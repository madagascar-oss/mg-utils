import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import {
  MdgError,
  OPERATOR_NAMES,
  formatPhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumber,
  safeParsePhoneNumber,
  tryParsePhoneNumber,
  type PhoneNumberFormat,
} from '../src/index.ts';

// Fuzzing: input sizes well past the 32-character limit, and enough runs to hit edge cases.
const FUZZ_MAX_INPUT_LENGTH = 64;
const FUZZ_RUNS = 2000;

const validNationalNumber = fc
  .tuple(fc.constantFrom('32', '33', '34', '37', '38', '39'), fc.stringMatching(/^\d{7}$/))
  .map(([prefix, rest]) => `${prefix}${rest}`);

describe('parsePhoneNumber fuzzing', () => {
  test('throws only MdgError for any string input', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: FUZZ_MAX_INPUT_LENGTH }), (input) => {
        const result = safeParsePhoneNumber(input);
        expect(result.success || result.error instanceof MdgError).toBe(true);
      }),
      { numRuns: FUZZ_RUNS },
    );
  });

  test('reads back every format it writes', () => {
    fc.assert(
      fc.property(
        validNationalNumber,
        fc.constantFrom<PhoneNumberFormat[]>('e164', 'international', 'national'),
        (nationalNumber, format) => {
          const written = formatPhoneNumber(`0${nationalNumber}`, format);
          expect(parsePhoneNumber(written).nationalNumber).toBe(nationalNumber);
        },
      ),
    );
  });

  test('isValidPhoneNumber agrees with safeParsePhoneNumber', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), validNationalNumber, fc.anything()), (input) => {
        expect(isValidPhoneNumber(input)).toBe(safeParsePhoneNumber(input).success);
      }),
    );
  });
});

describe('tryParsePhoneNumber', () => {
  test('returns the parsed number for valid input', () => {
    expect(tryParsePhoneNumber('034 12 345 67')?.operator).toBe('telma');
  });

  test('returns undefined instead of throwing', () => {
    expect(tryParsePhoneNumber('035 12 345 67')).toBeUndefined();
  });

  test('agrees with safeParsePhoneNumber for any input', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), validNationalNumber, fc.anything()), (input) => {
        const result = safeParsePhoneNumber(input);
        expect(tryParsePhoneNumber(input)).toEqual(result.success ? result.data : undefined);
      }),
    );
  });
});

describe('OPERATOR_NAMES', () => {
  test('names the operator of a parsed number', () => {
    expect(OPERATOR_NAMES[parsePhoneNumber('034 12 345 67').operator]).toBe('Telma');
  });
});
