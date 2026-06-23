import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import path from 'node:path';
import { buildConfig, type SharpDependency } from 'payload';
import sharp from 'sharp';

import { Articles } from './collections/Articles';
import { ContactSubmissions } from './collections/ContactSubmissions';
import { Media } from './collections/Media';
import { Partners } from './collections/Partners';
import { Projects } from './collections/Projects';
import { Services } from './collections/Services';
import { Testimonials } from './collections/Testimonials';
import { Users } from './collections/Users';
import { GlobalSettings } from './globals/GlobalSettings';
import { getS3FileURL, getS3StorageConfig, isS3StorageEnabled } from './lib/s3';
import { resolveLivePreviewURL } from './lib/preview';

const dirname = path.resolve(process.cwd(), 'src');

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.APP_URL ||
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  'http://localhost:3000';

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      collections: ['articles', 'services', 'projects', 'partners', 'testimonials'],
      globals: ['global-settings'],
      url: ({ collectionConfig, globalConfig, data }) =>
        resolveLivePreviewURL({
          collectionSlug: collectionConfig?.slug,
          globalSlug: globalConfig?.slug,
          slug: typeof data?.slug === 'string' ? data.slug : null,
        }),
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
        { label: 'Tablet', name: 'tablet', width: 834, height: 1112 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [
    Users,
    Media,
    Services,
    Projects,
    Partners,
    Testimonials,
    Articles,
    ContactSubmissions,
  ],
  globals: [GlobalSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'edzero-dev-payload-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.SITE_DATABASE_URL || process.env.DATABASE_URL || '',
    },
    push: process.env.PAYLOAD_DB_PUSH === 'true',
  }),
  plugins: [
    s3Storage({
      enabled: isS3StorageEnabled(),
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => getS3FileURL(filename, prefix),
          prefix: 'media',
        },
      },
      bucket: process.env.AWS_BUCKET ?? 'edzero',
      config: isS3StorageEnabled() ? getS3StorageConfig() : {},
    }),
  ],
  sharp: sharp as unknown as SharpDependency,
});
