export interface ActualProblem {
  id: string;
  title: string;
  problem: string;
  decision: string;
  change: string;
  recordAndLimitation: string;
}

export const actualProblemsIntro =
  '팀 동료가 만든 초기 자동화 도구를 바탕으로, 저는 제작 중 발견한 문제를 정의하고 검수 기준과 개선 방향을 정했습니다. 구현은 AI와 협업했습니다. 아래는 과거 제작 기록에 남은 사례이며, 별도의 합성 테스트와 구분합니다. Codex 검수는 AI 검수이며, 사람의 승인은 별도 단계입니다.';

export const actualProblemsNotice =
  '원본 기록과 미디어는 비공개입니다. 이 요약은 과거 문서에 근거하며, 당시 결과를 이번에 독립적으로 재검증한 것은 아닙니다.';

export const actualProblems: readonly ActualProblem[] = [
  {
    id: 'layered-review',
    title: '놓친 시각적 결함 → 다층 검수',
    problem: '1차 AI 검수에서 이미지 속 가짜 문자 흔적을 놓쳤습니다.',
    decision: '한 번의 AI 통과 판정을 최종 승인으로 취급하지 않기로 했습니다.',
    change:
      'Qwen 선별 뒤 Codex가 전체 해상도로 다시 검수하고, 문제가 있는 이미지만 재생성해 재검수하도록 했습니다.',
    recordAndLimitation:
      '후속 AI 검수의 결함 발견과 해당 이미지 재생성이 기록되어 있습니다. 전체 결함 탐지율 향상을 측정한 결과는 아닙니다.',
  },
  {
    id: 'targeted-scenes',
    title: '물리·장면 요구 위반 → 해당 장면만 수정',
    problem:
      '물체의 부자연스러운 움직임, 원치 않는 생성 자막, 계획에 없던 배경 인물이 발견됐습니다.',
    decision:
      '정상 장면을 유지하고, 실패한 장면을 제작 요구사항에 맞춰 다시 확인하기로 했습니다.',
    change: '해당 장면만 재생성한 뒤 새 결과물을 다시 검수했습니다.',
    recordAndLimitation:
      '물리 오류 장면은 두 번째 시도에서 검수 통과로, 자막·배경 인물 문제는 교체본 검수 통과로 기록됐습니다. 당시 AI 검수 기록이며, 사용자 만족이나 오류 재발 방지를 입증하지는 않습니다.',
  },
  {
    id: 'changed-outputs',
    title: '유효한 작업의 반복 처리 → 변경된 결과만 재검수',
    problem:
      '영상만 다시 생성할 때, 바뀌지 않은 승인 프레임까지 반복 처리할 여지가 있었습니다.',
    decision: '검증된 입력의 유지와 새 출력의 검수를 분리하기로 했습니다.',
    change:
      '동일한 작업 안에서 승인 프레임과 검수 근거가 현재 파일에 일치할 때만 유지하고, 재생성한 영상은 새로 검수하도록 했습니다.',
    recordAndLimitation:
      '선택적 재시도 규칙의 적용과 교체 영상의 검수 통과가 기록되어 있습니다. 실제 전체 작업시간의 단축 폭은 측정하지 않았습니다.',
  },
];
