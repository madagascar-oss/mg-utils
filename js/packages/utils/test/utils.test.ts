import { expect, test } from 'vitest';
import { MgError, formatPhoneNumber, numberToWords } from '../src/index.ts';

const TWENTY_ONE = 21;
const TWENTY_ONE_IN_WORDS = 'iraika amby roapolo';

test('re-exports number words', () => {
  expect(numberToWords(TWENTY_ONE)).toBe(TWENTY_ONE_IN_WORDS);
});

test('re-exports phone formatting', () => {
  expect(formatPhoneNumber('0341234567', 'e164')).toBe('+261341234567');
});

test('recognises errors from every module with one MgError', () => {
  expect(() => numberToWords(-1)).toThrow(MgError);
  expect(() => formatPhoneNumber('x', 'e164')).toThrow(MgError);
});
