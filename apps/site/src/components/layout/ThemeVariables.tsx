'use client';

import { useEffect } from 'react';
import type { CSSProperties } from 'react';

type Props = {
  variables: CSSProperties;
};

export function ThemeVariables({ variables }: Props) {
  useEffect(() => {
    const root = document.documentElement;
    const entries = Object.entries(variables).filter(([, value]) => value != null);

    for (const [key, value] of entries) {
      root.style.setProperty(key, String(value));
    }

    return () => {
      for (const [key] of entries) {
        root.style.removeProperty(key);
      }
    };
  }, [variables]);

  return null;
}
