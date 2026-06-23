import { cn } from '@/lib/utils';

type Props = {
  title: string;
  className?: string;
  variant?: 'accent' | 'light';
  /** Extra top padding so the title clears the fixed navbar (matches Testimonials). */
  navSafe?: boolean;
};

export function SectionHeading({ title, className = '', variant = 'accent', navSafe = false }: Props) {
  const strokeColor = variant === 'light' ? 'white' : 'var(--color-accent)';

  return (
    <div className={cn('text-center', navSafe && 'section-title-nav-safe', className)}>
      <h2 className="font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">{title}</h2>
      <svg className="mx-auto mt-3 h-3 w-16" viewBox="0 0 64 12" fill="none" aria-hidden>
        <path
          d="M2 8 C12 2, 20 10, 32 6 S52 2, 62 8"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
