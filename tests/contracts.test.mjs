import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  assessEvidence,
  selectRetryItems,
  runExamples,
} from '../public/evidence/contract-demo.mjs';

test('public examples run without provider calls', () => {
  const result = runExamples();
  assert.equal(result.results.length, 6);
  assert.ok(result.results.every((item) => item.expected === item.actual));
});
test('high average cannot compensate for a deficient criterion', () => {
  const status = assessEvidence({
    scores: [3, ...Array(12).fill(5)],
    currentFile: 'x',
    reviewedFile: 'x',
    approved: true,
    hardFailure: false,
  });
  assert.equal(status, 'REVIEW');
});
test('invalid and missing evaluation inputs fail closed', () => {
  const valid = {
    scores: Array(13).fill(4),
    currentFile: 'x',
    reviewedFile: 'x',
    approved: true,
    hardFailure: false,
  };
  for (const input of [
    { ...valid, scores: Array(13).fill(NaN) },
    { ...valid, currentFile: '' },
    { ...valid, hardFailure: undefined },
    { ...valid, approved: 'true' },
    { ...valid, scores: Array(13).fill(6) },
  ])
    assert.equal(assessEvidence(input), 'FAIL');
});
test('retry selection preserves PASS and does not retry BLOCKED blindly', () => {
  assert.deepEqual(
    selectRetryItems([
      { id: 'A', state: 'PASS' },
      { id: 'B', state: 'FAIL' },
      { id: 'C', state: 'BLOCKED' },
      { id: 'D', state: 'REVIEW' },
    ]),
    ['B', 'D'],
  );
  assert.throws(
    () => selectRetryItems([{ id: 'A', state: 'UNKNOWN' }]),
    TypeError,
  );
});
test('published evidence separates synthetic inputs and unmeasured production metrics', () => {
  const report = JSON.parse(
    readFileSync(
      new URL('../public/evidence/verification.json', import.meta.url),
      'utf8',
    ),
  );
  assert.equal(report.nonproduction_tests.total, 26);
  assert.equal(report.nonproduction_tests.passed, 26);
  assert.equal(report.fixed_case_collection.cases.length, 10);
  assert.equal(
    report.fixed_case_collection.repetitions_per_case *
      report.fixed_case_collection.case_count,
    report.fixed_case_collection.sample_count,
  );
  assert.equal(
    report.fixed_case_collection.cases.reduce(
      (sum, item) => sum + item.matches,
      0,
    ),
    30,
  );
  assert.equal(report.streaming_benchmark.type, 'synthetic_wait_commands');
  assert.equal(report.streaming_benchmark.trials, 1);
  for (const [key, value] of Object.entries(report.production_metrics))
    if (key !== 'status') assert.equal(value, null);
});
test('public copy and assets contain no private workspace identifiers', () => {
  for (const directory of ['app', 'components', 'data', 'lib', 'public']) {
    const root = new URL('../' + directory + '/', import.meta.url);
    for (const file of readdirSync(root, {
      recursive: true,
      withFileTypes: true,
    })) {
      if (!file.isFile() || !/\.(tsx?|css|json|mjs|txt|md)$/.test(file.name))
        continue;
      const text = readFileSync(file.parentPath + '/' + file.name, 'utf8');
      // The approved About page publishes the employer and personal GitHub URL.
      // Only these exact values at their designated locations are exempted.
      const relativeFile = join(file.parentPath, file.name).slice(
        new URL('../', import.meta.url).pathname.length,
      );
      const permitted = {
        'app/about/page.tsx': '<h3>Mel</h3>',
        'lib/resume.ts': 'https://github.com/jindeveloper-ai',
      };
      const reviewedText = Object.hasOwn(permitted, relativeFile)
        ? text.replace(permitted[relativeFile], '')
        : text;
      assert.doesNotMatch(
        reviewedText,
        /\/Users\/|OneDrive|CloudStorage|app\.notion\.com|reel-post-automation|jindeveloper|Gabby|\bMel\b|\bDante\b|\bmel[-_/]/i,
        file.name,
      );
    }
  }
});
test('all five case sections and homepage anchors exist', () => {
  const detail = readFileSync(
    new URL('../app/work/content-automation/page.tsx', import.meta.url),
    'utf8',
  );
  for (const id of ['problem', 'workflow', 'quality', 'validation', 'outcomes'])
    assert.ok(detail.includes('id="' + id + '"'));
  const home = readFileSync(
    new URL('../components/home-sections.tsx', import.meta.url),
    'utf8',
  );
  for (const id of ['approach', 'about'])
    assert.ok(home.includes('id="' + id + '"'));
  const data = readFileSync(
    new URL('../data/case-study.ts', import.meta.url),
    'utf8',
  );
  assert.equal((data.match(/\['[^']+', '/g) || []).length >= 13, true);
});
