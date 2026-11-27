// Numbers and decimal text, turned into their exact decimal digits.
import { MAX_TEXT_LENGTH, MIN_VALUE } from './generated/data.ts';
import { MdgError } from './generated/errors.ts';

/** @internal The whole digits, and the decimals or `undefined` for a whole number. */
export type DecimalParts = readonly [string, string | undefined];

const TRAILING_ZEROS = /0+$/;
// Rule 13: ASCII digits, then optionally a point and more digits. Nothing else.
const DECIMAL_TEXT = /^([0-9]+)(?:\.([0-9]+))?$/;
// String(value) of a small number, e.g. '1e-7' or '1.5e-10'.
const NEGATIVE_EXPONENT = /^(\d)(?:\.(\d+))?e-(\d+)$/;

/**
 * @internal The shortest exact decimal form of a number, never in exponent notation.
 *
 * @param value - A non-negative finite number.
 * @returns Its digits: `1500.5` → `'1500.5'`, `1e-7` → `'0.0000001'`.
 */
export function plainDecimal(value: number): string {
  const text = String(value);
  const match = NEGATIVE_EXPONENT.exec(text);
  if (match === null) return text;
  const [, lead = '', rest = '', exponent = ''] = match;
  return `0.${'0'.repeat(Number(exponent) - 1)}${lead}${rest}`;
}

/**
 * @internal Rule 13: the parts of plain decimal text, trailing decimal zeros dropped.
 *
 * @param text - Text the caller passed.
 * @param caller - Function name for the error message.
 * @returns The whole digits and the decimals.
 */
export function decimalTextParts(text: string, caller: string): DecimalParts {
  const match = text.length <= MAX_TEXT_LENGTH ? DECIMAL_TEXT.exec(text) : null;
  if (match === null) {
    throw new MdgError(
      'INVALID_FORMAT',
      `${caller} reads digits with an optional .decimals, at most ${String(MAX_TEXT_LENGTH)} characters.`,
    );
  }
  const [, whole = '', decimals = ''] = match;
  const significantDecimals = decimals.replace(TRAILING_ZEROS, '');
  return [whole, significantDecimals === '' ? undefined : significantDecimals];
}

/**
 * @internal Checks a number is finite and between 0 and `Number.MAX_SAFE_INTEGER`.
 *
 * @param value - The value the caller passed.
 * @param caller - Function name for the error message.
 */
export function assertSupportedNumber(value: unknown, caller: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new MdgError('INVALID_TYPE', `${caller} expects a finite number or decimal text.`);
  }
  if (value < MIN_VALUE || value > Number.MAX_SAFE_INTEGER) {
    throw new MdgError(
      'OUT_OF_RANGE',
      `${caller} supports ${String(MIN_VALUE)} to ${String(Number.MAX_SAFE_INTEGER)}.`,
    );
  }
}

/**
 * @internal The exact decimal parts of a number or of decimal text.
 *
 * @param value - A number from 0 to `Number.MAX_SAFE_INTEGER`, or plain decimal text.
 * @param caller - Function name for error messages.
 * @returns The whole digits and the decimals.
 */
export function decimalParts(value: unknown, caller: string): DecimalParts {
  if (typeof value === 'string') return decimalTextParts(value, caller);
  assertSupportedNumber(value, caller);
  const [whole = '', decimals] = plainDecimal(value).split('.');
  return [whole, decimals];
}
