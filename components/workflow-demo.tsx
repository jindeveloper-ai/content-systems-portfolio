'use client';

import Image from 'next/image';
import { useEffect, useReducer, useRef, useState, type DragEvent } from 'react';
import {
  ArrowRight,
  Check,
  Film,
  Grip,
  ImageIcon,
  LockKeyhole,
  Play,
  RotateCcw,
  ScanLine,
  ShieldCheck,
} from 'lucide-react';
import {
  canDropDemoItem,
  demoMedia,
  demoStepDurationMs,
  frameSteps,
  initialDemoState,
  transitionDemo,
  videoSteps,
} from '@/lib/workflow-demo';

const dragType = 'application/x-portfolio-workflow';
const announcements = {
  idle: '레퍼런스 카드를 첫 프레임 칸으로 드래그하거나, 샘플로 시작 버튼을 누르세요.',
  reviewing: '첫 프레임 제작·검수 과정을 재현하고 있습니다. 약 3초가 걸립니다.',
  frameReady:
    '실제 사용한 첫 프레임입니다. 확인 후 승인하고 영상 제작으로 이동하세요.',
  producing: '승인 이후의 영상 제작·최종 검수 과정을 약 3초 동안 재현합니다.',
  complete: '기존 완성본이 준비되었습니다. 재생 버튼으로 영상을 확인하세요.',
};

