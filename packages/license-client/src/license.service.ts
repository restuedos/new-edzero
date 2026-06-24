import {
  createHmac,
  createPublicKey,
  privateEncrypt,
  publicEncrypt,
  randomBytes,
  verify,
  constants,
} from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { dirname } from 'node:path';
import type {
  ActivateResult,
  HeartbeatResult,
  LicenseClaims,
  LicenseClientConfig,
  LicenseStatus,
  VerifyResponse,
} from './types.js';
import { INVALIDATE_APP_LICENSE } from './types.js';

export class LicenseService {
  private readonly usedNonces = new Set<string>();

  constructor(private readonly config: LicenseClientConfig) {}

  shouldEnforce(): boolean {
    if (this.config.verifyUrl === '') return false;
    return this.config.enforce;
  }

  isVerified(): boolean {
    if (!this.shouldEnforce()) return true;

    const secret = this.resolvedLocalHmacSecret();
    if (secret === '') return false;

    const status = this.readStatus();
    if (!this.verifyLocalIntegrity(status)) return false;

    const { license_token: licenseToken, signature } = status;
    if (!licenseToken || !signature) return false;

    const claims = this.verifyServerSignatureAndDecode(licenseToken, signature);
    if (!claims || !this.claimsAreUsable(claims)) return false;

    return this.isHeartbeatFresh(status);
  }

  async activate(licenseKey: string): Promise<ActivateResult> {
    const verifyUrl = this.config.verifyUrl;
    if (verifyUrl === '') {
      return { ok: false, message: 'LICENSE_VERIFY_URL belum dikonfigurasi.' };
    }

    this.assertLicenseServerHostAllowedForUrl(verifyUrl);

    const encryptedPayload = this.encryptLicenseKey(licenseKey);
    if (!encryptedPayload) {
      return { ok: false, message: 'Gagal mengenkripsi license key. Periksa public key.' };
    }

    const timestamp = new Date().toISOString();
    const nonce = randomBytes(16).toString('hex');
    const deviceFingerprint = this.resolveDeviceFingerprint();

    const body: Record<string, string> = {
      payload: encryptedPayload,
      app_url: this.config.appUrl,
      environment: this.config.appEnv,
      timestamp,
      nonce,
      device_fingerprint: deviceFingerprint,
    };

    const requestSignature = this.signVerifyRequest(body);
    if (requestSignature) {
      body.request_signature = requestSignature;
    }

    try {
      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });

      const data = (await response.json()) as VerifyResponse;

      if (!data.valid) {
        if (data[INVALIDATE_APP_LICENSE]) {
          this.deleteStatus();
        }
        return { ok: false, message: data.message ?? 'Aktivasi gagal.' };
      }

      if (!data.license_token || !data.signature) {
        return { ok: false, message: 'Respons server tidak lengkap.' };
      }

      const status: LicenseStatus = {
        license_token: data.license_token,
        signature: data.signature,
        last_heartbeat_at: new Date().toISOString(),
        device_fingerprint: deviceFingerprint,
        verified_at: new Date().toISOString(),
      } as LicenseStatus;

