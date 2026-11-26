// GENERATED — edit spec/ instead. Run `just codegen` to refresh.

// From spec/modules/ariary/data.yaml, spec 0.5.0.

/** @internal */
export const CURRENCY_SYMBOL = 'Ar' as const;

/** @internal */
export const CURRENCY_WORD = 'ariary' as const;

/** @internal */
export const SYMBOL_SEPARATOR = '\u00a0' as const;

/** @internal */
export const GROUP_SIZE = 3 as const;

/** Thousand separator used by {@link formatAriary}: `space` (default) or `dot`. */
export type AriaryGrouping = 'space' | 'dot';

/** @internal Grouping option → separator character; the first entry is the default. */
export const GROUP_SEPARATORS: ReadonlyMap<AriaryGrouping, string> = new Map<
  AriaryGrouping,
  string
>([
  ['space', '\u00a0'],
  ['dot', '.'],
]);

/** @internal */
export const DEFAULT_GROUPING = 'space' as const;

/** @internal */
export const READABLE_SEPARATORS = [' ', '\u00a0', '\u202f', '.'] as const;

/** @internal Lower-cased, longest first. */
export const CURRENCY_TOKENS = ['ariary', 'mga', 'ar'] as const;

/** @internal */
export const FRANC_SYMBOL = 'Fmg' as const;

/** @internal */
export const FRANCS_PER_ARIARY = 5 as const;

/** @internal */
export const MIN_AMOUNT = 0 as const;
