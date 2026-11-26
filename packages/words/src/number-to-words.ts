import {
  DECIMAL_SEPARATOR,
  HUNDRED_WORDS,
  JOINER_BELOW_THOUSAND,
  JOINER_BETWEEN_GROUPS,
  JOINER_UNITS_BEFORE_TEN,
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
const BELOW_THOUSAND_DIGITS = 3;
const FIRST_SCALE_EXPONENT = SCALES[0].exponent;
const ONE = '1';
const LEADING_ZEROS = /^0+/;
// String(value) of a small number, e.g. '1e-7' or '1.5e-10'.
const NEGATIVE_EXPONENT = /^(\d)(?:\.(\d+))?e-(\d+)$/;

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

// The digits a group counts, without leading zeros: '' when the group is absent. The largest
// group takes every digit left, so its count can be any size.
function scaleCount(digits: string, scale: Scale): string {
  const end = digits.length - scale.exponent;
  if (end <= 0) return '';
  const start = scale.countDigits === null ? 0 : Math.max(0, end - scale.countDigits);
  return digits.slice(start, end).replace(LEADING_ZEROS, '');
}

// A count of one is bare only for the first group: "arivo", but "iray alina", "iray tapitrisa".
// Counts are read with every rule, so 1000 lavitrisa is "arivo lavitrisa".
function scaleWords(digits: string, scale: Scale): string {
  const count = scaleCount(digits, scale);
  if (count === '') return '';
  if (count === ONE && scale.exponent === FIRST_SCALE_EXPONENT) return scale.word;
  return `${wholeWords(count)} ${scale.word}`;
}

// Works on decimal digits, not arithmetic, so counts and decimals of any length stay exact.
function wholeWords(digits: string): string {
  const significant = digits.replace(LEADING_ZEROS, '');
  if (significant === '') return ZERO_WORD;
  const groups = [
    belowThousandWords(Number(significant.slice(-BELOW_THOUSAND_DIGITS))),
    ...SCALES.map((scale) => scaleWords(significant, scale)),
  ];
  return groups.filter(isNotEmpty).join(` ${JOINER_BETWEEN_GROUPS} `);
}

// Each leading zero after the point is "aotra"; the rest reads as a whole number.
function decimalWords(digits: string): string {
  const significant = digits.replace(LEADING_ZEROS, '');
  const zeros = Array.from({ length: digits.length - significant.length }, () => ZERO_WORD);
  return [...zeros, wholeWords(significant)].join(' ');
}

// The shortest exact decimal form of the value, never in exponent notation.
function plainDecimal(value: number): string {
  const text = String(value);
  const match = NEGATIVE_EXPONENT.exec(text);
  if (match === null) return text;
  const [, lead = '', rest = '', exponent = ''] = match;
  return `0.${'0'.repeat(Number(exponent) - 1)}${lead}${rest}`;
}

function assertSupportedNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new MgError('INVALID_TYPE', 'numberToWords expects a finite number.');
  }
  if (value < MIN_VALUE || value > Number.MAX_SAFE_INTEGER) {
    throw new MgError(
      'OUT_OF_RANGE',
      `numberToWords supports ${String(MIN_VALUE)} to ${String(Number.MAX_SAFE_INTEGER)}.`,
    );
  }
}

/**
 * Writes a number in Malagasy words, smallest part first, with `faingo` before the decimals.
 *
 * @param value - A number from 0 to `Number.MAX_SAFE_INTEGER`, whole or decimal.
 * @returns The number in Malagasy words.
 * @throws {@link MgError} `INVALID_TYPE` if `value` is not a finite number,
 *   `OUT_OF_RANGE` if it is negative or above `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * ```ts
 * numberToWords(21); // 'iraika amby roapolo'
 * numberToWords(2026); // 'enina amby roapolo sy roa arivo'
 * numberToWords(3.14); // "telo faingo efatra ambin'ny folo"
 * ```
 */
export function numberToWords(value: number): string {
  assertSupportedNumber(value);
  const [whole = '', decimals] = plainDecimal(value).split('.');
  if (decimals === undefined) return wholeWords(whole);
  return `${wholeWords(whole)} ${DECIMAL_SEPARATOR} ${decimalWords(decimals)}`;
}
