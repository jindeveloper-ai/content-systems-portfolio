import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resumeAssets } from '../lib/resume.ts';

test('each language resolves to the exact approved, small original PDF', () => {
  const approved = {
    ko: 'a2ba10885b970e291607d88561e58eb4c9c96eeb25ddbbe8b9a422b0509fed84',
    en: '130a8ecd0553c4dac8751813d913bd3e39d1e72e379c03d70e7d5e90da20f2a7',
  };
  assert.deepEqual(Object.keys(resumeAssets).sort(), ['en', 'ko']);
  for (const [locale, asset] of Object.entries(resumeAssets)) {
    assert.equal(asset.href, '/resume/' + asset.filename);
    assert.ok(asset.filename.endsWith('-' + locale + '.pdf'));
    const data = readFileSync(
      new URL('../public' + asset.href, import.meta.url),
    );
    assert.equal(data.subarray(0, 5).toString(), '%PDF-');
    assert.ok(data.length < 100_000);
    assert.equal(
      createHash('sha256').update(data).digest('hex'),
      approved[locale],
    );
  }
});
