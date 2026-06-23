import { ThemeVariables } from '@/components/layout/ThemeVariables';
import { themeStyleFromSettings } from '@/lib/theme';
import type { GlobalSetting } from '@/payload-types';
import type { CSSProperties, ReactNode } from 'react';

type Props = {
  settings: GlobalSetting;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function ThemeShell({ settings, children, className, style }: Props) {
  const themeStyle = themeStyleFromSettings(settings);

  return (
    <>
      <ThemeVariables variables={themeStyle} />
      <div className={className} style={{ ...themeStyle, ...style }}>
        {children}
      </div>
    </>
  );
}
