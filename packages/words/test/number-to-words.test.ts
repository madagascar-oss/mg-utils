import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { numberToWords } from '../src/index.ts';

const BIGINT_INPUT = 12n;
// First integer a number cannot hold exactly next to its neighbours.
const FIRST_UNSAFE_INTEGER = Number.MAX_SAFE_INTEGER + 1;
const WORDS_ONLY = /^[a-z' ]+$/;
const BROKEN_JOIN = / {2}|\b(sy|amby|faingo) \1\b|^ | $/;
const DECIMAL_SEPARATOR = 'faingo';

const TRADITIONAL = { system: 'traditional' } as const;
// Extra zeros added around decimal text, well within the 100-character limit.
const TEXT_PADDING = 20;
// Below 10 000 both systems write the same words (spec rule 12).
const FIRST_DIFFERENT_POWER = 10_000;
const TRADITIONAL_NAMES =
  /(alina|hetsy|tapitrisa|safatsiroa|tsitamboisa|lavitrisa|alinkisa|tsipesimpesenina|tsitokotsiforohana|tsihitanoanoa)(faharoa)?$/;
// A tens or hundreds word right before a name: a count above 9, which rule 12 never writes.
const COUNT_ABOVE_NINE = /(polo|folo|zato|jato|arivo) \S+$/;

const supportedIntegers = fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER });
const supportedNumbers = fc.oneof(
  supportedIntegers,
  fc.double({ min: 0, max: Number.MAX_SAFE_INTEGER, noNaN: true }),
);

describe('numberToWords', () => {
  test('returns words for every supported number without throwing', () => {
    fc.assert(
      fc.property(supportedNumbers, (value) => {
        expect(numberToWords(value)).toMatch(WORDS_ONLY);
      }),
    );
  });

  test('never repeats a joiner or leaves a double space', () => {
    fc.assert(
      fc.property(supportedNumbers, (value) => {
        expect(numberToWords(value)).not.toMatch(BROKEN_JOIN);
      }),
    );
  });

  test('says faingo exactly when the number has decimals', () => {
    fc.assert(
      fc.property(supportedNumbers, (value) => {
        expect(numberToWords(value).includes(DECIMAL_SEPARATOR)).toBe(!Number.isInteger(value));
      }),
    );
  });

  test('throws OUT_OF_RANGE above Number.MAX_SAFE_INTEGER', () => {
    expect(() => numberToWords(FIRST_UNSAFE_INTEGER)).toThrow(
      expect.objectContaining({ code: 'OUT_OF_RANGE' }),
    );
  });

  test('throws INVALID_TYPE for a bigint, because only numbers are accepted', () => {
    expect(() => numberToWords(BIGINT_INPUT as unknown as number)).toThrow(
      expect.objectContaining({ code: 'INVALID_TYPE' }),
    );
  });

  test('in the traditional system, returns words for every supported number', () => {
    fc.assert(
      fc.property(supportedNumbers, (value) => {
        const words = numberToWords(value, TRADITIONAL);
        expect(words).toMatch(WORDS_ONLY);
        expect(words).not.toMatch(BROKEN_JOIN);
      }),
    );
  });

  test('both systems write the same words below 10 000', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: FIRST_DIFFERENT_POWER - 1 }), (value) => {
        expect(numberToWords(value, TRADITIONAL)).toBe(numberToWords(value));
      }),
    );
  });

  test('in the traditional system, every power of ten takes a single digit', () => {
    fc.assert(
      fc.property(supportedIntegers, (value) => {
        const groups = numberToWords(value, TRADITIONAL).split(' sy ');
        for (const group of groups.filter((part) => TRADITIONAL_NAMES.test(part))) {
          expect(group).not.toMatch(COUNT_ABOVE_NINE);
        }
      }),
    );
  });

  test('throws INVALID_TYPE when the options are not an object', () => {
    expect(() => numberToWords(1, null as unknown as object)).toThrow(
      expect.objectContaining({ code: 'INVALID_TYPE' }),
    );
  });

  test('reads decimal text the same as the number it writes', () => {
    fc.assert(
      fc.property(supportedIntegers, (value) => {
        expect(numberToWords(String(value))).toBe(numberToWords(value));
      }),
    );
  });

  test('ignores trailing decimal zeros and leading whole zeros in text', () => {
    fc.assert(
      fc.property(supportedIntegers, fc.nat({ max: TEXT_PADDING }), (value, padding) => {
        const padded = `${'0'.repeat(padding)}${String(value)}.${'0'.repeat(padding + 1)}`;
        expect(numberToWords(padded)).toBe(numberToWords(value));
      }),
    );
  });
});
