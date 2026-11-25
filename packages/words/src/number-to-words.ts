import {
  HUNDRED_WORDS,
  JOINER_BELOW_THOUSAND,
  JOINER_BETWEEN_GROUPS,
  JOINER_UNITS_BEFORE_TEN,
  MAX_VALUE,
  MIN_VALUE,
  SCALES,
  TEN_WORDS,
  UNIT_ONE_IN_COMPOUND,
  UNIT_WORDS,
  ZERO_WORD,
} from './generated/data.ts';
import { MgError } from './generated/errors.ts';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Scale = (typeof SCALES)[number];

const BASE = 10;
const HUNDRED = BASE * BASE;
const FIRST_SCALE_VALUE = SCALES[0].value;

function digitAt(value: number, place: number): Digit {
  return (Math.floor(value / place) % BASE) as Digit;
}

function isNotEmpty(word: string): boolean {
  return word !== '';
}

// Malagasy reads upwards: units, then tens, then hundreds. 11–19 join with "ambin'ny", other
// units onto tens with "amby"; "iraika" replaces "iray" only right before those words.
function belowHundredWords(unitWord: string, units: Digit, tens: Digit): string {
  if (tens === 1 && units > 0) return `${unitWord} ${JOINER_UNITS_BEFORE_TEN} ${TEN_WORDS[1]}`;
  return [unitWord, TEN_WORDS[tens]].filter(isNotEmpty).join(` ${JOINER_BELOW_THOUSAND} `);
}

// The smaller part joins exactly 100 with "amby" ("dimy amby zato") and 200–900 with "sy"
// ("dimy sy roanjato"), at every size of number.
function belowThousandWords(value: number): string {
  const units = digitAt(value, 1);
  const tens = digitAt(value, BASE);
  const hundreds = digitAt(value, HUNDRED);
  const isOneBeforeAmby = units === 1 && (tens > 0 || hundreds === 1);
  const unitWord = isOneBeforeAmby ? UNIT_ONE_IN_COMPOUND : UNIT_WORDS[units];
  const belowHundred = belowHundredWords(unitWord, units, tens);
  const joiner = hundreds === 1 ? JOINER_BELOW_THOUSAND : JOINER_BETWEEN_GROUPS;
  return [belowHundred, HUNDRED_WORDS[hundreds]].filter(isNotEmpty).join(` ${joiner} `);
}

// A count of one is bare only for the first group: "arivo", but "iray alina", "iray tapitrisa".
function scaleWords(value: number, scale: Scale): string {
  const count = Math.floor(value / scale.value) % (scale.maxCount + 1);
  if (count === 0) return '';
  if (count === 1 && scale.value === FIRST_SCALE_VALUE) return scale.word;
  return `${belowThousandWords(count)} ${scale.word}`;
}

function assertSupportedInteger(value: unknown): asserts value is number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new MgError('INVALID_TYPE', 'numberToWords expects an integer.');
  }
  if (value < MIN_VALUE || value > MAX_VALUE) {
    throw new MgError(
      'OUT_OF_RANGE',
      `numberToWords supports ${String(MIN_VALUE)} to ${String(MAX_VALUE)}.`,
    );
  }
}

/**
 * Writes a whole number in Malagasy words, smallest part first.
 *
 * @param value - An integer from 0 to 999 999 999 999.
 * @returns The number in Malagasy words.
 * @throws {@link MgError} `INVALID_TYPE` if `value` is not an integer,
 *   `OUT_OF_RANGE` if it is negative or above 999 999 999 999.
 *
 * @example
 * ```ts
 * numberToWords(21); // 'iraika amby roapolo'
 * numberToWords(2026); // 'enina amby roapolo sy roa arivo'
 * ```
 */
export function numberToWords(value: number): string {
  assertSupportedInteger(value);
  if (value === 0) return ZERO_WORD;
  const groups = [
    belowThousandWords(value % FIRST_SCALE_VALUE),
    ...SCALES.map((scale) => scaleWords(value, scale)),
  ];
  return groups.filter(isNotEmpty).join(` ${JOINER_BETWEEN_GROUPS} `);
}
