'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  createTranslator,
  createLocaleStore,
  localeStorageKey,
  readLocale,
  type Locale,
  type Translator,
} from '@/lib/i18n';

interface LanguageContextValue {
  locale: Locale;
  selectLocale: (locale: Locale) => void;
  t: Translator;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // A stable Korean server render keeps static HTML and hydration consistent.
  const [store] = useState(() =>
    createLocaleStore(
      () =>
        readLocale(
          () => window.localStorage.getItem(localeStorageKey),
          navigator.languages,
        ),
      (value) => window.localStorage.setItem(localeStorageKey, value),
    ),
  );
  const locale = useSyncExternalStore<Locale>(
    store.subscribe,
    store.getSnapshot,
    () => 'ko',
  );
  const originalMetadata = useRef<{
    title: string;
    description: string | null;
  } | null>(null);

  const t = useMemo(() => createTranslator(locale), [locale]);

  useEffect(() => {
    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    originalMetadata.current ??= {
      title: document.title,
      description: description?.content ?? null,
    };
    document.documentElement.lang = locale;
    document.title = t(originalMetadata.current.title);
    if (description && originalMetadata.current.description)
      description.content = t(originalMetadata.current.description);
  }, [locale, t]);

  function selectLocale(next: Locale) {
    store.select(next);
  }

  return (
    <LanguageContext.Provider value={{ locale, selectLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('LanguageProvider is required');
  return context;
}

export function LanguageSwitcher() {
  const { locale, selectLocale, t } = useI18n();
  return (
    <fieldset className="language-switcher" aria-label={t('언어 선택')}>
      <button
        type="button"
        lang="ko"
        aria-label="한국어"
        aria-pressed={locale === 'ko'}
        onClick={() => selectLocale('ko')}
      >
        KO
      </button>
      <button
        type="button"
        lang="en"
        aria-label="English"
        aria-pressed={locale === 'en'}
        onClick={() => selectLocale('en')}
      >
        EN
      </button>
    </fieldset>
  );
}
