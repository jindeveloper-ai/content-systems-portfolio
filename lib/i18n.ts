import english from '../data/en.json' with { type: 'json' };

export type Locale = 'ko' | 'en';
export const localeStorageKey = 'content-systems-language';

export function isLocale(value: unknown): value is Locale {
  return value === 'ko' || value === 'en';
}

export function resolveLocale(
  saved: unknown,
  languages: readonly string[],
): Locale {
  if (isLocale(saved)) return saved;
  for (const language of languages) {
    const base = language.toLowerCase().split('-')[0];
    if (isLocale(base)) return base;
  }
  return 'en';
}

export function readLocale(
  read: () => unknown,
  languages: readonly string[],
): Locale {
  try {
    return resolveLocale(read(), languages);
  } catch {
    return resolveLocale(null, languages);
  }
}

export function rememberLocale(
  locale: Locale,
  write: (value: Locale) => void,
): boolean {
  try {
    write(locale);
    return true;
  } catch {
    // Switching still works when the browser blocks preference storage.
    return false;
  }
}

export function normalizeCopy(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function createLocaleStore(
  read: () => Locale,
  write: (value: Locale) => void,
) {
  let selected: Locale | null = null;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => selected ?? read(),
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    select: (next: Locale) => {
      if (!isLocale(next)) return;
      selected = next;
      rememberLocale(next, write);
      for (const listener of listeners) listener();
    },
  };
}

export interface Translator {
  (value: string): string;
  (value: number): number;
}

export function createTranslator(locale: Locale): Translator {
  function translate(value: string): string;
  function translate(value: number): number;
  function translate(value: string | number): string | number {
    if (locale === 'ko' || typeof value === 'number') return value;
    const key = normalizeCopy(value);
    if (!Object.hasOwn(english, key)) return value;
    const translated = english[key as keyof typeof english];
    // Preserve spaces around inline elements without translating markup or URLs.
    return (
      (value.match(/^\s+/)?.[0] ?? '') +
      translated +
      (value.match(/\s+$/)?.[0] ?? '')
    );
  }
  return translate;
}
