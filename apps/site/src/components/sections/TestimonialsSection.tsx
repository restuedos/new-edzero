'use client';

import { useCallback, useEffect, useState } from 'react';
import { MediaImage } from '@/components/ui/MediaImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TechGameDecor, GameCircle, GameCross, GameSquare } from '@/components/ui/TechGameDecor';
import { cn } from '@/lib/utils';

const AUTO_SLIDE_MS = 5500;
const BG_CROSSFADE_MS = 1000;

type Testimonial = {
  id: string;
  quote: string;
  authorName: string;
  authorTitle?: string | null;
  backgroundImageUrl?: string;
};

type Props = {
  testimonials: Testimonial[];
};

function TestimonialCard({
  testimonial,
  highlighted = false,
  className,
}: {
  testimonial: Testimonial;
  highlighted?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        'game-testimonial-card flex w-full flex-col rounded-2xl px-6 py-8 md:rounded-3xl md:px-9 md:py-10',
        highlighted ? 'game-testimonial-card-active min-h-[260px] md:min-h-[280px]' : 'game-testimonial-card-dim min-h-[200px] md:min-h-[220px]',
        className,
      )}
    >
      <span
        className={cn(
          'mb-4 block text-center font-[family-name:var(--font-display)] leading-none text-[var(--color-accent)]',
          highlighted ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl',
        )}
        aria-hidden
      >
        &ldquo;
      </span>

      <blockquote
        className={cn(
          'flex-1 text-center font-[family-name:var(--font-body)] leading-relaxed',
          highlighted
            ? 'text-sm text-neutral-100 md:text-base md:leading-7'
            : 'text-[0.68rem] text-neutral-400 md:text-xs',
        )}
      >
        {testimonial.quote}
      </blockquote>

      <div
        className={cn(
          'mt-6 border-t border-neutral-600/40 pt-5 text-center',
          !highlighted && 'opacity-80',
        )}
      >
        <p
          className={cn(
            'font-[family-name:var(--font-display)] leading-snug text-white',
            highlighted ? 'text-sm md:text-base' : 'text-xs md:text-sm',
          )}
        >
          {testimonial.authorName}
        </p>
        {testimonial.authorTitle && (
          <p
            className={cn(
              'mt-1 font-[family-name:var(--font-body)] text-neutral-500',
              highlighted ? 'text-xs md:text-sm' : 'text-[0.65rem] md:text-xs',
            )}
          >
            {testimonial.authorTitle}
          </p>
        )}
      </div>
    </article>
  );
}

export function TestimonialsSection({ testimonials }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = testimonials.length;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (total <= 1 || paused) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [total, paused]);

  if (total === 0) return null;

  const prev = testimonials[(index - 1 + total) % total]!;
  const current = testimonials[index]!;
  const next = testimonials[(index + 1) % total]!;

  return (
    <section id="testimonials" className="game-section-bg snap-screen relative flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {testimonials.map((testimonial, i) => (
          <MediaImage
            key={testimonial.id}
            src={testimonial.backgroundImageUrl}
            alt=""
            className={cn(
              'absolute inset-0 h-full w-full object-cover object-[center_15%] grayscale ease-in-out',
              i === index ? 'opacity-100' : 'opacity-0',
            )}
            style={{ transition: `opacity ${BG_CROSSFADE_MS}ms ease-in-out` }}
          />
        ))}
      </div>
      <div className="absolute inset-x-0 top-0 z-[4] h-28 bg-gradient-to-b from-black/55 to-transparent md:h-32" />
      <div className="game-testimonial-hero-gradient pointer-events-none absolute inset-0 z-[5]" aria-hidden />
      <TechGameDecor variant="testimonials" />

      <div className="relative z-10 min-h-0 flex-[0.58] md:flex-[0.64] lg:flex-[0.66]">
        <div className="section-padding !pb-36 md:!pb-44">
          <SectionHeading title="My Happy Clients" variant="light" navSafe />
        </div>
      </div>

      <div
        className="relative z-20 -mt-28 flex min-h-0 flex-1 flex-col justify-end pb-8 md:-mt-36 md:pb-10 lg:-mt-40"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setPaused(false);
          }
        }}
      >
        <div className="relative mx-auto w-full max-w-7xl px-4 lg:px-8">
          <GameCross className="absolute -left-1 top-[38%] hidden opacity-50 md:block" size="md" />
          <GameSquare className="absolute -left-3 bottom-[18%] hidden rotate-12 opacity-40 md:block" accent size="sm" />
          <GameCircle className="absolute right-0 bottom-[12%] hidden opacity-35 md:block" size="sm" />

          <div className="relative flex w-full items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            {total > 1 && (
              <div className="w-[26%] max-w-[280px] shrink-0 scale-[0.88] transition-all duration-700 ease-out sm:max-w-[300px] md:w-[28%] md:max-w-[320px] md:scale-[0.9]">
                <TestimonialCard testimonial={prev} />
              </div>
            )}

            <div className="w-[48%] max-w-xl shrink-0 transition-all duration-700 ease-out sm:max-w-2xl md:w-[44%] md:max-w-[42rem] lg:max-w-[44rem]">
              <TestimonialCard testimonial={current} highlighted />
            </div>

            {total > 1 && (
              <div className="w-[26%] max-w-[280px] shrink-0 scale-[0.88] transition-all duration-700 ease-out sm:max-w-[300px] md:w-[28%] md:max-w-[320px] md:scale-[0.9]">
                <TestimonialCard testimonial={next} />
              </div>
            )}
          </div>
        </div>

        {total > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3 md:mt-10">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => goTo(i)}
                className={cn(
                  'transition-all duration-300',
                  i === index
                    ? 'h-1.5 w-8 rounded-full bg-neutral-400'
                    : 'h-2 w-2 rounded-full bg-neutral-700 hover:bg-neutral-500',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
