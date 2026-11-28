// ariary: spec data → lookup tables → TypeScript constants.
import type { Sourced } from './shared.ts';
import { constant, literal } from '../emit.ts';

interface AriaryData {
  readonly currency: { readonly code: string; readonly symbol: string; readonly word: string };
  readonly symbolSeparator: { readonly value: string };
  readonly decimalSeparators: readonly { readonly id: string; readonly value: string }[];
  readonly grouping: { readonly size: number };
  readonly groupSeparators: readonly { readonly id: string; readonly value: string }[];
  readonly readableSeparators: Sourced<string>;
  readonly currencyTokens: Sourced<string>;
  readonly legacyFranc: {
    readonly code: string;
    readonly symbol: string;
    readonly francsPerAriary: number;
  };
  readonly limits: {
    readonly min: number;
    readonly maxTextLength: number;
    readonly maxReadLength: number;
  };
}

interface AriaryTables {
  readonly currencySymbol: string;
  readonly currencyCode: string;
  readonly francCode: string;
  readonly currencyWord: string;
  readonly symbolSeparator: string;
  /** Decimal option id → character; the first entry is the default. */
  readonly decimalSeparators: readonly (readonly [string, string])[];
  readonly groupSize: number;
  /** Separator id → character; the first entry is the default. */
  readonly groupSeparators: readonly (readonly [string, string])[];
  readonly readableSeparators: readonly string[];
  /** Lower-cased, longest first, so `Ariary` is tried before `Ar`. */
  readonly currencyTokens: readonly string[];
  readonly francSymbol: string;
  readonly francsPerAriary: number;
  /** 10 ÷ francsPerAriary: dividing by it is multiplying by this, then shifting one place. */
  readonly francDivisionFactor: number;
  readonly minAmount: number;
  readonly maxTextLength: number;
  readonly maxReadLength: number;
}

const DECIMAL_BASE = 10;

/** Exact decimal division needs a rate that divides 10, such as 5 (1 Ar = 5 FMG). */
function divisionFactor(francsPerAriary: number): number {
  if (DECIMAL_BASE % francsPerAriary !== 0) {
    throw new Error(`francsPerAriary ${String(francsPerAriary)} does not divide 10`);
  }
  return DECIMAL_BASE / francsPerAriary;
}

function ariaryTables(data: AriaryData): AriaryTables {
  return {
    currencySymbol: data.currency.symbol,
    currencyCode: data.currency.code,
    francCode: data.legacyFranc.code,
    currencyWord: data.currency.word,
    symbolSeparator: data.symbolSeparator.value,
    decimalSeparators: data.decimalSeparators.map(({ id, value }) => [id, value] as const),
    groupSize: data.grouping.size,
    groupSeparators: data.groupSeparators.map(({ id, value }) => [id, value] as const),
    readableSeparators: [...data.readableSeparators.values],
    currencyTokens: data.currencyTokens.values
      .map((token) => token.toLowerCase())
      .sort((left, right) => right.length - left.length || left.localeCompare(right)),
    francSymbol: data.legacyFranc.symbol,
    francsPerAriary: data.legacyFranc.francsPerAriary,
    francDivisionFactor: divisionFactor(data.legacyFranc.francsPerAriary),
    minAmount: data.limits.min,
    maxTextLength: data.limits.maxTextLength,
    maxReadLength: data.limits.maxReadLength,
  };
}

export function emit(data: AriaryData): string[] {
  const tables = ariaryTables(data);
  const groupingUnion = tables.groupSeparators.map(([id]) => literal(id)).join(' | ');
  const decimalUnion = tables.decimalSeparators.map(([id]) => literal(id)).join(' | ');
  return [
    constant('CURRENCY_SYMBOL', tables.currencySymbol),
    constant('CURRENCY_CODE', tables.currencyCode, 'ISO 4217 code, for currencyDisplay code.'),
    constant('FRANC_CODE', tables.francCode, 'ISO 4217 code of the old franc.'),
    constant('CURRENCY_WORD', tables.currencyWord),
    constant('SYMBOL_SEPARATOR', tables.symbolSeparator),
    constant('GROUP_SIZE', tables.groupSize),
    `/** Thousand separator used by {@link formatAriary}: \`space\` (default) or \`dot\`. */\nexport type AriaryGrouping = ${groupingUnion};`,
    `/** @internal Grouping option → separator character; the first entry is the default. */\nexport const GROUP_SEPARATORS: ReadonlyMap<AriaryGrouping, string> = new Map<AriaryGrouping, string>(${literal(tables.groupSeparators)});`,
    constant('DEFAULT_GROUPING', tables.groupSeparators[0]?.[0] ?? ''),
    `/** Decimal separator used by {@link formatAriary} and the parsers: \`comma\` (default) or \`dot\`. */\nexport type AriaryDecimal = ${decimalUnion};`,
    `/** @internal Decimal option → separator character; the first entry is the default. */\nexport const DECIMAL_SEPARATORS: ReadonlyMap<AriaryDecimal, string> = new Map<AriaryDecimal, string>(${literal(tables.decimalSeparators)});`,
    constant('DEFAULT_DECIMAL', tables.decimalSeparators[0]?.[0] ?? ''),
    constant('READABLE_SEPARATORS', tables.readableSeparators),
    constant('CURRENCY_TOKENS', tables.currencyTokens, 'Lower-cased, longest first.'),
    constant('FRANC_SYMBOL', tables.francSymbol),
    constant('FRANCS_PER_ARIARY', tables.francsPerAriary),
    constant('FRANC_DIVISION_FACTOR', tables.francDivisionFactor, '10 ÷ FRANCS_PER_ARIARY.'),
    constant('MIN_AMOUNT', tables.minAmount),
    constant('MAX_TEXT_LENGTH', tables.maxTextLength, 'Longest decimal text taken as an amount.'),
    constant('MAX_READ_LENGTH', tables.maxReadLength, 'Longest text the parsers read.'),
  ];
}
