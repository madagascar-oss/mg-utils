// Amounts at the public boundary: a number, or decimal text read exactly. Both become the
// amount's exact decimal digits, so nothing below ever rounds.
import { MAX_TEXT_LENGTH, MIN_AMOUNT } from './generated/data.ts';
import { MdgError, type SafeParseResult } from './generated/errors.ts';
import { plainDecimal } from './decimal.ts';

/** @internal The spec sets no maximum: number amounts stop where a number stops being exact. */
export const MAX_AMOUNT = Number.MAX_SAFE_INTEGER;

/**
 * What the functions that compute or read an amount give back: a `number` (default), or the
 * exact decimal `text`, of any size.
 *
 * @example
 * ```ts
 * const exact: AmountResultKind = 'text';
 * ```
 */
export type AmountResultKind = 'number' | 'text';

/**
 * Options for the functions that give back an amount.
 *
 * @example
 * ```ts
 * const options: AmountResultOptions = { as: 'text' };
 * ```
 */
export interface AmountResultOptions {
  /** `number` (default), or `text` for the exact decimal digits. */
  readonly as?: AmountResultKind;
}

/**
 * The value an amount function gives back for an {@link AmountResultKind}: `string` for `text`,
 * otherwise `number`.
 *
 * @example
 * ```ts
 * const digits: AmountValue<'text'> = '1500.5';
 * ```
 */
export type AmountValue<Kind extends AmountResultKind> = Kind extends 'text' ? string : number;

const RESULT_KINDS: ReadonlySet<unknown> = new Set<AmountResultKind>(['number', 'text']);
// Words rule 13: ASCII digits, then optionally a point and more digits. Nothing else.
const DECIMAL_TEXT = /^[0-9]+(?:\.[0-9]+)?$/;
const LEADING_ZEROS = /^0+(?=\d)/;
const TRAILING_DECIMAL_ZEROS = /\.?0+$/;
const POINT = '.';

/**
 * @internal Canonical decimal text: no leading zeros, no trailing decimal zeros.
 *
 * @param text - Digits with an optional point and decimals.
 * @returns `'0012.50'` → `'12.5'`.
 */
export function canonical(text: string): string {
  const whole = text.replace(LEADING_ZEROS, '');
  return whole.includes(POINT) ? whole.replace(TRAILING_DECIMAL_ZEROS, '') : whole;
}

/**
 * @internal Throws OUT_OF_RANGE for a number below 0 or above {@link MAX_AMOUNT}.
 *
 * @param value - A finite number.
 */
export function assertInRange(value: number): void {
  if (value < MIN_AMOUNT || value > MAX_AMOUNT) {
    throw new MdgError(
      'OUT_OF_RANGE',
      `Amounts go from ${String(MIN_AMOUNT)} to ${String(MAX_AMOUNT)}.`,
    );
  }
}

/**
 * @internal An amount's exact decimal digits, validated at the public boundary.
 *
 * @param value - A number from 0 to `Number.MAX_SAFE_INTEGER`, or plain decimal text.
 * @returns Canonical decimal text: `1500.50` → `'1500.5'`.
 */
export function amountDigits(value: unknown): string {
  if (typeof value === 'string') {
    if (value.length > MAX_TEXT_LENGTH || !DECIMAL_TEXT.test(value)) {
      throw new MdgError(
        'INVALID_FORMAT',
        `Amount text is digits with an optional .decimals, at most ${String(MAX_TEXT_LENGTH)} characters.`,
      );
    }
    return canonical(value);
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new MdgError('INVALID_TYPE', 'Amounts are finite numbers or decimal text.');
  }
  assertInRange(value);
  return plainDecimal(value);
}

/**
 * @internal The result kind the options ask for.
 *
 * @param options - The options the caller passed.
 * @returns `number` or `text`, or `undefined` for bad options.
 */
export function resultKind(options: unknown): AmountResultKind | undefined {
  if (typeof options !== 'object' || options === null) return undefined;
  const { as = 'number' } = options as AmountResultOptions;
  return RESULT_KINDS.has(as) ? as : undefined;
}

/**
 * @internal Exact digits as a number, only when the number holds them exactly.
 *
 * @param digits - Canonical decimal text.
 * @returns The number, or PRECISION_LOSS: never a silent rounding.
 */
export function exactNumber(digits: string): SafeParseResult<number> {
  const value = Number(digits);
  if (value <= MAX_AMOUNT && plainDecimal(value) === digits) return { success: true, data: value };
  return {
    success: false,
    error: new MdgError(
      'PRECISION_LOSS',
      `${digits} does not fit a number exactly; pass { as: 'text' } for the exact digits.`,
    ),
  };
}

/**
 * @internal Gives exact digits back as the options ask, throwing on PRECISION_LOSS.
 *
 * @param digits - Canonical decimal text.
 * @param kind - `number` or `text`.
 * @returns The number or the text.
 */
export function amountResult(digits: string, kind: AmountResultKind): number | string {
  if (kind === 'text') return digits;
  const result = exactNumber(digits);
  if (!result.success) throw result.error;
  return result.data;
}
