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
    readonly prefixes?: readonly string[];
    readonly fixedPrefixes?: readonly string[];
  }[];
  readonly fixedZones: {
    readonly prefix: string;
    readonly zones: readonly { readonly digit: string; readonly name: string }[];
  };
  readonly areas: {
    readonly entries: readonly {
      readonly prefix: string;
      readonly name: string;
      readonly province: string;
    }[];
  };
}

type LineType = 'mobile' | 'fixed';
type PrefixEntry = readonly [string, { readonly operator: string; readonly type: LineType }];

interface PhoneTables {
  readonly countryCode: string;
  readonly internationalPrefix: string;
  readonly trunkPrefix: string;
  readonly nationalNumberLength: number;
  readonly grouping: readonly number[];
  readonly operators: readonly { readonly id: string; readonly name: string }[];
  readonly operatorByPrefix: readonly PrefixEntry[];
  readonly operatorPrefixLength: number;
  readonly fixedZonePrefix: string;
  readonly fixedZoneDigits: readonly string[];
  readonly areas: PhoneData['areas']['entries'];
}

function prefixEntries(data: PhoneData): PrefixEntry[] {
  return data.operators
    .flatMap(({ id, prefixes = [], fixedPrefixes = [] }) => [
      ...prefixes.map((prefix): PrefixEntry => [prefix, { operator: id, type: 'mobile' }]),
      ...fixedPrefixes.map((prefix): PrefixEntry => [prefix, { operator: id, type: 'fixed' }]),
    ])
    .sort(([left], [right]) => left.localeCompare(right));
}

function phoneTables(data: PhoneData): PhoneTables {
  const operatorByPrefix = prefixEntries(data);
  return {
    countryCode: data.plan.countryCode,
    internationalPrefix: data.plan.internationalPrefix,
    trunkPrefix: data.plan.trunkPrefix,
    nationalNumberLength: data.plan.nationalNumberLength,
    grouping: [...data.plan.grouping],
    operators: data.operators.map(({ id, name }) => ({ id, name })),
    operatorByPrefix,
    operatorPrefixLength: operatorByPrefix[0]?.[0].length ?? 0,
    fixedZonePrefix: data.fixedZones.prefix,
    fixedZoneDigits: data.fixedZones.zones.map((zone) => zone.digit),
    // Longest prefix first, so the most precise area wins.
    areas: [...data.areas.entries].sort((left, right) => right.prefix.length - left.prefix.length),
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
    `/** Identifier of a Malagasy telephone operator. */\nexport type OperatorId = ${idUnion};`,
    publicConstant(
      'OPERATOR_NAMES',
      names,
      [
        '/**',
        ' * Display name of each operator, by {@link OperatorId}.',
        ' *',
        ' * @example',
        ' * ```ts',
        " * OPERATOR_NAMES[parsePhone('034 12 345 67').operator]; // 'Yas Madagascar'",
        ' * ```',
        ' */',
      ].join('\n'),
    ),
    `/** @internal Two-digit operator code → operator and line type. */\nexport const OPERATOR_BY_PREFIX: ReadonlyMap<string, { readonly operator: OperatorId; readonly type: 'mobile' | 'fixed' }> = new Map<string, { readonly operator: OperatorId; readonly type: 'mobile' | 'fixed' }>(${literal(tables.operatorByPrefix)});`,
    constant('OPERATOR_PREFIX_LENGTH', tables.operatorPrefixLength),
    constant(
      'FIXED_ZONE_PREFIX',
      tables.fixedZonePrefix,
      'Operator code whose next digit is a zone.',
    ),
    constant('FIXED_ZONE_DIGITS', tables.fixedZoneDigits, 'Assigned zone digits after it.'),
    constant('AREAS', tables.areas, 'Geographic numbers, longest prefix first.'),
  ];
}
