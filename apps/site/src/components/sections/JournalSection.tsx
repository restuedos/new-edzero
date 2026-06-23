import Link from 'next/link';
import { MediaImage } from '@/components/ui/MediaImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TechGameDecor } from '@/components/ui/TechGameDecor';

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  author?: string | null;
  readTimeMinutes?: number | null;
  coverImageUrl?: string;
};

type Props = {
  articles: Article[];
};

export function JournalSection({ articles }: Props) {
  if (articles.length === 0) return null;

  return (
    <section id="journal" className="game-section-bg snap-screen snap-screen-center relative overflow-hidden section-padding">
      <TechGameDecor variant="journal" />

      <div className="relative z-[1] w-full">
        <SectionHeading title="My Journal Blog" variant="light" navSafe className="mb-6 md:mb-8" />

        <div className="mx-auto grid w-full max-w-6xl grid-cols-3 gap-2 md:gap-4">
          {articles.slice(0, 3).map((article, index) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="game-journal-card group relative block h-[42vh] min-h-[14rem] overflow-hidden bg-[var(--color-surface)] sm:h-[46vh] md:h-[50vh] md:min-h-[18rem] lg:h-[52vh] lg:min-h-[20rem]"
            >
              <span className="game-journal-index" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="game-hud-corner absolute left-3 top-3 z-[2] opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
              <span
                className="game-hud-corner game-hud-corner-accent absolute bottom-3 right-3 z-[2] rotate-180 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />

              <MediaImage
                src={article.coverImageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 pt-16 md:p-6 md:pt-20">
                <h3 className="font-[family-name:var(--font-display)] text-base leading-snug text-white md:text-xl lg:text-2xl">
                  {article.title}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-body)] text-[0.65rem] text-neutral-400 md:text-xs">
                  By {article.author ?? 'EDZero'} — {article.readTimeMinutes ?? 5} mins read
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center md:mt-8">
          <Link href="/blog" className="btn-outline game-btn">
            View all articles
          </Link>
        </div>
      </div>
    </section>
  );
}
