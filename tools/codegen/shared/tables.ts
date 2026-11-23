// Language-neutral lookup tables built from spec data. Every language target emits these
// same tables, so ports differ only in syntax, never in data.

interface Valued {
  readonly value: number;
  readonly word: string;
}
interface Worded {
  readonly word: string;
}

export interface WordsData {
  readonly zero: Worded;
  readonly units: readonly Valued[];
  readonly unitOneInCompound: Worded;
  readonly tens: readonly Valued[];
  readonly hundreds: readonly Valued[];
  readonly scales: readonly (Valued & { readonly maxCount: number })[];
  readonly joiners: Readonly<Record<'unitsBeforeTen' | 'belowThousand' | 'betweenGroups', Worded>>;
  readonly limits: { readonly min: number; readonly max: number };
}

export interface PhoneData {
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

export interface WordsTables {
  readonly zeroWord: string;
  readonly unitWords: readonly string[];
  readonly unitOneInCompound: string;
  readonly tenWords: readonly string[];
  readonly hundredWords: readonly string[];
  readonly scales: readonly {
    readonly value: number;
    readonly word: string;
    readonly maxCount: number;
  }[];
  readonly joinerUnitsBeforeTen: string;
  readonly joinerBelowThousand: string;
  readonly joinerBetweenGroups: string;
  readonly minValue: number;
  readonly maxValue: number;
}

export interface PhoneTables {
  readonly countryCode: string;
  readonly internationalPrefix: string;
  readonly trunkPrefix: string;
  readonly nationalNumberLength: number;
  readonly grouping: readonly number[];
  readonly operators: readonly { readonly id: string; readonly name: string }[];
  readonly operatorByPrefix: readonly (readonly [string, string])[];
  readonly operatorPrefixLength: number;
}

/** Words indexed by digit (index 0 is ''), checked for gaps against the spec values. */
function indexedWords(entries: readonly Valued[], step: number): string[] {
  return ['', ...entries.map((entry) => entry.word)].map((word, digit) => {
    const expected = digit * step;
    const found = entries.find((entry) => entry.value === expected);
    if (digit > 0 && found?.word !== word) throw new Error(`spec gap at value ${String(expected)}`);
    return word;
  });
}

export function wordsTables(data: WordsData): WordsTables {
  return {
    zeroWord: data.zero.word,
    unitWords: indexedWords(data.units, 1),
    unitOneInCompound: data.unitOneInCompound.word,
    tenWords: indexedWords(data.tens, 10),
    hundredWords: indexedWords(data.hundreds, 100),
    scales: [...data.scales]
      .sort((left, right) => left.value - right.value)
      .map(({ value, word, maxCount }) => ({ value, word, maxCount })),
    joinerUnitsBeforeTen: data.joiners.unitsBeforeTen.word,
    joinerBelowThousand: data.joiners.belowThousand.word,
    joinerBetweenGroups: data.joiners.betweenGroups.word,
    minValue: data.limits.min,
    maxValue: data.limits.max,
  };
}

export function phoneTables(data: PhoneData): PhoneTables {
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
