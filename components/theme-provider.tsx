'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { Moon, Sun } from 'lucide-react';
import { useI18n } from '@/components/language-provider';
import {
  createThemeStore,
  readTheme,
  themeStorageKey,
  type Theme,
} from '@/lib/theme';

interface ThemeContextValue {
  theme: Theme;
  selectTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function subscribeToSystemTheme(listener: () => void) {
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() =>
    createThemeStore(
      () =>
        readTheme(
          () => window.localStorage.getItem(themeStorageKey),
          () => window.matchMedia('(prefers-color-scheme: dark)').matches,
        ),
      (value) => window.localStorage.setItem(themeStorageKey, value),
      subscribeToSystemTheme,
    ),
  );
  const theme = useSyncExternalStore<Theme>(
    store.subscribe,
    store.getSnapshot,
    () => 'light',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, selectTheme: store.select }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('ThemeProvider is required');
  return context;
}

export function ThemeSwitcher() {
  const { theme, selectTheme } = useTheme();
  const { t } = useI18n();
  return (
    <fieldset className="theme-switcher" aria-label={t('화면 모드 선택')}>
      <button
        type="button"
        aria-pressed={theme === 'light'}
        aria-label={t('화이트')}
        title={t('화이트')}
        onClick={() => selectTheme('light')}
      >
        <Sun size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-pressed={theme === 'dark'}
        aria-label={t('블랙')}
        title={t('블랙')}
        onClick={() => selectTheme('dark')}
      >
        <Moon size={16} aria-hidden="true" />
      </button>
    </fieldset>
  );
}
