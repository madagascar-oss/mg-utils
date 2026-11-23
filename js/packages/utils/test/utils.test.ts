import { expect, test } from 'vitest';
import { MgError, formatPhoneNumber, numberToWords } from '../src/index.ts';

test('re-exports number words', () => {
  expect(numberToWords(21)).toBe('iraika amby roapolo');
});

test('re-exports phone formatting', () => {
  expect(formatPhoneNumber('0341234567', 'e164')).toBe('+261341234567');
});

test('recognises errors from every module with one MgError', () => {
  expect(() => numberToWords(-1)).toThrow(MgError);
  expect(() => formatPhoneNumber('x', 'e164')).toThrow(MgError);
});
