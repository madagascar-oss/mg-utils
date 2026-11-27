import {
  COUNTRY_CODE,
  OPERATOR_BY_PREFIX,
  OPERATOR_PREFIX_LENGTH,
  type OperatorId,
} from './generated/data.ts';
import type { SafeParseResult } from './generated/errors.ts';
import { readNationalNumber } from './read-national-number.ts';
import { failure } from './result.ts';

declare const phoneNumberBrand: unique symbol;

/**
 * A Malagasy mobile number that passed validation. Create it with {@link parsePhone}.
 *
 * @example
 * ```ts
 * const phone: PhoneNumber = parsePhone('034 12 345 67');
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

/**
 * Reads a Malagasy mobile number without throwing.
 *
 * @param input - The number as typed by a user, in any accepted spelling.
 * @returns `{ success: true, data }` with the {@link PhoneNumber}, or `{ success: false, error }`.
 *
 * @example
 * ```ts
 * const result = safeParsePhone('+261 34 12 345 67');
 * if (result.success) result.data.operator; // 'yas'
 * ```
 */
export function safeParsePhone(input: unknown): SafeParseResult<PhoneNumber> {
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
 * @throws {@link MdgError} `INVALID_TYPE` for non-strings, `INVALID_FORMAT` for text that is
 *   not a Malagasy number, `UNKNOWN_OPERATOR` for an unassigned mobile prefix.
 *
 * @example
 * ```ts
 * parsePhone('034 12 345 67');
 * // { e164: '+261341234567', nationalNumber: '341234567', operator: 'yas' }
 * ```
 */
export function parsePhone(input: string): PhoneNumber {
  const result = safeParsePhone(input);
  if (!result.success) throw result.error;
  return result.data;
}

/**
 * Reads a Malagasy mobile number, or gives `undefined` instead of throwing.
 *
 * Use {@link safeParsePhone} when you need to know why the input was rejected.
 *
 * @param input - The number as typed by a user, in any accepted spelling.
 * @returns The {@link PhoneNumber}, or `undefined` when {@link parsePhone} would throw.
 *
 * @example
 * ```ts
 * tryParsePhone('034 12 345 67')?.operator; // 'yas'
 * tryParsePhone('031 12 345 67'); // undefined
 * ```
 */
export function tryParsePhone(input: unknown): PhoneNumber | undefined {
  const result = safeParsePhone(input);
  return result.success ? result.data : undefined;
}

/**
 * Tells whether the input is a valid Malagasy mobile number. Never throws.
 *
 * @param input - Any value.
 * @returns `true` when {@link parsePhone} would succeed.
 *
 * @example
 * ```ts
 * isValidPhone('034 12 345 67'); // true
 * isValidPhone('031 12 345 67'); // false
 * ```
 */
export function isValidPhone(input: unknown): boolean {
  return safeParsePhone(input).success;
}
