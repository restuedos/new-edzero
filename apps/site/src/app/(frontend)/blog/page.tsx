import Link from 'next/link';
import { getPayload } from '@/lib/payload';
import { mediaUrl } from '@/lib/utils';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteNav } from '@/components/layout/SiteNav';
import { ThemeShell } from '@/components/layout/ThemeShell';

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
    <ThemeShell settings={settings} className="page-shell game-section-bg">
      <SiteNav siteName={settings.siteName ?? 'EDZERO'} socialLinks={settings.socialLinks ?? []} />
      <main className="page-shell-main section-padding pb-16 md:pb-20">
        <h1 className="section-title">Journal</h1>
        <div className="section-divider" />
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.docs.map((article) => (
            <article key={article.id} className="card-dark">
              {mediaUrl(article.coverImage) ? (
                // eslint-disable-next-line @next/next/no-img-element -- blog listing cover
                <img
                  src={mediaUrl(article.coverImage)}
                  alt=""
                  className="mb-4 aspect-video w-full object-cover"
                />
              ) : null}
              <h2 className="font-[family-name:var(--font-heading)] text-lg">{article.title}</h2>
              <p className="mt-2 text-sm text-neutral-400">{article.excerpt}</p>
              <Link href={`/blog/${article.slug}`} className="mt-4 inline-block text-sm text-[var(--color-accent)]">
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter siteName={settings.siteName ?? 'EDZERO'} copyrightText={settings.copyrightText} socialLinks={settings.socialLinks ?? []} />
    </ThemeShell>
  );
}
