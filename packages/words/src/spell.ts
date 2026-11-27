import {
  DECIMAL_SEPARATOR,
  HUNDRED_WORDS,
  JOINER_BELOW_THOUSAND,
  JOINER_BETWEEN_GROUPS,
  JOINER_UNITS_BEFORE_TEN,
  MAX_TEXT_LENGTH,
  MIN_VALUE,
  SCALES,
  TEN_WORDS,
  TRADITIONAL_SCALES,
  UNIT_ONE_IN_COMPOUND,
  UNIT_WORDS,
  ZERO_WORD,
} from './generated/data.ts';
import { MdgError } from './generated/errors.ts';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Scale = (typeof SCALES)[number] | (typeof TRADITIONAL_SCALES)[number];
type ScaleTable = readonly Scale[];

/**
 * How large numbers are named: `standard` (default; `telopolo tapitrisa` for 30 000 000) or
 * `traditional`, with one name per power of ten (`telo safatsiroa`).
 *
 * @example
 * ```ts
 * const system: NumberSystem = 'traditional';
 * ```
 */
export type NumberSystem = 'standard' | 'traditional';

/**
 * Options for {@link spell}.
 *
 * @example
 * ```ts
 * const options: SpellOptions = { system: 'traditional' };
 * ```
 */
export interface SpellOptions {
  /** `standard` (default) or `traditional`. */
  readonly system?: NumberSystem;
}

const SCALES_BY_SYSTEM: Readonly<Record<NumberSystem, ScaleTable>> = {
  standard: SCALES,
  traditional: TRADITIONAL_SCALES,
};
const SYSTEMS: ReadonlySet<unknown> = new Set(Object.keys(SCALES_BY_SYSTEM));
const DEFAULT_SYSTEM: NumberSystem = 'standard';

const BASE = 10;
const HUNDRED = BASE * BASE;
const BELOW_THOUSAND_DIGITS = 3;
const FIRST_SCALE_EXPONENT = SCALES[0].exponent;
const ONE = '1';
const LEADING_ZEROS = /^0+/;
const TRAILING_ZEROS = /0+$/;
// Rule 13: ASCII digits, then optionally a point and more digits. Nothing else.
const DECIMAL_TEXT = /^([0-9]+)(?:\.([0-9]+))?$/;
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
function scaleWords(digits: string, scale: Scale, scales: ScaleTable): string {
  const count = scaleCount(digits, scale);
  if (count === '') return '';
  if (count === ONE && scale.exponent === FIRST_SCALE_EXPONENT) return scale.word;
  return `${wholeWords(count, scales)} ${scale.word}`;
}

// How many digits a table can name: the largest group's count width, or no limit.
function reach(scales: ScaleTable): number {
  const largest = scales[scales.length - 1];
  return largest?.countDigits == null ? Infinity : largest.exponent + largest.countDigits;
}

// Rule 12: a number longer than the traditional names reach is read with the standard scales.
function tableFor(digits: string, scales: ScaleTable): ScaleTable {
  return digits.replace(LEADING_ZEROS, '').length > reach(scales) ? SCALES : scales;
}

// Works on decimal digits, not arithmetic, so counts and decimals of any length stay exact.
function wholeWords(digits: string, scales: ScaleTable): string {
  const significant = digits.replace(LEADING_ZEROS, '');
  if (significant === '') return ZERO_WORD;
  const groups = [
    belowThousandWords(Number(significant.slice(-BELOW_THOUSAND_DIGITS))),
    ...scales.map((scale) => scaleWords(significant, scale, scales)),
  ];
  return groups.filter(isNotEmpty).join(` ${JOINER_BETWEEN_GROUPS} `);
}

// Each leading zero after the point is "aotra"; the rest reads as a whole number.
function decimalWords(digits: string, scales: ScaleTable): string {
  const significant = digits.replace(LEADING_ZEROS, '');
  const zeros = Array.from({ length: digits.length - significant.length }, () => ZERO_WORD);
  return [...zeros, wholeWords(significant, tableFor(significant, scales))].join(' ');
}

