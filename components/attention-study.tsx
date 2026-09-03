import { ArrowUpRight } from 'lucide-react';
import { attentionStudy } from '@/data/case-study';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';

export function AttentionStudy() {
  return (
    <section
      id={attentionStudy.id}
      className="case-section attention-study"
      aria-labelledby="attention-title"
    >
      <div className="section-kicker">
        05 / RESEARCH & ATTENTION
        <span className="evidence-status">개인용 분석 앱 · 실행 확인</span>
      </div>
      <h2 id="attention-title">
        만드는 과정뿐 아니라,
        <br />
        보는 경험도 검토했습니다.
      </h2>
      <p>
        콘텐츠를 빠르게 만드는 것에서 멈추지 않고, 무엇을 먼저 보게 할지
        질문하고 그 판단을 검토 가능한 지표로 바꿨습니다.
      </p>
      <p className="research-role">{attentionStudy.role}</p>
      <p className="callout">
        여기서 ‘AI 아이트래킹’은 모델이 예상한 주목도입니다. 사람의 눈을 측정한
        결과가 아니며, 높은 점수가 호감·이해도·시청 유지율을 뜻하지 않습니다.
      </p>

      <div className="research-part">
        <span className="mini-label">01 / 제작 질문</span>
        <h3>“보기 좋다”는 감각을, 수정 이유로 설명하려면?</h3>
        <p>
          핵심 장면이 충분히 눈에 띄는지, 여러 요소가 시선을 나눠 갖는지, 어느
          구간부터 다시 봐야 하는지 확인할 보조 도구가 필요했습니다. 사람의
          판단을 없애기보다 검수할 위치와 질문을 구체적으로 만들고자 했습니다.
        </p>
      </div>

      <div className="research-part">
        <span className="mini-label">02 / 연구에서 얻은 관점</span>
        <h3>주목과 호감을, 같은 문제로 다루지 않았습니다.</h3>
        <p>
          “사람을 매력적으로 느끼고 좋아하게 되는 이유”를 직접 조사하고, AI와의
          문답을 활용해 개인 연구 노트로 정리했습니다. 사회심리·지각 연구에서
          인물의 태도와 감각적 단서를 나눠 살펴보고, 연구 대상과 과제의 한계도
          함께 기록했습니다.
        </p>
        <p>
          아래는 노트의 조사 주제를 콘텐츠 검수 질문으로 바꾼 예시입니다. 질문은
          아직 사용자 반응으로 검증하지 않은 제작 가설이며, 논문 저자들의 릴스
          제작 권고가 아닌 저의 해석입니다. 개인 노트 자체를 일차 논문이나
          과학적 합의로 인용하지 않고 연결된 원문을 구분했습니다.
        </p>
        <div
          className="research-sources"
          aria-label="개인 조사에서 제작 질문으로"
        >
          {attentionStudy.researchNotes.map((note) => (
            <article key={note.topic}>
              <span className="mini-label">조사한 내용 → 제작 가설</span>
              <h4>{note.topic}</h4>
              <p>{note.studied}</p>
              <p>
                <strong>검수할 질문</strong> {note.question}
              </p>
              <p>
                <a href={note.href}>
                  {note.sourceLabel}{' '}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </p>
            </article>
          ))}
        </div>
        <p className="callout">
          사람의 태도·목소리·관계 맥락은 사람이 검토할 영역으로 남겼습니다.
          주목도 앱은 화면의 예측 분포를 다룰 뿐, 따뜻함·신뢰·목소리의 매력을
          자동 채점하지 않습니다. 도메인 지식으로 평가할 대상을 정하고, CS
          지식으로 계산할 수 있는 범위를 구분한 이유입니다.
        </p>
        <h4 className="subheading">시각적 주목 분석에 참고한 연구</h4>
        <div className="research-sources">
          {attentionStudy.sources.map((source) => (
            <article key={source.href}>
              <span className="mini-label">{source.label}</span>
              <h4>
                <a href={source.href}>
                  {source.title} <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </h4>
              <p>{source.scope}</p>
              <p>
                <strong>적용 판단</strong> {source.decision}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="research-part">
        <span className="mini-label">03 / 도메인 지식 → 계산 가능한 설계</span>
        <h3>제작자의 질문을 지표와 동작으로 바꿨습니다.</h3>
        <p>
          콘텐츠의 전달 의도와 시각적 주의를 구분하는 도메인 지식, 그리고 이를
          구현하는 컴퓨터 과학(CS) 개념을 실제 선택에 연결했습니다.
        </p>
        <div className="research-table">
          <Table>
            <TableCaption>
              제작 질문 · 구현 선택 · 그 과정에서 학습한 개념
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">제작자의 질문</TableHead>
                <TableHead scope="col">도구의 동작과 배운 개념</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attentionStudy.learning.map((item) => (
                <TableRow key={item.question}>
                  <TableHead scope="row">{item.question}</TableHead>
                  <TableCell>
                    {item.decision}
                    <span className="research-concept">{item.concept}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="research-definition">
          <strong>관심 영역(AOI)</strong>은 확인하고 싶은 화면 영역입니다. 영역
          주목 비율은 예측 분포 중 그 영역이 차지하는 몫이며 실제 체류 시간이
          아닙니다. 면적 대비 비율(lift)은 그 몫을 영역의 면적 비율로 나눠, 큰
          영역이 값을 더 많이 받는 효과를 구분하는 보조 지표입니다. 앱의
          가중치와 등급은 사용자 반응으로 검증되지 않은 내부 기준이며, 위 심리학
          논문에서 가져온 공식이 아닙니다.
        </p>
      </div>

      <div className="research-part">
        <span className="mini-label">04 / 실제 실행</span>
        <h3>완성 영상 분석과 시간 정보 실험을 나눴습니다.</h3>
        <p>
          영상 선택 → 표본 프레임 추출 → 모델 예측 → 히트맵·비교 영상·구간 기록
          → 사람의 검수로 연결했습니다. 설치·모델 연산·결과 저장은 Ubuntu 안에서
          수행하고, Chrome에서는 비공개 화면을 확인했습니다.
        </p>
        <div className="research-executions">
          {attentionStudy.executions.map((execution) => (
            <article key={execution.title}>
              <span className="evidence-status neutral">
                {execution.status}
              </span>
              <h4>{execution.title}</h4>
              <p>{execution.summary}</p>
              <dl>
                <div>
                  <dt>실행 조건</dt>
                  <dd>{execution.conditions}</dd>
                </div>
              </dl>
              <p className="research-limit">
                <strong>해석 범위</strong> {execution.limit}
              </p>
            </article>
          ))}
        </div>
        <p className="research-definition">
          위 내용은 2026년 9월 3일 확인한 비공개 실행 기록의 요약입니다. 원본
          분석 화면·로그·코드는 이 사이트에 공개하지 않습니다. 이 페이지에서
          영상을 업로드하거나 분석 모델을 실행할 수는 없습니다.
        </p>
      </div>

      <div className="research-part">
        <span className="mini-label">05 / 판단과 다음 검증</span>
        <h3>예측값을 얻은 것과, 사용자가 좋아한 것은 다릅니다.</h3>
        <p>
          분석 → 편집 수정 → 같은 조건의 재분석 → 실제 사용자 반응 비교로 이어진
          완결 자료는 아직 확보하지 못했습니다. 시청 유지율·CTR 개선이나
          사용자가 더 좋아하는 편집안 선정을 성과로 주장하지 않습니다.
        </p>
        <p>
          다음에는 한 구간에서 보여주려는 요소와 가설을 먼저 정하고, 자막
          위치처럼 한 요소만 바꿔 같은 설정으로 비교하려 합니다. 점수가 높아져도
          의미 전달이 나빠지면 채택하지 않고, 실제 선호는 별도 시청자 평가로
          확인해야 합니다.
        </p>
        <div className="research-takeaway">
          <h4>이 과정에서 익힌 것</h4>
          <p>
            콘텐츠의 전달 의도를 관찰 가능한 질문으로 바꾸고, 지표의 정의와
            한계를 설명하는 방법을 학습했습니다. 구현에서는 영상의
            시간·좌표·해상도를 다루고, 모델 출력 형식을 통일하며, 작업별 상태와
            실패 처리를 분리하는 구조를 AI와 함께 구성했습니다.
          </p>
          <p>
            모델을 새로 학습한 경험이 아니라,{' '}
            <strong>
              연구와 오픈소스 모델을 제작 검수에 적용하고 검증 조건을 설계한
              경험
            </strong>
            입니다.
          </p>
        </div>
      </div>
    </section>
  );
}
