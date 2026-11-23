import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import {
  MgError,
  OPERATOR_NAMES,
  formatPhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumber,
  safeParsePhoneNumber,
  type PhoneNumberFormat,
} from '../src/index.ts';

const validNationalNumber = fc
  .tuple(fc.constantFrom('32', '33', '34', '37', '38', '39'), fc.stringMatching(/^\d{7}$/))
  .map(([prefix, rest]) => `${prefix}${rest}`);

describe('parsePhoneNumber fuzzing', () => {
  test('throws only MgError for any string input', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 64 }), (input) => {
        const result = safeParsePhoneNumber(input);
        expect(result.success || result.error instanceof MgError).toBe(true);
      }),
      { numRuns: 2000 },
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

describe('OPERATOR_NAMES', () => {
  test('names the operator of a parsed number', () => {
    expect(OPERATOR_NAMES[parsePhoneNumber('034 12 345 67').operator]).toBe('Telma');
  });
});
