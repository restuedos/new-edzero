'use client';

import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export function HomeSnapScroll({ children }: Props) {
  useEffect(() => {
    document.documentElement.classList.add('home-snap', 'home-tech-game');
    return () => {
      document.documentElement.classList.remove('home-snap', 'home-tech-game');
    };
  }, []);

  return children;
}
