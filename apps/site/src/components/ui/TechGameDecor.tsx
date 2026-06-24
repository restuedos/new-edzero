import { cn } from '@/lib/utils';

type Variant =
  | 'about-ambient'
  | 'about-photo'
  | 'nav-header'
  | 'nav-drawer'
  | 'hero'
  | 'services'
  | 'portfolio'
  | 'testimonials'
  | 'journal'
  | 'blog'
  | 'contact'
  | 'footer';

type ShapeProps = {
  className?: string;
  accent?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const shapeSizes = {
  sm: 'h-5 w-5',
  md: 'h-7 w-7',
  lg: 'h-9 w-9',
};

const crossSizes = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
};

const triangleSizes = {
  sm: 'h-5 w-5',
  md: 'h-7 w-7',
  lg: 'h-9 w-9',
};

const circleSizes = {
  sm: 'h-5 w-5',
  md: 'h-7 w-7',
  lg: 'h-9 w-9',
};

export function GameCross({ className, size = 'md' }: ShapeProps) {
  return (
    <span
      className={cn('game-cross font-light leading-none text-[var(--color-accent)]', crossSizes[size], className)}
      aria-hidden
    >
      ×
    </span>
  );
}

export function GameSquare({ className, accent, size = 'md' }: ShapeProps) {
  return (
    <span
      className={cn(
        'game-square block border',
        shapeSizes[size],
        accent ? 'game-glow-accent border-[var(--color-accent)]/75' : 'border-white/70',
        className,
      )}
      aria-hidden
    />
  );
}

export function GameCircle({ className, accent, size = 'md' }: ShapeProps) {
  return (
    <span
      className={cn(
        'game-circle block rounded-full border',
        circleSizes[size],
        accent ? 'game-glow-accent border-[var(--color-accent)]/75' : 'border-white/70',
        className,
      )}
      aria-hidden
    />
  );
}

