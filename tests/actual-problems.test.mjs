import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  actualProblems,
  actualProblemsIntro,
  actualProblemsNotice,
} from '../data/actual-problems.ts';
import { createTranslator } from '../lib/i18n.ts';

const read = (file) =>
  readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const fields = [
  'title',
  'problem',
  'decision',
  'change',
  'recordAndLimitation',
];

test('three historical incidents each carry a problem, decision, change and bounded result', () => {
  assert.deepEqual(
    actualProblems.map(({ id }) => id),
    ['layered-review', 'targeted-scenes', 'changed-outputs'],
  );
  for (const incident of actualProblems) {
    assert.deepEqual(Object.keys(incident), ['id', ...fields]);
    for (const field of fields) assert.ok(incident[field].trim().length > 0);
  }
});

test('the approved Korean and English public copy remains exact', () => {
  // Copy fingerprints lock the user-approved wording, not confidential sources.
  const approved = {
    ko: '530d06f81e72b541c8652f7ccc85ad2da0a8a475a22b2a2c8a41464f47f7ffe9',
    en: '08fc03478ea41670d11150c3b0c6078c5f0cf1337508cf749d861a3b9bef7021',
  };
  for (const locale of ['ko', 'en']) {
    const t = createTranslator(locale);
    const copy = [
      t('실제 문제와 개선'),
      t(actualProblemsIntro),
      ...actualProblems.flatMap((incident) =>
        fields.map((key) => t(incident[key])),
      ),
      t(actualProblemsNotice),
    ];
    assert.equal(
      createHash('sha256').update(JSON.stringify(copy)).digest('hex'),
      approved[locale],
      locale + ': changing approved copy requires a new content review',
    );
  }
});

test('attribution, AI review and historical limitations are visible in both languages', () => {
  const en = createTranslator('en');
  assert.match(
    actualProblemsIntro,
    /팀 동료.*AI와 협업.*합성 테스트.*Codex 검수는 AI 검수.*사람의 승인/,
  );
  assert.match(
    en(actualProblemsIntro),
    /teammate.*AI-assisted.*synthetic tests.*AI review; human approval/s,
  );
  assert.match(
    actualProblemsNotice,
    /비공개.*독립적으로 재검증한 것은 아닙니다/,
  );
  assert.match(
    en(actualProblemsNotice),
    /remain private.*not independently reverified/,
  );
  assert.match(
    actualProblems[2].recordAndLimitation,
    /단축 폭은 측정하지 않았습니다/,
  );
  assert.match(
    en(actualProblems[2].recordAndLimitation),
    /time savings were not measured/,
  );
  for (const [ko, translation] of [
    ['문제', 'Problem'],
    ['판단', 'Decision'],
    ['변경', 'Change'],
    ['기록과 한계', 'Record & limitation'],
  ])
    assert.equal(en(ko), translation);
});

test('the section and its TOC link sit between role and workflow without new media or services', () => {
  const page = read('app/work/content-automation/page.tsx');
  const component = read('components/actual-problems.tsx');
  assert.equal(page.split('<ActualProblems />').length - 1, 1);
  assert.ok(page.indexOf('id="problem"') < page.indexOf('<ActualProblems />'));
  assert.ok(page.indexOf('<ActualProblems />') < page.indexOf('id="workflow"'));
  assert.equal(page.split('href="#actual-problems"').length - 1, 1);
  assert.ok(
    page.indexOf('href="#problem"') < page.indexOf('href="#actual-problems"'),
  );
  assert.ok(
    page.indexOf('href="#actual-problems"') < page.indexOf('href="#workflow"'),
  );
  assert.equal(component.split('id="actual-problems"').length - 1, 1);
  assert.ok(component.includes('aria-labelledby="actual-problems-title"'));
  assert.ok(component.includes('id="actual-problems-title"'));
  assert.equal((component.match(/<dt>/g) || []).length, 4);
  for (const field of fields)
    assert.ok(component.includes(`t(example.${field})`));
  for (const copy of ['actualProblemsIntro', 'actualProblemsNotice'])
    assert.ok(component.includes(`t(${copy})`));
  assert.doesNotMatch(
    component,
    /<(?:img|video|audio|iframe|details)\b|fetch\(|dangerouslySetInnerHTML/,
  );
  assert.doesNotMatch(
    read('data/actual-problems.ts'),
    /https?:\/\/|\/(?:Users|home)\/|\.(?:mp4|png|webp)|15[–-]20|10 videos/,
  );
});
