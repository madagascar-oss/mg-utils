// One emitter per module turns the shared tables into PHP files.
// Modules without an emitter get a generic `Data::DATA` constant.
import { phoneTables, wordsTables, type PhoneData, type WordsData } from '../shared/tables.ts';
import { ROOT_NAMESPACE, dataClass, pascalCase, phpFile, phpLiteral } from './emit.ts';

export interface PhpOutput {
  readonly path: string;
  readonly source: string;
}

const SCALE_TYPE = 'list<array{value: int, word: string, maxCount: int}>';

function words(data: WordsData, source: string): PhpOutput[] {
  const tables = wordsTables(data);
  const namespace = `${ROOT_NAMESPACE}\\Words\\Generated`;
  return [
    {
      path: 'Words/Generated/Data.php',
      source: dataClass(
        namespace,
        [
          { name: 'ZERO_WORD', type: 'string', value: tables.zeroWord },
          { name: 'UNIT_WORDS', type: 'array', value: tables.unitWords, varDoc: 'list<string>' },
          { name: 'UNIT_ONE_IN_COMPOUND', type: 'string', value: tables.unitOneInCompound },
          { name: 'TEN_WORDS', type: 'array', value: tables.tenWords, varDoc: 'list<string>' },
          {
            name: 'HUNDRED_WORDS',
            type: 'array',
            value: tables.hundredWords,
            varDoc: 'list<string>',
          },
          { name: 'SCALES', type: 'array', value: tables.scales, varDoc: SCALE_TYPE },
          { name: 'JOINER_UNITS_BEFORE_TEN', type: 'string', value: tables.joinerUnitsBeforeTen },
          { name: 'JOINER_BELOW_THOUSAND', type: 'string', value: tables.joinerBelowThousand },
          { name: 'JOINER_BETWEEN_GROUPS', type: 'string', value: tables.joinerBetweenGroups },
          { name: 'MIN_VALUE', type: 'int', value: tables.minValue },
          { name: 'MAX_VALUE', type: 'int', value: tables.maxValue },
        ],
        source,
      ),
    },
  ];
}

function operatorEnum(operators: readonly { id: string; name: string }[]): string {
  const cases = operators
    .map((op) => `    case ${pascalCase(op.id)} = ${phpLiteral(op.id)};`)
    .join('\n');
  const names = operators
    .map((op) => `            self::${pascalCase(op.id)} => ${phpLiteral(op.name)},`)
    .join('\n');
  return phpFile(
    `${ROOT_NAMESPACE}\\Phone`,
    `/**
 * A Malagasy mobile operator, identified by the same id in every language.
 *
 * Example: \`PhoneNumber::parse('034 12 345 67')->operator === Operator::Telma\`
 */
enum Operator: string
{
${cases}

    /**
     * Display name of the operator, e.g. \`Telma\`.
     */
    public function displayName(): string
    {
        return match ($this) {
${names}
        };
    }
}`,
  );
}

function phone(data: PhoneData, source: string): PhpOutput[] {
  const tables = phoneTables(data);
  return [
    {
      path: 'Phone/Generated/Data.php',
      source: dataClass(
        `${ROOT_NAMESPACE}\\Phone\\Generated`,
        [
          { name: 'COUNTRY_CODE', type: 'string', value: tables.countryCode },
          { name: 'INTERNATIONAL_PREFIX', type: 'string', value: tables.internationalPrefix },
          { name: 'TRUNK_PREFIX', type: 'string', value: tables.trunkPrefix },
          { name: 'NATIONAL_NUMBER_LENGTH', type: 'int', value: tables.nationalNumberLength },
          { name: 'GROUPING', type: 'array', value: tables.grouping, varDoc: 'list<int>' },
          {
            name: 'OPERATOR_BY_PREFIX',
            type: 'array',
            value: Object.fromEntries(tables.operatorByPrefix),
            // PHP stores numeric-string keys such as '34' as integers.
            varDoc: 'array<int|string, string>',
          },
          { name: 'OPERATOR_PREFIX_LENGTH', type: 'int', value: tables.operatorPrefixLength },
        ],
        source,
      ),
    },
    { path: 'Phone/Operator.php', source: operatorEnum(tables.operators) },
  ];
}

const EMITTERS: Readonly<Record<string, (data: never, source: string) => PhpOutput[]>> = {
  words,
  phone,
};

export function moduleFiles(module: string, data: unknown, specVersion: string): PhpOutput[] {
  const source = `spec/${module}/data.yaml (spec ${specVersion})`;
  const emit = EMITTERS[module];
  if (emit !== undefined) return emit(data as never, source);
  const pascal = pascalCase(module);
  return [
    {
      path: `${pascal}/Generated/Data.php`,
      source: dataClass(
        `${ROOT_NAMESPACE}\\${pascal}\\Generated`,
        [{ name: 'DATA', type: 'array', value: data, varDoc: 'array<mixed>' }],
        source,
      ),
    },
  ];
}
