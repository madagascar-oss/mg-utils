import { expect, test } from 'vitest';
import {
  MgError,
  formatAriary,
  formatDate,
  formatPhoneNumber,
  numberToWords,
} from '../src/index.ts';

const TWENTY_ONE = 21;
const TWENTY_ONE_IN_WORDS = 'iraika amby roapolo';
const SAMPLE_AMOUNT = 1500;
const SAMPLE_DATE = '2026-11-23';

test('re-exports number words', () => {
  expect(numberToWords(TWENTY_ONE)).toBe(TWENTY_ONE_IN_WORDS);
});

test('re-exports phone formatting', () => {
  expect(formatPhoneNumber('0341234567', 'e164')).toBe('+261341234567');
});

test('re-exports ariary formatting', () => {
  expect(formatAriary(SAMPLE_AMOUNT)).toBe('Ar\u00a01\u00a0500');
});

test('re-exports date formatting', () => {
  expect(formatDate(SAMPLE_DATE, 'full')).toBe('Alatsinainy 23 Novambra 2026');
});

test('recognises errors from every module with one MgError', () => {
  expect(() => numberToWords(-1)).toThrow(MgError);
  expect(() => formatPhoneNumber('x', 'e164')).toThrow(MgError);
  expect(() => formatAriary(-1)).toThrow(MgError);
  expect(() => formatDate('2026-02-30')).toThrow(MgError);
});
