import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '콘텐츠 제작 자동화 | Content Systems',
};

export default function CaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
