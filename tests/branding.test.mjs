import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

test('approved SEO titles retain the visible Content Systems branding', () => {
  const layout = readFileSync(
    new URL('../app/layout.tsx', import.meta.url),
    'utf8',
  );
  const detail = readFileSync(
    new URL('../app/work/content-automation/layout.tsx', import.meta.url),
    'utf8',
  );
  const shell = readFileSync(
    new URL('../components/site-shell.tsx', import.meta.url),
    'utf8',
  );
  assert.ok(
    layout.includes("title: 'SU JIN LEE | AI Content Automation Portfolio'"),
  );
  assert.ok(detail.includes('AI Content Automation Case Study | SU JIN LEE'));
  assert.ok(shell.includes('Content Systems 홈'));
  assert.doesNotMatch(layout + detail + shell, /portpolio/);
});

test('favicon is an inline SJ monogram with a fresh browser cache key', () => {
  const icon = readFileSync(
    new URL('../public/favicon.svg', import.meta.url),
    'utf8',
  );
  const layout = readFileSync(
    new URL('../app/layout.tsx', import.meta.url),
    'utf8',
  );
  assert.ok(icon.includes('>SJ</text>'));
  assert.ok(layout.includes('/favicon.svg?v=sj-1'));
  assert.doesNotMatch(icon, /<script|<image|<foreignObject|\bon\w+=|\bhref=/i);
});

test('published portfolio content contains no academic background claims', () => {
  for (const folder of ['app', 'components', 'data', 'public']) {
    for (const file of readdirSync(new URL('../' + folder, import.meta.url), {
      recursive: true,
      withFileTypes: true,
    })) {
      if (
        !file.isFile() ||
        !/\.(tsx?|css|json|mjs|txt|md|svg|vtt)$/.test(file.name)
      )
        continue;
      const text = readFileSync(file.parentPath + '/' + file.name, 'utf8');
      assert.doesNotMatch(
        text,
        /전공|신구|영상디자인|전문학사|학사|3년제|대학교/,
        file.name,
      );
    }
  }
});
