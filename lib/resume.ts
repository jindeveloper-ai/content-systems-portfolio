import type { Locale } from './i18n';

export interface ResumeAsset {
  href: string;
  filename: string;
  label: string;
  sizeLabel: string;
}

export const resumeAssets: Record<Locale, ResumeAsset> = {
  ko: {
    href: '/resume/su-jin-lee-resume-ko.pdf',
    filename: 'su-jin-lee-resume-ko.pdf',
    label: '한국어 레쥬메',
    sizeLabel: '51 KB',
  },
  en: {
    href: '/resume/su-jin-lee-resume-en.pdf',
    filename: 'su-jin-lee-resume-en.pdf',
    label: '영문 레쥬메',
    sizeLabel: '36 KB',
  },
};

export const contactLinks = {
  email: 'mailto:su.jin.lee.developer@gmail.com',
  linkedin: 'https://www.linkedin.com/in/su-jin-lee-169606375/',
  github: 'https://github.com/jindeveloper-ai',
};
