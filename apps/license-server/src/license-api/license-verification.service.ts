import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { LicenseCryptoService } from './license-crypto.service';
import { LicenseInboundValidator } from './license-inbound-validator.service';
import { environmentBucket, invalidBody } from './license-api-response';
import { createHash, randomBytes } from 'node:crypto';

@Injectable()
export class LicenseVerificationService {
  constructor(
    private prisma: PrismaService,
    private crypto: LicenseCryptoService,
    private validator: LicenseInboundValidator,
  ) {}

  async verify(body: Record<string, string>) {
    if (!this.validator.isAllowedAppUrl(body.app_url)) {
      return { status: 403, body: { valid: false, message: 'App URL tidak diizinkan.' } };
    }
    if (!this.validator.isFreshTimestamp(body.timestamp)) {
      return { status: 422, body: { valid: false, message: 'Request expired atau timestamp tidak valid.' } };
    }
    if (!(await this.validator.isNonceFresh(body.nonce, 'verify'))) {
      return { status: 422, body: { valid: false, message: 'Nonce sudah pernah dipakai.' } };
    }
    if (!this.validator.verifyPayloadSignature(body)) {
      return { status: 401, body: { valid: false, message: 'Request signature tidak valid.' } };
    }

    const licenseKey = this.crypto.decryptPayload(body.payload);
    if (!licenseKey) {
      return { status: 422, body: { valid: false, message: 'Payload lisensi gagal didekripsi.' } };
    }

    const keyHash = createHash('sha256').update(licenseKey).digest('hex');
    const license = await this.prisma.license.findUnique({ where: { keyHash } });
    if (!license) {
      return { status: 422, body: { valid: false, message: 'License key tidak valid.' } };
    }
    if (!this.validator.isLicenseUsable(license)) {
      return { status: 422, body: { valid: false, message: 'License tidak aktif atau sudah expired.' } };
    }
    if (!this.validator.isDomainAllowedForLicense(license, body.app_url)) {
      return { status: 403, body: { valid: false, message: 'Domain tidak diizinkan untuk license ini.' } };
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

    const canActivate = await this.applyActivationPolicy(license, deviceFingerprint, bucket);
    if (!canActivate) {
      return { status: 422, body: { valid: false, message: 'Batas aktivasi device tercapai.' } };
    }

    await this.recordActivation(license.id, body, deviceFingerprint, bucket);

    const expiresAt = license.expiresAt ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const claims = {
      license_id: license.id,
      app_url: body.app_url,
      environment: body.environment,
      environment_bucket: bucket,
      plan: license.plan,
      issued_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    };

    const licenseToken = Buffer.from(JSON.stringify(claims)).toString('base64');
    const signature = this.crypto.signToken(licenseToken);
    if (!signature) {
      return { status: 500, body: { valid: false, message: 'Gagal menandatangani license token.' } };
    }

    await this.prisma.license.update({
      where: { id: license.id },
      data: { lastVerifiedAt: new Date() },
    });

    return {
      status: 200,
      body: { valid: true, message: 'License valid.', license_token: licenseToken, signature },
    };
  }

  private async applyActivationPolicy(
    license: { id: number; maxActivations: number; activationPolicy: string },
    deviceFingerprint: string,
    bucket: string,
  ): Promise<boolean> {
    const exists = await this.prisma.licenseActivation.findUnique({
      where: {
        licenseId_deviceFingerprint_environmentBucket: {
          licenseId: license.id,
          deviceFingerprint,
          environmentBucket: bucket,
        },
      },
    });
    if (exists) return true;

    const count = await this.prisma.licenseActivation.count({
      where: { licenseId: license.id, environmentBucket: bucket },
    });
    if (count < license.maxActivations) return true;
    if (license.activationPolicy !== 'auto_revoke_oldest') return false;

    const oldest = await this.prisma.licenseActivation.findFirst({
      where: { licenseId: license.id, environmentBucket: bucket },
      orderBy: [{ lastSeenAt: 'asc' }, { createdAt: 'asc' }],
    });
    if (!oldest) return false;
    await this.prisma.licenseActivation.delete({ where: { id: oldest.id } });
    return true;
  }

  private async recordActivation(
    licenseId: number,
    body: Record<string, string>,
    deviceFingerprint: string,
    bucket: string,
  ) {
    await this.prisma.licenseActivation.upsert({
      where: {
        licenseId_deviceFingerprint_environmentBucket: {
          licenseId,
          deviceFingerprint,
          environmentBucket: bucket,
        },
      },
      update: { lastSeenAt: new Date(), appUrl: body.app_url, environment: body.environment },
      create: {
        licenseId,
        deviceFingerprint,
        appUrl: body.app_url,
        environment: body.environment,
        environmentBucket: bucket,
      },
    });
  }
}

@Injectable()
export class LicenseManagerService {
  constructor(private prisma: PrismaService) {}

  async generate(attrs: {
    plan?: string;
    customerName?: string;
    customerEmail?: string;
    maxActivations?: number;
    allowedDomains?: string[];
    expiresInDays?: number;
    activationPolicy?: string;
  }) {
    const plan = (attrs.plan ?? 'PRO').toUpperCase();
    const suffix = randomBytes(8).toString('hex').toUpperCase();
    const licenseKey = `EDZ-${plan}-${new Date().getFullYear()}-${suffix}`;
    const keyHash = createHash('sha256').update(licenseKey).digest('hex');

    const expiresAt = attrs.expiresInDays
      ? new Date(Date.now() + attrs.expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const license = await this.prisma.license.create({
      data: {
        licenseKey,
        keyHash,
        plan,
        customerName: attrs.customerName,
        customerEmail: attrs.customerEmail,
        maxActivations: attrs.maxActivations ?? 1,
        activationPolicy: attrs.activationPolicy ?? 'block_new',
        allowedDomains: attrs.allowedDomains ?? [],
        expiresAt,
      },
    });

    await this.prisma.licenseGenerationLog.create({
      data: { licenseId: license.id, channel: 'api' },
    });

    return { ...license, licenseKey };
  }
}
