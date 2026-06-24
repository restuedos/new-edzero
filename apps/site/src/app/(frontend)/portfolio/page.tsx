import { getPayload } from '@/lib/payload';
import { mediaUrl } from '@/lib/utils';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { PortfolioSection } from '@/components/sections/PortfolioSection';

export default async function PortfolioPage() {
  const payload = await getPayload();
  const [settings, projects] = await Promise.all([
    payload.findGlobal({ slug: 'global-settings' }),
    payload.find({ collection: 'projects', where: { isActive: { equals: true } }, sort: 'displayOrder', limit: 50, depth: 1 }),
  ]);

  return (
    <SubPageLayout settings={settings}>
      <PortfolioSection
        layout="page"
        projects={projects.docs.map((p) => ({
          id: String(p.id),
          title: p.title,
          category: p.category,
          coverImageUrl: mediaUrl(p.coverImage),
        }))}
      />
    </SubPageLayout>
  );
}
