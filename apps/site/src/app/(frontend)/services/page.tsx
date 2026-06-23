import { getPayload } from '@/lib/payload';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteNav } from '@/components/layout/SiteNav';
import { ThemeShell } from '@/components/layout/ThemeShell';
import { ServicesSection } from '@/components/sections/ServicesSection';

export default async function ServicesPage() {
  const payload = await getPayload();
  const [settings, services] = await Promise.all([
    payload.findGlobal({ slug: 'global-settings' }),
    payload.find({ collection: 'services', where: { isActive: { equals: true } }, sort: 'displayOrder', limit: 50 }),
  ]);

  return (
    <ThemeShell settings={settings}>
      <SiteNav siteName={settings.siteName ?? 'EDZERO'} socialLinks={settings.socialLinks ?? []} />
      <main className="pt-24">
        <ServicesSection
          services={services.docs.map((s) => ({
            id: String(s.id),
            title: s.title,
            description: s.description,
            icon: s.icon,
          }))}
        />
      </main>
      <SiteFooter siteName={settings.siteName ?? 'EDZERO'} copyrightText={settings.copyrightText} socialLinks={settings.socialLinks ?? []} />
    </ThemeShell>
  );
}
