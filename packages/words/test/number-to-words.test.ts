import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { numberToWords } from '../src/index.ts';

const BIGINT_INPUT = 12n;
// First integer a number cannot hold exactly next to its neighbours.
const FIRST_UNSAFE_INTEGER = Number.MAX_SAFE_INTEGER + 1;
const WORDS_ONLY = /^[a-z' ]+$/;
const BROKEN_JOIN = / {2}|\b(sy|amby|faingo) \1\b|^ | $/;
const DECIMAL_SEPARATOR = 'faingo';

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
});
