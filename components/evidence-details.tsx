'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { qualityGroups } from '@/data/case-study';

export function QualityDetails() {
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
              {group.title}
              <small>{group.items.length}개 항목</small>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <dl className="criteria-list">
              {group.items.map(([name, question]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{question}</dd>
                </div>
              ))}
            </dl>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
