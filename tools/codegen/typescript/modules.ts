// One emitter per module turns the shared tables into TypeScript constants.
// Modules without an emitter get the generic `DATA` constant.
import { phoneTables, wordsTables, type PhoneData, type WordsData } from '../shared/tables.ts';
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

const EMITTERS: Readonly<Record<string, (data: never) => string[]>> = { words, phone };

export function dataFile(module: string, data: unknown, specVersion: string): string {
  const emit = EMITTERS[module];
  const body = emit === undefined ? [constant('DATA', data)] : emit(data as never);
  return (
    [GENERATED_HEADER, `// From spec/${module}/data.yaml, spec ${specVersion}.`, ...body].join(
      '\n\n',
    ) + '\n'
  );
}
