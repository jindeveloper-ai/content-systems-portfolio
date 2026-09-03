import Link from '@/components/site-link';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  ArrowDown,
  ArrowUpRight,
  Check,
  FileText,
} from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-shell';
import { QualityDetails } from '@/components/evidence-details';
import { AttentionStudy } from '@/components/attention-study';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import { caseStudy, workflow, evaluationCases } from '@/data/case-study';

export const metadata: Metadata = {
  title: '콘텐츠 제작 자동화 | Content Systems',
};

export default function ContentAutomation() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="container case-page">
        <Link className="back-link" href="/#work">
          <ArrowLeft size={16} aria-hidden="true" /> 프로젝트 목록
        </Link>
        <header className="case-hero">
          <span className="eyebrow">CASE STUDY 01 / CONTENT AUTOMATION</span>
          <h1>
            반복되는 콘텐츠 제작을
            <br />
            <em>검증 가능한 시스템으로.</em>
          </h1>
          <p className="case-lead">{caseStudy.summary}</p>
          <div className="case-meta">
            <div>
              <span>ROLE</span>
              <strong>{caseStudy.role}</strong>
            </div>
            <div>
              <span>SCOPE</span>
              <strong>시나리오 · 제작 구조 · 평가 · 반복 자동화</strong>
            </div>
            <div>
              <span>DISCLOSURE</span>
              <strong>익명화한 사례 · 공개용 자료 재구성</strong>
            </div>
          </div>
        </header>
        <div className="case-reading-layout">
          <aside className="case-toc">
            <span className="mini-label">IN THIS CASE</span>
            <nav aria-label="사례 목차">
              <a href="#problem">01 문제와 역할</a>
              <a href="#workflow">02 제작 체계</a>
              <a href="#quality">03 품질 평가</a>
              <a href="#validation">04 자동화 검증</a>
              <a href="#attention-study">05 연구와 분석 도구</a>
              <a href="#outcomes">06 성과와 한계</a>
            </nav>
            <a
              href="/evidence/verification.json"
              className="artifact-link"
              download
            >
              <FileText size={14} aria-hidden="true" /> 검증 기록 JSON{' '}
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </aside>
          <div className="case-body">
            <section id="problem" className="case-section">
              <div className="section-kicker">01 / PROBLEM & ROLE</div>
              <h2>
                반복 작업의 병목은
                <br />
                생성 버튼 바깥에도 있었습니다.
              </h2>
              <p>
                아이디어 조사, 인물 설정, 장면 계획, 생성, 검수, 수정이 서로
                연결되지 않으면 같은 설명을 반복하고, 어떤 파일을 승인했는지
                다시 확인해야 합니다. 이 제작 맥락을 다음 단계로 전달하는 구조를
                설계했습니다.
              </p>
              <div className="contrast-grid">
                <article>
                  <span className="mini-label">해결하려는 문제</span>
                  <h3>
                    설명은 반복되고,
                    <br />
                    판단의 근거는 흩어집니다.
                  </h3>
                  <p>
                    요구사항 누락, 검수 기록과 파일의 불일치, 성공한 작업까지
                    다시 처리하는 비효율.
                  </p>
                </article>
                <article>
                  <span className="mini-label">설계한 방향</span>
                  <h3>
                    입력과 완료 조건을 정하고,
                    <br />
                    판단을 기록으로 연결합니다.
                  </h3>
                  <p>
                    단계별 입력·결과물·검수 조건을 명시하고, 사람의 승인과 현재
                    파일을 연결.
                  </p>
                </article>
              </div>
              <div className="role-block">
                <h3>제가 맡은 일과 AI가 맡은 일</h3>
                <dl>
                  <div>
                    <dt>본인</dt>
                    <dd>
                      문제·요구사항 정의, 제작 시나리오와 평가 기준 설계, 결과물
                      검수, 승인 및 개선 방향 판단.
                    </dd>
                  </div>
                  <div>
                    <dt>AI 협업</dt>
                    <dd>
                      설계에 따른 코드 작성·수정, 조사 정리, 자동 검증 및 반복
                      실행 보조.
                    </dd>
                  </div>
                </dl>
                <p className="fine-print">
                  코드를 전부 직접 작성했거나, 제작·게시를 완전 무인으로
                  운영했다는 의미는 아닙니다.
                </p>
              </div>
            </section>
            <section id="workflow" className="case-section">
              <div className="section-kicker">
                02 / WORKFLOW <span className="evidence-status">구현 확인</span>
              </div>
              <h2>
                10개의 단계를,
                <br />
                다섯 개의 제작 흐름으로.
              </h2>
              <p>
                Skill은 반복 작업의 지침과 도구를 묶은 단위, Agent는 그 지침과
                도구를 활용해 작업하는 AI입니다. 이 사례에서는 정해진 제작 절차
                안에서 AI를 활용하고, 중요한 결정은 사람이 맡습니다.
              </p>
              <ol className="workflow-list">
                {workflow.map((step) => (
                  <li key={step.number}>
                    <span className="workflow-index">{step.number}</span>
                    <div>
                      <span className="mini-label">{step.stages}</span>
                      <h3>{step.title}</h3>
                      <dl>
                        <div>
                          <dt>사람</dt>
                          <dd>{step.human}</dd>
                        </div>
                        <div>
                          <dt>AI</dt>
                          <dd>{step.ai}</dd>
                        </div>
                        <div>
                          <dt>결과물</dt>
                          <dd>{step.output}</dd>
                        </div>
                      </dl>
                      <div className="approval-note">
                        <Check size={15} aria-hidden="true" />
                        {step.approval}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="brief">
                <span className="eyebrow">
                  SANITIZED BRIEF / 공개용 재구성 예시
                </span>
                <h3>한 장면 안에서, 대화할 이유를 만드는 짧은 영상</h3>
                <dl>
                  <div>
                    <dt>대상·목적</dt>
                    <dd>
                      처음 만나는 시청자가 상황을 이해하고 반응할 수 있는 인물
                      중심 콘텐츠.
                    </dd>
                  </div>
                  <div>
                    <dt>제작 조건</dt>
                    <dd>
                      인물·공간의 일관성, 간결한 행동과 대사, 기획한 길이,
                      화면과 맞는 환경음.
                    </dd>
                  </div>
                  <div>
                    <dt>완료 조건</dt>
                    <dd>
                      형식 검증 + 13개 항목 각각 4점 이상 + 중대 오류 없음 +
                      현재 파일 확인.
                    </dd>
                  </div>
                  <div>
                    <dt>멈추는 조건</dt>
                    <dd>
                      승인 누락, 파일·근거 불일치, 권리나 표현 범위가 불명확한
                      경우.
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
            <section id="quality" className="case-section">
              <div className="section-kicker">
                03 / QUALITY DESIGN{' '}
                <span className="evidence-status">구현 확인</span>
              </div>
              <h2>
                평균이 좋아도,
                <br />한 항목이 미달하면 다시 봅니다.
              </h2>
              <p>
                한 번의 ‘좋다’는 판단 대신, 장면의 자연스러움부터 시청자와의
                관계까지 13개 항목으로 나눕니다. 중대한 오류는 점수와 별개로
                탈락시키고, 수정 이유를 장면과 연결해 기록합니다.
              </p>
              <div className="quality-rule">
                <strong>
                  13 <span>개 항목</span>
                </strong>
                <span className="rule-times">×</span>
                <strong>
                  4 <span>점 이상 / 각 항목</span>
                </strong>
                <div>평균으로 미달 항목을 상쇄하지 않음</div>
              </div>
              <p className="score-scale">
                1–2점: 실패 · 3점: 재검토 · 4점: 사소한 보완 수준 · 5점: 게시
                가능한 완성도
              </p>
              <QualityDetails />
              <p className="callout">
                클릭·시청 지속·대화 참여의 ‘가능성’은 콘텐츠 검수용 대리
                지표입니다. 실제 CTR, 시청 유지율, 전환율을 측정한 값이
                아닙니다.
              </p>
              <div className="failure-example">
                <span className="eyebrow">
                  FAILURE → REVISION / 합성 재현 사례
                </span>
                <h3>“수정한 영상에, 이전 검수 기록을 붙이면?”</h3>
                <div className="failure-steps">
                  <div>
                    <span>발생 조건</span>
                    <p>검수 통과 후 파일 내용이 변경됨.</p>
                  </div>
                  <ArrowDown size={16} aria-hidden="true" />
                  <div>
                    <span>판단</span>
                    <p>파일 식별값이 달라 이전 승인은 무효. 전달을 차단.</p>
                  </div>
                  <ArrowDown size={16} aria-hidden="true" />
                  <div>
                    <span>수정 · 재검증</span>
                    <p>
                      현재 파일에 필요한 검수 기록을 다시 만들고, 모두 충족하면
                      최종 게이트를 확인.
                    </p>
                  </div>
                </div>
                <p className="fine-print">
                  원본 코드의 테스트에서 ‘검수 기록 누락 → 차단’, ‘기록 충족 →
                  통과’, ‘파일 변경 → 재차단’을 확인했습니다. 실제 영상의 개선
                  성과를 재현한 사례는 아닙니다.
                </p>
              </div>
            </section>
            <section id="validation" className="case-section">
              <div className="section-kicker">
                04 / AUTOMATION & EVALUATION{' '}
                <span className="evidence-status">합성 테스트</span>
              </div>
              <h2>
                잘되는 경우뿐 아니라,
                <br />
                멈춰야 할 경우도 테스트합니다.
              </h2>
              <p>
                2026년 9월 3일, 생성 API를 호출하지 않는 기존 비운영 테스트를
                실행했습니다. 정해진 오류 입력을 통해 승인·근거·재시도 규칙이
                작동하는지 확인하는 검사입니다.
              </p>
              <div className="test-summary">
                <div>
                  <strong>26 / 26</strong>
                  <span>기존 비운영 테스트 통과</span>
                </div>
                <div>
                  <strong>10 × 3</strong>
                  <span>고정 사례별 합성 입력 3회</span>
                </div>
                <div>
                  <strong>30 / 30</strong>
                  <span>입력 기대값과 수집 결과 일치</span>
                </div>
              </div>
              <p className="fine-print">
                기대 상태를 넣은 합성 기록을 수집·비교한 결과입니다. 모델의 오류
                탐지 정확도나 실제 콘텐츠 품질을 입증하지 않습니다. 26개
                테스트와 30개 입력은 서로 다른 검증 단위입니다.
              </p>
              <div className="table-region" aria-label="10개 평가 시나리오 표">
                <Table>
                  <TableCaption>
                    각 사례 3회 · 예상 상태를 가진 합성 입력의 수집 계약 검증
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>평가 시나리오</TableHead>
                      <TableHead>기대 상태</TableHead>
                      <TableHead>수집 일치</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluationCases.map(([name, status]) => (
                      <TableRow key={name}>
                        <TableCell>{name}</TableCell>
                        <TableCell>
                          <span
                            className={
                              status === 'PASS' ? 'result-pass' : 'result-fail'
                            }
                          >
                            {status}
                          </span>
                        </TableCell>
                        <TableCell>3 / 3</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <h3 className="subheading">
                다시 실행할 때, 성공한 작업은 보존합니다.
              </h3>
              <div className="retry-example">
                <div>
                  <span>항목 A</span>
                  <strong>PASS</strong>
                  <p>현재 파일과 유효한 근거가 같으면 보존</p>
                </div>
                <div>
                  <span>항목 B</span>
                  <strong>FAIL / REVIEW</strong>
                  <p>실패한 단계·항목을 선택해 다시 처리</p>
                </div>
              </div>
              <p className="fine-print">
                다른 단계에 의존해 막힌 BLOCKED 항목을 무조건 재실행하지
                않습니다. 원인을 해결하고 현재 결과물에 맞는 근거를 다시
                확인합니다.
              </p>
              <div className="benchmark-box">
                <span className="eyebrow">
                  SYNTHETIC BENCHMARK / 운영 성과 아님
                </span>
                <h3>실행 구조 비교: 순차 처리와 항목별 이어 처리</h3>
                <div className="timing-row">
                  <span>순차 처리</span>
                  <div className="timing-track">
                    <span style={{ width: '100%' }} />
                  </div>
                  <strong>2.037초</strong>
                </div>
                <div className="timing-row">
                  <span>항목별 처리</span>
                  <div className="timing-track">
                    <span style={{ width: '29.5%' }} />
                  </div>
                  <strong>0.601초</strong>
                </div>
                <p>
                  조건: 4개 항목 × 12개 내부 실행 단계, 단계당 0.02초 대기 명령,
                  작업자 4개·검수 작업자 2개, 무거운 검수 동시 실행 1개. 같은
                  로컬 환경에서 1회 비교했습니다.
                </p>
                <p className="fine-print">
                  여기서 12개는 내부 실행 단계이며, 앞의 10개는 전체 제작
                  절차입니다. 프로세스 실행·대기만 비교했으므로 생성 속도·실제
                  작업 시간 절감률로 일반화할 수 없습니다.
                </p>
              </div>
              <div className="artifact-box">
                <FileText size={22} aria-hidden="true" />
                <div>
                  <h3>검증 기록과 공개용 규칙 예시</h3>
                  <p>
                    원본 코드·내부 경로 없이 조건, 결과, 한계를 확인할 수
                    있습니다.
                  </p>
                  <div className="artifact-links">
                    <a href="/evidence/verification.json" download>
                      검증 기록 JSON{' '}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                    <a href="/evidence/contract-demo.mjs" download>
                      규칙 재현 예시 내려받기{' '}
                      <ArrowDown size={14} aria-hidden="true" />
                    </a>
                  </div>
                  <p className="fine-print">
                    예시는 포트폴리오 설명을 위해 AI와 새로 작성한 독립
                    코드입니다. 원본 실행 시스템을 공개한 것이 아닙니다. Node.js
                    22 이상에서 <code>node contract-demo.mjs</code>로
                    실행합니다.
                  </p>
                </div>
              </div>
            </section>
            <AttentionStudy />
            <section id="outcomes" className="case-section">
              <div className="section-kicker">06 / OUTCOMES & LIMITS</div>
              <h2>
                확인한 것과,
                <br />
                앞으로 측정할 것을 구분합니다.
              </h2>
              <div className="outcome-list">
                <article>
                  <span className="evidence-status">구현 확인</span>
                  <h3>제작 절차·품질 기준·승인 경계</h3>
                  <p>
                    워크플로 지침과 검증 코드에서 단계 구조, 평가 항목, 실패
                    범위 선택, 현재 파일에 연결된 승인 검사를 확인했습니다.
                  </p>
                </article>
                <article>
                  <span className="evidence-status">합성 테스트</span>
                  <h3>규칙의 동작과 실행 구조</h3>
                  <p>
                    26개 비운영 테스트, 30개 입력 수집, 대기 명령 기반 실행
                    비교. 모델이 실제 콘텐츠를 얼마나 잘 평가하는지는 별도
                    검증이 필요합니다.
                  </p>
                </article>
                <article>
                  <span className="evidence-status neutral">실측</span>
                  <h3>실제 운영 생산성은 아직 확정하지 않았습니다.</h3>
                  <p>
                    충분한 실제 승인 표본에 근거한 소요 시간·비용 절감률,
                    CTR·시청 유지율·전환율은 제시하지 않습니다. 과거 통과
                    기록이나 목표 시간을 달성 실적으로 바꾸지 않았습니다.
                  </p>
                </article>
                <article>
                  <span className="evidence-status neutral">제안</span>
                  <h3>다음 단계: 품질을 유지하는 생산성 비교</h3>
                  <p>
                    같은 과업·모델·승인 조건에서 버전별 실제 승인 표본을 20개
                    이상 모아 시간의 중앙값과 p95를 비교합니다. p95는 측정값의
                    95%가 그 이하인 시간입니다. 품질, 비용, 수동 개입 시간도
                    따로 기록합니다.
                  </p>
                </article>
              </div>
              <h3 className="subheading">기술 조사에서 적용 판단까지</h3>
              <p>
                새로운 도구를 추가하기 전에 제작 업무에서 필요한 부분과 검증
                비용을 비교합니다. 아래는 공개 기술 자료를 이 사례에 연결한 판단
                메모입니다.
              </p>
              <div className="trend-list">
                <article>
                  <span className="mini-label">
                    WORKFLOW VS. AUTONOMOUS AGENT
                  </span>
                  <h4>고정된 제작 절차에는 예측 가능한 흐름</h4>
                  <p>
                    정해진 절차와 자율 판단을 구분합니다. 이 사례에는 단계별
                    완료 조건·사람의 승인을 유지하고, 무제한 자율 실행은
                    적용하지 않았습니다.
                  </p>
                  <a href="https://www.anthropic.com/engineering/building-effective-agents">
                    Anthropic · Building effective agents{' '}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </article>
                <article>
                  <span className="mini-label">REUSABLE SKILLS</span>
                  <h4>지침과 도구를 반복 가능한 단위로</h4>
                  <p>
                    작업별 지침·검수 조건·스크립트를 묶어 다시 활용합니다.
                    Skill을 추가할 때는 사용 조건과 실패 시 멈출 지점도 함께
                    정합니다.
                  </p>
                  <a href="https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills">
                    Anthropic · Agent Skills{' '}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </article>
              </div>
              <div className="closing-note">
                <p>
                  자동화의 완성도는
                  <br />
                  <strong>
                    사람이 무엇을 판단해야 하는지
                    <br />
                    명확하게 만드는 데서 시작합니다.
                  </strong>
                </p>
                <span>이 사례에서 배운 가장 중요한 기준입니다.</span>
              </div>
              <p className="fine-print">
                본 페이지는 개인 포트폴리오이며 특정 기업의 공식 페이지가
                아닙니다. 프로젝트 식별 정보와 원본 미디어·코드는 공개하지
                않았고, 설명 자료는 익명화하여 재구성했습니다.
              </p>
            </section>
          </div>
        </div>
        <Link href="/#work" className="text-link end-link">
          <ArrowLeft size={16} aria-hidden="true" /> 프로젝트 목록으로
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
