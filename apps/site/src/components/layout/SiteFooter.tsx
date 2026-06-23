import { TechGameDecor } from '@/components/ui/TechGameDecor';

type Props = {
  siteName: string;
  copyrightText?: string | null;
  socialLinks?: { platform?: string | null; url?: string | null }[];
  compact?: boolean;
};

const platformLabels: Record<string, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  github: 'Github',
};

export function SiteFooter({ siteName, copyrightText, socialLinks = [], compact = false }: Props) {
  const year = new Date().getFullYear();
  const footnote =
    copyrightText ??
    `Copyright © ${year} All rights reserved | Made with ♥ by EDZero`;

  return (
    <footer
      className={`relative shrink-0 overflow-hidden border-t border-neutral-900 px-6 text-center md:px-12 ${
        compact ? 'py-6 md:py-8' : 'py-10 md:py-12'
      }`}
    >
      <TechGameDecor variant="footer" />
      <div className="relative z-[1]">
        <p className="site-logo text-2xl md:text-3xl">
          {siteName}
          <span className="accent-dot" />
        </p>
        {socialLinks.length > 0 && (
          <nav
            className={`flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs tracking-[0.22em] text-neutral-300 md:gap-x-10 md:text-sm ${
              compact ? 'mt-5' : 'mt-8'
            }`}
            aria-label="Social media"
          >
            {socialLinks.map((s) => (
              <a
                key={s.url ?? s.platform}
                href={s.url ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="uppercase transition hover:text-white"
              >
                {platformLabels[s.platform ?? ''] ?? s.platform}
              </a>
            ))}
          </nav>
        )}
        <p className={`text-xs tracking-wide text-neutral-500 md:text-sm ${compact ? 'mt-5' : 'mt-8'}`}>
          {footnote}
        </p>
      </div>
    </footer>
  );
}
