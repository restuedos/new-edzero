import { getPayload } from '@/lib/payload';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteNav } from '@/components/layout/SiteNav';
import { ThemeShell } from '@/components/layout/ThemeShell';
import { ContactSection } from '@/components/sections/ContactSection';

export default async function ContactPage() {
  const payload = await getPayload();
  const settings = await payload.findGlobal({ slug: 'global-settings' });

  return (
    <ThemeShell settings={settings}>
      <SiteNav siteName={settings.siteName ?? 'EDZERO'} socialLinks={settings.socialLinks ?? []} />
      <main className="pt-24">
        <ContactSection
          siteName={settings.siteName ?? 'EDZERO'}
          email={settings.contactEmail}
          phone={settings.contactPhone}
          address={settings.contactAddress}
        />
      </main>
      <SiteFooter siteName={settings.siteName ?? 'EDZERO'} copyrightText={settings.copyrightText} socialLinks={settings.socialLinks ?? []} />
    </ThemeShell>
  );
}
