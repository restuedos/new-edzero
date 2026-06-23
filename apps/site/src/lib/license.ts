import { createLicenseConfigFromEnv, LicenseService } from '@edzero/license-client/core';

let cached: LicenseService | null = null;

export function getLicenseService(): LicenseService {
  if (!cached) {
    cached = new LicenseService(createLicenseConfigFromEnv());
  }
  return cached;
}

export function isLicenseVerified(): boolean {
  return getLicenseService().isVerified();
}

export function shouldEnforceLicense(): boolean {
  return getLicenseService().shouldEnforce();
}
