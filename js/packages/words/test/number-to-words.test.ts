import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { numberToWords } from '../src/index.ts';

describe('numberToWords', () => {
  test('returns words for every supported integer without throwing', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 999_999_999_999 }), (value) => {
        expect(numberToWords(value)).toMatch(/^[a-z' ]+$/);
      }),
    );
  });

  test('never repeats a joiner or leaves a double space', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 999_999_999_999 }), (value) => {
        expect(numberToWords(value)).not.toMatch(/ {2}|\b(sy|amby) \1\b|^ | $/);
      }),
    );
  });

  test('throws INVALID_TYPE for a bigint, because only numbers are accepted', () => {
    expect(() => numberToWords(12n as unknown as number)).toThrow(
      expect.objectContaining({ code: 'INVALID_TYPE' }),
    );
  });
});
