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
export const demoMediaItems = [
  {
    id: '01',
    pickerLabel: '01 · 전시 부스 · 12초',
    detailLabel: '12초 · 세로 9:16 · 첫 프레임 3장',
    videoAriaLabel: '전시 부스 장면의 실제 완성 영상, 12초',
    description:
      '전시 부스에서 인물이 손을 흔들고 캐릭터 인쇄물을 보여주는 세로형 완성 영상입니다.',
    frames: [
      {
        src: '/media/workflow-scene-01-frame-01.webp',
        alt: '전시 부스에서 청록색 트윈테일 의상을 입고 손을 흔드는 인물',
      },
      {
        src: '/media/workflow-scene-01-frame-02.webp',
        alt: '전시 부스에서 두 손을 입가에 모은 인물의 가까운 구도',
      },
      {
        src: '/media/workflow-scene-01-frame-03.webp',
        alt: '전시 부스에서 캐릭터 인쇄물을 들어 보이는 인물',
      },
    ],
    video: '/media/workflow-scene-01.mp4',
    captions: '/media/workflow-scene-01.vtt',
  },
  {
    id: '02',
    pickerLabel: '02 · 작업실 · 5초',
    detailLabel: '5초 · 세로 9:16 · 첫 프레임 1장',
    videoAriaLabel: '작업실 장면의 실제 완성 영상, 5초',
    description:
      '헤드폰과 피아노가 보이는 작업실에서 인물이 카메라를 바라보는 세로형 완성 영상입니다.',
    frames: [
      {
        src: '/media/workflow-scene-02-frame-01.webp',
        alt: '헤드폰과 피아노가 보이는 작업실에서 촬영한 인물의 셀피 구도',
      },
    ],
    video: '/media/workflow-scene-02.mp4',
    captions: '/media/workflow-scene-02.vtt',
  },
  {
    id: '03',
    pickerLabel: '03 · 엘리베이터 · 7초',
    detailLabel: '7초 · 세로 9:16 · 첫 프레임 1장',
    videoAriaLabel: '엘리베이터 장면의 실제 완성 영상, 7초',
    description:
      '엘리베이터 거울 앞에서 쇼핑백을 든 인물이 움직이는 세로형 완성 영상입니다.',
    frames: [
      {
        src: '/media/workflow-scene-03-frame-01.webp',
        alt: '엘리베이터 거울 앞에서 쇼핑백을 든 인물의 셀피 구도',
      },
    ],
    video: '/media/workflow-scene-03.mp4',
    captions: '/media/workflow-scene-03.vtt',
  },
] as const;

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