export function GameTriangle({ className, accent, size = 'md' }: ShapeProps) {
  return (
    <svg
      className={cn(
        triangleSizes[size],
        accent ? 'text-[var(--color-accent)] game-glow-accent' : 'text-white/75',
        className,
      )}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path d="M12 4 L20 19 H4 Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function GameDotMatrix({ className }: { className?: string }) {
  return <div className={cn('game-dot-grid', className)} aria-hidden />;
}

type Props = {
  variant: Variant;
  className?: string;
};

export function TechGameDecor({ variant, className }: Props) {
  if (variant === 'about-ambient') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
        <GameDotMatrix className="absolute -left-4 top-[6%] h-[88%] w-[min(56vw,520px)] opacity-45 md:left-[2%]" />
        <GameSquare className="absolute left-[6%] top-[18%] -rotate-12 opacity-70" size="sm" />
        <GameCross className="absolute left-[12%] top-[36%] opacity-90" size="lg" />
        <GameTriangle className="absolute right-[10%] top-[14%] rotate-6 opacity-80" accent size="md" />
        <GameCircle className="absolute right-[16%] top-[32%] opacity-60" size="sm" />
        <GameSquare className="absolute right-[5%] bottom-[22%] rotate-45 opacity-55" accent size="sm" />
        <GameCross className="absolute bottom-[14%] left-[44%] opacity-45" size="sm" />
        <GameCircle className="absolute left-[54%] top-[10%] opacity-40" accent size="sm" />
        <GameTriangle className="absolute bottom-[26%] left-[8%] -rotate-12 opacity-35" size="sm" />
        <div className="game-scanlines absolute inset-0 opacity-[0.035]" />
      </div>
    );
  }

  if (variant === 'about-photo') {
    return (
      <div className={cn('pointer-events-none absolute -inset-5 md:-inset-7', className)} aria-hidden>
        <GameDotMatrix className="absolute inset-0 opacity-65" />
        <GameSquare className="absolute left-0 top-4 -rotate-6 opacity-90" size="md" />
        <GameCross className="absolute -left-1 top-[36%] opacity-95" size="md" />
        <GameTriangle className="absolute -right-0.5 top-9 rotate-12 opacity-85" accent size="sm" />
        <GameCircle className="absolute right-0 top-[54%] opacity-80" size="sm" />
        <GameSquare className="absolute bottom-8 -left-2 rotate-12 opacity-75" accent size="sm" />
        <GameCross className="absolute bottom-[28%] right-3 opacity-60" size="sm" />
        <GameCircle className="absolute bottom-3 right-8 opacity-50" accent size="sm" />
        <span className="game-hud-corner absolute left-1 top-1" />
        <span className="game-hud-corner game-hud-corner-accent absolute bottom-1 right-1 rotate-180" />
      </div>
    );
  }

  if (variant === 'nav-header') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
        <div className="absolute inset-x-6 bottom-0 h-px bg-neutral-800 md:inset-x-12" />
        <GameDotMatrix className="absolute right-16 top-0 hidden h-full w-20 opacity-35 md:block" />
        <GameCross className="absolute right-[3.75rem] top-1/2 -translate-y-1/2 opacity-75" size="sm" />
        <GameSquare className="absolute right-[5.25rem] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 opacity-55" accent />
        <GameCircle className="absolute right-24 top-1/2 h-2 w-2 -translate-y-1/2 opacity-40" />
      </div>
    );
  }

  if (variant === 'nav-drawer') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
        <GameDotMatrix className="absolute bottom-0 left-0 h-44 w-full opacity-30" />
        <GameTriangle className="absolute right-7 top-24 rotate-180 opacity-50" accent size="sm" />
        <GameCircle className="absolute left-5 top-[38%] opacity-45" size="sm" />
        <GameCross className="absolute bottom-36 right-8 opacity-65" size="md" />
        <GameSquare className="absolute bottom-44 left-7 opacity-50" accent size="sm" />
        <GameCross className="absolute left-6 top-20 opacity-35" size="sm" />
        <div className="game-scanlines absolute inset-0 opacity-[0.04]" />
      </div>
    );
  }

  if (variant === 'services') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
        <GameDotMatrix className="absolute left-[4%] top-[12%] h-[76%] w-[38%] opacity-30 md:w-[28%]" />
        <GameDotMatrix className="absolute right-[2%] bottom-[8%] h-[40%] w-[32%] opacity-22" />
        <GameCross className="absolute left-[10%] top-[22%] opacity-50" size="md" />
        <GameTriangle className="absolute right-[2%] top-[16%] rotate-12 opacity-42" accent size="sm" />
        <GameCircle className="absolute left-[48%] top-[8%] opacity-35" size="sm" />
        <GameSquare className="absolute right-[8%] bottom-[24%] rotate-45 opacity-40" accent size="sm" />
        <GameCross className="absolute bottom-[16%] left-[22%] opacity-35" size="sm" />
        <GameTriangle className="absolute bottom-[20%] right-[28%] -rotate-6 opacity-30" size="sm" />
        <GameCircle className="absolute left-[2%] bottom-[18%] opacity-40" accent size="sm" />
        <GameSquare className="absolute right-[2%] top-[28%] rotate-12 opacity-38" size="sm" />
        <GameCross className="absolute right-[3%] bottom-[14%] opacity-32" size="sm" />
        <div className="game-scanlines absolute inset-0 opacity-[0.03]" />
      </div>
    );
  }

  if (variant === 'portfolio') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
        <GameDotMatrix className="absolute -left-2 top-[6%] h-[50%] w-[min(44vw,400px)] opacity-28" />
        <GameDotMatrix className="absolute bottom-[4%] right-0 h-[38%] w-[min(36vw,320px)] opacity-22" />
        <GameCross className="absolute left-[6%] top-[14%] opacity-45" size="md" />
        <GameTriangle className="absolute right-[2%] top-[8%] rotate-6 opacity-38" accent size="sm" />
        <GameCircle className="absolute left-[42%] top-[6%] opacity-30" size="sm" />
        <GameSquare className="absolute right-[4%] top-[42%] rotate-45 opacity-35" accent size="sm" />
        <GameCross className="absolute bottom-[12%] left-[18%] opacity-30" size="sm" />
        <GameTriangle className="absolute left-[2%] top-[32%] -rotate-12 opacity-36" size="sm" />
        <GameCircle className="absolute right-[2%] top-[22%] opacity-34" accent size="sm" />
        <GameSquare className="absolute left-[3%] bottom-[10%] opacity-32" accent size="sm" />
        <div className="game-scanlines absolute inset-0 opacity-[0.025]" />
      </div>
    );
  }

  if (variant === 'testimonials') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
        <GameDotMatrix className="absolute left-[2%] top-[6%] h-[58%] w-[min(44vw,420px)] opacity-40" />
        <GameDotMatrix className="absolute bottom-[4%] right-0 h-[48%] w-[min(38vw,340px)] opacity-32" />
        <GameCross className="absolute left-[6%] top-[18%] opacity-60" size="lg" />
        <GameTriangle className="absolute right-[2%] top-[6%] rotate-6 opacity-50" accent size="sm" />
        <GameCircle className="absolute left-[44%] top-[8%] opacity-45" accent size="sm" />
        <GameSquare className="absolute left-[2%] bottom-[12%] rotate-45 opacity-40" accent size="sm" />
        <GameCross className="absolute bottom-[14%] left-[14%] opacity-45" size="md" />
        <GameCircle className="absolute bottom-[8%] right-[3%] opacity-35" size="sm" />
        <GameSquare className="absolute right-[2%] bottom-[18%] opacity-30" size="sm" />
        <div className="game-scanlines absolute inset-0 opacity-[0.04]" />
      </div>
    );
  }

  if (variant === 'journal' || variant === 'blog') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
        <GameDotMatrix className="absolute left-[4%] top-[10%] h-[70%] w-[min(36vw,360px)] opacity-34" />
        <GameDotMatrix className="absolute right-[3%] bottom-[8%] h-[45%] w-[min(32vw,300px)] opacity-26" />
        <GameDotMatrix className="absolute left-[38%] top-[4%] h-[28%] w-[min(22vw,200px)] opacity-20" />
        <GameCross className="absolute left-[8%] top-[22%] opacity-50" size="md" />
        <GameCross className="absolute left-[2%] top-[52%] opacity-28" size="sm" />
        <GameTriangle className="absolute right-[2%] top-[10%] -rotate-6 opacity-45" accent size="sm" />
        <GameTriangle className="absolute left-[6%] bottom-[18%] rotate-12 opacity-32" accent size="sm" />
        <GameCircle className="absolute left-[38%] bottom-[16%] opacity-38" accent size="sm" />
        <GameCircle className="absolute right-[14%] top-[34%] opacity-30" size="sm" />
        <GameSquare className="absolute right-[6%] bottom-[24%] rotate-45 opacity-42" accent size="sm" />
        <GameSquare className="absolute left-[2%] top-[38%] opacity-36" size="sm" />
        <GameSquare className="absolute right-[2%] top-[58%] rotate-12 opacity-28" accent size="sm" />
        <GameCross className="absolute bottom-[12%] left-[18%] opacity-32" size="sm" />
        <GameCross className="absolute right-[3%] bottom-[16%] opacity-30" size="sm" />
        {variant === 'blog' && (
          <>
            <GameDotMatrix className="absolute bottom-[2%] left-[12%] h-[32%] w-[min(28vw,240px)] opacity-18" />
            <GameTriangle className="absolute right-[18%] bottom-[8%] -rotate-12 opacity-26" size="sm" />
            <GameCircle className="absolute left-[52%] top-[12%] opacity-24" accent size="sm" />
            <GameCross className="absolute right-[8%] top-[48%] opacity-22" size="md" />
          </>
        )}
        <div className="game-scanlines absolute inset-0 opacity-[0.03]" />
      </div>
    );
  }

  if (variant === 'contact') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
        <GameDotMatrix className="absolute left-[2%] top-[8%] h-[72%] w-[min(34vw,340px)] opacity-32" />
        <GameDotMatrix className="absolute right-[2%] top-[14%] h-[58%] w-[min(30vw,280px)] opacity-24" />
        <GameCross className="absolute left-[4%] top-[18%] opacity-48" size="md" />
        <GameTriangle className="absolute left-[2%] bottom-[22%] -rotate-12 opacity-38" accent size="sm" />
        <GameSquare className="absolute left-[3%] top-[42%] rotate-45 opacity-36" size="sm" />
        <GameCircle className="absolute right-[2%] top-[12%] opacity-40" accent size="sm" />
        <GameTriangle className="absolute right-[3%] bottom-[28%] rotate-6 opacity-34" size="sm" />
        <GameCross className="absolute right-[4%] bottom-[14%] opacity-42" size="sm" />
        <GameSquare className="absolute right-[2%] top-[36%] opacity-32" accent size="sm" />
        <div className="game-scanlines absolute inset-0 opacity-[0.03]" />
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
        <GameDotMatrix className="absolute left-[6%] top-[10%] h-[80%] w-[min(28vw,240px)] opacity-22" />
        <GameDotMatrix className="absolute right-[5%] top-[8%] h-[80%] w-[min(26vw,220px)] opacity-18" />
        <GameCross className="absolute left-[3%] top-[28%] opacity-38" size="sm" />
        <GameCircle className="absolute left-[2%] bottom-[24%] opacity-32" accent size="sm" />
        <GameTriangle className="absolute right-[2%] top-[22%] rotate-6 opacity-36" accent size="sm" />
        <GameSquare className="absolute right-[3%] bottom-[30%] rotate-45 opacity-28" size="sm" />
        <div className="game-scanlines absolute inset-0 opacity-[0.025]" />
      </div>
    );
  }

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <GameDotMatrix className="absolute right-0 top-0 h-[55%] w-[min(40vw,320px)] opacity-25" />
      <GameSquare className="absolute right-[12%] top-[18%] rotate-12 opacity-50" size="sm" />
      <GameTriangle className="absolute right-[8%] top-[28%] -rotate-6 opacity-45" accent size="md" />
      <GameCircle className="absolute right-[18%] top-[12%] opacity-40" size="sm" />
      <GameCross className="absolute right-[6%] top-[42%] opacity-55" size="md" />
      <GameSquare className="absolute right-[22%] top-[36%] h-4 w-4 rotate-45 opacity-35" accent />
      <div className="game-scanlines absolute inset-0 opacity-[0.025]" />
    </div>
  );
}