function RecordedChecks({
  steps,
  active,
}: {
  steps: readonly string[];
  active: number;
}) {
  return (
    <ol className="demo-checks" aria-label="제작 기록 재현 단계">
      {steps.map((label, index) => (
        <li
          key={label}
          data-status={
            index < active ? 'done' : index === active ? 'active' : 'waiting'
          }
        >
          {index < active ? (
            <Check size={15} aria-hidden="true" />
          ) : (
            <span className="demo-check-dot" aria-hidden="true" />
          )}
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}

export function WorkflowDemo() {
  const [state, dispatch] = useReducer(transitionDemo, initialDemoState);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dropNotice, setDropNotice] = useState('');
  const [frameError, setFrameError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [frameAttempt, setFrameAttempt] = useState(0);
  const [videoAttempt, setVideoAttempt] = useState(0);
  const dragSource = useRef<string | null>(null);
  const referenceButton = useRef<HTMLButtonElement>(null);
  const approvalButton = useRef<HTMLButtonElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (state.phase !== 'reviewing' && state.phase !== 'producing') return;
    if (reducedMotion) {
      dispatch('finishStage');
      return;
    }
    const timer = window.setTimeout(
      () => dispatch('advance'),
      demoStepDurationMs,
    );
    return () => window.clearTimeout(timer);
  }, [state.phase, state.step, reducedMotion]);

  useEffect(() => {
    if (state.phase === 'frameReady')
      approvalButton.current?.focus({ preventScroll: true });
    if (state.phase === 'complete')
      resultHeading.current?.focus({ preventScroll: true });
  }, [state.phase]);

  const hasFrame =
    state.phase === 'frameReady' ||
    state.phase === 'producing' ||
    state.phase === 'complete';
  const isBusy = state.phase === 'reviewing' || state.phase === 'producing';

  function clearDrag() {
    dragSource.current = null;
    setDraggedItem(null);
  }

  function startDrag(
    event: DragEvent<HTMLElement>,
    item: 'reference' | 'frame',
  ) {
    event.dataTransfer.setData(dragType, item);
    event.dataTransfer.effectAllowed = 'move';
    dragSource.current = item;
    setDraggedItem(item);
    setDropNotice('');
  }

  function dropItem(
    event: DragEvent<HTMLElement>,
    target: 'frame' | 'production',
  ) {
    event.preventDefault();
    event.stopPropagation();
    const item = event.dataTransfer.getData(dragType);
    if (
      !event.dataTransfer.files.length &&
      item === dragSource.current &&
      canDropDemoItem(state.phase, item, target) &&
      !(item === 'frame' && frameError)
    ) {
      dispatch(item === 'reference' ? 'start' : 'approve');
      setDropNotice('');
    } else {
      setDropNotice(
        '준비된 레퍼런스 → 첫 프레임 → 승인하고 영상 제작 순서로 이동해 주세요. 외부 파일은 업로드하지 않습니다.',
      );
    }
    clearDrag();
  }

  function resetDemo() {
    dispatch('reset');
    clearDrag();
    setDropNotice('');
    setFrameError(false);
    setVideoError(false);
    referenceButton.current?.focus({ preventScroll: true });
  }

  return (
    <section
      className="workflow-demo"
      id="demo"
      aria-labelledby="demo-title"
      data-phase={state.phase}
    >
      <div className="demo-heading">
        <div>
          <span className="demo-kicker">INTERACTIVE CASE · 제작 과정 체험</span>
          <h2 id="demo-title">하나의 프레임이 영상이 되기까지</h2>
        </div>
        <div className="demo-toolbar">
          <button
            type="button"
            className="demo-text-button"
            onClick={() => {
              clearDrag();
              setDropNotice('');
              dispatch('skip');
            }}
          >
            완성본 바로 보기 <ArrowRight size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="demo-reset"
            onClick={resetDemo}
            aria-label="체험 처음부터 다시 시작"
          >
            <RotateCcw size={17} aria-hidden="true" />
            <span>다시 시작</span>
          </button>
        </div>
      </div>
      <p className="demo-disclosure">
        실제 제작 기록을 재현한 체험입니다. 실시간 AI 생성·파일 업로드는 하지
        않습니다.
      </p>
      <div
        className="demo-board"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          clearDrag();
          setDropNotice(
            '카드를 점선으로 표시한 다음 단계에 놓아 주세요. 외부 파일은 업로드하지 않습니다.',
          );
        }}
      >
        <article
          className="demo-node demo-reference"
          data-done={state.phase !== 'idle'}
        >
          <div className="demo-node-heading">
            <span>01</span>
            <h3>레퍼런스</h3>
            <span className="demo-owner">기획</span>
          </div>
          <button
            ref={referenceButton}
            type="button"
            className="demo-reference-card"
            draggable={state.phase === 'idle'}
            onDragStart={(event) => startDrag(event, 'reference')}
            onDragEnd={clearDrag}
            onClick={() => {
              setDropNotice('');
              dispatch('start');
            }}
            aria-disabled={state.phase !== 'idle'}
            aria-label="준비된 레퍼런스로 첫 프레임 제작 체험 시작"
            aria-describedby="demo-input-note"
          >
            <span className="demo-file-icon">
              <Film size={31} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <strong>reference.mp4</strong>
            <span>준비된 레퍼런스 카드</span>
            <span className="demo-drag-hint">
              <Grip size={14} aria-hidden="true" /> 오른쪽으로 드래그
            </span>
          </button>
          <p className="demo-node-note" id="demo-input-note">
            원본 영상은 공개하지 않고,
            <br />
            구도·동작을 참고하는 단계를 재현합니다.
          </p>
          <span className="demo-connector" aria-hidden="true">
            <ArrowRight size={22} />
          </span>
        </article>

        <div
          className="demo-node demo-drop-zone"
          data-target={draggedItem === 'reference' && state.phase === 'idle'}
          onDrop={(event) => dropItem(event, 'frame')}
          aria-label="첫 프레임 만들기: 레퍼런스를 놓는 곳"
        >
          <div className="demo-node-heading">
            <span>02</span>
            <h3>첫 프레임</h3>
            <span className="demo-owner">AI · 검수</span>
          </div>
          <div className="demo-frame-slot">
            {hasFrame ? (
              frameError ? (
                <div className="demo-media-error" role="alert">
                  <p>프레임을 불러오지 못했습니다.</p>
                  <button
                    className="demo-text-button"
                    type="button"
                    onClick={() => {
                      setFrameError(false);
                      setFrameAttempt((value) => value + 1);
                    }}
                  >
                    이미지 다시 불러오기
                  </button>
                </div>
              ) : (
                <div
                  className="demo-first-frame-source"
                  draggable={state.phase === 'frameReady'}
                  onDragStart={(event) => startDrag(event, 'frame')}
                  onDragEnd={clearDrag}
                >
                  <Image
                    key={frameAttempt}
                    src={demoMedia.frame}
                    width={720}
                    height={1280}
                    alt="실내에서 두 인물이 헤어스타일을 연출하는, 첫 구간 제작에 사용한 이미지"
                    className="demo-first-frame"
                    unoptimized
                    draggable={false}
                    onError={() => setFrameError(true)}
                  />
                </div>
              )
            ) : (
              <div
                className={`demo-frame-placeholder ${state.phase === 'reviewing' ? 'is-scanning' : ''}`}
              >
                {state.phase === 'reviewing' ? (
                  <ScanLine size={30} aria-hidden="true" />
                ) : (
                  <ImageIcon size={30} aria-hidden="true" />
                )}
                <span>
                  {state.phase === 'reviewing'
                    ? '제작·검수 과정 재현 중'
                    : '레퍼런스를 여기에 놓으세요'}
                </span>
                {state.phase === 'reviewing' && (
                  <span className="demo-scan-line" aria-hidden="true" />
                )}
              </div>
            )}
          </div>
          {state.phase === 'reviewing' ? (
            <RecordedChecks steps={frameSteps} active={state.step} />
          ) : (
            <p className="demo-node-note">
              {hasFrame ? (
                <>
                  실제 사용한 첫 프레임
                  <br />
                  <strong>총 20개 구간 중 첫 구간 예시</strong>
                </>
              ) : (
                <>
                  구도·인물의 일관성을 확인하고
                  <br />
                  영상 제작 전에 수정하기 위해.
                </>
              )}
            </p>
          )}
          <button
            type="button"
            className="demo-button"
            onClick={() => {
              setDropNotice('');
              dispatch('start');
            }}
            disabled={state.phase !== 'idle'}
          >
            {state.phase === 'idle'
              ? '샘플로 시작'
              : state.phase === 'reviewing'
                ? '기록 재현 중…'
                : '첫 프레임 확인'}
          </button>
          <span className="demo-connector" aria-hidden="true">
            <ArrowRight size={22} />
          </span>
        </div>

        <div
          className="demo-node demo-drop-zone demo-production"
          data-target={
            draggedItem === 'frame' &&
            state.phase === 'frameReady' &&
            !frameError
          }
          onDrop={(event) => dropItem(event, 'production')}
          aria-label="승인하고 영상 제작: 첫 프레임을 놓는 곳"
        >
          <div className="demo-node-heading">
            <span>03</span>
            <h3>승인 → 제작</h3>
            <span className="demo-owner">사람 → AI</span>
          </div>
          <div
            className={`demo-approval-visual ${state.phase === 'producing' ? 'is-producing' : ''}`}
          >
            <ShieldCheck size={34} strokeWidth={1.4} aria-hidden="true" />
            <strong>
              {state.phase === 'producing'
                ? '영상 제작 과정 재현 중'
                : state.phase === 'complete'
                  ? '제작 과정의 승인 경계'
                  : '이 프레임으로 만들까요?'}
            </strong>
            <span>사람이 확인해야 다음 단계로</span>
          </div>
          {state.phase === 'producing' ? (
            <RecordedChecks steps={videoSteps} active={state.step} />
          ) : (
            <p className="demo-node-note">
              승인된 이미지로 LTX 영상 제작.
              <br />
              편집·자막·음악을 더하고 최종 검수.
            </p>
          )}
          <button
            ref={approvalButton}
            type="button"
            className="demo-button demo-primary"
            disabled={state.phase !== 'frameReady' || frameError}
            onClick={() => {
              setDropNotice('');
              dispatch('approve');
            }}
          >
            이 프레임 승인하고 제작
          </button>
          <span className="demo-connector" aria-hidden="true">
            <ArrowRight size={22} />
          </span>
        </div>

        <article className="demo-node demo-result">
          <div className="demo-node-heading">
            <span>04</span>
            <h3 ref={resultHeading} tabIndex={-1}>
              완성본
            </h3>
            <span className="demo-owner">결과</span>
          </div>
          <div className="demo-result-slot">
            {state.phase === 'complete' ? (
              videoError ? (
                <div className="demo-media-error" role="alert">
                  <p>영상을 불러오지 못했습니다.</p>
                  <button
                    type="button"
                    className="demo-text-button"
                    onClick={() => {
                      setVideoError(false);
                      setVideoAttempt((value) => value + 1);
                    }}
                  >
                    영상 다시 불러오기
                  </button>
                </div>
              ) : (
                <video
                  key={videoAttempt}
                  controls
                  playsInline
                  preload="none"
                  poster={demoMedia.frame}
                  width={720}
                  height={1280}
                  src={demoMedia.video}
                  aria-label="헤어스타일 연출 콘텐츠 실제 완성본, 약 22초"
                  aria-describedby="demo-video-description"
                  onError={() => setVideoError(true)}
                >
                  <track
                    kind="captions"
                    src="/media/workflow-captions.vtt"
                    srcLang="en"
                    label="English · music and on-screen text"
                  />
                </video>
              )
            ) : (
              <div className="demo-result-placeholder">
                <span className="demo-play-circle">
                  <Play size={26} aria-hidden="true" />
                </span>
                <span>
                  <LockKeyhole size={13} aria-hidden="true" /> 완성본에서 재생할
                  수 있습니다
                </span>
              </div>
            )}
          </div>
          <p className="demo-node-note">
            22초 · 세로 9:16 · 20개 구간
            <br />
            사용자가 재생한 뒤에만 영상 로딩.
          </p>
        </article>
      </div>
      <div className="demo-status-row">
        <output aria-live="polite" aria-atomic="true">
          {dropNotice || announcements[state.phase]}
        </output>
        <span className="demo-replay-label">
          {isBusy
            ? '약 3초의 설명용 애니메이션'
            : '실제 생성 시간·평가 점수 아님'}
        </span>
      </div>
      <p className="demo-caption" id="demo-video-description">
        영상: 두 인물이 실내에서 헤어스타일을 연출하는 콘텐츠. 영어 자막과 배경
        음악이 포함되어 있습니다. 위 흐름은 제작 과정을 축약한 것으로, 한 장으로
        전체 영상을 생성한 사례가 아닙니다.
      </p>
      <noscript>
        <p>
          제작 과정 체험에는 JavaScript가 필요합니다.{' '}
          <a href={demoMedia.video}>기존 완성본 보기</a>
        </p>
      </noscript>
    </section>
  );
}
