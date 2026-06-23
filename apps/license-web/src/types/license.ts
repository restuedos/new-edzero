export interface License {
  id: number;
  licenseKey: string;
  status: string;
  plan?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  maxActivations: number;
  activationPolicy?: string | null;
  allowedDomains?: string[] | null;
  expiresAt?: string | null;
  lastVerifiedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  _count?: { activations: number };
  activations?: LicenseActivation[];
  deviceBlocks?: unknown[];
  generationLogs?: unknown[];
}

export interface LicenseActivation {
  id: number;
  deviceFingerprint: string;
  appUrl: string;
  environment: string;
  environmentBucket: string;
  lastSeenAt: string;
  createdAt: string;
}

export interface LicenseFormValues {
  plan?: string;
  customerName?: string;
  customerEmail?: string;
  maxActivations?: number;
  allowedDomains?: string[];
  expiresInDays?: number;
  activationPolicy?: string;
  status?: string;
}
