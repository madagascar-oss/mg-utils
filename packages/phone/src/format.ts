import { COUNTRY_CODE, GROUPING, TRUNK_PREFIX } from './generated/data.ts';
import { MdgError } from './generated/errors.ts';
import { parsePhoneNumber } from './phone-number.ts';

/**
 * How {@link formatPhoneNumber} writes a number.
 *
 * - `e164`: `+261341234567`
 * - `international`: `+261 34 12 345 67`
 * - `national`: `034 12 345 67`
 *
 * @example
 * ```ts
 * const format: PhoneNumberFormat = 'national';
 * ```
 */
export type PhoneNumberFormat = 'e164' | 'international' | 'national';

const PHONE_NUMBER_FORMATS: readonly PhoneNumberFormat[] = ['e164', 'international', 'national'];

const GROUP_BOUNDS = GROUPING.reduce<readonly (readonly [number, number])[]>((bounds, size) => {
  const start = bounds.at(-1)?.[1] ?? 0;
  return [...bounds, [start, start + size]];
}, []);

function groupDigits(nationalNumber: string): string {
  return GROUP_BOUNDS.map(([start, end]) => nationalNumber.slice(start, end)).join(' ');
}

const FORMATTERS: Readonly<Record<PhoneNumberFormat, (nationalNumber: string) => string>> = {
  e164: (nationalNumber) => `+${COUNTRY_CODE}${nationalNumber}`,
  international: (nationalNumber) => `+${COUNTRY_CODE} ${groupDigits(nationalNumber)}`,
  national: (nationalNumber) => `${TRUNK_PREFIX}${groupDigits(nationalNumber)}`,
};

function isPhoneNumberFormat(value: unknown): value is PhoneNumberFormat {
  return PHONE_NUMBER_FORMATS.some((format) => format === value);
}

/**
 * Writes a Malagasy mobile number in a standard form.
 *
 * @param input - The number in any spelling accepted by {@link parsePhoneNumber}.
 * @param format - `'e164'`, `'international'` or `'national'`.
 * @returns The formatted number.
 * @throws {@link MdgError} `INVALID_TYPE` for an unknown format, plus every error of
 *   {@link parsePhoneNumber}.
 *
 * @example
 * ```ts
 * formatPhoneNumber('+261341234567', 'national'); // '034 12 345 67'
 * formatPhoneNumber('034 12 345 67', 'international'); // '+261 34 12 345 67'
 * ```
 */
export function formatPhoneNumber(input: string, format: PhoneNumberFormat): string {
  if (!isPhoneNumberFormat(format)) {
    throw new MdgError(
      'INVALID_TYPE',
      `Format must be one of: ${PHONE_NUMBER_FORMATS.join(', ')}.`,
    );
  }
  return FORMATTERS[format](parsePhoneNumber(input).nationalNumber);
}
