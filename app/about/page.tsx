'use client';

import { ArrowDown, ArrowRight, ArrowUpRight, FileText } from 'lucide-react';
import { useI18n } from '@/components/language-provider';
import { SiteHeader, SiteFooter } from '@/components/site-shell';
import Link from '@/components/site-link';
import { contactLinks, resumeAssets } from '@/lib/resume';

export default function About() {
  const { locale, t } = useI18n();
  const resume = resumeAssets[locale];

  return (
    <>
      <SiteHeader />
      <main id="main" className="container about-page">
        <header className="about-intro">
          <div className="about-identity">
            <span className="eyebrow">ABOUT / SU JIN LEE</span>
            <p className="about-location">Seoul, South Korea</p>
            <a className="text-link" href="#resume">
              {t('레쥬메 보기')} <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="about-narrative">
            <h1>
              {t('콘텐츠를 만드는 일과, 만드는 시스템을 함께 설계합니다.')}
            </h1>
            <p>
              {t(
                '콘텐츠의 기획과 표현을 고민하며, 반복되는 제작 과정을 실행 가능한 단계로 정리합니다. 문제와 요구사항 정의, 시나리오·품질 기준 설계, 결과물 검수와 개선 방향 판단을 주도했습니다.',
              )}
            </p>
            <p>
              {t(
                'AI와 협업해 Python 자동화와 미디어 도구를 연결했습니다. 작업이 중단돼도 이어갈 수 있는 구조, 승인한 파일을 다시 확인하는 검증, 사람이 결정할 지점을 코드와 운영 절차에 반영합니다.',
              )}
            </p>
            <span className="about-role">
              {t('기획 · 설계 · 검수 주도 / AI 협업 구현')}
            </span>
          </div>
        </header>

        <section className="about-row" aria-labelledby="experience-title">
          <div className="about-section-label">
            <span className="eyebrow">01 / EXPERIENCE</span>
            <h2 id="experience-title">{t('경력')}</h2>
          </div>
          <div className="about-section-content">
            <div className="about-job-heading">
              <h3>Mel</h3>
              <p>{t('2026.02 – 현재 · 원격')}</p>
            </div>
            <p className="about-job-role">
              AI Content Creator &amp; Automation Designer
            </p>
            <ul className="about-experience-list">
              <li>
                <strong>{t('중단된 작업을 이어가는 실행 구조')}</strong>
                <p>
                  {t(
                    'Python 병렬 실행기와 단계별 체크포인트로 유효한 완료 결과를 재사용하고 실패한 항목이나 단계만 다시 처리하도록 구성했습니다.',
                  )}
                </p>
              </li>
              <li>
                <strong>{t('생성과 후반 작업을 연결하는 도구 통합')}</strong>
                <p>
                  {t(
                    '생성형 AI 서비스에 Blender·FFmpeg 후처리와 Ubuntu 원격 실행을 연결했습니다. 작업 명세, 출력 파일, 코드 버전과 파일 해시를 대조해 결과를 확인합니다.',
                  )}
                </p>
              </li>
              <li>
                <strong>{t('현재 파일에 연결된 품질 검수')}</strong>
                <p>
                  {t(
                    '13개 품질 항목마다 4/5 이상을 요구하고 중대 오류는 별도로 차단합니다. SHA-256 파일 해시와 검수 기록을 연결해 수정 전 파일의 승인이 재사용되지 않도록 했습니다.',
                  )}
                </p>
              </li>
              <li>
                <strong>{t('기획부터 전달까지 10단계')}</strong>
                <p>
                  {t(
                    '레퍼런스 조사, 이미지·영상 생성, 후처리, 검증과 전달의 입력·완료 조건을 정의했습니다. unittest·GitHub Actions 검사와 운영 문서로 반복 실행을 뒷받침합니다.',
                  )}
                </p>
              </li>
            </ul>
            <p className="about-note">
              {t(
                '공개 검증 기록: 2026.09.03 기준 비운영 테스트 26개 통과, 합성 입력 수집 기록 30개 일치. 실제 제작 시간·비용 절감 측정치는 아닙니다.',
              )}
            </p>
            <Link className="text-link" href="/work/content-automation/">
              {t('제작 체계와 검증 근거 읽기')}{' '}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="about-row" aria-labelledby="about-research-title">
          <div className="about-section-label">
            <span className="eyebrow">02 / SELECTED RESEARCH</span>
            <h2 id="about-research-title">{t('영상 주목도 분석')}</h2>
          </div>
          <div className="about-section-content">
            <p className="about-research-lead">
              {t('무엇이 눈길을 끄는지, 감각에서 검토 가능한 질문으로.')}
            </p>
            <p>
              {t(
                '논문과 연구 노트의 질문을 콘텐츠 검수 기준으로 정리하고, AI와 협업한 개인용 분석 앱에서 영상의 예측 주목도 분포를 살펴봤습니다.',
              )}
            </p>
            <dl className="about-research-records">
              <div>
                <dt>DeepGaze IIE</dt>
                <dd>
                  {t(
                    '22.13초 영상의 66개 샘플 프레임으로 히트맵, 비교 영상과 검토 후보 구간을 생성했습니다.',
                  )}
                </dd>
              </div>
              <div>
                <dt>UNISAL</dt>
                <dd>
                  {t(
                    '별도 검증본에서 시간 정보 사용과 시간 모듈 우회를 같은 모델·입력 조건으로 18회 비교했습니다. 실행과 출력 차이를 확인한 실험입니다.',
                  )}
                </dd>
              </div>
            </dl>
            <p className="about-note">
              {t(
                '예측 주목도는 실제 시선 측정이나 사용자 선호 정확도 검증이 아닙니다. UNISAL 전체 검증은 기존 감사·의존성 예외로 보류된 상태이며, 세부 조건과 한계는 사례에 기록했습니다.',
              )}
            </p>
            <Link
              className="text-link"
              href="/work/content-automation/#attention-study"
            >
              {t('연구와 분석 조건 살펴보기')}{' '}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="about-row" aria-labelledby="skills-contact-title">
          <div className="about-section-label">
            <span className="eyebrow">03 / SKILLS &amp; CONTACT</span>
            <h2 id="skills-contact-title">{t('기술과 연락처')}</h2>
          </div>
          <div className="about-section-content">
            <dl className="about-skills">
              <div>
                <dt>{t('코드 · 자동화')}</dt>
                <dd>
                  Python · Bash · JSON
                  <br />
                  {t('병렬 처리 · 체크포인트 복구 · 파일 검증')}
                </dd>
              </div>
              <div>
                <dt>{t('AI · 미디어')}</dt>
                <dd>
                  Replicate · Qwen VL · MediaPipe
                  <br />
                  FFmpeg / FFprobe · Blender
                </dd>
              </div>
              <div>
                <dt>{t('운영 · 검증')}</dt>
                <dd>
                  Ubuntu · Git · GitHub Actions
                  <br />
                  unittest · prek
                </dd>
              </div>
            </dl>
            <div className="about-contact-links">
              <a href={contactLinks.email}>
                su.jin.lee.developer@gmail.com{' '}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <a
                href={contactLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('LinkedIn (새 탭)')}
              >
                LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <a
                href={contactLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('GitHub (새 탭)')}
              >
                GitHub <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section
          id="resume"
          className="about-row about-resume"
          aria-labelledby="resume-title"
        >
          <div className="about-section-label">
            <span className="eyebrow">04 / RESUME</span>
            <h2 id="resume-title">{t('레쥬메')}</h2>
          </div>
          <div className="about-section-content">
            <div className="resume-card">
              <FileText size={30} aria-hidden="true" />
              <div className="resume-description">
                <h3>{t(resume.label)}</h3>
                <p>
                  PDF · {t('1페이지')} · {resume.sizeLabel}
                </p>
              </div>
              <div className="resume-actions">
                <a
                  className="resume-open"
                  href={resume.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  hrefLang={locale}
                  type="application/pdf"
                >
                  {t('새 탭에서 보기')}{' '}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <a
                  href={resume.href}
                  download={resume.filename}
                  hrefLang={locale}
                  type="application/pdf"
                >
                  {t('PDF 다운로드')} <ArrowDown size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
            <p className="resume-language-note">
              {t('상단 언어 선택에 맞는 레쥬메가 표시됩니다.')}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
