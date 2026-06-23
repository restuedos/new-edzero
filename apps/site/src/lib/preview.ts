export function getServerURL(): string {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.APP_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

function withLivePreview(path: string): string {
  const base = getServerURL();

  if (path.startsWith('#')) {
    return `${base}/?live-preview=1${path}`;
  }

  const [pathname, hash = ''] = path.split('#');
  const separator = pathname.includes('?') ? '&' : '?';
  const withQuery = `${base}${pathname}${separator}live-preview=1`;
  return hash ? `${withQuery}#${hash}` : withQuery;
}

export function resolveLivePreviewURL({
  collectionSlug,
  globalSlug,
  slug,
}: {
  collectionSlug?: string;
  globalSlug?: string;
  slug?: string | null;
}): string {
  if (globalSlug === 'global-settings') {
    return withLivePreview('/');
  }

  switch (collectionSlug) {
    case 'articles':
      return slug ? withLivePreview(`/blog/${slug}`) : withLivePreview('/blog');
    case 'services':
      return withLivePreview('#services');
    case 'projects':
      return withLivePreview('#portfolio');
    case 'partners':
      return withLivePreview('#clients');
    case 'testimonials':
      return withLivePreview('#testimonials');
    default:
      return withLivePreview('/');
  }
}
