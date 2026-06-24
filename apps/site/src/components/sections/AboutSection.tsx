import { MediaImage } from '@/components/ui/MediaImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TechGameDecor } from '@/components/ui/TechGameDecor';
import { cn } from '@/lib/utils';

function AccentText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={index} className="text-[var(--color-accent)]">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

type Props = {
  title: string;
  name?: string | null;
  text?: string | null;
  aboutImageUrl?: string;
  cvUrl?: string;
  skills?: string[];
  layout?: 'home' | 'page';
};

export function AboutSection({
  title,
  name,
  text,
  aboutImageUrl,
  cvUrl,
  skills = [],
  layout = 'home',
}: Props) {
  const paragraphs = (text ?? '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      id="about"
      className={cn(
        'relative overflow-hidden',
        layout === 'page'
          ? 'flex flex-1 flex-col justify-center py-8 md:py-12'
          : 'game-section-bg snap-screen snap-screen-center section-padding',
      )}
    >
      <TechGameDecor variant="about-ambient" />

      <div className="relative z-[1] w-full">
        <SectionHeading
          title={title}
          variant="light"
          navSafe={layout === 'home'}
          className="mb-8 md:mb-10"
        />

        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[0.92fr_1.08fr] md:gap-12 lg:gap-14">
          <div className="relative mx-auto flex w-full max-w-md justify-center md:mx-0 md:justify-end md:pr-6">
            <div className="relative z-[1] w-64 md:w-72 lg:w-80">
              <TechGameDecor variant="about-photo" />
              <MediaImage
                src={aboutImageUrl}
                alt=""
                className="game-photo-frame relative aspect-square w-full object-cover object-top grayscale"
              />
            </div>
          </div>

          <div className="game-about-panel relative max-w-xl px-6 py-7 md:pl-8 md:pr-8 md:py-8 lg:pl-10">
            {name && (
              <p className="mb-5 font-[family-name:var(--font-body)] text-base leading-relaxed text-white md:mb-6 md:text-lg">
                Hello! I&apos;m{' '}
                <span className="font-semibold text-[var(--color-accent)]">{name}.</span>
              </p>
            )}

            <div className="space-y-4 font-[family-name:var(--font-body)] text-sm leading-relaxed text-[var(--color-muted-light)] md:space-y-5 md:text-base">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>
                  <AccentText text={paragraph} />
                </p>
              ))}
            </div>

            {skills.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 md:mt-7">
                {skills.map((skill) => (
                  <span key={skill} className="game-tag">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {cvUrl && (
              <a href={cvUrl} target="_blank" rel="noreferrer" className="btn-pill game-btn mt-8 md:mt-9">
                Download My CV
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
