import { getPayload } from '@/lib/payload';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { ServicesSection } from '@/components/sections/ServicesSection';

export default async function ServicesPage() {
  const payload = await getPayload();
  const [settings, services] = await Promise.all([
    payload.findGlobal({ slug: 'global-settings' }),
    payload.find({ collection: 'services', where: { isActive: { equals: true } }, sort: 'displayOrder', limit: 50 }),
  ]);

  return (
    <SubPageLayout settings={settings}>
      <ServicesSection
        layout="page"
        services={services.docs.map((s) => ({
          id: String(s.id),
          title: s.title,
          description: s.description,
          icon: s.icon,
        }))}
      />
    </SubPageLayout>
  );
}
