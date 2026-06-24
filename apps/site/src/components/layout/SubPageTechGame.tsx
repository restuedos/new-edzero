'use client';

import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

/** Enables home-tech-game styles (service cards, buttons, portfolio tiles) on standalone routes. */
export function SubPageTechGame({ children }: Props) {
  useEffect(() => {
    document.documentElement.classList.add('home-tech-game');
    return () => {
      document.documentElement.classList.remove('home-tech-game');
    };
  }, []);

  return children;
}
