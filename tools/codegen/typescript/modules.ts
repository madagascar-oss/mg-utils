// One emitter per module turns spec data into ready-made lookup structures.
// Modules without an emitter get the generic `DATA` constant.
import { GENERATED_HEADER, constant, literal, publicConstant } from './emit.ts';

interface Valued {
  readonly value: number;
  readonly word: string;
}
interface Worded {
  readonly word: string;
}

interface WordsData {
  readonly zero: Worded;
  readonly units: readonly Valued[];
  readonly unitOneInCompound: Worded;
  readonly tens: readonly Valued[];
  readonly hundreds: readonly Valued[];
  readonly scales: readonly (Valued & { readonly maxCount: number })[];
  readonly joiners: Readonly<Record<'unitsBeforeTen' | 'belowThousand' | 'betweenGroups', Worded>>;
  readonly limits: { readonly min: number; readonly max: number };
}

interface PhoneData {
  readonly plan: {
    readonly countryCode: string;
    readonly internationalPrefix: string;
    readonly trunkPrefix: string;
    readonly nationalNumberLength: number;
    readonly grouping: readonly number[];
  };
  readonly operators: readonly {
    readonly id: string;
    readonly name: string;
    readonly prefixes: readonly string[];
  }[];
}

function indexedWords(entries: readonly Valued[], step: number): string[] {
  return ['', ...entries.map((entry) => entry.word)].map((word, digit) => {
    const expected = digit * step;
    const found = entries.find((entry) => entry.value === expected);
    if (digit > 0 && found?.word !== word) throw new Error(`spec gap at value ${String(expected)}`);
    return word;
  });
}

function words(data: WordsData): string[] {
  return [
    constant('ZERO_WORD', data.zero.word),
    constant('UNIT_WORDS', indexedWords(data.units, 1), 'Index = digit; index 0 is unused.'),
    constant('UNIT_ONE_IN_COMPOUND', data.unitOneInCompound.word),
    constant('TEN_WORDS', indexedWords(data.tens, 10), 'Index = tens digit.'),
    constant('HUNDRED_WORDS', indexedWords(data.hundreds, 100), 'Index = hundreds digit.'),
    constant(
      'SCALES',
      [...data.scales].sort((left, right) => left.value - right.value),
      'Ascending by value.',
    ),
    constant('JOINER_UNITS_BEFORE_TEN', data.joiners.unitsBeforeTen.word),
    constant('JOINER_BELOW_THOUSAND', data.joiners.belowThousand.word),
    constant('JOINER_BETWEEN_GROUPS', data.joiners.betweenGroups.word),
    constant('MIN_VALUE', data.limits.min),
    constant('MAX_VALUE', data.limits.max),
  ];
}

function phone(data: PhoneData): string[] {
  const byPrefix = data.operators
    .flatMap((operator) => operator.prefixes.map((prefix) => [prefix, operator.id] as const))
    .sort(([left], [right]) => left.localeCompare(right));
  const idUnion = data.operators.map((operator) => literal(operator.id)).join(' | ');
  const names = Object.fromEntries(data.operators.map((operator) => [operator.id, operator.name]));
  return [
    constant('COUNTRY_CODE', data.plan.countryCode),
    constant('INTERNATIONAL_PREFIX', data.plan.internationalPrefix),
    constant('TRUNK_PREFIX', data.plan.trunkPrefix),
    constant('NATIONAL_NUMBER_LENGTH', data.plan.nationalNumberLength),
    constant('GROUPING', data.plan.grouping, 'Digit group sizes of the national number.'),
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
    `/** @internal Two-digit operator code → operator. */\nexport const OPERATOR_BY_PREFIX: ReadonlyMap<string, OperatorId> = new Map<string, OperatorId>(${literal(byPrefix)});`,
    constant('OPERATOR_PREFIX_LENGTH', byPrefix[0]?.[0].length ?? 0),
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
