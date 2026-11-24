// One emitter per module turns the shared tables into TypeScript constants.
// Modules without an emitter get the generic `DATA` constant.
import {
  ariaryTables,
  dateTables,
  phoneTables,
  wordsTables,
  type AriaryData,
  type DateData,
  type PhoneData,
  type WordsData,
} from '../shared/tables.ts';
import { GENERATED_HEADER, constant, literal, publicConstant } from './emit.ts';

function words(data: WordsData): string[] {
  const tables = wordsTables(data);
  return [
    constant('ZERO_WORD', tables.zeroWord),
    constant('UNIT_WORDS', tables.unitWords, 'Index = digit; index 0 is unused.'),
    constant('UNIT_ONE_IN_COMPOUND', tables.unitOneInCompound),
    constant('TEN_WORDS', tables.tenWords, 'Index = tens digit.'),
    constant('HUNDRED_WORDS', tables.hundredWords, 'Index = hundreds digit.'),
    constant('SCALES', tables.scales, 'Ascending by value.'),
    constant('JOINER_UNITS_BEFORE_TEN', tables.joinerUnitsBeforeTen),
    constant('JOINER_BELOW_THOUSAND', tables.joinerBelowThousand),
    constant('JOINER_BETWEEN_GROUPS', tables.joinerBetweenGroups),
    constant('MIN_VALUE', tables.minValue),
    constant('MAX_VALUE', tables.maxValue),
  ];
}

function phone(data: PhoneData): string[] {
  const tables = phoneTables(data);
  const idUnion = tables.operators.map((operator) => literal(operator.id)).join(' | ');
  const names = Object.fromEntries(
    tables.operators.map((operator) => [operator.id, operator.name]),
  );
  return [
    constant('COUNTRY_CODE', tables.countryCode),
    constant('INTERNATIONAL_PREFIX', tables.internationalPrefix),
    constant('TRUNK_PREFIX', tables.trunkPrefix),
    constant('NATIONAL_NUMBER_LENGTH', tables.nationalNumberLength),
    constant('GROUPING', tables.grouping, 'Digit group sizes of the national number.'),
    `/** Identifier of a Malagasy mobile operator. */\nexport type OperatorId = ${idUnion};`,
    publicConstant(
      'OPERATOR_NAMES',
      names,
      [
        '/**',
        ' * Display name of each mobile operator, by {@link OperatorId}.',
        ' *',
        ' * @example',
        ' * ```ts',
        " * OPERATOR_NAMES[parsePhoneNumber('034 12 345 67').operator]; // 'Telma'",
        ' * ```',
        ' */',
      ].join('\n'),
    ),
    `/** @internal Two-digit operator code → operator. */\nexport const OPERATOR_BY_PREFIX: ReadonlyMap<string, OperatorId> = new Map<string, OperatorId>(${literal(tables.operatorByPrefix)});`,
    constant('OPERATOR_PREFIX_LENGTH', tables.operatorPrefixLength),
  ];
}

function ariary(data: AriaryData): string[] {
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

function date(data: DateData): string[] {
  const tables = dateTables(data);
  const styleUnion = tables.styles.map(([id]) => literal(id)).join(' | ');
  return [
    constant('MONTH_NAMES', tables.monthNames, 'Index = month number; index 0 is unused.'),
    constant('MONTH_ABBREVIATIONS', tables.monthAbbreviations, 'Index = month number.'),
    constant(
      'WEEKDAY_NAMES',
      tables.weekdayNames,
      'Index = ISO weekday (Monday 1); index 0 is unused.',
    ),
    constant('WEEKDAY_ABBREVIATIONS', tables.weekdayAbbreviations, 'Index = ISO weekday.'),
    `/** Date style for {@link formatDate}; \`long\` is the default. */\nexport type DateStyle = ${styleUnion};`,
    `/** @internal Style → CLDR pattern; the first entry is the default. */\nexport const STYLE_PATTERNS: ReadonlyMap<DateStyle, string> = new Map<DateStyle, string>(${literal(tables.styles)});`,
    constant('DEFAULT_STYLE', tables.styles[0]?.[0] ?? ''),
    constant('MIN_YEAR', tables.minYear),
    constant('MAX_YEAR', tables.maxYear),
  ];
}

const EMITTERS: Readonly<Record<string, (data: never) => string[]>> = {
  words,
  phone,
  ariary,
  date,
};

export function dataFile(module: string, data: unknown, specVersion: string): string {
  const emit = EMITTERS[module];
  const body = emit === undefined ? [constant('DATA', data)] : emit(data as never);
  return (
    [GENERATED_HEADER, `// From spec/${module}/data.yaml, spec ${specVersion}.`, ...body].join(
      '\n\n',
    ) + '\n'
  );
}
