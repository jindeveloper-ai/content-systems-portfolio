import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { attentionStudy } from '../data/case-study.ts';

const read = (file) =>
  readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const home = read('components/home-sections.tsx');
const detail = read('app/work/content-automation/page.tsx');
const section = read('components/attention-study.tsx');
const text = section.replace(/\s+/g, ' ');

test('home, detail navigation and section share the research anchor', () => {
  assert.equal(attentionStudy.id, 'attention-study');
  assert.ok(home.includes("'/work/content-automation#' + attentionStudy.id"));
  assert.ok(home.indexOf('research-teaser') < home.indexOf('id="approach"'));
  assert.ok(detail.includes('href="#attention-study"'));
  assert.ok(section.includes('id={attentionStudy.id}'));
  assert.ok(section.includes('aria-labelledby="attention-title"'));
  assert.ok(
    detail.indexOf('id="validation"') < detail.indexOf('<AttentionStudy />'),
  );
  assert.ok(
    detail.indexOf('<AttentionStudy />') < detail.indexOf('id="outcomes"'),
  );
});

test('research cites only the reviewed primary papers and includes scope limits', () => {
  assert.deepEqual(
    attentionStudy.sources.map((source) => source.href),
    [
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC10480866/',
      'https://arxiv.org/abs/2105.12441',
      'https://arxiv.org/abs/2003.05477',
    ],
  );
  for (const source of attentionStudy.sources) {
    assert.ok(source.title && source.label && source.scope && source.decision);
  }
  assert.match(attentionStudy.sources[0].scope, /60명/);
  assert.match(
    attentionStudy.sources[0].decision,
    /릴스 선호.*적용하지 않았습니다/,
  );
  assert.ok(text.includes('저의 해석입니다'));
});

test('personal research topics become explicit hypotheses, not automatic liking scores', () => {
  assert.equal(attentionStudy.researchNotes.length, 4);
  assert.deepEqual(
    attentionStudy.researchNotes.map((note) => note.href),
    [
      'https://doi.org/10.1037/a0034726',
      'https://journals.sagepub.com/doi/abs/10.1177/0265407508096700',
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC5436296/',
      'https://pubmed.ncbi.nlm.nih.gov/29733622/',
    ],
  );
  for (const note of attentionStudy.researchNotes) {
    assert.ok(note.topic && note.studied && note.question && note.sourceLabel);
  }
  for (const disclosure of [
    '개인 연구 노트로 정리했습니다',
    '사용자 반응으로 검증하지 않은 제작 가설',
    '자동 채점하지 않습니다',
  ])
    assert.ok(text.includes(disclosure), disclosure);
});

test('learning maps five production questions to implementation choices and concepts', () => {
  assert.equal(attentionStudy.learning.length, 5);
  assert.equal(
    new Set(attentionStudy.learning.map((item) => item.question)).size,
    5,
  );
  for (const item of attentionStudy.learning) {
    assert.ok(item.question && item.decision && item.concept);
  }
  assert.ok(section.includes('<TableCaption>'));
  assert.ok(section.includes('scope="row"'));
  for (const disclosure of [
    '실제 체류 시간이 아닙니다',
    '내부 기준',
    '논문에서 가져온 공식이 아닙니다',
  ]) {
    assert.ok(text.includes(disclosure), disclosure);
  }
});

test('executed analysis is separate from temporal experiments and unmeasured user outcomes', () => {
  const [deepgaze, unisal] = attentionStudy.executions;
  assert.equal(attentionStudy.executions.length, 2);
  assert.match(deepgaze.conditions, /3 FPS.*512.*66프레임.*보조 분석 끔/);
  assert.match(deepgaze.summary, /22\.13초/);
  assert.match(unisal.conditions, /6 FPS.*384×224.*FP32/);
  assert.match(unisal.summary, /총 18회/);
  assert.match(unisal.status, /보류/);
  assert.match(unisal.limit, /독립적인 세 영상이 아닙니다/);
  assert.match(unisal.limit, /사용자 선호의 A\/B 실험이 아닙니다/);
  for (const disclosure of [
    '사람의 눈을 측정한 결과가 아니며',
    '완결 자료는 아직 확보하지 못했습니다',
    '성과로 주장하지 않습니다',
    '모델을 새로 학습한 경험이 아니라',
  ])
    assert.ok(text.includes(disclosure), disclosure);
});

test('the research copy supports language selection without a private app connection or unapproved media', () => {
  assert.doesNotMatch(
    section + home + JSON.stringify(attentionStudy),
    /app\.notion\.com|jindeveloper|127\.0\.0\.1|localhost|tailscale|\/home\/|\/Users\/|clova/i,
  );
  assert.doesNotMatch(
    section,
    /fetch\(|XMLHttpRequest|WebSocket|<video|<img|<iframe|<input|dangerouslySetInnerHTML/,
  );
  assert.ok(section.includes('const { t } = useI18n()'));
  assert.ok(
    text.includes('원본 분석 화면·로그·코드는 이 사이트에 공개하지 않습니다'),
  );
});
