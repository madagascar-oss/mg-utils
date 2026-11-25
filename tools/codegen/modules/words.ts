// words: spec data → lookup tables → TypeScript constants.
import type { Valued, Worded } from './shared.ts';
import { constant } from '../emit.ts';

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

interface WordsTables {
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

// Place values of the digits each word table covers.
const UNIT_STEP = 1;

const TEN_STEP = 10;

const HUNDRED_STEP = 100;

/** Words indexed by digit (index 0 is ''), checked for gaps against the spec values. */
function indexedWords(entries: readonly Valued[], step: number): string[] {
  return ['', ...entries.map((entry) => entry.word)].map((word, digit) => {
    const expected = digit * step;
    const found = entries.find((entry) => entry.value === expected);
    if (digit > 0 && found?.word !== word) throw new Error(`spec gap at value ${String(expected)}`);
    return word;
  });
}

function wordsTables(data: WordsData): WordsTables {
  return {
    zeroWord: data.zero.word,
    unitWords: indexedWords(data.units, UNIT_STEP),
    unitOneInCompound: data.unitOneInCompound.word,
    tenWords: indexedWords(data.tens, TEN_STEP),
    hundredWords: indexedWords(data.hundreds, HUNDRED_STEP),
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

export function emit(data: WordsData): string[] {
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
