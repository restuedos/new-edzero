import { getPayload } from '@/lib/payload';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { ContactSection } from '@/components/sections/ContactSection';

export default async function ContactPage() {
  const payload = await getPayload();
  const settings = await payload.findGlobal({ slug: 'global-settings' });

  return (
    <SubPageLayout settings={settings}>
      <ContactSection
        layout="page"
        siteName={settings.siteName ?? 'EDZERO'}
        email={settings.contactEmail}
        phone={settings.contactPhone}
        address={settings.contactAddress}
      />
    </SubPageLayout>
  );
}
