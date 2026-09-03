import Link from '@/components/site-link';
import { ArrowUpRight } from 'lucide-react';

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 바로가기
      </a>
      <header className="site-header container">
        <Link className="wordmark" href="/" aria-label="Content Systems 홈">
          <span className="wordmark-symbol" aria-hidden="true">
            c<span>↗</span>
          </span>
          <span>
            CONTENT
            <br />
            <strong>SYSTEMS</strong>
          </span>
        </Link>
        <nav aria-label="주요 메뉴">
          <Link href="/#work">프로젝트</Link>
          <Link href="/#approach">작업 방식</Link>
          <Link href="/#about">
            소개 <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </nav>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer container">
      <Link href="/" className="footer-mark">
        CONTENT / SYSTEMS
      </Link>
      <p>기획에서 검증까지, 책임 있게.</p>
      <span>© 2026 · 개인 포트폴리오</span>
    </footer>
  );
}
