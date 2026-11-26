// Grouping and decimal options shared by formatting and reading. Every default is the Malagasy
// way; the comma grouping and the decimal dot are opt-in for text in another convention.
import {
  DECIMAL_SEPARATORS,
  DEFAULT_DECIMAL,
  DEFAULT_GROUPING,
  GROUP_SEPARATORS,
  type AriaryDecimal,
  type AriaryGrouping,
} from './generated/data.ts';
import { MgError } from './generated/errors.ts';

/**
 * Separator options for formatting and reading amounts.
 *
 * @example
 * ```ts
 * const english: AriarySeparatorOptions = { grouping: 'comma', decimal: 'dot' };
 * ```
 */
export interface AriarySeparatorOptions {
  /** Thousand separator: `space` (default), `dot`, or `comma` for another convention. */
  readonly grouping?: AriaryGrouping;
  /** Decimal separator: `comma` (default), or `dot` for another convention. */
  readonly decimal?: AriaryDecimal;
}

/**
 * @internal Throws INVALID_TYPE unless `options` is an object.
 *
 * @param options - What the caller passed as options.
 */
export function assertOptionsObject(options: unknown): asserts options is Record<string, unknown> {
  if (typeof options !== 'object' || options === null) {
    throw new MgError('INVALID_TYPE', 'Options must be an object.');
  }
}

/**
 * @internal Reads the `decimal` option.
 *
 * @param options - The caller's options.
 * @returns The decimal character, a comma by default.
 */
export function decimalFor(options: AriarySeparatorOptions): string {
  const decimal = DECIMAL_SEPARATORS.get(options.decimal ?? DEFAULT_DECIMAL);
  if (decimal === undefined) throw new MgError('INVALID_TYPE', 'decimal is comma or dot.');
  return decimal;
}

/**
 * @internal Reads a `grouping` option and checks it against the decimal character.
 *
 * @param id - The grouping option.
 * @param decimal - The decimal character in use.
 * @returns The grouping character.
 */
export function groupingFor(id: AriaryGrouping, decimal: string): string {
  const grouping = GROUP_SEPARATORS.get(id);
  if (grouping === undefined) throw new MgError('INVALID_TYPE', 'grouping is space, dot or comma.');
  if (grouping === decimal) {
    throw new MgError('INVALID_TYPE', 'grouping and decimal must be different characters.');
  }
  return grouping;
}

/**
 * @internal The grouping option for formatting.
 *
 * @param options - The caller's options.
 * @returns The one given, or the Malagasy default.
 */
export function formatGroupingId(options: AriarySeparatorOptions): AriaryGrouping {
  return options.grouping ?? DEFAULT_GROUPING;
}
