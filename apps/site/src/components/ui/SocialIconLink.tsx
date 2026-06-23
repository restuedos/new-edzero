import { Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

const platformIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
} as const;

const platformLabels: Record<keyof typeof platformIcons, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  github: 'GitHub',
};

type Platform = keyof typeof platformIcons;

type Props = {
  platform?: string | null;
  url?: string | null;
  className?: string;
  iconClassName?: string;
  size?: number;
};

export function SocialIconLink({ platform, url, className, iconClassName, size = 20 }: Props) {
  if (!platform || !url) return null;

  const key = platform as Platform;
  const Icon = platformIcons[key];
  if (!Icon) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label={platformLabels[key] ?? platform}
      className={cn(
        'nav-social-icon inline-flex items-center justify-center text-white transition-colors hover:text-[var(--color-accent)]',
        className,
      )}
    >
      <Icon size={size} strokeWidth={1.5} className={iconClassName} />
    </a>
  );
}
