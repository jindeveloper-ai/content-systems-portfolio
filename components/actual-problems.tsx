'use client';

import { useI18n } from '@/components/language-provider';
import {
  actualProblems,
  actualProblemsIntro,
  actualProblemsNotice,
} from '@/data/actual-problems';
import styles from './actual-problems.module.css';

export function ActualProblems() {
  const { t } = useI18n();
  return (
    <section
      id="actual-problems"
      className={`case-section ${styles.section}`}
      aria-labelledby="actual-problems-title"
    >
      <h2 id="actual-problems-title">{t('실제 문제와 개선')}</h2>
      <p>{t(actualProblemsIntro)}</p>
      <div className={styles.cases}>
        {actualProblems.map((example, index) => (
          <article key={example.id} aria-labelledby={`incident-${example.id}`}>
            <h3 id={`incident-${example.id}`}>
              {index + 1}. {t(example.title)}
            </h3>
            <dl className={styles.details}>
              <div>
                <dt>{t('문제')}</dt>
                <dd>{t(example.problem)}</dd>
              </div>
              <div>
                <dt>{t('판단')}</dt>
                <dd>{t(example.decision)}</dd>
              </div>
              <div>
                <dt>{t('변경')}</dt>
                <dd>{t(example.change)}</dd>
              </div>
              <div>
                <dt>{t('기록과 한계')}</dt>
                <dd>{t(example.recordAndLimitation)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <p className={styles.notice}>{t(actualProblemsNotice)}</p>
    </section>
  );
}
