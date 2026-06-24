import Link from 'next/link';
import { MediaImage } from '@/components/ui/MediaImage';
import { JournalArticleGrid } from '@/components/sections/JournalArticleGrid';
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

        <JournalArticleGrid articles={articles.slice(0, 3)} />

        <div className="relative z-[1] mt-6 text-center md:mt-8">
          <Link href="/blog" className="btn-outline game-btn">
            View all articles
          </Link>
        </div>
      </div>
    </section>
  );
}
