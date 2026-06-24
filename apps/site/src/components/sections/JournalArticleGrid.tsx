import Link from 'next/link';
import { MediaImage } from '@/components/ui/MediaImage';
import { cn } from '@/lib/utils';

export type JournalArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  author?: string | null;
  readTimeMinutes?: number | null;
  coverImageUrl?: string;
};

type Props = {
  articles: JournalArticle[];
  className?: string;
};

export function JournalArticleGrid({ articles, className }: Props) {
  if (articles.length === 0) {
    return (
      <p className="relative z-[1] text-center text-sm text-neutral-500">No published articles yet.</p>
    );
  }

  return (
    <div
      className={cn(
        'relative z-[1] mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3',
        className,
      )}
    >
      {articles.map((article, index) => (
        <Link
          key={article.id}
          href={`/blog/${article.slug}`}
          className="game-journal-card group relative block min-h-[14rem] overflow-hidden bg-[var(--color-surface)] sm:min-h-[16rem] md:min-h-[18rem] lg:min-h-[20rem] lg:h-[42vh]"
        >
          <span className="game-journal-index" aria-hidden>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className="game-hud-corner absolute left-3 top-3 z-[2] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
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
            {article.excerpt && (
              <p className="mt-2 line-clamp-2 font-[family-name:var(--font-body)] text-[0.65rem] text-neutral-400 md:text-xs">
                {article.excerpt}
              </p>
            )}
            <p className="mt-2 font-[family-name:var(--font-body)] text-[0.65rem] text-neutral-500 md:text-xs">
              By {article.author ?? 'EDZero'} — {article.readTimeMinutes ?? 5} mins read
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
