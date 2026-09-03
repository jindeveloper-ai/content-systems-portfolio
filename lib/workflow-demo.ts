export type DemoPhase =
  | 'idle'
  | 'reviewing'
  | 'frameReady'
  | 'producing'
  | 'complete';
export type DemoState = { phase: DemoPhase; step: number };
export type DemoEvent =
  | 'start'
  | 'advance'
  | 'approve'
  | 'finishStage'
  | 'skip'
  | 'reset';

export const initialDemoState: DemoState = { phase: 'idle', step: 0 };
export const demoStepDurationMs = 1000;
export const demoMedia = {
  frame: '/media/workflow-first-frame.webp',
  video: '/media/workflow-result.mp4',
} as const;

export const frameSteps = [
  '구도·동작을 제작 계획으로 정리',
  'GPT Image 2로 첫 프레임 제작',
  '인물·화면 검수 기록 확인',
] as const;

export const videoSteps = [
  '승인한 프레임을 LTX 입력에 연결',
  '구간별 영상 제작 → 편집·자막·음악',
  '최종 검수 → 완성본 연결',
] as const;

// This state machine replays a recorded process; it never runs a provider or evaluates media.
export function transitionDemo(state: DemoState, event: DemoEvent): DemoState {
  if (event === 'reset') return initialDemoState;
  if (event === 'skip') return { phase: 'complete', step: 0 };
  if (event === 'start' && state.phase === 'idle')
    return { phase: 'reviewing', step: 0 };
  if (event === 'approve' && state.phase === 'frameReady')
    return { phase: 'producing', step: 0 };
  if (state.phase !== 'reviewing' && state.phase !== 'producing') return state;
  if (event !== 'advance' && event !== 'finishStage') return state;
  const steps = state.phase === 'reviewing' ? frameSteps : videoSteps;
  if (event === 'advance' && state.step < steps.length - 1)
    return { ...state, step: state.step + 1 };
  return {
    phase: state.phase === 'reviewing' ? 'frameReady' : 'complete',
    step: 0,
  };
}

export function canDropDemoItem(
  phase: DemoPhase,
  item: string,
  target: string,
): boolean {
  return (
    (phase === 'idle' && item === 'reference' && target === 'frame') ||
    (phase === 'frameReady' && item === 'frame' && target === 'production')
  );
}
