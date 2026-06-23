import { notFound } from 'next/navigation';
import { BlogArticleView } from '@/components/cms/BlogArticleView';
import { getPayload } from '@/lib/payload';

type Props = { params: Promise<{ slug: string }> };

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload();
  const settings = await payload.findGlobal({ slug: 'global-settings' });
  const result = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  });
  const article = result.docs[0];
  if (!article) notFound();

  return <BlogArticleView article={article} settings={settings} />;
}