// The shortest exact decimal form of the value, never in exponent notation.
function plainDecimal(value: number): string {
  const text = String(value);
  const match = NEGATIVE_EXPONENT.exec(text);
  if (match === null) return text;
  const [, lead = '', rest = '', exponent = ''] = match;
  return `0.${'0'.repeat(Number(exponent) - 1)}${lead}${rest}`;
}

// Rule 13: the whole digits and the decimals of plain decimal text, trailing decimal zeros
// dropped. Checked at the edge, so the reading below trusts its digits.
function decimalTextParts(text: string): readonly [string, string | undefined] {
  const match = text.length <= MAX_TEXT_LENGTH ? DECIMAL_TEXT.exec(text) : null;
  if (match === null) {
    throw new MdgError(
      'INVALID_FORMAT',
      `spell reads digits with an optional .decimals, at most ${String(MAX_TEXT_LENGTH)} characters.`,
    );
  }
  const [, whole = '', decimals = ''] = match;
  const significantDecimals = decimals.replace(TRAILING_ZEROS, '');
  return [whole, significantDecimals === '' ? undefined : significantDecimals];
}

function numberParts(value: number): readonly [string, string | undefined] {
  assertSupportedNumber(value);
  const [whole = '', decimals] = plainDecimal(value).split('.');
  return [whole, decimals];
}

function assertSupportedNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new MdgError('INVALID_TYPE', 'spell expects a finite number or decimal text.');
  }
  if (value < MIN_VALUE || value > Number.MAX_SAFE_INTEGER) {
    throw new MdgError(
      'OUT_OF_RANGE',
      `spell supports ${String(MIN_VALUE)} to ${String(Number.MAX_SAFE_INTEGER)}.`,
    );
  }
}

function scalesFor(options: unknown): ScaleTable {
  if (typeof options !== 'object' || options === null) {
    throw new MdgError('INVALID_TYPE', 'spell options must be an object.');
  }
  const { system = DEFAULT_SYSTEM } = options as SpellOptions;
  if (!SYSTEMS.has(system)) {
    throw new MdgError('INVALID_TYPE', 'system is standard or traditional.');
  }
  return SCALES_BY_SYSTEM[system];
}

/**
 * Writes a number in Malagasy words, smallest part first, with `faingo` before the decimals.
 *
 * @param value - A number from 0 to `Number.MAX_SAFE_INTEGER`, whole or decimal, or plain
 *   decimal text such as `'2000000000000000.9'`, read exactly (a number that large has already
 *   lost its decimals to floating point).
 * @param options - Optional `system`: `standard` (default) or `traditional`, which names every
 *   power of ten (`telo safatsiroa` for 30 000 000).
 * @returns The number in Malagasy words.
 * @throws {@link MdgError} `INVALID_TYPE` if `value` is not a finite number or the options are
 *   unknown, `INVALID_FORMAT` for text that is not plain decimal (at most 100 characters),
 *   `OUT_OF_RANGE` if a number is negative or above `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * ```ts
 * spell(21); // 'iraika amby roapolo'
 * spell(2026); // 'enina amby roapolo sy roa arivo'
 * spell(3.14); // "telo faingo efatra ambin'ny folo"
 * spell(30_000_000, { system: 'traditional' }); // 'telo safatsiroa'
 * spell('2000000000000000.9'); // 'roa tapitrisa lavitrisa faingo sivy'
 * ```
 */
export function spell(value: number | string, options: SpellOptions = {}): string {
  const [whole, decimals] =
    typeof value === 'string' ? decimalTextParts(value) : numberParts(value);
  const scales = scalesFor(options);
  const wholePart = wholeWords(whole, tableFor(whole, scales));
  if (decimals === undefined) return wholePart;
  return `${wholePart} ${DECIMAL_SEPARATOR} ${decimalWords(decimals, scales)}`;
}
