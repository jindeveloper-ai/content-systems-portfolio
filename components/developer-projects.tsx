'use client';

import { ArrowUpRight } from 'lucide-react';
import { useI18n } from '@/components/language-provider';
import { contactLinks } from '@/lib/resume';
import styles from './developer-projects.module.css';

const projects = [
  {
    name: 'Audio Book Maid',
    stack: 'TypeScript, Python, FastAPI',
    description:
      'Risu 대화를 여러 화자의 오디오북으로 만들고, 저장한 위치부터 이어 듣는 확장 프로그램입니다.',
    repository: 'risu-extensions-portfolio/tree/main/projects/audio-book-maid',
  },
  {
    name: 'MARS.NET',
    stack: 'JavaScript, Node.js',
    description:
      '규칙 기반 판정에 AI 대화를 연결한 소셜 추리 게임입니다. 로컬 연습 모드를 제공합니다.',
    repository: 'space-mafia-prototype',
  },
  {
    name: 'Narin Character Profile',
    stack: 'React, TypeScript, Cloudflare Worker',
    description:
      '메신저와 이미지 피드에서 캐릭터를 탐색하는 다국어 웹사이트입니다.',
    repository: 'cat-widget-character-profile',
  },
];

export function DeveloperProjects() {
  const { t } = useI18n();

  return (
    <section
      id="developer-projects"
      className={styles.section}
      aria-labelledby="developer-projects-title"
    >
      <div className="section-heading">
        <h2 id="developer-projects-title">{t('개발 프로젝트')}</h2>
        <a className="text-link" href={contactLinks.github}>
          GitHub <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
      <ul className={styles.projects}>
        {projects.map(({ name, stack, description, repository }) => (
          <li className={styles.project} key={name}>
            <div>
              <h3>{name}</h3>
              <p className={styles.stack}>{stack}</p>
            </div>
            <div>
              <p>{t(description)}</p>
              <a
                className="text-link"
                href={`${contactLinks.github}/${repository}`}
              >
                {t('코드와 실행 안내')}
                <span className="sr-only"> ({name})</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
