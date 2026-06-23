import { createLicenseConfigFromEnv } from './config.js';
import type { LicenseClientConfig } from './types.js';
import { LicenseService } from './license.service.js';

export function createLicenseChecker(config?: LicenseClientConfig): LicenseService {
  return new LicenseService(config ?? createLicenseConfigFromEnv());
}

export function isLicenseVerified(config?: LicenseClientConfig): boolean {
  return createLicenseChecker(config).isVerified();
}
