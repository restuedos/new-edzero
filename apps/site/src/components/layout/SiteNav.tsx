'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SocialIconLink } from '@/components/ui/SocialIconLink';
import { TechGameDecor } from '@/components/ui/TechGameDecor';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/#hero', sectionId: 'hero' },
  { label: 'About', href: '/#about', sectionId: 'about' },
  { label: 'Services', href: '/#services', sectionId: 'services' },
  { label: 'Portfolio', href: '/#portfolio', sectionId: 'portfolio' },
  { label: 'Testimonial', href: '/#testimonials', sectionId: 'testimonials' },
  { label: 'Journal', href: '/#journal', sectionId: 'journal' },
  { label: 'Contact', href: '/#contact', sectionId: 'contact' },
] as const;

const sectionIds = navItems.map((item) => item.sectionId);

type SectionId = (typeof sectionIds)[number];

function sectionFromHash(hash: string): SectionId {
  const id = hash.replace('#', '');
  return sectionIds.includes(id as SectionId) ? (id as SectionId) : 'hero';
}

type Props = {
  siteName: string;
  socialLinks?: { platform?: string | null; url?: string | null }[];
};

export function SiteNav({ siteName, socialLinks = [] }: Props) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');

  const onHero = isHome && activeSection === 'hero';

  useEffect(() => {
    if (!isHome) return;

    setActiveSection(sectionFromHash(window.location.hash));

    const onHashChange = () => setActiveSection(sectionFromHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let bestSection: SectionId = 'hero';
        let bestRatio = 0;

        for (const id of sectionIds) {
          const ratio = visibility.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestSection = id;
          }
        }

        if (bestRatio > 0) {
          setActiveSection(bestSection);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '-40% 0px -40% 0px',
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function isActive(sectionId: SectionId) {
    return isHome && activeSection === sectionId;
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 px-6 py-6 md:px-12 md:py-8">
        <TechGameDecor variant="nav-header" />
        <div className="relative z-[1] flex items-center justify-between">
          <Link
            href="/"
            className={cn(
              'site-logo text-white transition-all duration-300 ease-out',
              onHero ? 'site-logo-hero text-2xl md:text-[1.65rem] lg:text-3xl' : 'text-sm md:text-base',
            )}
          >
            {siteName}
            <span className="accent-dot" />
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            className="text-white transition hover:opacity-80"
            onClick={() => setOpen(true)}
          >
            <Menu size={26} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-[59] bg-black/20"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed right-0 top-0 z-[60] flex h-full w-[min(28vw,320px)] min-w-[240px] flex-col overflow-hidden bg-black shadow-2xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-hidden={!open}
      >
        <TechGameDecor variant="nav-drawer" />
        <div className="relative z-[1] flex justify-end px-6 pb-2 pt-6 md:px-8 md:pt-8">
          <button
            type="button"
            aria-label="Close menu"
            className="text-white transition hover:opacity-80"
            onClick={() => setOpen(false)}
          >
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="relative z-[1] flex flex-1 flex-col gap-6 px-10 pt-6 md:gap-7 md:px-12 md:pt-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'font-[family-name:var(--font-display)] text-lg leading-none transition-colors md:text-xl',
                isActive(item.sectionId)
                  ? 'text-[var(--color-accent)]'
                  : 'text-white hover:text-[var(--color-muted-light)]',
              )}
              aria-current={isActive(item.sectionId) ? 'page' : undefined}
              onClick={() => {
                setActiveSection(item.sectionId);
                setOpen(false);
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {socialLinks.length > 0 && (
          <div className="relative z-[1] border-t border-neutral-800 px-10 py-8 md:px-12">
            <p className="mb-5 font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)]">
              Find me on:
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {socialLinks.map((s) => (
                <SocialIconLink
                  key={s.url ?? s.platform}
                  platform={s.platform}
                  url={s.url}
                  size={22}
                />
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
