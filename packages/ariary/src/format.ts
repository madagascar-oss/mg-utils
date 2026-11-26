import { CURRENCY_SYMBOL, FRANC_SYMBOL, GROUP_SIZE, SYMBOL_SEPARATOR } from './generated/data.ts';
import { MgError } from './generated/errors.ts';
import { assertAmount } from './amount.ts';
import { plainDecimal } from './decimal.ts';
import {
  assertOptionsObject,
  decimalFor,
  formatGroupingId,
  groupingFor,
  type AriarySeparatorOptions,
} from './separators.ts';

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
export interface AriaryFormatOptions extends AriarySeparatorOptions {
  /** Symbol `before` (default) or `after` the amount. */
  readonly symbolPosition?: AriarySymbolPosition;
}

const SYMBOL_POSITIONS: ReadonlySet<unknown> = new Set<AriarySymbolPosition>(['before', 'after']);
const DECIMAL_POINT = '.';
const DIGIT_GROUP_BOUNDARY = new RegExp(`\\B(?=(\\d{${String(GROUP_SIZE)}})+(?!\\d))`, 'g');

interface Layout {
  readonly grouping: string;
  readonly decimal: string;
  readonly symbolAfter: boolean;
}

function layoutFor(options: unknown): Layout {
  assertOptionsObject(options);
  const { symbolPosition = 'before' } = options as AriaryFormatOptions;
  if (!SYMBOL_POSITIONS.has(symbolPosition)) {
    throw new MgError('INVALID_TYPE', 'symbolPosition is before or after.');
  }
  const decimal = decimalFor(options);
  const grouping = groupingFor(formatGroupingId(options), decimal);
  return { grouping, decimal, symbolAfter: symbolPosition === 'after' };
}

// Groups the whole part only; decimals follow a comma as they are, never grouped or rounded.
function layOut(amount: number, symbol: string, options: AriaryFormatOptions): string {
  const layout = layoutFor(options);
  const [whole = '', decimals] = plainDecimal(amount).split(DECIMAL_POINT);
  const grouped = whole.replace(DIGIT_GROUP_BOUNDARY, layout.grouping);
  const digits = decimals === undefined ? grouped : `${grouped}${layout.decimal}${decimals}`;
  return layout.symbolAfter
    ? `${digits}${SYMBOL_SEPARATOR}${symbol}`
    : `${symbol}${SYMBOL_SEPARATOR}${digits}`;
}

/**
 * Writes an Ariary amount the Malagasy way: symbol `Ar`, digits grouped by no-break spaces.
 *
 * @param amount - Ariary from 0 to `Number.MAX_SAFE_INTEGER`, whole or decimal.
 * @param options - Optional `grouping` (`space`, `dot` or `comma`), `decimal` (`comma` or `dot`)
 *   and `symbolPosition` (`before` or `after`). The defaults are the Malagasy way.
 * @returns The formatted amount, e.g. `Ar 1 500` or `Ar 1 500,5` (the spaces are U+00A0).
 * @throws {@link MgError} `INVALID_TYPE` for a value that is not a finite number or unknown options,
 *   `OUT_OF_RANGE` outside 0 to `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * ```ts
 * formatAriary(1500); // 'Ar 1 500'
 * formatAriary(1500, { grouping: 'dot', symbolPosition: 'after' }); // '1.500 Ar'
 * formatAriary(1500.5); // 'Ar 1 500,5'
 * ```
 */
export function formatAriary(amount: number, options: AriaryFormatOptions = {}): string {
  assertAmount(amount);
  return layOut(amount, CURRENCY_SYMBOL, options);
}

/**
 * Writes an amount in old Malagasy francs, with the same layout as {@link formatAriary}.
 *
 * @param francs - Francs from 0 to `Number.MAX_SAFE_INTEGER`, whole or decimal.
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
