import {
  COUNTRY_CODE,
  INTERNATIONAL_PREFIX,
  NATIONAL_NUMBER_LENGTH,
  OPERATOR_BY_PREFIX,
  OPERATOR_PREFIX_LENGTH,
  TRUNK_PREFIX,
  type OperatorId,
} from './generated/data.ts';
import { MgError, type ErrorCode } from './generated/errors.ts';
import type { SafeParseResult } from './result.ts';

declare const phoneNumberBrand: unique symbol;

/**
 * A Malagasy mobile number that passed validation. Create it with {@link parsePhoneNumber}.
 *
 * @example
 * ```ts
 * const phone: PhoneNumber = parsePhoneNumber('034 12 345 67');
 * phone.e164; // '+261341234567'
 * ```
 */
export interface PhoneNumber {
  /** The number in E.164 form, for storage and APIs: `+261341234567`. */
  readonly e164: string;
  /** The 9 digits after the country code: `341234567`. */
  readonly nationalNumber: string;
  /** The operator that holds the number's prefix. */
  readonly operator: OperatorId;
  /** Marks values that went through validation; it does not exist at runtime. */
  readonly [phoneNumberBrand]: true;
}

// Bounded so a parser that reads user input never scans unbounded text.
const MAX_INPUT_LENGTH = 32;
const SEPARATORS = /[\s().-]/g;
// A national significant number never starts with the trunk prefix 0 (ITU-T E.164).
const NATIONAL_NUMBER_DIGITS = /^[1-9]\d*$/;
const NATIONAL_PREFIXES = [
  `+${COUNTRY_CODE}`,
  `${INTERNATIONAL_PREFIX}${COUNTRY_CODE}`,
  COUNTRY_CODE,
  TRUNK_PREFIX,
  '',
] as const;

function failure(code: ErrorCode, message: string): SafeParseResult<never> {
  return { success: false, error: new MgError(code, message) };
}

function stripNationalPrefix(compact: string): string | undefined {
  const prefix = NATIONAL_PREFIXES.find(
    (candidate) =>
      compact.startsWith(candidate) && compact.length === candidate.length + NATIONAL_NUMBER_LENGTH,
  );
  return prefix === undefined ? undefined : compact.slice(prefix.length);
}

function readNationalNumber(input: string): SafeParseResult<string> {
  if (input.length > MAX_INPUT_LENGTH) {
    return failure(
      'INVALID_FORMAT',
      `Phone numbers are at most ${String(MAX_INPUT_LENGTH)} characters.`,
    );
  }
  const nationalNumber = stripNationalPrefix(input.replace(SEPARATORS, ''));
  if (nationalNumber === undefined || !NATIONAL_NUMBER_DIGITS.test(nationalNumber)) {
    return failure('INVALID_FORMAT', 'Expected a Malagasy number such as 034 12 345 67.');
  }
  return { success: true, data: nationalNumber };
}

/**
 * Reads a Malagasy mobile number without throwing.
 *
 * @param input - The number as typed by a user, in any accepted spelling.
 * @returns `{ success: true, data }` with the {@link PhoneNumber}, or `{ success: false, error }`.
 *
 * @example
 * ```ts
 * const result = safeParsePhoneNumber('+261 34 12 345 67');
 * if (result.success) result.data.operator; // 'telma'
 * ```
 */
export function safeParsePhoneNumber(input: unknown): SafeParseResult<PhoneNumber> {
  if (typeof input !== 'string') return failure('INVALID_TYPE', 'Expected the number as a string.');
  const national = readNationalNumber(input);
  if (!national.success) return national;
  const operator = OPERATOR_BY_PREFIX.get(national.data.slice(0, OPERATOR_PREFIX_LENGTH));
  if (operator === undefined) {
    return failure('UNKNOWN_OPERATOR', 'The prefix is not assigned to a Malagasy mobile operator.');
  }
  const phone = {
    e164: `+${COUNTRY_CODE}${national.data}`,
    nationalNumber: national.data,
    operator,
  };
  return { success: true, data: phone as PhoneNumber };
}

/**
 * Reads a Malagasy mobile number written in any common way.
 *
 * Accepts `034 12 345 67`, `+261 34 12 345 67`, `00261…`, `261…` and `34 12 345 67`;
 * spaces, dashes, dots and parentheses are ignored.
 *
 * @param input - The number as typed by a user.
 * @returns The validated {@link PhoneNumber}.
 * @throws {@link MgError} `INVALID_TYPE` for non-strings, `INVALID_FORMAT` for text that is
 *   not a Malagasy number, `UNKNOWN_OPERATOR` for an unassigned mobile prefix.
 *
 * @example
 * ```ts
 * parsePhoneNumber('034 12 345 67');
 * // { e164: '+261341234567', nationalNumber: '341234567', operator: 'telma' }
 * ```
 */
export function parsePhoneNumber(input: string): PhoneNumber {
  const result = safeParsePhoneNumber(input);
  if (!result.success) throw result.error;
  return result.data;
}

/**
 * Tells whether the input is a valid Malagasy mobile number. Never throws.
 *
 * @param input - Any value.
 * @returns `true` when {@link parsePhoneNumber} would succeed.
 *
 * @example
 * ```ts
 * isValidPhoneNumber('034 12 345 67'); // true
 * isValidPhoneNumber('035 12 345 67'); // false
 * ```
 */
export function isValidPhoneNumber(input: unknown): boolean {
  return safeParsePhoneNumber(input).success;
}
