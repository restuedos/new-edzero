import { getPayload } from '@/lib/payload';
import { mediaUrl } from '@/lib/utils';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { JournalArticleGrid } from '@/components/sections/JournalArticleGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TechGameDecor } from '@/components/ui/TechGameDecor';

export default async function BlogPage() {
  const payload = await getPayload();
  const [settings, articles] = await Promise.all([
    payload.findGlobal({ slug: 'global-settings' }),
    payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 50,
      depth: 1,
    }),
  ]);

  return (
    <SubPageLayout settings={settings}>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <TechGameDecor variant="blog" />

        <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
          <SectionHeading title="Journal" variant="light" className="mb-6 md:mb-8" />

          <JournalArticleGrid
            className="flex-1 content-start"
            articles={articles.docs.map((article) => ({
              id: String(article.id),
              title: article.title,
              slug: article.slug,
              excerpt: article.excerpt,
              author: article.author,
              readTimeMinutes: article.readTimeMinutes,
              coverImageUrl: mediaUrl(article.coverImage),
            }))}
          />
        </div>
      </div>
    </SubPageLayout>
  );
}
