import type { Metadata } from 'next';
import { Libre_Franklin, Open_Sans } from 'next/font/google';
import { LivePreviewMode } from '@/components/cms/LivePreviewMode';
import './globals.css';

export const dynamic = 'force-dynamic';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

const libreFranklin = Libre_Franklin({
  subsets: ['latin'],
  weight: ['500', '600', '700', '900'],
  variable: '--font-franklin',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EDZERO — Company Profile',
  description: 'EDZero company profile starter — portfolio, services, and CMS-powered content.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} ${libreFranklin.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var q=location.search;if(window.self!==window.top||q.indexOf('live-preview')!==-1)document.documentElement.classList.add('live-preview')}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <LivePreviewMode />
        {children}
      </body>
    </html>
  );
}
