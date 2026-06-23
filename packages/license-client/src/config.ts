import type { LicenseClientConfig } from './types.js';

export function createLicenseConfigFromEnv(env: NodeJS.ProcessEnv = process.env): LicenseClientConfig {
  return {
    verifyUrl: (env.LICENSE_VERIFY_URL ?? '').trim(),
    enforce: env.LICENSE_ENFORCEMENT_ENABLED !== 'false',
    productionEnvironments: (env.LICENSE_PRODUCTION_ENVIRONMENTS ?? 'production,prod')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    statusFile: env.LICENSE_STATUS_FILE ?? 'storage/private/license.json',
    encryptionPublicKeyPath:
      env.LICENSE_ENCRYPTION_PUBLIC_KEY_PATH ?? 'storage/private/license-encryption-public.rsa',
    verificationPublicKeyPath:
      env.LICENSE_VERIFICATION_PUBLIC_KEY_PATH ?? 'storage/private/license-verification-public.rsa',
    localHmacSecret: env.LICENSE_LOCAL_HMAC_SECRET ?? '',
    heartbeatEnabled: env.LICENSE_HEARTBEAT_ENABLED === 'true',
    heartbeatMaxStaleHours: parseInt(env.LICENSE_HEARTBEAT_MAX_STALE_HOURS ?? '48', 10),
    requireHttps: env.LICENSE_REQUIRE_HTTPS !== 'false',
    allowedHosts: (env.LICENSE_ALLOWED_HOSTS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    requestHmacSecret: env.LICENSE_REQUEST_HMAC_SECRET ?? '',
    appUrl: env.APP_URL ?? 'http://localhost:3000',
    appEnv: env.NODE_ENV ?? 'development',
  };
}
