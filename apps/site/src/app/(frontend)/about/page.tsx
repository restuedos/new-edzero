import { getPayload } from '@/lib/payload';
import { mediaUrl } from '@/lib/utils';
import { SubPageLayout } from '@/components/layout/SubPageLayout';
import { AboutSection } from '@/components/sections/AboutSection';
import { skillsFromSettings } from '@/lib/theme';

export default async function AboutPage() {
  const payload = await getPayload();
  const settings = await payload.findGlobal({ slug: 'global-settings' });

  return (
    <SubPageLayout settings={settings}>
      <AboutSection
        layout="page"
        title={settings.aboutTitle ?? 'About Me'}
        name={settings.aboutName}
        text={settings.aboutText}
        aboutImageUrl={mediaUrl(settings.aboutImage)}
        cvUrl={mediaUrl(settings.cvFile)}
        skills={skillsFromSettings(settings)}
      />
    </SubPageLayout>
  );
}
