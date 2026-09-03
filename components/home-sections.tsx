import Link from '@/components/site-link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { attentionStudy, caseStudy } from '@/data/case-study';

export function HomeSections() {
  return (
    <>
      <section
        className="home-section research-teaser"
        aria-labelledby="research-title"
      >
        <div>
          <span className="eyebrow">RESEARCH → MAKING → REVIEW</span>
          <h2 id="research-title">{attentionStudy.title}</h2>
          <p className="research-role">{attentionStudy.role}</p>
        </div>
        <div>
          <p className="research-summary">{attentionStudy.summary}</p>
          <p className="research-boundary">
            예측 주목도 ≠ 실제 시선 측정 ≠ 사용자 선호
          </p>
          <Link
            className="text-link"
            href={'/work/content-automation#' + attentionStudy.id}
          >
            연구에서 분석 도구로 <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section
        id="approach"
        className="home-section"
        aria-labelledby="approach-title"
      >
        <div className="section-heading">
          <h2 id="approach-title">
            How I work<span>02</span>
          </h2>
          <span className="small muted">
            기술보다 먼저, 제작의 문제를 정의합니다
          </span>
        </div>
        <div className="approach-grid">
          {[
            [
              '01',
              '기획을 실행 가능한 단위로.',
              '막연한 아이디어를 대상, 장면, 대사, 결과물 조건으로 나눕니다. AI가 할 일과 사람이 결정할 일을 구분합니다.',
            ],
            [
              '02',
              '좋다는 판단을 설명 가능한 기준으로.',
              '품질을 한 점수로 뭉치지 않습니다. 자연스러움, 일관성, 전달력을 나누고 미달 이유를 남깁니다.',
            ],
            [
              '03',
              '실패를 다음 실행의 입력으로.',
              '오류의 위치와 원인을 구분합니다. 성공한 작업은 보존하고, 실패한 부분만 고친 뒤 현재 결과물을 다시 확인합니다.',
            ],
          ].map(([number, title, text]) => (
            <article key={number}>
              <span className="mini-label">{number} / PRINCIPLE</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        className="home-section evidence-section"
        aria-labelledby="evidence-title"
      >
        <div className="section-heading">
          <h2 id="evidence-title">
            Evidence, not just claims<span>03</span>
          </h2>
          <span className="small muted">주장을 확인할 수 있는 근거</span>
        </div>
        <div className="evidence-grid">
          {caseStudy.evidence.map((item) => (
            <Link
              key={item.id}
              href={'/work/content-automation' + item.href}
              className="evidence-card"
            >
              <div className="evidence-card-top">
                <span className="mini-label">{item.id}</span>
                <span className="evidence-status">{item.status}</span>
              </div>
              <h3>
                {item.title}
                <ArrowUpRight size={18} aria-hidden="true" />
              </h3>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section
        id="about"
        className="about-section"
        aria-labelledby="about-title"
      >
        <div>
          <span className="eyebrow">ABOUT MY PRACTICE</span>
          <h2 id="about-title">
            콘텐츠의 감각과
            <br />
            시스템의 논리 사이.
          </h2>
        </div>
        <div className="about-copy">
          <p>
            콘텐츠의 기획과 표현을 고민합니다. 반복 작업에서는 요구사항을
            정리하고, AI와 함께 구현하며, 결과가 의도에 맞는지 끝까지 검수하는
            역할을 맡았습니다.
          </p>
          <p>
            관심 분야는 LLM 기반 콘텐츠 시나리오, 제작 품질 평가, Skill·Agent를
            활용한 업무 자동화입니다.
          </p>
          <dl>
            <div>
              <dt>역할</dt>
              <dd>{caseStudy.role}</dd>
            </div>
            <div>
              <dt>작업 원칙</dt>
              <dd>승인 경계 · 검토 가능한 근거 · 책임 있는 전달</dd>
            </div>
          </dl>
          <Link className="text-link" href="/work/content-automation">
            대표 사례에서 더 알아보기{' '}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
