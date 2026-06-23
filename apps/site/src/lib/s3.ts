const bucket = process.env.AWS_BUCKET ?? 'edzero';
const region = process.env.AWS_DEFAULT_REGION ?? 'us-east-1';
const endpoint = process.env.AWS_ENDPOINT;
const publicBase = (process.env.S3_PUBLIC_URL ?? endpoint ?? '').replace(/\/$/, '');

export function isS3StorageEnabled(): boolean {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      bucket &&
      endpoint,
  );
}

export function getS3FileURL(filename: string, prefix?: string): string {
  const key = prefix ? `${prefix}/${filename}` : filename;
  return `${publicBase}/${bucket}/${key}`;
}

export function getS3StorageConfig() {
  return {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region,
    endpoint,
    forcePathStyle: true,
  };
}
