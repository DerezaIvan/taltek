import assert from 'node:assert/strict';
import test from 'node:test';

import { getDigestRange, getNextRunDate } from './weekly-digest.mjs';

test('Wednesday digest contains submissions from Friday through Tuesday in Moscow time', () => {
  const range = getDigestRange(new Date('2026-09-16T06:00:00.000Z'));

  assert.equal(range.start.toISOString(), '2026-09-10T21:00:00.000Z');
  assert.equal(range.end.toISOString(), '2026-09-15T20:59:59.999Z');
});

test('Friday digest contains submissions from Wednesday through Thursday in Moscow time', () => {
  const range = getDigestRange(new Date('2026-09-18T06:00:00.000Z'));

  assert.equal(range.start.toISOString(), '2026-09-15T21:00:00.000Z');
  assert.equal(range.end.toISOString(), '2026-09-17T20:59:59.999Z');
});

test('manual run before Wednesday dispatch time uses the previous Friday period', () => {
  const range = getDigestRange(new Date('2026-09-16T05:59:59.000Z'));

  assert.equal(range.start.toISOString(), '2026-09-08T21:00:00.000Z');
  assert.equal(range.end.toISOString(), '2026-09-10T20:59:59.999Z');
});

test('next run after Wednesday is Friday at 09:00 Moscow time', () => {
  const nextRun = getNextRunDate(new Date('2026-09-16T06:00:01.000Z'));

  assert.equal(nextRun.toISOString(), '2026-09-18T06:00:00.000Z');
});

test('next run after Friday is Wednesday at 09:00 Moscow time', () => {
  const nextRun = getNextRunDate(new Date('2026-09-18T06:00:01.000Z'));

  assert.equal(nextRun.toISOString(), '2026-09-23T06:00:00.000Z');
});