      this.writeStatus(status);
      return { ok: true, message: data.message ?? 'License berhasil diaktivasi.' };
    } catch {
      return { ok: false, message: 'Tidak dapat menghubungi license server.' };
    }
  }

  async ensureHeartbeatFresh(): Promise<HeartbeatResult | null> {
    if (!this.shouldEnforce() || !this.config.heartbeatEnabled) {
      return null;
    }

    const status = this.readStatus();
    if (!status.license_token) {
      return null;
    }

    const ref = status.last_heartbeat_at ?? (status as Record<string, string>).verified_at;
    const minIntervalMs = this.heartbeatMinIntervalMs();
    if (ref && Date.now() - new Date(ref).getTime() < minIntervalMs) {
      return { ok: true, message: 'Heartbeat skipped — masih dalam interval minimum.' };
    }

    return this.runHeartbeat();
  }

  async runHeartbeat(): Promise<HeartbeatResult> {
    if (!this.shouldEnforce() || !this.config.heartbeatEnabled) {
      return { ok: true, message: 'Heartbeat dinonaktifkan atau enforcement lisensi mati.' };
    }

    const secret = this.resolvedLocalHmacSecret();
    if (secret === '') {
      return { ok: false, message: 'LICENSE_LOCAL_HMAC_SECRET wajib diisi.' };
    }

    const status = this.readStatus();
    if (!this.verifyLocalIntegrity(status)) {
      return { ok: false, message: 'Status lisensi korup atau belum diaktivasi.' };
    }

    const { license_token: licenseToken, signature } = status;
    if (!licenseToken || !signature) {
      return { ok: false, message: 'Belum ada token lisensi. Aktivasi terlebih dahulu.' };
    }

    const claims = this.verifyServerSignatureAndDecode(licenseToken, signature);
    if (!claims || !this.claimsAreUsable(claims)) {
      return { ok: false, message: 'Token lisensi tidak valid — aktivasi ulang.' };
    }

    const url = this.resolvedHeartbeatUrl();
    if (url === '') {
      return { ok: false, message: 'LICENSE_VERIFY_URL wajib diisi untuk heartbeat.' };
    }

    this.assertLicenseServerHostAllowedForUrl(url);

    const timestamp = new Date().toISOString();
    const nonce = randomBytes(16).toString('hex');

    const body: Record<string, string> = {
      license_token: licenseToken,
      signature,
      app_url: this.config.appUrl,
      environment: this.config.appEnv,
      timestamp,
      nonce,
      device_fingerprint: this.resolveStoredOrLiveDeviceFingerprint(status),
    };

    const requestSignature = this.signHeartbeatRequest(body);
    if (requestSignature) {
      body.request_signature = requestSignature;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });

      const data = (await response.json()) as VerifyResponse;

      if (!data.valid) {
        if (data[INVALIDATE_APP_LICENSE]) {
          this.deleteStatus();
        }
        return { ok: false, message: data.message ?? 'Heartbeat ditolak.' };
      }

      status.last_heartbeat_at = new Date().toISOString();
      this.writeStatus(status);
      return { ok: true, message: data.message ?? 'Heartbeat berhasil.' };
    } catch {
      return { ok: false, message: 'Tidak dapat menghubungi license server untuk heartbeat.' };
    }
  }

  private heartbeatMinIntervalMs(): number {
    const quarterStaleMs = (this.config.heartbeatMaxStaleHours * 60 * 60 * 1000) / 4;
    const oneHourMs = 60 * 60 * 1000;
    return Math.min(quarterStaleMs, oneHourMs);
  }

  private resolvedLocalHmacSecret(): string {
    return this.config.localHmacSecret;
  }

  private resolvedHeartbeatUrl(): string {
    const verify = this.config.verifyUrl.replace(/\/$/, '');
    if (verify.endsWith('/verify')) {
      return verify.slice(0, -'/verify'.length) + '/heartbeat';
    }
    return verify + '/heartbeat';
  }

  private readStatus(): LicenseStatus {
    const path = this.config.statusFile;
    if (!existsSync(path)) return {};
    try {
      return JSON.parse(readFileSync(path, 'utf8')) as LicenseStatus;
    } catch {
      return {};
    }
  }

  private writeStatus(status: LicenseStatus): void {
    const path = this.config.statusFile;
    mkdirSync(dirname(path), { recursive: true });
    const payload = { ...status };
    payload.hmac = this.computeStatusHmac(payload);
    writeFileSync(path, JSON.stringify(payload, null, 2), 'utf8');
  }

  private deleteStatus(): void {
    const path = this.config.statusFile;
    if (existsSync(path)) unlinkSync(path);
  }

  private verifyLocalIntegrity(status: LicenseStatus): boolean {
    if (!status || Object.keys(status).length === 0) return false;
    const storedHmac = status.hmac;
    if (!storedHmac) return false;
    const copy = { ...status };
    delete copy.hmac;
    return this.computeStatusHmac(copy) === storedHmac;
  }

  private computeStatusHmac(status: LicenseStatus): string {
    const secret = this.resolvedLocalHmacSecret();
    const json = JSON.stringify(status);
    return createHmac('sha256', secret).update(json).digest('hex');
  }

  private verifyServerSignatureAndDecode(
    licenseToken: string,
    signatureBase64: string,
  ): LicenseClaims | null {
    const path = this.config.verificationPublicKeyPath;
    if (!existsSync(path)) return null;

    try {
      const publicKey = createPublicKey(readFileSync(path, 'utf8'));
      const binarySignature = Buffer.from(signatureBase64, 'base64');
      const verified = verify('sha256', Buffer.from(licenseToken), publicKey, binarySignature);
      if (!verified) return null;

      const json = Buffer.from(licenseToken, 'base64').toString('utf8');
      return JSON.parse(json) as LicenseClaims;
    } catch {
      return null;
    }
  }

  private claimsAreUsable(claims: LicenseClaims): boolean {
    const bucket = claims.environment_bucket;
    const expected = this.config.productionEnvironments.includes(this.config.appEnv)
      ? 'prod'
      : 'nonprod';
    if (bucket && bucket !== expected) return false;

    if (claims.expires_at) {
      const expiry = new Date(claims.expires_at);
      if (expiry < new Date()) return false;
    }

    if (claims.app_url && claims.app_url !== this.config.appUrl) return false;
    if (claims.environment && claims.environment !== this.config.appEnv) return false;

    return true;
  }

  private isHeartbeatFresh(status: LicenseStatus): boolean {
    if (!this.config.heartbeatEnabled) return true;

    const ref = status.last_heartbeat_at ?? (status as Record<string, string>).verified_at;
    if (!ref) return false;

    const at = new Date(ref);
    const maxStaleMs = this.config.heartbeatMaxStaleHours * 60 * 60 * 1000;
    return at.getTime() >= Date.now() - maxStaleMs;
  }

  private encryptLicenseKey(licenseKey: string): string | null {
    const path = this.config.encryptionPublicKeyPath;
    if (!existsSync(path)) return null;

    try {
      const publicKey = createPublicKey(readFileSync(path, 'utf8'));
      const encrypted = publicEncrypt(
        { key: publicKey, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
        Buffer.from(licenseKey, 'utf8'),
      );
      return encrypted.toString('base64');
    } catch {
      return null;
    }
  }

  private resolveDeviceFingerprint(): string {
    const input = `${this.config.appUrl}|${this.config.appEnv}|${process.env.HOSTNAME ?? 'local'}`;
    return createHmac('sha256', 'edzero-device').update(input).digest('hex').slice(0, 64);
  }

  private resolveStoredOrLiveDeviceFingerprint(status: LicenseStatus): string {
    const stored = (status as Record<string, string>).device_fingerprint;
    return stored ?? this.resolveDeviceFingerprint();
  }

  private signVerifyRequest(body: Record<string, string>): string | null {
    if (!this.config.requestHmacSecret) return null;
    const canonical = ['payload', 'app_url', 'environment', 'timestamp', 'nonce']
      .map((k) => body[k] ?? '')
      .join('|');
    return createHmac('sha256', this.config.requestHmacSecret).update(canonical).digest('hex');
  }

  private signHeartbeatRequest(body: Record<string, string>): string | null {
    if (!this.config.requestHmacSecret) return null;
    const canonical = [
      'license_token',
      'signature',
      'app_url',
      'environment',
      'timestamp',
      'nonce',
    ]
      .map((k) => body[k] ?? '')
      .join('|');
    return createHmac('sha256', this.config.requestHmacSecret).update(canonical).digest('hex');
  }

  private assertLicenseServerHostAllowedForUrl(url: string): void {
    if (!this.config.requireHttps) return;
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      throw new Error('LICENSE_REQUIRE_HTTPS: URL harus HTTPS.');
    }
    if (
      this.config.allowedHosts.length > 0 &&
      !this.config.allowedHosts.includes(parsed.hostname)
    ) {
      throw new Error(`Host ${parsed.hostname} tidak ada di LICENSE_ALLOWED_HOSTS.`);
    }
  }
}
