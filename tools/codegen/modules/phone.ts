// phone: spec data → lookup tables → TypeScript constants.
import { constant, literal, publicConstant } from '../emit.ts';

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

interface PhoneTables {
  readonly countryCode: string;
  readonly internationalPrefix: string;
  readonly trunkPrefix: string;
  readonly nationalNumberLength: number;
  readonly grouping: readonly number[];
  readonly operators: readonly { readonly id: string; readonly name: string }[];
  readonly operatorByPrefix: readonly (readonly [string, string])[];
  readonly operatorPrefixLength: number;
}

function phoneTables(data: PhoneData): PhoneTables {
  const operatorByPrefix = data.operators
    .flatMap((operator) => operator.prefixes.map((prefix) => [prefix, operator.id] as const))
    .sort(([left], [right]) => left.localeCompare(right));
  return {
    countryCode: data.plan.countryCode,
    internationalPrefix: data.plan.internationalPrefix,
    trunkPrefix: data.plan.trunkPrefix,
    nationalNumberLength: data.plan.nationalNumberLength,
    grouping: [...data.plan.grouping],
    operators: data.operators.map(({ id, name }) => ({ id, name })),
    operatorByPrefix,
    operatorPrefixLength: operatorByPrefix[0]?.[0].length ?? 0,
  };
}

export function emit(data: PhoneData): string[] {
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
