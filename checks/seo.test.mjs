import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Run after the production build: checks the actual HTML a crawler receives.
const readBuild = (path) =>
  readFileSync(new URL('../dist/client/' + path, import.meta.url), 'utf8');
const origin = 'https://su-jin-lee-portfolio.pages.dev';
const pages = [
  ['/', 'SU JIN LEE | AI Content Automation Portfolio'],
  ['/about/', 'About SU JIN LEE | Content Systems'],
  [
    '/work/content-automation/',
    'AI Content Automation Case Study | SU JIN LEE',
  ],
];
const tags = (html, name) =>
  [...html.matchAll(new RegExp('<' + name + '\\s[^>]*>', 'g'))].map(([tag]) =>
    Object.fromEntries(
      [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]),
    ),
  );

for (const [path, title] of pages) {
  test('crawler HTML has distinct, indexable metadata: ' + path, () => {
    const html = readBuild(path.slice(1) + 'index.html');
    assert.deepEqual(
      [...html.matchAll(/<title>(.*?)<\/title>/g)].map((m) => m[1]),
      [title],
    );
    const metadata = tags(html, 'meta');
    const descriptions = metadata.filter((tag) => tag.name === 'description');
    assert.equal(descriptions.length, 1);
    assert.ok(descriptions[0].content.length > 50);
    assert.deepEqual(
      metadata.filter((tag) => tag.name === 'robots').map((tag) => tag.content),
      ['index, follow'],
    );
    const links = tags(html, 'link');
    assert.deepEqual(
      links.filter((tag) => tag.rel === 'canonical').map((tag) => tag.href),
      [origin + path],
    );
    assert.ok(links.every((tag) => !tag.hreflang));
    assert.match(html, /<html[^>]*lang="ko"/);
    assert.match(html, /기획/);
    assert.doesNotMatch(html, /<iframe/);
  });
}

test('crawler discovery lists only the three canonical pages, with PDF crawling allowed', () => {
  const robots = readBuild('robots.txt');
  assert.match(robots, /^User-agent: \*\nAllow: \/\n/m);
  assert.doesNotMatch(robots, /Disallow:/i);
  assert.ok(robots.includes('Sitemap: ' + origin + '/sitemap.xml'));
  const sitemap = readBuild('sitemap.xml');
  assert.deepEqual(
    [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]),
    pages.map(([path]) => origin + path),
  );
});

test('static header rules exclude only resumes from indexing and preserve asset caching', () => {
  const headers = readBuild('_headers');
  assert.match(headers, /\/resume\/\*\n\s+X-Robots-Tag: noindex/);
  assert.equal((headers.match(/X-Robots-Tag:/g) ?? []).length, 1);
  assert.match(headers, /Cache-Control: public, max-age=31536000, immutable/);
});
