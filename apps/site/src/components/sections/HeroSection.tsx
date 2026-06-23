import Link from 'next/link';
import { MediaImage } from '@/components/ui/MediaImage';
import { TechGameDecor } from '@/components/ui/TechGameDecor';

type Props = {
  headline: string;
  subheadline?: string | null;
  heroImageUrl?: string;
};

export function HeroSection({ headline, subheadline, heroImageUrl }: Props) {
  return (
    <section id="hero" className="snap-screen relative flex flex-col justify-end overflow-hidden">
      <MediaImage
        src={heroImageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_20%] grayscale"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-black/20" />
      <TechGameDecor variant="hero" />

      <div className="relative z-10 w-full max-w-4xl section-padding pb-28 pt-36 text-left md:pb-36 md:pt-40">
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(3.5rem,12vw,7.5rem)] leading-none text-white">
          Hi!
        </h1>
        <p className="mt-5 max-w-xl font-[family-name:var(--font-display)] text-xl leading-snug text-white md:text-2xl">
          {headline}
        </p>
        {subheadline && (
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--color-muted-light)] md:text-base">
            {subheadline}
          </p>
        )}
        <div className="accent-line accent-line-hero" />
        <Link href="#about" className="btn-hero game-btn mt-8">
          Discover Now
        </Link>
      </div>
    </section>
  );
}
