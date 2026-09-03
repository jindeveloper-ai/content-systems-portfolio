import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  createThemeStore,
  isTheme,
  readTheme,
  rememberTheme,
  resolveTheme,
  themeStorageKey,
} from '../lib/theme.ts';

const read = (file) =>
  readFileSync(new URL('../' + file, import.meta.url), 'utf8');

test('saved theme wins and first visit follows the system setting', () => {
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('dark', false), 'dark');
  assert.equal(resolveTheme(null, true), 'dark');
  assert.equal(resolveTheme(null, false), 'light');
  for (const invalid of ['black', 'system', '', true, {}, '__proto__']) {
    assert.equal(isTheme(invalid), false);
    assert.equal(resolveTheme(invalid, false), 'light');
  }
});

test('theme preference survives a visit and storage failures have safe fallbacks', () => {
  const preferences = new Map();
  assert.equal(
    rememberTheme('dark', (value) => preferences.set(themeStorageKey, value)),
    true,
  );
  assert.equal(
    readTheme(
      () => preferences.get(themeStorageKey),
      () => false,
    ),
    'dark',
  );
  assert.equal(
    readTheme(
      () => {
        throw new Error('Storage blocked');
      },
      () => true,
    ),
    'dark',
  );
  assert.equal(
    readTheme(
      () => null,
      () => {
        throw new Error('Media query unavailable');
      },
    ),
    'light',
  );
  assert.equal(
    rememberTheme('light', () => {
      throw new Error('Quota exceeded');
    }),
    false,
  );
});

test('system changes apply until the visitor makes an explicit choice', () => {
  let systemPrefersDark = false;
  let systemListener = () => {};
  let stopped = 0;
  let saved = null;
  const store = createThemeStore(
    () => resolveTheme(saved, systemPrefersDark),
    (value) => {
      saved = value;
    },
    (listener) => {
      systemListener = listener;
      return () => stopped++;
    },
  );

  assert.equal(store.getSnapshot(), 'light');
  let updates = 0;
  const unsubscribe = store.subscribe(() => updates++);
  systemPrefersDark = true;
  systemListener();
  assert.equal(store.getSnapshot(), 'dark');
  assert.equal(updates, 1);

  store.select('light');
  assert.equal(store.getSnapshot(), 'light');
  assert.equal(saved, 'light');
  assert.equal(updates, 2);
  systemPrefersDark = false;
  systemListener();
  assert.equal(updates, 2);
  store.select('sepia');
  assert.equal(store.getSnapshot(), 'light');

  unsubscribe();
  assert.equal(stopped, 1);
});

test('theme controls are accessible, local-only, and do not remount page content', () => {
  const provider = read('components/theme-provider.tsx');
  const layout = read('app/layout.tsx');
  const shell = read('components/site-shell.tsx');
  assert.ok(provider.includes('aria-pressed'));
  assert.ok(provider.includes("selectTheme('light')"));
  assert.ok(provider.includes("selectTheme('dark')"));
  assert.ok(provider.includes('prefers-color-scheme: dark'));
  assert.ok(provider.includes('document.documentElement.dataset.theme'));
  assert.ok(provider.includes('window.localStorage'));
  assert.ok(layout.includes('<ThemeProvider>'));
  assert.ok(shell.includes('<ThemeSwitcher />'));
  assert.doesNotMatch(
    provider,
    /fetch\(|XMLHttpRequest|WebSocket|location\.(reload|href)|key=\{theme\}|dangerouslySetInnerHTML/,
  );
});

test('both palettes use shared color tokens and retain a system fallback', () => {
  const css = read('app/globals.css');
  assert.ok(css.includes("[data-theme='dark']"));
  assert.ok(css.includes('@media (prefers-color-scheme: dark)'));
  assert.ok(css.includes(':root:not([data-theme])'));
  for (const token of [
    '--background',
    '--foreground',
    '--surface',
    '--surface-muted',
    '--border',
    '--muted-foreground',
    '--primary',
  ]) {
    assert.ok(css.includes(token + ':'), token);
    assert.ok(css.includes('var(' + token + ')'), token);
  }
});
