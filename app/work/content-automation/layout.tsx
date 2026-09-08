import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Content Automation Case Study | SU JIN LEE',
  description:
    '기획부터 전달까지 10단계 콘텐츠 제작 체계를 설계한 사례. 모델 선택, API 연결, 사람의 승인과 품질 검수, 비운영 테스트의 근거와 한계를 설명합니다.',
  alternates: {
    canonical:
      'https://su-jin-lee-portfolio.pages.dev/work/content-automation/',
  },
};

export default function CaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
