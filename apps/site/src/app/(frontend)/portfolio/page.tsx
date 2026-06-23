import { getPayload } from '@/lib/payload';
import { mediaUrl } from '@/lib/utils';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteNav } from '@/components/layout/SiteNav';
import { ThemeShell } from '@/components/layout/ThemeShell';
import { PortfolioSection } from '@/components/sections/PortfolioSection';

export default async function PortfolioPage() {
  const payload = await getPayload();
  const [settings, projects] = await Promise.all([
    payload.findGlobal({ slug: 'global-settings' }),
    payload.find({ collection: 'projects', where: { isActive: { equals: true } }, sort: 'displayOrder', limit: 50, depth: 1 }),
  ]);

  return (
    <ThemeShell settings={settings}>
      <SiteNav siteName={settings.siteName ?? 'EDZERO'} socialLinks={settings.socialLinks ?? []} />
      <main className="pt-24">
        <PortfolioSection
          projects={projects.docs.map((p) => ({
            id: String(p.id),
            title: p.title,
            category: p.category,
            coverImageUrl: mediaUrl(p.coverImage),
          }))}
        />
      </main>
      <SiteFooter siteName={settings.siteName ?? 'EDZERO'} copyrightText={settings.copyrightText} socialLinks={settings.socialLinks ?? []} />
    </ThemeShell>
  );
}
