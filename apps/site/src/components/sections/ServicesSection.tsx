import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { TechGameDecor } from '@/components/ui/TechGameDecor';
import { cn } from '@/lib/utils';

type Service = {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
};

type Props = {
  services: Service[];
  layout?: 'home' | 'page';
};

export function ServicesSection({ services, layout = 'home' }: Props) {
  return (
    <section
      id="services"
      className={cn(
        'relative overflow-hidden',
        layout === 'page'
          ? 'flex flex-1 flex-col justify-center py-8 md:py-12'
          : 'game-section-bg snap-screen snap-screen-center section-padding',
      )}
    >
      <TechGameDecor variant="services" />

      <div className="relative z-[1] w-full">
        <SectionHeading
          title="My Services"
          variant="light"
          navSafe={layout === 'home'}
          className="mb-10 md:mb-12"
        />

        <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-12">
          {services.map((service, index) => (
            <article key={service.id} className="game-service-card relative">
              <span className="game-service-index" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              <ServiceIcon name={service.icon ?? 'backend'} className="mb-5" />
              <h3 className="mb-3 font-[family-name:var(--font-display)] text-xl text-white md:text-[1.35rem]">
                {service.title}
              </h3>
              <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed text-[var(--color-muted-light)] md:text-[0.95rem]">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
