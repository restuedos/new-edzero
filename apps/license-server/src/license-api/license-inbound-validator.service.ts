import { Injectable } from '@nestjs/common';
import { createHmac, createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.module';

@Injectable()
export class LicenseInboundValidator {
  private readonly clockSkewSeconds = parseInt(process.env.LICENSE_CLOCK_SKEW_SECONDS ?? '120', 10);

  constructor(private prisma: PrismaService) {}

  isAllowedAppUrl(appUrl: string): boolean {
    const allowed = (process.env.LICENSE_ALLOWED_APP_URLS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (allowed.length === 0) return true;
    return allowed.some((a) => appUrl.startsWith(a));
  }

  isFreshTimestamp(timestamp: string): boolean {
    const ts = new Date(timestamp).getTime();
    const now = Date.now();
    return Math.abs(now - ts) <= this.clockSkewSeconds * 1000;
  }

  async isNonceFresh(nonce: string, scope: string): Promise<boolean> {
    const existing = await this.prisma.usedNonce.findUnique({
      where: { nonce_scope: { nonce, scope } },
    });
    if (existing) return false;

    await this.prisma.usedNonce.create({
      data: {
        nonce,
        scope,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    return true;
  }

  verifyPayloadSignature(body: Record<string, string>): boolean {
    const secret = process.env.LICENSE_REQUEST_HMAC_SECRET ?? '';
    if (!secret) return true;
    const sig = body.request_signature;
    if (!sig) return false;
    const canonical = ['payload', 'app_url', 'environment', 'timestamp', 'nonce']
      .map((k) => body[k] ?? '')
      .join('|');
    const expected = createHmac('sha256', secret).update(canonical).digest('hex');
    return sig === expected;
  }

  heartbeatPayloadSignature(body: Record<string, string>): boolean {
    const secret = process.env.LICENSE_REQUEST_HMAC_SECRET ?? '';
    if (!secret) return true;
    const sig = body.request_signature;
    if (!sig) return false;
    const canonical = [
      'license_token', 'signature', 'app_url', 'environment', 'timestamp', 'nonce',
    ].map((k) => body[k] ?? '').join('|');
    const expected = createHmac('sha256', secret).update(canonical).digest('hex');
    return sig === expected;
  }

  resolveDeviceFingerprint(body: Record<string, string>): string {
    if (body.device_fingerprint) return body.device_fingerprint;
    const input = `${body.app_url}|${body.environment}|server`;
    return createHash('sha256').update(input).digest('hex').slice(0, 64);
  }

  isLicenseUsable(license: { status: string; expiresAt: Date | null }): boolean {
    if (license.status !== 'active') return false;
    if (license.expiresAt && license.expiresAt < new Date()) return false;
    return true;
  }

  isDomainAllowedForLicense(license: { allowedDomains: unknown }, appUrl: string): boolean {
    const domains = license.allowedDomains as string[] | null;
    if (!domains?.length) return true;
    try {
      const host = new URL(appUrl).hostname;
      return domains.some((d) => host === d || host.endsWith(`.${d}`));
    } catch {
      return false;
    }
  }
}
