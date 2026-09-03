'use client';

import { LanguageSwitcher, useI18n } from '@/components/language-provider';
import { ThemeSwitcher } from '@/components/theme-provider';

import Link from '@/components/site-link';
import { ArrowUpRight } from 'lucide-react';

export function SiteHeader() {
  const { t } = useI18n();
  return (
    <>
      <a className="skip-link" href="#main">
        {t('본문으로 바로가기')}
      </a>
      <header className="site-header container">
        <Link
          className="wordmark"
          href="/"
          aria-label={t('Content Systems 홈')}
        >
          <span className="wordmark-symbol" aria-hidden="true">
            c<span>↗</span>
          </span>
          <span>
            CONTENT
            <br />
            <strong>SYSTEMS</strong>
          </span>
        </Link>
        <div className="header-controls">
          <nav aria-label={t('주요 메뉴')}>
            <Link href="/#work">{t('프로젝트')}</Link>
            <Link href="/#approach">{t('작업 방식')}</Link>
            <Link href="/#about">
              {t('소개 ')}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </nav>
          <div className="preference-controls">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="site-footer container">
      <Link href="/" className="footer-mark">
        CONTENT / SYSTEMS
      </Link>
      <p>{t('기획에서 검증까지, 책임 있게.')}</p>
      <span>{t('© 2026 · 개인 포트폴리오')}</span>
    </footer>
  );
}
