export type Theme = 'light' | 'dark';

export const themeStorageKey = 'content-systems-theme';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

export function resolveTheme(
  saved: unknown,
  systemPrefersDark: boolean,
): Theme {
  if (isTheme(saved)) return saved;
  return systemPrefersDark ? 'dark' : 'light';
}

export function readTheme(
  read: () => unknown,
  systemPrefersDark: () => boolean,
): Theme {
  let prefersDark = false;
  try {
    prefersDark = systemPrefersDark();
  } catch {
    // Light is the safe fallback when the browser cannot expose this setting.
  }
  try {
    return resolveTheme(read(), prefersDark);
  } catch {
    return resolveTheme(null, prefersDark);
  }
}

export function rememberTheme(
  theme: Theme,
  write: (value: Theme) => void,
): boolean {
  try {
    write(theme);
    return true;
  } catch {
    // The selected theme still applies when preference storage is unavailable.
    return false;
  }
}

export function createThemeStore(
  read: () => Theme,
  write: (value: Theme) => void,
  subscribeToSystem: (listener: () => void) => () => void,
) {
  let selected: Theme | null = null;
  let stopSystemSubscription: (() => void) | null = null;
  const listeners = new Set<() => void>();

  function notify() {
    for (const listener of listeners) listener();
  }

  return {
    getSnapshot: () => selected ?? read(),
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      stopSystemSubscription ??= subscribeToSystem(() => {
        if (selected === null) notify();
      });
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          stopSystemSubscription?.();
          stopSystemSubscription = null;
        }
      };
    },
    select: (next: Theme) => {
      if (!isTheme(next) || next === selected) return;
      selected = next;
      rememberTheme(next, write);
      notify();
    },
  };
}
