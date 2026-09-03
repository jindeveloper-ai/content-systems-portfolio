import Link from '@/components/site-link';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-shell';
import { HomeSections } from '@/components/home-sections';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="container">
        <section className="hero" aria-labelledby="intro-title">
          <div className="hero-topline">
            <span className="eyebrow">
              <span className="status-dot" /> CONTENT × AI × SYSTEMS
            </span>
            <span className="edition">PORTFOLIO / 2026</span>
          </div>
          <div className="hero-grid">
            <h1 id="intro-title">
              콘텐츠를 만들고,
              <br />
              만드는 방식을
              <br />
              <em>설계합니다.</em>
            </h1>
            <div className="hero-note">
              <span className="mini-label">
                A CREATOR WHO THINKS IN SYSTEMS
              </span>
              <p>
                콘텐츠 제작의 반복 과정을 구조화하고,
                <br className="desktop-break" /> 품질 기준과 승인 절차를 갖춘
                <br className="desktop-break" /> AI 자동화를 설계합니다.
              </p>
              <a className="text-link" href="#work">
                대표 프로젝트 살펴보기{' '}
                <ArrowRight size={19} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="hero-bottom">
            <p>
              영상디자인의 시선으로 기획하고,
              <br className="mobile-break" /> AI와 협업해 검증 가능한 제작
              체계를 만듭니다.
            </p>
            <span>기획 · 설계 · 검수 주도 / AI 협업 구현</span>
          </div>
        </section>
        <section
          id="work"
          className="work-section"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <h2 id="work-title">
              Selected work<span>01</span>
            </h2>
            <span className="muted small">
              결과물 너머, 제작 과정을 설계한 기록
            </span>
          </div>
          <Link className="featured-case" href="/work/content-automation">
            <div className="case-intro">
              <span className="eyebrow">01 / CONTENT AUTOMATION</span>
              <h3>
                반복되는 콘텐츠 제작을
                <br />
                검증 가능한 시스템으로.
              </h3>
              <p>
                아이디어 발굴부터 전달까지.
                <br />
                사람의 판단과 AI의 실행을 연결한
                <br />
                콘텐츠 제작 자동화 사례입니다.
              </p>
              <div className="tags">
                <span>워크플로 설계</span>
                <span>품질 평가</span>
                <span>Skill · Agent</span>
              </div>
              <span className="case-link">
                사례 자세히 보기 <ArrowUpRight size={22} aria-hidden="true" />
              </span>
            </div>
            <div
              className="workflow-preview"
              aria-label="기획, 승인, 제작, 검수, 전달의 흐름"
            >
              <div className="diagram-header">
                <span>CONTENT PRODUCTION FLOW</span>
                <span className="diagram-live">HUMAN + AI</span>
              </div>
              <div className="flow-row">
                <span className="flow-number">01</span>
                <strong>기획</strong>
                <span>조사 · 아이디어 · 제작 브리프</span>
                <Check size={16} aria-hidden="true" />
              </div>
              <div className="approval-line">
                <span />
                사람의 승인
                <span />
              </div>
              <div className="flow-row">
                <span className="flow-number">02</span>
                <strong>제작</strong>
                <span>계획 · 첫 화면 · 영상 · 후반 작업</span>
                <Check size={16} aria-hidden="true" />
              </div>
              <div className="flow-connector" aria-hidden="true">
                ↓
              </div>
              <div className="flow-row quality">
                <span className="flow-number">03</span>
                <strong>검수</strong>
                <span>13개 품질 항목 · 개별 4점 이상</span>
                <span className="mini-pill">QA</span>
              </div>
              <div className="retry-line">↳ 미달 항목만 수정 · 재검증</div>
              <div className="approval-line">
                <span />
                최종 확인 후 전달
                <span />
              </div>
              <p className="diagram-note">
                설명용으로 재구성한 흐름 · 실제 실행 화면 아님
              </p>
            </div>
          </Link>
          <div className="evidence-strip">
            <div>
              <strong>
                10<span>단계</span>
              </strong>
              <p>제작 과정 구조화</p>
            </div>
            <div>
              <strong>
                13<span>항목</span>
              </strong>
              <p>품질 평가 기준</p>
            </div>
            <div>
              <strong>
                10<span>사례</span>
              </strong>
              <p>평가 시나리오 정의</p>
            </div>
            <div className="strip-note">
              많이 만드는 것보다,
              <br />
              <strong>다시 검증할 수 있게.</strong>
            </div>
          </div>
        </section>
        <HomeSections />
      </main>
      <SiteFooter />
    </>
  );
}
