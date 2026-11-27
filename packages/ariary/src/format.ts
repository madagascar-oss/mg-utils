import {
  CURRENCY_CODE,
  CURRENCY_SYMBOL,
  FRANC_CODE,
  FRANC_SYMBOL,
  GROUP_SIZE,
  SYMBOL_SEPARATOR,
} from './generated/data.ts';
import { MdgError } from './generated/errors.ts';
import { amountDigits } from './amount.ts';
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
 * How the currency is shown: `symbol` (default, `Ar 1 500`) or the ISO 4217 `code`
 * (`MGA 1 500`; `MGF` for old francs).
 *
 * @example
 * ```ts
 * const display: AriaryCurrencyDisplay = 'code';
 * ```
 */
export type AriaryCurrencyDisplay = 'symbol' | 'code';

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
  /** `symbol` (default, `Ar`) or the ISO `code` (`MGA`). */
  readonly currencyDisplay?: AriaryCurrencyDisplay;
}

// The symbol and the ISO code of each currency.
interface Currency {
  readonly symbol: string;
  readonly code: string;
}

const ARIARY: Currency = { symbol: CURRENCY_SYMBOL, code: CURRENCY_CODE };
const FRANC: Currency = { symbol: FRANC_SYMBOL, code: FRANC_CODE };
const CURRENCY_DISPLAYS: ReadonlySet<unknown> = new Set<AriaryCurrencyDisplay>(['symbol', 'code']);

const SYMBOL_POSITIONS: ReadonlySet<unknown> = new Set<AriarySymbolPosition>(['before', 'after']);
const DECIMAL_POINT = '.';
const DIGIT_GROUP_BOUNDARY = new RegExp(`\\B(?=(\\d{${String(GROUP_SIZE)}})+(?!\\d))`, 'g');

interface Layout {
  readonly grouping: string;
  readonly decimal: string;
  readonly symbolAfter: boolean;
  readonly display: AriaryCurrencyDisplay;
}

function layoutFor(options: unknown): Layout {
  assertOptionsObject(options);
  const { symbolPosition = 'before', currencyDisplay = 'symbol' } = options as AriaryFormatOptions;
  if (!SYMBOL_POSITIONS.has(symbolPosition)) {
    throw new MdgError('INVALID_TYPE', 'symbolPosition is before or after.');
  }
  if (!CURRENCY_DISPLAYS.has(currencyDisplay)) {
    throw new MdgError('INVALID_TYPE', 'currencyDisplay is symbol or code.');
  }
  const decimal = decimalFor(options);
  const grouping = groupingFor(formatGroupingId(options), decimal);
  return { grouping, decimal, symbolAfter: symbolPosition === 'after', display: currencyDisplay };
}

// Groups the whole part only; decimals follow a comma as they are, never grouped or rounded.
function layOut(digits: string, currency: Currency, options: AriaryFormatOptions): string {
  const layout = layoutFor(options);
  const symbol = currency[layout.display];
  const [whole = '', decimals] = digits.split(DECIMAL_POINT);
  const grouped = whole.replace(DIGIT_GROUP_BOUNDARY, layout.grouping);
  const text = decimals === undefined ? grouped : `${grouped}${layout.decimal}${decimals}`;
  return layout.symbolAfter
    ? `${text}${SYMBOL_SEPARATOR}${symbol}`
    : `${symbol}${SYMBOL_SEPARATOR}${text}`;
}

/**
 * Writes an Ariary amount the Malagasy way: symbol `Ar`, digits grouped by no-break spaces.
 *
 * @param amount - Ariary from 0 to `Number.MAX_SAFE_INTEGER`, whole or decimal, or decimal
 *   text such as `'1500.25'`, written exactly.
 * @param options - Optional `grouping` (`space`, `dot` or `comma`), `decimal` (`comma` or `dot`),
 *   `symbolPosition` (`before` or `after`) and `currencyDisplay` (`symbol` or `code`). The defaults are the Malagasy way.
 * @returns The formatted amount, e.g. `Ar 1 500` or `Ar 1 500,5` (the spaces are U+00A0).
 * @throws {@link MdgError} `INVALID_TYPE` for a value that is not a finite number or text, or
 *   unknown options; `INVALID_FORMAT` for text that is not plain decimal; `OUT_OF_RANGE` for a
 *   number outside 0 to `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * ```ts
 * formatAriary(1500); // 'Ar 1 500'
 * formatAriary(1500, { grouping: 'dot', symbolPosition: 'after' }); // '1.500 Ar'
 * formatAriary(1500.5); // 'Ar 1 500,5'
 * formatAriary(1500, { currencyDisplay: 'code' }); // 'MGA 1 500'
 * ```
 */
export function formatAriary(amount: number | string, options: AriaryFormatOptions = {}): string {
  return layOut(amountDigits(amount), ARIARY, options);
}

/**
 * Writes an amount in old Malagasy francs, with the same layout as {@link formatAriary}.
 *
 * @param francs - Francs from 0 to `Number.MAX_SAFE_INTEGER`, whole or decimal, or decimal text.
 * @param options - Same options as {@link formatAriary}.
 * @returns The formatted amount, e.g. `Fmg 7 500`.
 * @throws {@link MdgError} as {@link formatAriary}.
 *
 * @example
 * ```ts
 * formatFmg(7500); // 'Fmg 7 500'
 * ```
 */
export function formatFmg(francs: number | string, options: AriaryFormatOptions = {}): string {
  return layOut(amountDigits(francs), FRANC, options);
}
