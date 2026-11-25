// ariary: spec data → lookup tables → TypeScript constants.
import type { Sourced } from './shared.ts';
import { constant, literal } from '../emit.ts';

interface AriaryData {
  readonly currency: { readonly code: string; readonly symbol: string; readonly word: string };
  readonly symbolSeparator: { readonly value: string };
  readonly grouping: { readonly size: number };
  readonly groupSeparators: readonly { readonly id: string; readonly value: string }[];
  readonly readableSeparators: Sourced<string>;
  readonly currencyTokens: Sourced<string>;
  readonly legacyFranc: { readonly symbol: string; readonly francsPerAriary: number };
  readonly limits: { readonly min: number; readonly max: number };
}

interface AriaryTables {
  readonly currencySymbol: string;
  readonly currencyWord: string;
  readonly symbolSeparator: string;
  readonly groupSize: number;
  /** Separator id → character; the first entry is the default. */
  readonly groupSeparators: readonly (readonly [string, string])[];
  readonly readableSeparators: readonly string[];
  /** Lower-cased, longest first, so `Ariary` is tried before `Ar`. */
  readonly currencyTokens: readonly string[];
  readonly francSymbol: string;
  readonly francsPerAriary: number;
  readonly minAmount: number;
  readonly maxAmount: number;
}

function ariaryTables(data: AriaryData): AriaryTables {
  return {
    currencySymbol: data.currency.symbol,
    currencyWord: data.currency.word,
    symbolSeparator: data.symbolSeparator.value,
    groupSize: data.grouping.size,
    groupSeparators: data.groupSeparators.map(({ id, value }) => [id, value] as const),
    readableSeparators: [...data.readableSeparators.values],
    currencyTokens: data.currencyTokens.values
      .map((token) => token.toLowerCase())
      .sort((left, right) => right.length - left.length || left.localeCompare(right)),
    francSymbol: data.legacyFranc.symbol,
    francsPerAriary: data.legacyFranc.francsPerAriary,
    minAmount: data.limits.min,
    maxAmount: data.limits.max,
  };
}

export function emit(data: AriaryData): string[] {
  const tables = ariaryTables(data);
  const groupingUnion = tables.groupSeparators.map(([id]) => literal(id)).join(' | ');
  return [
    constant('CURRENCY_SYMBOL', tables.currencySymbol),
    constant('CURRENCY_WORD', tables.currencyWord),
    constant('SYMBOL_SEPARATOR', tables.symbolSeparator),
    constant('GROUP_SIZE', tables.groupSize),
    `/** Thousand separator used by {@link formatAriary}: \`space\` (default) or \`dot\`. */\nexport type AriaryGrouping = ${groupingUnion};`,
    `/** @internal Grouping option → separator character; the first entry is the default. */\nexport const GROUP_SEPARATORS: ReadonlyMap<AriaryGrouping, string> = new Map<AriaryGrouping, string>(${literal(tables.groupSeparators)});`,
    constant('DEFAULT_GROUPING', tables.groupSeparators[0]?.[0] ?? ''),
    constant('READABLE_SEPARATORS', tables.readableSeparators),
    constant('CURRENCY_TOKENS', tables.currencyTokens, 'Lower-cased, longest first.'),
    constant('FRANC_SYMBOL', tables.francSymbol),
    constant('FRANCS_PER_ARIARY', tables.francsPerAriary),
    constant('MIN_AMOUNT', tables.minAmount),
    constant('MAX_AMOUNT', tables.maxAmount),
  ];
}
