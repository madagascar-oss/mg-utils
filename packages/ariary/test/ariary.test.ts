import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import {
  MgError,
  formatAriary,
  parseAriary,
  safeParseAriary,
  type AriaryFormatOptions,
} from '../src/index.ts';

// Largest supported amount (spec/modules/ariary/data.yaml limits.max).
const LARGEST_SUPPORTED_AMOUNT = 999_999_999_999;
const FUZZ_MAX_INPUT_LENGTH = 40;
const FUZZ_RUNS = 2000;
const SAMPLE_AMOUNT = 1500;

const layouts = fc.record({
  grouping: fc.constantFrom<NonNullable<AriaryFormatOptions['grouping']>>('space', 'dot'),
  symbolPosition: fc.constantFrom<NonNullable<AriaryFormatOptions['symbolPosition']>>(
    'before',
    'after',
  ),
});

describe('formatAriary and parseAriary', () => {
  test('reads back every amount it writes, in every layout', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: LARGEST_SUPPORTED_AMOUNT }),
        layouts,
        (amount, options) => {
          expect(parseAriary(formatAriary(amount, options))).toBe(amount);
        },
      ),
    );
  });

  test('throws only MgError for any string input', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: FUZZ_MAX_INPUT_LENGTH }), (text) => {
        const result = safeParseAriary(text);
        expect(result.success || result.error instanceof MgError).toBe(true);
      }),
      { numRuns: FUZZ_RUNS },
    );
  });

  test('throws INVALID_TYPE when options is not an object', () => {
    expect(() => formatAriary(SAMPLE_AMOUNT, null as unknown as AriaryFormatOptions)).toThrow(
      expect.objectContaining({ code: 'INVALID_TYPE' }),
    );
  });
});
