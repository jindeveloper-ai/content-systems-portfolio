import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import {
  canDropDemoItem,
  demoMediaItems,
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
    'workflow-scene-01-frame-01.webp',
    'workflow-scene-01-frame-02.webp',
    'workflow-scene-01-frame-03.webp',
    'workflow-scene-01.mp4',
    'workflow-scene-01.vtt',
    'workflow-scene-02-frame-01.webp',
    'workflow-scene-02.mp4',
    'workflow-scene-02.vtt',
    'workflow-scene-03-frame-01.webp',
    'workflow-scene-03.mp4',
    'workflow-scene-03.vtt',
  ]);
  const sha = (buffer) => createHash('sha256').update(buffer).digest('hex');
  const expectedHashes = {
    'workflow-scene-01-frame-01.webp':
      'c9fd50c4b61eee882ef624fc8b49f3ffbdcd1a4f3bea16cadb90b4db2c97e839',
    'workflow-scene-01-frame-02.webp':
      '5368e7c0fccf70bcd9cf04fe7328bae1eb7ab18916e88eeceb2ed6612c9b4b06',
    'workflow-scene-01-frame-03.webp':
      '5ed7ce024d914fd0ad48302f7010b8424793eea421da1e97b57758a03106b5e1',
    'workflow-scene-02-frame-01.webp':
      '0225539d9199c8efb0b79f1180c4e12ede4c2896846b3655e3fe850a8bfc6f56',
    'workflow-scene-03-frame-01.webp':
      'c8af3c4a735b91ec6894647bec7e5284062eeab5a9b3d9d006ed940c28736f46',
    'workflow-scene-01.mp4':
      'a0d01bf1a935582f09c2c24b6aafc89b6ea2fd892d01403f595332dc7f3a53f9',
    'workflow-scene-02.mp4':
      '368ebc4f01d7a7465212ff973d3326bfc30c1568a125d58b8214c8de15efeb63',
    'workflow-scene-03.mp4':
      '0d32e55ef67861ae54c50e93fca32159b9d96d082aba6f4f710b6b0f5d845d4c',
  };
  const frames = demoMediaItems.flatMap((item) => item.frames);
  const videos = demoMediaItems.map((item) => item.video);
  const buffers = [];
  for (const frame of frames) {
    const name = frame.src.replace('/media/', '');
    const buffer = readFileSync(new URL(name, root));
    buffers.push(buffer);
    assert.equal(sha(buffer), expectedHashes[name]);
    assert.ok(buffer.length <= 128_000, `${name}: 128 KB frame budget`);
    assert.equal(buffer.toString('ascii', 0, 4), 'RIFF');
    assert.equal(buffer.toString('ascii', 8, 12), 'WEBP');
    for (let offset = 12; offset < buffer.length;) {
      const type = buffer.toString('ascii', offset, offset + 4);
      assert.ok(
        !['EXIF', 'XMP '].includes(type),
        `${name}: no identity metadata`,
      );
      const size = buffer.readUInt32LE(offset + 4);
      offset += 8 + size + (size % 2);
    }
  }
  let totalVideoBytes = 0;
  for (const path of videos) {
    const name = path.replace('/media/', '');
    const buffer = readFileSync(new URL(name, root));
    buffers.push(buffer);
    totalVideoBytes += buffer.length;
    assert.equal(sha(buffer), expectedHashes[name]);
    assert.ok(buffer.length <= 8_000_000, `${name}: 8 MB video budget`);
    const atoms = [];
    for (let offset = 0; offset < buffer.length;) {
      const size = buffer.readUInt32BE(offset);
      assert.ok(size >= 8 && offset + size <= buffer.length);
      atoms.push(buffer.toString('ascii', offset + 4, offset + 8));
      offset += size;
    }
    assert.equal(atoms[0], 'ftyp');
    assert.ok(
      atoms.indexOf('moov') >= 0 &&
        atoms.indexOf('moov') < atoms.indexOf('mdat'),
      `${name}: fast-start metadata precedes video data`,
    );
  }
  assert.ok(totalVideoBytes <= 14_000_000, 'combined video budget: 14 MB');
  for (const asset of buffers)
    assert.doesNotMatch(
      asset.toString('latin1'),
      /\/Users\/|OneDrive|CloudStorage|Miku|LTX_final|replicate\.delivery/i,
    );
  assert.deepEqual(
    demoMediaItems.map(({ id, frames: itemFrames, video, captions }) => ({
      id,
      frameCount: itemFrames.length,
      video,
      captions,
    })),
    [
      {
        id: '01',
        frameCount: 3,
        video: '/media/workflow-scene-01.mp4',
        captions: '/media/workflow-scene-01.vtt',
      },
      {
        id: '02',
        frameCount: 1,
        video: '/media/workflow-scene-02.mp4',
        captions: '/media/workflow-scene-02.vtt',
      },
      {
        id: '03',
        frameCount: 1,
        video: '/media/workflow-scene-03.mp4',
        captions: '/media/workflow-scene-03.vtt',
      },
    ],
  );
  assert.equal(new Set(frames.map((frame) => frame.src)).size, frames.length);
  for (const item of demoMediaItems) {
    const captions = readFileSync(
      new URL(item.captions.replace('/media/', ''), root),
      'utf8',
    );
    assert.match(captions, /^WEBVTT/);
    assert.match(captions, /Background music and on-screen English text/);
  }
});

test('the client preserves replay disclosure, lazy video, cleanup, and no provider calls', () => {
  const component = readFileSync(
    new URL('../components/workflow-demo.tsx', import.meta.url),
    'utf8',
  );
  for (const text of [
    '실시간 AI 생성·파일 업로드는 하지 않습니다',
    '체험할 장면 선택',
    '선택한 클립의 실제 첫 프레임 묶음',
    'type="radio"',
    "dispatch('reset')",
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
  assert.match(component, /selectedMedia\.frames\.map/);
  assert.match(component, /src=\{selectedMedia\.video\}/);
  assert.match(component, /src=\{selectedMedia\.captions\}/);
  const detail = readFileSync(
    new URL('../app/work/content-automation/page.tsx', import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(detail, /clova/i);
});
