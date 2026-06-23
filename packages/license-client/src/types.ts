export const INVALIDATE_APP_LICENSE = 'invalidate_app_license' as const;

export interface LicenseClientConfig {
  verifyUrl: string;
  enforce: boolean;
  productionEnvironments: string[];
  statusFile: string;
  encryptionPublicKeyPath: string;
  verificationPublicKeyPath: string;
  localHmacSecret: string;
  heartbeatEnabled: boolean;
  heartbeatMaxStaleHours: number;
  requireHttps: boolean;
  allowedHosts: string[];
  requestHmacSecret: string;
  appUrl: string;
  appEnv: string;
}

export interface LicenseStatus {
  license_token?: string;
  signature?: string;
  last_heartbeat_at?: string;
  hmac?: string;
}

export interface LicenseClaims {
  license_id: number;
  app_url: string;
  environment: string;
  environment_bucket: string;
  plan?: string;
  issued_at: string;
  expires_at: string;
}

export interface VerifyResponse {
  valid: boolean;
  message: string;
  license_token?: string;
  signature?: string;
  [INVALIDATE_APP_LICENSE]?: boolean;
}

export interface ActivateResult {
  ok: boolean;
  message: string;
}

export interface HeartbeatResult {
  ok: boolean;
  message: string;
}
