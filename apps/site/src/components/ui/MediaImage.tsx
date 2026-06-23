'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  src?: string | null;
  alt?: string;
  className?: string;
  placeholderClassName?: string;
  style?: React.CSSProperties;
};

export function MediaImage({ src, alt = '', className, placeholderClassName, style }: Props) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const resolvedSrc = src?.trim();
  const showPlaceholder = !resolvedSrc || failed;

  if (showPlaceholder) {
    return (
      <div
        aria-hidden={!alt}
        aria-label={alt || undefined}
        className={cn('bg-neutral-600', className, placeholderClassName)}
        style={style}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- CMS media URLs
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}
