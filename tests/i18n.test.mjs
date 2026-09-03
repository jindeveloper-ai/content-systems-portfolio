import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import english from '../data/en.json' with { type: 'json' };
import {
  createLocaleStore,
  createTranslator,
  isLocale,
  localeStorageKey,
  normalizeCopy,
  readLocale,
  rememberLocale,
  resolveLocale,
} from '../lib/i18n.ts';

const views = [
  'app/page.tsx',
  'app/work/content-automation/page.tsx',
  'components/site-shell.tsx',
  'components/theme-provider.tsx',
  'components/home-sections.tsx',
  'components/attention-study.tsx',
  'components/evidence-details.tsx',
  'components/workflow-demo.tsx',
];
const read = (file) =>
  readFileSync(new URL('../' + file, import.meta.url), 'utf8');

test('locale store is server-safe to construct and notifies subscribers without requiring storage', () => {
  let readCount = 0;
  const store = createLocaleStore(
    () => {
      readCount++;
      return 'ko';
    },
    () => {
      throw new Error('Storage blocked');
    },
  );
  assert.equal(readCount, 0);
  assert.equal(store.getSnapshot(), 'ko');
  let updates = 0;
  const unsubscribe = store.subscribe(() => updates++);
  store.select('en');
  assert.equal(store.getSnapshot(), 'en');
  assert.equal(updates, 1);
  unsubscribe();
  store.select('ko');
  assert.equal(store.getSnapshot(), 'ko');
  assert.equal(updates, 1);
  store.select('fr');
  assert.equal(store.getSnapshot(), 'ko');
});

test('explicit choice wins; browser language order and regional variants are respected', () => {
  assert.equal(resolveLocale('ko', ['en-US']), 'ko');
  assert.equal(resolveLocale('en', ['ko-KR']), 'en');
  assert.equal(resolveLocale(null, ['ko-KR', 'en-US']), 'ko');
  assert.equal(resolveLocale(null, ['en-GB', 'ko-KR']), 'en');
  assert.equal(resolveLocale(null, ['fr-FR', 'KO-kr']), 'ko');
  assert.equal(resolveLocale(null, ['de-DE']), 'en');
  assert.equal(resolveLocale(null, []), 'en');
  for (const invalid of ['fr', 'constructor', '__proto__', '', true, {}]) {
    assert.equal(isLocale(invalid), false);
    assert.equal(resolveLocale(invalid, ['ko']), 'ko');
  }
});

test('saved language survives a page visit; unavailable storage does not prevent selection', () => {
  const preferences = new Map();
  assert.equal(
    rememberLocale('en', (value) => preferences.set(localeStorageKey, value)),
    true,
  );
  assert.equal(
    readLocale(() => preferences.get(localeStorageKey), ['ko']),
    'en',
  );
  assert.equal(
    readLocale(() => {
      throw new Error('Storage blocked');
    }, ['ko-KR']),
    'ko',
  );
  assert.equal(
    rememberLocale('ko', () => {
      throw new Error('Quota exceeded');
    }),
    false,
  );
});

test('translations preserve original Korean, inline spacing, numbers and unknown identifiers', () => {
  const ko = createTranslator('ko');
  const en = createTranslator('en');
  assert.equal(ko('  소개 '), '  소개 ');
  assert.equal(en('  소개 '), '  About ');
  assert.equal(en(13), 13);
  for (const value of [
    'PASS',
    '/work/content-automation#quality',
    '__proto__',
    'constructor',
  ])
    assert.equal(en(value), value);
  for (const [source, translation] of Object.entries(english)) {
    assert.equal(ko(source), source);
    assert.equal(en(source), translation);
    assert.ok(translation.trim().length > 0, source);
    assert.doesNotMatch(translation, /[가-힣]|<script|https?:\/\//, source);
  }
});

test('all current page, workflow and research copy has an English entry', () => {
  const missing = new Set();
  const files = [
    ...views,
    'app/layout.tsx',
    'app/work/content-automation/layout.tsx',
    'data/case-study.ts',
    'lib/workflow-demo.ts',
  ];
  for (const file of files) {
    const tree = ts.createSourceFile(
      file,
      read(file),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    function visit(node) {
      if (
        (ts.isStringLiteral(node) || ts.isJsxText(node)) &&
        /[가-힣]/.test(node.text)
      ) {
        const source = normalizeCopy(node.text);
        if (!Object.hasOwn(english, source)) missing.add(file + ': ' + source);
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
  }
  assert.deepEqual([...missing], []);
});

test('visible Korean text and accessibility labels are routed through translation', () => {
  for (const file of views) {
    const tree = ts.createSourceFile(
      file,
      read(file),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    function visit(node) {
      if (ts.isJsxText(node))
        assert.equal(
          /[가-힣]/.test(node.text),
          false,
          file + ': untranslated JSX text',
        );
      if (
        ts.isJsxAttribute(node) &&
        node.initializer &&
        ts.isStringLiteral(node.initializer)
      )
        assert.equal(
          /[가-힣]/.test(node.initializer.text),
          false,
          file + ': untranslated attribute',
        );
      ts.forEachChild(node, visit);
    }
    visit(tree);
    assert.ok(read(file).includes('useI18n()'), file);
  }
});

test('language controls are accessible and never reset the workflow or use a translation service', () => {
  const provider = read('components/language-provider.tsx');
  assert.ok(provider.includes('aria-pressed'));
  assert.ok(provider.includes('lang="ko"') && provider.includes('lang="en"'));
  assert.ok(provider.includes('document.documentElement.lang = locale'));
  assert.ok(provider.includes('document.title = t('));
  assert.ok(read('app/layout.tsx').includes('<LanguageProvider>'));
  assert.doesNotMatch(
    provider,
    /fetch\(|XMLHttpRequest|WebSocket|location\.(reload|href)|key=\{locale\}|dangerouslySetInnerHTML/,
  );
  const demo = read('components/workflow-demo.tsx');
  assert.ok(demo.includes('useReducer(transitionDemo, initialDemoState)'));
  assert.doesNotMatch(demo, /key=\{locale\}/);
  assert.ok(
    read('components/evidence-details.tsx').includes(
      "defaultValue={['장면의 완성도']}",
    ),
  );
});
