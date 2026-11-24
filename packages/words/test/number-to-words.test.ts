import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { numberToWords } from '../src/index.ts';

// Largest supported input (spec/modules/words/data.yaml limits.max).
const LARGEST_SUPPORTED_NUMBER = 999_999_999_999;
const BIGINT_INPUT = 12n;

describe('numberToWords', () => {
  test('returns words for every supported integer without throwing', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: LARGEST_SUPPORTED_NUMBER }), (value) => {
        expect(numberToWords(value)).toMatch(/^[a-z' ]+$/);
      }),
    );
  });

  test('never repeats a joiner or leaves a double space', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: LARGEST_SUPPORTED_NUMBER }), (value) => {
        expect(numberToWords(value)).not.toMatch(/ {2}|\b(sy|amby) \1\b|^ | $/);
      }),
    );
  });

  test('throws INVALID_TYPE for a bigint, because only numbers are accepted', () => {
    expect(() => numberToWords(BIGINT_INPUT as unknown as number)).toThrow(
      expect.objectContaining({ code: 'INVALID_TYPE' }),
    );
  });
});
