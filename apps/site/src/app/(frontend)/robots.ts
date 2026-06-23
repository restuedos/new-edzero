import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.APP_URL ?? 'https://edzero.test';
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/license'] },
    sitemap: `${base}/sitemap.xml`,
  };
}
