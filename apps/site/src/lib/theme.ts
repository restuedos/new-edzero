import type { CSSProperties } from 'react';
import type { GlobalSetting } from '@/payload-types';

export const THEME_DEFAULTS = {
  primary: '#e31837',
  secondary: '#ffffff',
  background: '#121212',
  backgroundDeep: '#000000',
  surface: '#1c1c1c',
  surfaceElevated: '#242424',
  text: '#ffffff',
  muted: '#a8a8a8',
  mutedLight: '#d4d4d4',
} as const;

type ThemeSettings = Pick<GlobalSetting, 'theme'> & {
  /** @deprecated use theme.primaryColor */
  accentColor?: string | null;
};

export function themeStyleFromSettings(settings: ThemeSettings): CSSProperties {
  const theme = settings.theme;

  return {
    '--color-accent': theme?.primaryColor ?? settings.accentColor ?? THEME_DEFAULTS.primary,
    '--color-secondary': theme?.secondaryColor ?? THEME_DEFAULTS.secondary,
    '--color-bg': theme?.backgroundColor ?? THEME_DEFAULTS.background,
    '--color-bg-deep': theme?.backgroundDeepColor ?? THEME_DEFAULTS.backgroundDeep,
    '--color-surface': theme?.surfaceColor ?? THEME_DEFAULTS.surface,
    '--color-surface-elevated': theme?.surfaceElevatedColor ?? THEME_DEFAULTS.surfaceElevated,
    '--color-text': theme?.textColor ?? THEME_DEFAULTS.text,
    '--color-muted': theme?.mutedColor ?? THEME_DEFAULTS.muted,
    '--color-muted-light': theme?.mutedLightColor ?? THEME_DEFAULTS.mutedLight,
  } as CSSProperties;
}

export function skillsFromSettings(settings: GlobalSetting): string[] {
  if (!settings.skills?.length) return [];
  return settings.skills.map((skill) => skill.label).filter(Boolean);
}
