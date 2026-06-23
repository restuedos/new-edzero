import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_URL ?? 'https://edzero.test';
  return ['', '/about', '/services', '/portfolio', '/blog', '/contact'].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
