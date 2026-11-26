import {
  CURRENCY_SYMBOL,
  DEFAULT_GROUPING,
  FRANC_SYMBOL,
  GROUP_SEPARATORS,
  GROUP_SIZE,
  SYMBOL_SEPARATOR,
  type AriaryGrouping,
} from './generated/data.ts';
import { MgError } from './generated/errors.ts';
import { assertAmount } from './amount.ts';

/**
 * Where the currency symbol goes: `before` (default, `Ar 1 500`) or `after` (`1 500 Ar`).
 *
 * @example
 * ```ts
 * const position: AriarySymbolPosition = 'after';
 * ```
 */
export type AriarySymbolPosition = 'before' | 'after';

/**
 * Layout options for {@link formatAriary} and {@link formatFmg}.
 *
 * @example
 * ```ts
 * const options: AriaryFormatOptions = { grouping: 'dot', symbolPosition: 'after' };
 * ```
 */
export interface AriaryFormatOptions {
  /** Thousand separator: `space` (default) or `dot`. Never a comma. */
  readonly grouping?: AriaryGrouping;
  /** Symbol `before` (default) or `after` the amount. */
  readonly symbolPosition?: AriarySymbolPosition;
}

const SYMBOL_POSITIONS: ReadonlySet<unknown> = new Set<AriarySymbolPosition>(['before', 'after']);
const DIGIT_GROUP_BOUNDARY = new RegExp(`\\B(?=(\\d{${String(GROUP_SIZE)}})+(?!\\d))`, 'g');

function separatorFor(options: unknown): string {
  if (typeof options !== 'object' || options === null) {
    throw new MgError('INVALID_TYPE', 'Options must be an object.');
  }
  const { grouping = DEFAULT_GROUPING, symbolPosition = 'before' } = options as AriaryFormatOptions;
  const separator = GROUP_SEPARATORS.get(grouping);
  if (separator === undefined || !SYMBOL_POSITIONS.has(symbolPosition)) {
    throw new MgError(
      'INVALID_TYPE',
      'grouping is space or dot; symbolPosition is before or after.',
    );
  }
  return separator;
}

function layOut(amount: number, symbol: string, options: AriaryFormatOptions): string {
  const digits = String(amount).replace(DIGIT_GROUP_BOUNDARY, separatorFor(options));
  return options.symbolPosition === 'after'
    ? `${digits}${SYMBOL_SEPARATOR}${symbol}`
    : `${symbol}${SYMBOL_SEPARATOR}${digits}`;
}

/**
 * Writes an Ariary amount the Malagasy way: symbol `Ar`, digits grouped by no-break spaces.
 *
 * @param amount - Whole ariary from 0 to `Number.MAX_SAFE_INTEGER`.
 * @param options - Optional `grouping` (`space` or `dot`) and `symbolPosition` (`before` or `after`).
 * @returns The formatted amount, e.g. `Ar 1 500` (the spaces are U+00A0).
 * @throws {@link MgError} `INVALID_TYPE` for non-integers or unknown options,
 *   `OUT_OF_RANGE` outside 0 to `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * ```ts
 * formatAriary(1500); // 'Ar 1 500'
 * formatAriary(1500, { grouping: 'dot', symbolPosition: 'after' }); // '1.500 Ar'
 * ```
 */
export function formatAriary(amount: number, options: AriaryFormatOptions = {}): string {
  assertAmount(amount);
  return layOut(amount, CURRENCY_SYMBOL, options);
}

/**
 * Writes an amount in old Malagasy francs, with the same layout as {@link formatAriary}.
 *
 * @param francs - Whole francs from 0 to `Number.MAX_SAFE_INTEGER`.
 * @param options - Same options as {@link formatAriary}.
 * @returns The formatted amount, e.g. `Fmg 7 500`.
 * @throws {@link MgError} `INVALID_TYPE` or `OUT_OF_RANGE`, as {@link formatAriary}.
 *
 * @example
 * ```ts
 * formatFmg(7500); // 'Fmg 7 500'
 * ```
 */
export function formatFmg(francs: number, options: AriaryFormatOptions = {}): string {
  assertAmount(francs);
  return layOut(francs, FRANC_SYMBOL, options);
}
