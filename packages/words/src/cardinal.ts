// Whole numbers in words, from their decimal digits, so counts of any length stay exact.
import {
  HUNDRED_WORDS,
  JOINER_BELOW_THOUSAND,
  JOINER_BETWEEN_GROUPS,
  JOINER_UNITS_BEFORE_TEN,
  SCALES,
  TEN_WORDS,
  TRADITIONAL_SCALES,
  UNIT_ONE_IN_COMPOUND,
  UNIT_WORDS,
  ZERO_WORD,
} from './generated/data.ts';
import type { NumberSystem } from './system.ts';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Scale = (typeof SCALES)[number] | (typeof TRADITIONAL_SCALES)[number];
type ScaleTable = readonly Scale[];
// A whole number joins its groups with "sy" (rule 8); a count before a group word is one
// phrase, every part joined by "amby" (rule 6).
type Role = 'number' | 'count';

const BASE = 10;
const HUNDRED = BASE * BASE;
const BELOW_THOUSAND_DIGITS = 3;
// Rule 7: a count of one is bare only for arivo.
const BARE_ONE_EXPONENT = SCALES[0].exponent;
const LEADING_ZEROS = /^0+/;
const ONE = '1';
const JOINERS: Readonly<Record<Role, string>> = {
  number: JOINER_BETWEEN_GROUPS,
  count: JOINER_BELOW_THOUSAND,
};

function digitAt(value: number, place: number): Digit {
  return (Math.floor(value / place) % BASE) as Digit;
}

function isNotEmpty(word: string): boolean {
  return word !== '';
}

// 11–19 join with "ambin'ny", other units onto tens with "amby".
function belowHundredWords(unitWord: string, units: Digit, tens: Digit): string {
  if (tens === 1 && units > 0) return `${unitWord} ${JOINER_UNITS_BEFORE_TEN} ${TEN_WORDS[1]}`;
  return [unitWord, TEN_WORDS[tens]].filter(isNotEmpty).join(` ${JOINER_BELOW_THOUSAND} `);
}

// The part below 1000, and the joiner that follows it ('' when nothing does).
interface Lowest {
  readonly value: number;
  readonly role: Role;
  readonly nextJoiner: string;
}

// Rule 4: the part below 100 joins exactly 100 with "amby" and 200–900 with "sy"; inside a
// count every join is "amby". "iraika" replaces "iray" right before "amby" or "ambin'ny".
function belowThousandWords({ value, role, nextJoiner }: Lowest): string {
  const units = digitAt(value, 1);
  const tens = digitAt(value, BASE);
  const hundreds = digitAt(value, HUNDRED);
  const joiner = role === 'count' || hundreds === 1 ? JOINER_BELOW_THOUSAND : JOINER_BETWEEN_GROUPS;
  const afterUnits = tens > 0 || hundreds > 0 ? joiner : nextJoiner;
  const isOneBeforeAmby = units === 1 && (tens > 0 || afterUnits === JOINER_BELOW_THOUSAND);
  const unitWord = isOneBeforeAmby ? UNIT_ONE_IN_COMPOUND : UNIT_WORDS[units];
  const belowHundred = belowHundredWords(unitWord, units, tens);
  return [belowHundred, HUNDRED_WORDS[hundreds]].filter(isNotEmpty).join(` ${joiner} `);
}

// How many digits the traditional names reach: up to the largest name's single digit.
const TRADITIONAL_REACH = TRADITIONAL_SCALES.reduce(
  (most, scale) => Math.max(most, scale.exponent + scale.countDigits),
  0,
);

// Rule 12: a number longer than the traditional names reach is read with the standard scales.
function scalesFor(digits: string, system: NumberSystem): ScaleTable {
  return system === 'traditional' && digits.length <= TRADITIONAL_REACH
    ? TRADITIONAL_SCALES
    : SCALES;
}

// The digits a group counts, without leading zeros: '' when the group is absent.
function scaleCount(digits: string, scale: Scale): string {
  const end = digits.length - scale.exponent;
  if (end <= 0) return '';
  const start = scale.countDigits === null ? 0 : Math.max(0, end - scale.countDigits);
  return digits.slice(start, end).replace(LEADING_ZEROS, '');
}

function scaleWords(digits: string, scale: Scale, scales: ScaleTable): string {
  const count = scaleCount(digits, scale);
  if (count === '') return '';
  if (count === ONE && scale.exponent === BARE_ONE_EXPONENT) return scale.word;
  return `${numberWords(count, scales, 'count')} ${scale.word}`;
}

function numberWords(significant: string, scales: ScaleTable, role: Role): string {
  const upper = scales.map((scale) => scaleWords(significant, scale, scales)).filter(isNotEmpty);
  const joiner = JOINERS[role];
  const lowest = belowThousandWords({
    value: Number(significant.slice(-BELOW_THOUSAND_DIGITS)),
    role,
    nextJoiner: upper.length > 0 ? joiner : '',
  });
  return [lowest, ...upper].filter(isNotEmpty).join(` ${joiner} `);
}

/**
 * @internal A whole number in words, groups joined by "sy", smallest first.
 *
 * @param digits - Decimal digits; leading zeros are ignored.
 * @param system - `standard` or `traditional` (rule 12).
 * @returns The words: `'2586'` → `'enina amby valopolo sy dimanjato sy roa arivo'`.
 */
export function wholeWords(digits: string, system: NumberSystem): string {
  const significant = digits.replace(LEADING_ZEROS, '');
  if (significant === '') return ZERO_WORD;
  return numberWords(significant, scalesFor(significant, system), 'number');
}

/**
 * @internal A count as {@link wholeWords} writes it before a group word.
 *
 * @param count - The count, from 1, as a bigint.
 * @param system - Whether the group word is a standard or a traditional name.
 * @returns The count's words: `25000n` → `'dimy arivo amby roa alina'`.
 */
export function countWords(count: bigint, system: NumberSystem): string {
  const scales = system === 'traditional' ? TRADITIONAL_SCALES : SCALES;
  return numberWords(count.toString(), scales, 'count');
}
