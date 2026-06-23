export const INVALIDATE_APP_LICENSE = 'invalidate_app_license';

export function invalidBody(message: string, invalidate: boolean) {
  const payload: Record<string, unknown> = { valid: false, message };
  if (invalidate) payload[INVALIDATE_APP_LICENSE] = true;
  return payload;
}

export function environmentBucket(env: string): 'prod' | 'nonprod' {
  const prodNames = (process.env.LICENSE_PRODUCTION_ENVIRONMENTS ?? 'production,prod')
    .split(',')
    .map((s) => s.trim().toLowerCase());
  return prodNames.includes(env.toLowerCase().trim()) ? 'prod' : 'nonprod';
}
