// Independent, sanitized educational example, authored with AI for this portfolio.
// Not original project code. No model calls, network, private inputs or media analysis.
// Run with Node.js >= 22: node contract-demo.mjs
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

export function assessEvidence({
  scores,
  currentFile,
  reviewedFile,
  approved,
  hardFailure,
}) {
  if (
    !Array.isArray(scores) ||
    scores.length !== 13 ||
    scores.some((score) => !Number.isInteger(score) || score < 1 || score > 5)
  ) {
    return 'FAIL';
  }
  if (
    typeof currentFile !== 'string' ||
    !currentFile ||
    currentFile !== reviewedFile ||
    approved !== true ||
    hardFailure !== false
  ) {
    return 'FAIL';
  }
  if (scores.some((score) => score <= 2)) return 'FAIL';
  if (scores.some((score) => score < 4)) return 'REVIEW';
  return 'PASS';
}

export function selectRetryItems(items) {
  const validStates = new Set(['PASS', 'FAIL', 'REVIEW', 'BLOCKED']);
  if (
    !Array.isArray(items) ||
    items.some(
      (item) =>
        !item ||
        typeof item.id !== 'string' ||
        !item.id ||
        !validStates.has(item.state),
    )
  ) {
    throw new TypeError('Items require a public ID and a recognized state.');
  }
  return items
    .filter((item) => item.state === 'FAIL' || item.state === 'REVIEW')
    .map((item) => item.id);
}

export function runExamples() {
  const valid = {
    scores: Array(13).fill(4),
    currentFile: 'public-example-v1',
    reviewedFile: 'public-example-v1',
    approved: true,
    hardFailure: false,
  };
  const examples = [
    { name: 'all criteria met', input: valid, expected: 'PASS' },
    {
      name: 'one criterion below threshold',
      input: { ...valid, scores: [3, ...Array(12).fill(5)] },
      expected: 'REVIEW',
    },
    {
      name: 'file changed after review',
      input: { ...valid, currentFile: 'public-example-v2' },
      expected: 'FAIL',
    },
    {
      name: 'approval missing',
      input: { ...valid, approved: false },
      expected: 'FAIL',
    },
    {
      name: 'hard failure overrides scores',
      input: { ...valid, hardFailure: true },
      expected: 'FAIL',
    },
    {
      name: 'incomplete scores',
      input: { ...valid, scores: [5] },
      expected: 'FAIL',
    },
  ];
  const results = examples.map((example) => {
    const actual = assessEvidence(example.input);
    assert.equal(actual, example.expected);
    return { name: example.name, expected: example.expected, actual };
  });
  const retry = selectRetryItems([
    { id: 'A', state: 'PASS' },
    { id: 'B', state: 'FAIL' },
    { id: 'C', state: 'BLOCKED' },
    { id: 'D', state: 'REVIEW' },
  ]);
  assert.deepEqual(retry, ['B', 'D']);
  return {
    kind: 'independent_public_example',
    results,
    retry,
    note: 'Specification checks only; not production or media-quality results.',
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  console.log(JSON.stringify(runExamples(), null, 2));
}
