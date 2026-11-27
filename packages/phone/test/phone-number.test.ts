import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import {
  MdgError,
  OPERATOR_NAMES,
  formatPhone,
  isValidPhone,
  parsePhone,
  safeParsePhone,
  tryParsePhone,
  type PhoneNumberFormat,
} from '../src/index.ts';

// Fuzzing: input sizes well past the 32-character limit, and enough runs to hit edge cases.
const FUZZ_MAX_INPUT_LENGTH = 64;
const FUZZ_RUNS = 2000;

const validNationalNumber = fc
  .tuple(fc.constantFrom('32', '33', '34', '37', '38', '39'), fc.stringMatching(/^\d{7}$/))
  .map(([prefix, rest]) => `${prefix}${rest}`);

describe('parsePhone fuzzing', () => {
  test('throws only MdgError for any string input', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: FUZZ_MAX_INPUT_LENGTH }), (input) => {
        const result = safeParsePhone(input);
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
          const written = formatPhone(`0${nationalNumber}`, format);
          expect(parsePhone(written).nationalNumber).toBe(nationalNumber);
        },
      ),
    );
  });

  test('isValidPhone agrees with safeParsePhone', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), validNationalNumber, fc.anything()), (input) => {
        expect(isValidPhone(input)).toBe(safeParsePhone(input).success);
      }),
    );
  });
});

describe('tryParsePhone', () => {
  test('returns the parsed number for valid input', () => {
    expect(tryParsePhone('034 12 345 67')?.operator).toBe('yas');
    expect(tryParsePhone('035 12 345 67')?.operator).toBe('airtel');
  });

  test('returns undefined instead of throwing', () => {
    expect(tryParsePhone('031 12 345 67')).toBeUndefined();
  });

  test('agrees with safeParsePhone for any input', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), validNationalNumber, fc.anything()), (input) => {
        const result = safeParsePhone(input);
        expect(tryParsePhone(input)).toEqual(result.success ? result.data : undefined);
      }),
    );
  });
});

describe('OPERATOR_NAMES', () => {
  test('names the operator of a parsed number', () => {
    expect(OPERATOR_NAMES[parsePhone('034 12 345 67').operator]).toBe('Yas Madagascar');
  });
});
