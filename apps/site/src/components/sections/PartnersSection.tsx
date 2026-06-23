type Partner = {
  id: string;
  name: string;
  logoUrl?: string;
};

type Props = {
  partners: Partner[];
};

export function PartnersSection({ partners }: Props) {
  if (partners.length === 0) return null;

  return (
    <section className="game-section-bg section-padding pt-4 pb-16 md:pb-20">
      <div className="game-partners-strip mx-auto max-w-6xl px-8 py-10 md:px-12 md:py-12">
        <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-10 md:gap-x-20">
          {partners.map((partner) =>
            partner.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- partner logo
              <img
                key={partner.id}
                src={partner.logoUrl}
                alt={partner.name}
                className="h-7 object-contain brightness-0 invert opacity-90 md:h-9"
              />
            ) : (
              <span
                key={partner.id}
                className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-widest text-white"
              >
                {partner.name}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
