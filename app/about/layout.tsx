import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개 · SU JIN LEE | Content Systems',
  description:
    'SU JIN LEE의 콘텐츠 자동화 경력, 영상 주목도 분석 연구, 기술 역량과 레쥬메. 기획·설계·검수 주도, AI 협업 구현.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
