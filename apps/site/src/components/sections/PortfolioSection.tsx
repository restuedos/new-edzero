'use client';

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MediaImage } from '@/components/ui/MediaImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TechGameDecor } from '@/components/ui/TechGameDecor';
import { cn } from '@/lib/utils';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Web Development', value: 'web-development' },
  { label: 'Back End & API', value: 'backend-api' },
  { label: 'Cloud & DevOps', value: 'cloud-devops' },
  { label: 'System Integration', value: 'system-integration' },
] as const;

/** Repeating 6-tile rhythm: tall / short / short / tall / short / tall */
const ROW_SPAN_PATTERN = [2, 1, 1, 2, 1, 2] as const;

type Project = {
  id: string;
  title: string;
  category: string;
  coverImageUrl?: string;
};

type Props = {
  projects: Project[];
  layout?: 'home' | 'page';
};

function tileRowSpan(index: number): number {
  return ROW_SPAN_PATTERN[index % ROW_SPAN_PATTERN.length] ?? 1;
}

function PortfolioFilters({
  active,
  onChange,
}: {
  active: string;
  onChange: (value: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const container = containerRef.current;
    const tab = tabRefs.current[active];
    if (!container || !tab) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    setIndicator({
      left: tabRect.left - containerRect.left,
      width: tabRect.width,
    });
  }, [active]);

  useLayoutEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  return (
    <div className="relative z-[1] mx-auto mb-10 max-w-6xl md:mb-12">
      <div ref={containerRef} className="relative ml-auto w-fit max-w-full overflow-x-auto">
        <div className="flex min-w-max">
          {categories.map((cat) => {
            const isActive = active === cat.value;
            return (
              <button
                key={cat.value}
                ref={(el) => {
                  tabRefs.current[cat.value] = el;
                }}
                type="button"
                onClick={() => onChange(cat.value)}
                className="flex flex-col items-stretch"
              >
                <span
                  className={cn(
                    'whitespace-nowrap px-4 pb-3 font-[family-name:var(--font-logo)] text-xs tracking-[0.14em] uppercase transition-colors duration-300 md:px-5 md:text-sm',
                    isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300',
                  )}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative h-0.5 bg-white">
          <span
            className="absolute top-0 h-full bg-[var(--color-accent)] transition-[left,width] duration-300 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

export function PortfolioSection({ projects, layout = 'home' }: Props) {
  const [active, setActive] = useState('all');

  const filtered = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.category === active)),
    [active, projects],
  );

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        layout === 'page'
          ? 'flex min-h-0 flex-1 flex-col py-8 md:py-12'
          : 'game-section-bg pb-8 pt-4 md:pb-10 md:pt-6',
      )}
    >
      <TechGameDecor variant="portfolio" />

      <div
        className={cn(
          'relative z-[1] flex flex-col',
          layout === 'page' ? 'min-h-0 flex-1' : 'section-padding !pb-10 !pt-0',
        )}
      >
        <SectionHeading
          title="Portfolio"
          variant="light"
          navSafe={layout === 'home'}
          className="mb-10 md:mb-12"
        />

        <PortfolioFilters active={active} onChange={setActive} />

        <div
          className={cn(
            'game-portfolio-grid mx-auto grid max-w-6xl flex-1 grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[11rem]',
            layout === 'page' && 'min-h-[min(50vh,28rem)] content-start',
          )}
        >
          {filtered.map((project, index) => {
            const rowSpan = tileRowSpan(index);
            return (
              <article
                key={project.id}
                className={cn(
                  'game-portfolio-card group relative min-h-[14rem] overflow-hidden bg-[var(--color-surface)] sm:min-h-[12rem] lg:min-h-0',
                  rowSpan === 2 && 'lg:row-span-2',
                )}
              >
                <MediaImage
                  src={project.coverImageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <p className="pointer-events-none absolute bottom-0 left-0 right-0 translate-y-1 p-4 font-[family-name:var(--font-logo)] text-[0.65rem] tracking-[0.12em] text-white uppercase opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {project.title}
                </p>
                <span className="game-portfolio-index" aria-hidden>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
