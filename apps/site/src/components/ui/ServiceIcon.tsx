import {
  Cloud,
  Code,
  Code2,
  Database,
  Gauge,
  Globe,
  Image,
  LayoutGrid,
  Network,
  Palette,
  Plug,
  Server,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  className?: string;
};

/** Maps every `services.icon` select value from Payload CMS to a Lucide icon. */
const icons: Record<string, LucideIcon> = {
  backend: Code2,
  web: Globe,
  api: Plug,
  cloud: Cloud,
  database: Database,
  performance: Gauge,
  code: Code,
  smartphone: Smartphone,
  layout: LayoutGrid,
  image: Image,
  server: Server,
  system: Network,
  palette: Palette,
};

export function ServiceIcon({ name, className }: Props) {
  const Icon = icons[name] ?? Code2;

  return (
    <div
      className={cn(
        'game-service-icon relative inline-flex h-14 w-14 items-center justify-center border border-neutral-800 bg-neutral-950/80',
        className,
      )}
      aria-hidden
    >
      <Icon className="h-7 w-7 text-white" strokeWidth={1.5} />
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 bg-[var(--color-accent)] game-glow-accent" />
    </div>
  );
}
