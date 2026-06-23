import { getPayload } from '@/lib/payload';
import { mediaUrl } from '@/lib/utils';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteNav } from '@/components/layout/SiteNav';
import { ThemeShell } from '@/components/layout/ThemeShell';
import { AboutSection } from '@/components/sections/AboutSection';
import { skillsFromSettings } from '@/lib/theme';

export default async function AboutPage() {
  const payload = await getPayload();
  const settings = await payload.findGlobal({ slug: 'global-settings' });

  return (
    <ThemeShell settings={settings}>
      <SiteNav siteName={settings.siteName ?? 'EDZERO'} socialLinks={settings.socialLinks ?? []} />
      <main className="pt-24">
        <AboutSection
          title={settings.aboutTitle ?? 'About Me'}
          name={settings.aboutName}
          text={settings.aboutText}
          aboutImageUrl={mediaUrl(settings.aboutImage)}
          cvUrl={mediaUrl(settings.cvFile)}
          skills={skillsFromSettings(settings)}
        />
      </main>
      <SiteFooter siteName={settings.siteName ?? 'EDZERO'} copyrightText={settings.copyrightText} socialLinks={settings.socialLinks ?? []} />
    </ThemeShell>
  );
}
