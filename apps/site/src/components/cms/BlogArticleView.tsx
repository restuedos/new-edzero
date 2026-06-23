'use client';

import { useLivePreview } from '@payloadcms/live-preview-react';
import { LexicalRichText } from '@/components/cms/LexicalRichText';
import { RefreshRouteOnSave } from '@/components/cms/RefreshRouteOnSave';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteNav } from '@/components/layout/SiteNav';
import type { Article, GlobalSetting } from '@/payload-types';
import { ThemeShell } from '@/components/layout/ThemeShell';

type Props = {
  article: Article;
  settings: GlobalSetting;
};

export function BlogArticleView({ article: initialArticle, settings }: Props) {
  const serverURL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  const { data: article } = useLivePreview({
    initialData: initialArticle,
    serverURL,
    depth: 2,
  });

  return (
    <ThemeShell settings={settings} className="page-shell game-section-bg">
      <RefreshRouteOnSave />
      <SiteNav siteName={settings.siteName ?? 'EDZERO'} socialLinks={settings.socialLinks ?? []} />
      <main className="page-shell-main section-padding mx-auto w-full max-w-3xl pb-16 md:pb-20">
        <p className="text-sm text-neutral-500">
          {article.author} · {article.readTimeMinutes ?? 5} min read
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">{article.title}</h1>
        {article.excerpt && <p className="mt-4 text-neutral-400">{article.excerpt}</p>}
        <div className="article-body mt-10 max-w-none">
          <LexicalRichText data={article.body} className="payload-richtext article-body" />
        </div>
      </main>
      <SiteFooter
        siteName={settings.siteName ?? 'EDZERO'}
        copyrightText={settings.copyrightText}
        socialLinks={settings.socialLinks ?? []}
      />
    </ThemeShell>
  );
}
