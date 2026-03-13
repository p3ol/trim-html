import fsp from 'node:fs/promises';
import path from 'node:path';

import { test, expect } from 'vitest';

import { trimHtml } from '.';

const getFixture = async (name: string) => (await fsp.readFile(
  path.resolve(`./tests/fixtures/${name}`),
  'utf-8'
)).trim();

test('should work with basic input', async () => {
  expect(trimHtml(
    await getFixture('inputs/1.html'),
    { limit: 500 }
  ).html).toBe(await getFixture('outputs/1.html'));

  expect(trimHtml(
    await getFixture('inputs/2.html'),
    { limit: 500 }
  ).html).toBe(await getFixture('outputs/2.html'));
});

test('should strip invalid input', async () => {
  expect(trimHtml(
    await getFixture('inputs/invalid.html'),
    { limit: 500 }
  ).html).toBe(await getFixture('outputs/invalid.html'));
});

test('should allow word break if specified', () => {
  expect(trimHtml(
    '<div>test test test</div>',
    { wordBreak: false, limit: 6 }
  ).html).toBe('<div>test test...</div>');

  expect(trimHtml(
    '<div>test test test</div>',
    { wordBreak: true, limit: 6 }
  ).html).toBe('<div>test t...</div>');
});

test('should allow utf8 special spaces like 、 and 。', async () => {
  expect(trimHtml(
    await getFixture('inputs/han.html'),
    { limit: 10, wordBreak: true }
  ).html).toBe(await getFixture('outputs/han.html'));
});
