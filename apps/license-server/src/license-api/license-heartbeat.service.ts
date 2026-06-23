import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { LicenseCryptoService } from './license-crypto.service';
import { LicenseInboundValidator } from './license-inbound-validator.service';
import { environmentBucket, invalidBody } from './license-api-response';

@Injectable()
export class LicenseHeartbeatService {
  constructor(
    private prisma: PrismaService,
    private crypto: LicenseCryptoService,
    private validator: LicenseInboundValidator,
  ) {}

  async heartbeat(body: Record<string, string>) {
    if (!this.validator.isAllowedAppUrl(body.app_url)) {
      return { status: 403, body: invalidBody('App URL tidak diizinkan.', true) };
    }
    if (!this.validator.isFreshTimestamp(body.timestamp)) {
      return { status: 422, body: invalidBody('Request expired atau timestamp tidak valid.', false) };
    }
    if (!(await this.validator.isNonceFresh(body.nonce, 'heartbeat'))) {
      return { status: 422, body: invalidBody('Nonce sudah pernah dipakai.', false) };
    }
    if (!this.validator.heartbeatPayloadSignature(body)) {
      return { status: 401, body: invalidBody('Request signature tidak valid.', false) };
    }

    const claims = this.crypto.verifyAndDecodeLicenseToken(body.license_token, body.signature);
    if (!claims) {
      return { status: 422, body: invalidBody('License token atau signature tidak valid.', true) };
    }
    if (claims.app_url !== body.app_url || claims.environment !== body.environment) {
      return { status: 403, body: invalidBody('Token tidak cocok dengan aplikasi ini.', true) };
    }

    const expiresAt = new Date(String(claims.expires_at));
    if (expiresAt < new Date()) {
      return { status: 422, body: invalidBody('License token sudah expired.', true) };
    }

    const licenseId = Number(claims.license_id);
    const license = await this.prisma.license.findUnique({ where: { id: licenseId } });
    if (!license) {
      return { status: 422, body: invalidBody('License tidak ditemukan.', true) };
    }
    if (!this.validator.isLicenseUsable(license)) {
      return { status: 422, body: invalidBody('License tidak aktif atau sudah expired.', true) };
    }
    if (!this.validator.isDomainAllowedForLicense(license, body.app_url)) {
      return { status: 403, body: invalidBody('Domain tidak diizinkan untuk license ini.', true) };
    }

    const bucket = environmentBucket(body.environment);
    const deviceFingerprint = this.validator.resolveDeviceFingerprint(body);

    const blocked = await this.prisma.licenseDeviceBlock.findUnique({
      where: {
        licenseId_deviceFingerprint_environmentBucket: {
          licenseId: license.id,
          deviceFingerprint,
          environmentBucket: bucket,
        },
      },
    });
    if (blocked) {
      return { status: 422, body: invalidBody('Device ini diblokir untuk license ini.', true) };
    }

    const activation = await this.prisma.licenseActivation.findUnique({
      where: {
        licenseId_deviceFingerprint_environmentBucket: {
          licenseId: license.id,
          deviceFingerprint,
          environmentBucket: bucket,
        },
      },
    });
    if (!activation) {
      return { status: 422, body: invalidBody('Aktivasi device tidak dikenal.', true) };
    }

    await this.prisma.licenseActivation.update({
      where: { id: activation.id },
      data: { lastSeenAt: new Date() },
    });

    return {
      status: 200,
      body: { valid: true, message: 'Heartbeat diterima.', server_time: new Date().toISOString() },
    };
  }
}
