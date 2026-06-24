import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteNav } from '@/components/layout/SiteNav';
import { SubPageTechGame } from '@/components/layout/SubPageTechGame';
import { ThemeShell } from '@/components/layout/ThemeShell';
import { cn } from '@/lib/utils';
import type { GlobalSetting } from '@/payload-types';
import type { ReactNode } from 'react';

type Props = {
  settings: GlobalSetting;
  children: ReactNode;
  mainClassName?: string;
};

export function SubPageLayout({ settings, children, mainClassName }: Props) {
  const siteName = settings.siteName ?? 'EDZERO';
  const socialLinks = settings.socialLinks ?? [];

  return (
    <SubPageTechGame>
      <ThemeShell settings={settings} className="page-shell game-section-bg">
        <SiteNav siteName={siteName} socialLinks={socialLinks} />
        <main className={cn('page-shell-main section-padding pb-16 md:pb-20', mainClassName)}>
          {children}
        </main>
        <SiteFooter siteName={siteName} copyrightText={settings.copyrightText} socialLinks={socialLinks} />
      </ThemeShell>
    </SubPageTechGame>
  );
}
