import type { Metadata } from 'next';
import { LanguageProvider } from '@/components/language-provider';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'SU JIN LEE | AI Content Automation Portfolio',
  description:
    'SU JIN LEE의 AI 콘텐츠 자동화 포트폴리오. 제작 시나리오와 승인 절차, 13개 품질 기준을 설계하고 AI와 협업해 구현한 사례를 소개합니다.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://su-jin-lee-portfolio.pages.dev/' },
  // Public proof of site ownership supplied by Google Search Console, not a credential.
  verification: { google: '6Cc2BE8s7ne3tfHnBJo4MjWj_O9USLiHHFqlvnHh0PI' },
  icons: { icon: { url: '/favicon.svg?v=sj-1', type: 'image/svg+xml' } },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
