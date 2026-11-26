import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import {
  MgError,
  ariaryToFmg,
  formatAriary,
  parseAriary,
  safeParseAriary,
  tryParseAriary,
  type AriaryFormatOptions,
} from '../src/index.ts';

// The spec sets no max: amounts stop where a number stops being exact.
const LARGEST_SUPPORTED_AMOUNT = Number.MAX_SAFE_INTEGER;
// 9 007 199 254 740 992 is the first integer a number cannot tell from its neighbour.
const FIRST_UNSAFE_AMOUNT_TEXT = '9 007 199 254 740 992';
const FRANCS_PER_ARIARY = 5;
const FIRST_AMOUNT_TOO_LARGE_IN_FRANCS =
  Math.floor(LARGEST_SUPPORTED_AMOUNT / FRANCS_PER_ARIARY) + 1;
const FUZZ_MAX_INPUT_LENGTH = 40;
const MAX_INPUT_LENGTH = 32;
const FUZZ_RUNS = 2000;
const SAMPLE_AMOUNT = 1500;

const layouts = fc
  .record({
    grouping: fc.constantFrom<NonNullable<AriaryFormatOptions['grouping']>>(
      'space',
      'dot',
      'comma',
    ),
    decimal: fc.constantFrom<NonNullable<AriaryFormatOptions['decimal']>>('comma', 'dot'),
    symbolPosition: fc.constantFrom<NonNullable<AriaryFormatOptions['symbolPosition']>>(
      'before',
      'after',
    ),
  })
  .filter(({ grouping, decimal }) => grouping !== decimal);
const amounts = fc.oneof(
  fc.integer({ min: 0, max: LARGEST_SUPPORTED_AMOUNT }),
  fc.double({ min: 0, max: LARGEST_SUPPORTED_AMOUNT, noNaN: true }),
);

describe('formatAriary and parseAriary', () => {
  test('reads back every amount it writes, whole or decimal, in every layout', () => {
    fc.assert(
      fc.property(amounts, layouts, (amount, { grouping, decimal, symbolPosition }) => {
        const text = formatAriary(amount, { grouping, decimal, symbolPosition });
        // Reading stops at 32 characters (ADR 0004); 5e-324 formats to over 300.
        fc.pre(text.length <= MAX_INPUT_LENGTH);
        expect(parseAriary(text, { grouping, decimal })).toBe(amount);
      }),
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

describe('limits', () => {
  test('parseAriary throws OUT_OF_RANGE above Number.MAX_SAFE_INTEGER', () => {
    expect(() => parseAriary(FIRST_UNSAFE_AMOUNT_TEXT)).toThrow(
      expect.objectContaining({ code: 'OUT_OF_RANGE' }),
    );
  });

  test('ariaryToFmg throws OUT_OF_RANGE when the francs would not be exact', () => {
    expect(() => ariaryToFmg(FIRST_AMOUNT_TOO_LARGE_IN_FRANCS)).toThrow(
      expect.objectContaining({ code: 'OUT_OF_RANGE' }),
    );
  });
});

describe('tryParseAriary', () => {
  test('returns the amount for valid text', () => {
    expect(tryParseAriary('1.500 Ar')).toBe(SAMPLE_AMOUNT);
  });

  test('returns undefined instead of throwing', () => {
    expect(tryParseAriary('1.5')).toBeUndefined();
  });

  test('agrees with safeParseAriary for any input', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.string({ maxLength: FUZZ_MAX_INPUT_LENGTH }), fc.anything()),
        (text) => {
          const result = safeParseAriary(text);
          expect(tryParseAriary(text)).toBe(result.success ? result.data : undefined);
        },
      ),
    );
  });
});
