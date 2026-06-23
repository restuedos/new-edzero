'use client';

import { useEffect } from 'react';

function isLivePreviewContext(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.self !== window.top) return true;
  return new URLSearchParams(window.location.search).has('live-preview');
}

export function LivePreviewMode() {
  useEffect(() => {
    if (!isLivePreviewContext()) return;

    document.documentElement.classList.add('live-preview');

    return () => {
      document.documentElement.classList.remove('live-preview');
    };
  }, []);

  return null;
}
