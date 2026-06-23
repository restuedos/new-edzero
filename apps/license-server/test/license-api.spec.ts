import { describe, it, expect } from 'vitest';
import { environmentBucket, invalidBody, INVALIDATE_APP_LICENSE } from '../src/license-api/license-api-response';

describe('LicenseApiResponse', () => {
  it('invalidBody sets invalidate_app_license when requested', () => {
    const body = invalidBody('revoked', true);
    expect(body.valid).toBe(false);
    expect(body[INVALIDATE_APP_LICENSE]).toBe(true);
  });

  it('environmentBucket maps prod environments', () => {
    process.env.LICENSE_PRODUCTION_ENVIRONMENTS = 'production,prod';
    expect(environmentBucket('production')).toBe('prod');
    expect(environmentBucket('local')).toBe('nonprod');
  });
});
