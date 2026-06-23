import { describe, it, expect } from 'vitest';
import { createLicenseConfigFromEnv } from '../src/config';
import { INVALIDATE_APP_LICENSE } from '../src/index';

describe('@edzero/license-client', () => {
  it('createLicenseConfigFromEnv reads LICENSE_* vars', () => {
    const config = createLicenseConfigFromEnv({
      LICENSE_VERIFY_URL: 'https://license.test/api/license/verify',
      LICENSE_ENFORCEMENT_ENABLED: 'true',
      LICENSE_PRODUCTION_ENVIRONMENTS: 'production,prod',
      LICENSE_LOCAL_HMAC_SECRET: 'secret',
      APP_URL: 'https://edzero.test',
      NODE_ENV: 'development',
    });

    expect(config.verifyUrl).toBe('https://license.test/api/license/verify');
    expect(config.enforce).toBe(true);
    expect(config.productionEnvironments).toContain('production');
    expect(config.appUrl).toBe('https://edzero.test');
  });

  it('INVALIDATE_APP_LICENSE constant matches server contract', () => {
    expect(INVALIDATE_APP_LICENSE).toBe('invalidate_app_license');
  });
});
