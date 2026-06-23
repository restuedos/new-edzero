type MediaLike = { url?: string | null } | number | null | undefined;

export function mediaUrl(media: MediaLike): string | undefined {
  if (!media || typeof media === 'number') return undefined;
  return media.url ?? undefined;
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
