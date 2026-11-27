import { expect, test } from 'vitest';
import {
  MdgError,
  formatAriary,
  formatDate,
  formatPhone,
  spell,
  tryParseAriary,
  tryParsePhone,
} from '../src/index.ts';

const TWENTY_ONE = 21;
const TWENTY_ONE_IN_WORDS = 'iraika amby roapolo';
const SAMPLE_AMOUNT = 1500;
const SAMPLE_DATE = '2026-11-23';

test('re-exports number words', () => {
  expect(spell(TWENTY_ONE)).toBe(TWENTY_ONE_IN_WORDS);
});

test('re-exports phone formatting', () => {
  expect(formatPhone('0341234567', 'e164')).toBe('+261341234567');
});

test('re-exports ariary formatting', () => {
  expect(formatAriary(SAMPLE_AMOUNT)).toBe('Ar\u00a01\u00a0500');
});

test('re-exports date formatting', () => {
  expect(formatDate(SAMPLE_DATE, 'full')).toBe('Alatsinainy 23 Novambra 2026');
});

test('recognises errors from every module with one MdgError', () => {
  expect(() => spell(-1)).toThrow(MdgError);
  expect(() => formatPhone('x', 'e164')).toThrow(MdgError);
  expect(() => formatAriary(-1)).toThrow(MdgError);
  expect(() => formatDate('2026-02-30')).toThrow(MdgError);
});

test('re-exports the non-throwing parsers', () => {
  expect(tryParsePhone('034 12 345 67')?.e164).toBe('+261341234567');
  expect(tryParseAriary('Ar 1 500')).toBe(SAMPLE_AMOUNT);
});
