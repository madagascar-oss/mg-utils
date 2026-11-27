// GENERATED — edit spec/ instead. Run `just codegen` to refresh.

// From spec/modules/ariary/data.yaml, spec 0.9.0.

/** @internal */
export const CURRENCY_SYMBOL = 'Ar' as const;

/** @internal */
export const CURRENCY_WORD = 'ariary' as const;

/** @internal */
export const SYMBOL_SEPARATOR = '\u00a0' as const;

/** @internal */
export const GROUP_SIZE = 3 as const;

/** Thousand separator used by {@link formatAriary}: `space` (default) or `dot`. */
export type AriaryGrouping = 'space' | 'dot' | 'comma';

/** @internal Grouping option → separator character; the first entry is the default. */
export const GROUP_SEPARATORS: ReadonlyMap<AriaryGrouping, string> = new Map<
  AriaryGrouping,
  string
>([
  ['space', '\u00a0'],
  ['dot', '.'],
  ['comma', ','],
]);

/** @internal */
export const DEFAULT_GROUPING = 'space' as const;

/** Decimal separator used by {@link formatAriary} and the parsers: `comma` (default) or `dot`. */
export type AriaryDecimal = 'comma' | 'dot';

/** @internal Decimal option → separator character; the first entry is the default. */
export const DECIMAL_SEPARATORS: ReadonlyMap<AriaryDecimal, string> = new Map<
  AriaryDecimal,
  string
>([
  ['comma', ','],
  ['dot', '.'],
]);

/** @internal */
export const DEFAULT_DECIMAL = 'comma' as const;

/** @internal */
export const READABLE_SEPARATORS = [' ', '\u00a0', '\u202f', '.'] as const;

/** @internal Lower-cased, longest first. */
export const CURRENCY_TOKENS = ['ariary', 'mga', 'ar'] as const;

/** @internal */
export const FRANC_SYMBOL = 'Fmg' as const;

/** @internal */
export const FRANCS_PER_ARIARY = 5 as const;

/** @internal 10 ÷ FRANCS_PER_ARIARY. */
export const FRANC_DIVISION_FACTOR = 2 as const;

/** @internal */
export const MIN_AMOUNT = 0 as const;

/** @internal Longest decimal text taken as an amount. */
export const MAX_TEXT_LENGTH = 100 as const;

/** @internal Longest text the parsers read. */
export const MAX_READ_LENGTH = 329 as const;
