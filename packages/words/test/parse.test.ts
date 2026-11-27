import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { parseWords, safeParseWords, spell, tryParseWords } from '../src/index.ts';

const TWO_THOUSAND = 2000;
// Past the 4096-character limit.
const TOO_LONG_REPEATS = 1100;
const TOO_LONG = 'roa '.repeat(TOO_LONG_REPEATS);
// Both 25 000 000 000 000 000 and 20 000 005 000 000 000 are written so (spec rule 15).
const AMBIGUOUS_WORDS = 'dimy amby roapolo tapitrisa lavitrisa';
const ABOVE_SAFE_WORDS = 'iray lavitrisa lavitrisa';
const ABOVE_SAFE_TEXT = '1000000000000000000';
const SYSTEMS = ['standard', 'traditional'] as const;

const supportedNumbers = fc.oneof(
  fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }),
  fc.double({ min: 0, max: Number.MAX_SAFE_INTEGER, noNaN: true }),
);

describe('parseWords', () => {
  test('reads back every number spell writes, in both systems', () => {
    fc.assert(
      fc.property(supportedNumbers, fc.constantFrom(...SYSTEMS), (value, system) => {
        expect(parseWords(spell(value, { system }))).toBe(value);
      }),
    );
  });

  test('gives the exact digits as text', () => {
    expect(parseWords(ABOVE_SAFE_WORDS, { as: 'text' })).toBe(ABOVE_SAFE_TEXT);
  });

  test('throws PRECISION_LOSS instead of rounding', () => {
    expect(() => parseWords(ABOVE_SAFE_WORDS)).toThrow(
      expect.objectContaining({ code: 'PRECISION_LOSS' }),
    );
  });

  test('throws AMBIGUOUS when two numbers share the words', () => {
    expect(() => parseWords(AMBIGUOUS_WORDS)).toThrow(
      expect.objectContaining({ code: 'AMBIGUOUS' }),
    );
  });

  test.each([
    ['two decimal words', 'iray faingo roa faingo telo'],
    ['only zeros after faingo', 'iray faingo aotra'],
    ['a joiner at the end', 'roa amby'],
    ['a group without its count', 'roa sy amby arivo'],
  ])('rejects %s with INVALID_FORMAT', (_name, words) => {
    expect(() => parseWords(words)).toThrow(expect.objectContaining({ code: 'INVALID_FORMAT' }));
  });

  test('rejects text longer than the limit', () => {
    expect(() => parseWords(TOO_LONG)).toThrow(expect.objectContaining({ code: 'INVALID_FORMAT' }));
  });

  test.each([null, { as: 'bigint' }, { system: 'standard' }])(
    'rejects options %j with INVALID_TYPE',
    (options) => {
      expect(() => parseWords('roa', options as never)).toThrow(
        expect.objectContaining({ code: 'INVALID_TYPE' }),
      );
    },
  );
});

describe('safeParseWords and tryParseWords', () => {
  test('return the value without throwing', () => {
    expect(safeParseWords('roa arivo')).toEqual({ success: true, data: TWO_THOUSAND });
    expect(tryParseWords('roa arivo')).toBe(TWO_THOUSAND);
  });

  test('tryParseWords gives undefined for words it cannot read', () => {
    expect(tryParseWords('roa sy')).toBeUndefined();
  });
});
