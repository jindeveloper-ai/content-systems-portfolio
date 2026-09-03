'use client';

import { useI18n } from '@/components/language-provider';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { qualityGroups } from '@/data/case-study';

export function QualityDetails() {
  const { t } = useI18n();
  return (
    <Accordion
      multiple
      defaultValue={['장면의 완성도']}
      className="quality-accordion"
    >
      {qualityGroups.map((group) => (
        <AccordionItem key={group.title} value={group.title}>
          <AccordionTrigger>
            <span>
              {t(group.title)}
              <small>
                {t(group.items.length)}
                {t('개 항목')}
              </small>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <dl className="criteria-list">
              {group.items.map(([name, question]) => (
                <div key={name}>
                  <dt>{t(name)}</dt>
                  <dd>{t(question)}</dd>
                </div>
              ))}
            </dl>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
