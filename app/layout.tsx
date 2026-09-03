import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Content Systems | AI 콘텐츠 자동화 포트폴리오',
  description:
    '콘텐츠 제작의 반복 과정을 구조화하고, 품질 기준과 승인 절차를 갖춘 AI 자동화를 설계합니다. 기획·설계·검수 주도, AI 협업 구현.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
