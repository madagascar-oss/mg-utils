// Reads a number typed in any common way into its 9-digit national significant number.
import {
  COUNTRY_CODE,
  INTERNATIONAL_PREFIX,
  NATIONAL_NUMBER_LENGTH,
  TRUNK_PREFIX,
} from './generated/data.ts';
import type { SafeParseResult } from './generated/errors.ts';
import { failure } from './result.ts';

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

function stripNationalPrefix(compact: string): string | undefined {
  const prefix = NATIONAL_PREFIXES.find(
    (candidate) =>
      compact.startsWith(candidate) && compact.length === candidate.length + NATIONAL_NUMBER_LENGTH,
  );
  return prefix === undefined ? undefined : compact.slice(prefix.length);
}

/**
 * Strips separators and the `+261`, `00261`, `261` or `0` prefix, keeping the 9 digits.
 *
 * @param input - The number as typed by a user.
 * @returns The national significant number, or `INVALID_FORMAT`.
 *
 * @example
 * ```ts
 * readNationalNumber('+261 34 12 345 67'); // { success: true, data: '341234567' }
 * ```
 */
export function readNationalNumber(input: string): SafeParseResult<string> {
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
