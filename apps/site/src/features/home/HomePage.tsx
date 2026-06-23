import { getPayload } from '@/lib/payload';
import { mediaUrl } from '@/lib/utils';
import { RefreshRouteOnSave } from '@/components/cms/RefreshRouteOnSave';
import { HomeSnapScroll } from '@/components/layout/HomeSnapScroll';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteNav } from '@/components/layout/SiteNav';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { JournalSection } from '@/components/sections/JournalSection';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { ThemeShell } from '@/components/layout/ThemeShell';
import { skillsFromSettings } from '@/lib/theme';

export async function HomePage() {
  const payload = await getPayload();

  const [settings, services, projects, partners, testimonials, articles] = await Promise.all([
    payload.findGlobal({ slug: 'global-settings' }),
    payload.find({ collection: 'services', where: { isActive: { equals: true } }, sort: 'displayOrder', limit: 20 }),
    payload.find({ collection: 'projects', where: { isActive: { equals: true } }, sort: 'displayOrder', limit: 50, depth: 1 }),
    payload.find({ collection: 'partners', where: { isActive: { equals: true } }, sort: 'displayOrder', limit: 20, depth: 1 }),
    payload.find({ collection: 'testimonials', where: { isActive: { equals: true } }, sort: 'displayOrder', limit: 10, depth: 1 }),
    payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 6,
      depth: 1,
    }),
  ]);

  const skills = skillsFromSettings(settings);

  return (
    <HomeSnapScroll>
      <ThemeShell settings={settings}>
        <RefreshRouteOnSave />
        <SiteNav siteName={settings.siteName ?? 'EDZERO'} socialLinks={settings.socialLinks ?? []} />
        <main>
          <HeroSection
            headline={settings.heroHeadline ?? settings.tagline ?? ''}
            subheadline={settings.heroSubheadline}
            heroImageUrl={mediaUrl(settings.heroImage)}
          />
          <AboutSection
            title={settings.aboutTitle ?? 'About Me'}
            name={settings.aboutName}
            text={settings.aboutText}
            aboutImageUrl={mediaUrl(settings.aboutImage)}
            cvUrl={mediaUrl(settings.cvFile)}
            skills={skills}
          />
          <ServicesSection
            services={services.docs.map((s) => ({
              id: String(s.id),
              title: s.title,
              description: s.description,
              icon: s.icon,
            }))}
          />
          <div id="portfolio" className="snap-scroll-zone bg-black">
            <PortfolioSection
              projects={projects.docs.map((p) => ({
                id: String(p.id),
                title: p.title,
                category: p.category,
                coverImageUrl: mediaUrl(p.coverImage),
              }))}
            />
            <PartnersSection
              partners={partners.docs.map((p) => ({
                id: String(p.id),
                name: p.name,
                logoUrl: mediaUrl(p.logo),
              }))}
            />
          </div>
          <TestimonialsSection
            testimonials={testimonials.docs.map((t) => ({
              id: String(t.id),
              quote: t.quote,
              authorName: t.authorName,
              authorTitle: t.authorTitle,
              backgroundImageUrl: mediaUrl(t.backgroundImage),
            }))}
          />
          <JournalSection
            articles={articles.docs.map((a) => ({
              id: String(a.id),
              title: a.title,
              slug: a.slug,
              excerpt: a.excerpt,
              author: a.author,
              readTimeMinutes: a.readTimeMinutes,
              coverImageUrl: mediaUrl(a.coverImage),
            }))}
          />
          <section id="contact" className="game-section-bg snap-screen-fit flex flex-col">
            <ContactSection
              siteName={settings.siteName ?? 'EDZERO'}
              email={settings.contactEmail}
              phone={settings.contactPhone}
              address={settings.contactAddress}
              className="flex flex-1 flex-col justify-start"
            />
            <SiteFooter
              siteName={settings.siteName ?? 'EDZERO'}
              copyrightText={settings.copyrightText}
              socialLinks={settings.socialLinks ?? []}
              compact
            />
          </section>
        </main>
      </ThemeShell>
    </HomeSnapScroll>
  );
}
