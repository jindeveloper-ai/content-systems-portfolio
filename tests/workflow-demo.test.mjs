import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import {
  canDropDemoItem,
  demoMedia,
  demoStepDurationMs,
  frameSteps,
  initialDemoState,
  transitionDemo,
  videoSteps,
} from '../lib/workflow-demo.ts';

test('two three-second reconstructions stop at explicit human approval', () => {
  let state = transitionDemo(initialDemoState, 'start');
  assert.equal(frameSteps.length * demoStepDurationMs, 3000);
  assert.equal(videoSteps.length * demoStepDurationMs, 3000);
  for (let step = 0; step < frameSteps.length; step++) {
    assert.deepEqual(state, { phase: 'reviewing', step });
    assert.equal(transitionDemo(state, 'approve'), state);
    state = transitionDemo(state, 'advance');
  }
  assert.equal(state.phase, 'frameReady');
  assert.equal(transitionDemo(state, 'advance'), state);
  state = transitionDemo(state, 'approve');
  for (let step = 0; step < videoSteps.length; step++) {
    assert.deepEqual(state, { phase: 'producing', step });
    assert.equal(transitionDemo(state, 'start'), state);
    state = transitionDemo(state, 'advance');
  }
  assert.equal(state.phase, 'complete');
});

test('out-of-order and duplicate actions cannot bypass the approval boundary', () => {
  assert.equal(transitionDemo(initialDemoState, 'approve'), initialDemoState);
  const reviewing = transitionDemo(initialDemoState, 'start');
  assert.equal(transitionDemo(reviewing, 'start'), reviewing);
  const producing = transitionDemo({ phase: 'frameReady', step: 0 }, 'approve');
  assert.equal(transitionDemo(producing, 'approve'), producing);
});

test('reduced motion can finish each replay immediately but still requires approval', () => {
  let state = transitionDemo(
    transitionDemo(initialDemoState, 'start'),
    'finishStage',
  );
  assert.equal(state.phase, 'frameReady');
  assert.equal(transitionDemo(state, 'finishStage'), state);
  state = transitionDemo(transitionDemo(state, 'approve'), 'finishStage');
  assert.equal(state.phase, 'complete');
});

test('skip and reset are available in every phase; reset ignores a stale advance', () => {
  for (const phase of [
    'idle',
    'reviewing',
    'frameReady',
    'producing',
    'complete',
  ]) {
    const state = { phase, step: 1 };
    assert.equal(transitionDemo(state, 'skip').phase, 'complete');
    const reset = transitionDemo(state, 'reset');
    assert.deepEqual(reset, initialDemoState);
    assert.equal(transitionDemo(reset, 'advance'), reset);
  }
});

test('drag targets accept only the correct internal item and stage', () => {
  for (const phase of [
    'idle',
    'reviewing',
    'frameReady',
    'producing',
    'complete',
  ]) {
    for (const item of ['reference', 'frame', 'file', '']) {
      for (const target of ['frame', 'production', 'outside']) {
        assert.equal(
          canDropDemoItem(phase, item, target),
          (phase === 'idle' && item === 'reference' && target === 'frame') ||
            (phase === 'frameReady' &&
              item === 'frame' &&
              target === 'production'),
        );
      }
    }
  }
});

test('approved media are exact reviewed assets, bounded in size, and anonymously named', () => {
  const root = new URL('../public/media/', import.meta.url);
  assert.deepEqual(readdirSync(root).sort(), [
    'workflow-captions.vtt',
    'workflow-first-frame.webp',
    'workflow-result.mp4',
  ]);
  const frame = readFileSync(new URL('workflow-first-frame.webp', root));
  const video = readFileSync(new URL('workflow-result.mp4', root));
  const sha = (buffer) => createHash('sha256').update(buffer).digest('hex');
  assert.equal(
    sha(frame),
    'c763fd8be7789da1b303441960c55d1b9b3665c95f9b8487283ae0adb07b9620',
  );
  assert.equal(
    sha(video),
    'fef53f7e8a6ba1f2e368fe422ee90ffcea1d987ed89da6ae829adef68f363493',
  );
  assert.ok(frame.length <= 128_000, 'first-frame budget: 128 KB');
  assert.ok(video.length <= 12_000_000, 'approved video budget: 12 MB');
  assert.equal(frame.toString('ascii', 0, 4), 'RIFF');
  assert.equal(frame.toString('ascii', 8, 12), 'WEBP');
  for (let offset = 12; offset < frame.length;) {
    const type = frame.toString('ascii', offset, offset + 4);
    assert.ok(!['EXIF', 'XMP '].includes(type), 'no image identity metadata');
    const size = frame.readUInt32LE(offset + 4);
    offset += 8 + size + (size % 2);
  }
  const atoms = [];
  for (let offset = 0; offset < video.length;) {
    const size = video.readUInt32BE(offset);
    assert.ok(size >= 8 && offset + size <= video.length);
    atoms.push(video.toString('ascii', offset + 4, offset + 8));
    offset += size;
  }
  assert.equal(atoms[0], 'ftyp');
  assert.ok(
    atoms.indexOf('moov') >= 0 && atoms.indexOf('moov') < atoms.indexOf('mdat'),
    'fast-start metadata precedes video data',
  );
  for (const asset of [frame, video])
    assert.doesNotMatch(
      asset.toString('latin1'),
      /\/Users\/|OneDrive|CloudStorage|Lyra|Elenwe|replicate\.delivery/i,
    );
  assert.equal(demoMedia.frame, '/media/workflow-first-frame.webp');
  assert.equal(demoMedia.video, '/media/workflow-result.mp4');
});

test('the client preserves replay disclosure, lazy video, cleanup, and no provider calls', () => {
  const component = readFileSync(
    new URL('../components/workflow-demo.tsx', import.meta.url),
    'utf8',
  );
  for (const text of [
    '실시간 AI 생성·파일 업로드는 하지 않습니다',
    '총 20개 구간 중 첫 구간 예시',
    'preload="none"',
    'window.clearTimeout(timer)',
    'prefers-reduced-motion: reduce',
    'onError=',
    '<noscript>',
  ])
    assert.ok(component.replace(/\s+/g, ' ').includes(text), text);
  assert.doesNotMatch(
    component,
    /autoPlay|fetch\(|XMLHttpRequest|type="file"|localStorage|sessionStorage/,
  );
  const detail = readFileSync(
    new URL('../app/work/content-automation/page.tsx', import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(detail, /clova/i);
});
