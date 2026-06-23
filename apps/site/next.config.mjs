/** @type {import('next').NextConfig} */
import { withPayload } from '@payloadcms/next/withPayload';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(dirname, '../..');

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@edzero/license-client'],
  sassOptions: {
    loadPaths: [path.join(monorepoRoot, 'node_modules/@payloadcms/ui/dist/scss/')],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };
    return webpackConfig;
  },
  turbopack: {
    root: monorepoRoot,
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
