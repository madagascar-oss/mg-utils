import { wholeWords } from './cardinal.ts';
import { decimalParts } from './decimal-text.ts';
import { DECIMAL_SEPARATOR, ZERO_WORD } from './generated/data.ts';
import { systemOf, type NumberSystem, type SpellOptions } from './system.ts';

const LEADING_ZEROS = /^0+/;

// Each leading zero after the point is "aotra"; the rest reads as a whole number.
function decimalWords(digits: string, system: NumberSystem): string {
  const significant = digits.replace(LEADING_ZEROS, '');
  const zeros = Array.from({ length: digits.length - significant.length }, () => ZERO_WORD);
  return [...zeros, wholeWords(significant, system)].join(' ');
}

/**
 * @internal Words for exact decimal parts, as {@link spell} writes them.
 *
 * @param whole - The whole digits.
 * @param decimals - The decimals without trailing zeros, or `undefined`.
 * @param system - `standard` or `traditional`.
 * @returns The words.
 */
export function partsWords(
  whole: string,
  decimals: string | undefined,
  system: NumberSystem,
): string {
  const wholePart = wholeWords(whole, system);
  if (decimals === undefined) return wholePart;
  return `${wholePart} ${DECIMAL_SEPARATOR} ${decimalWords(decimals, system)}`;
}

/**
 * Writes a number in Malagasy words, smallest part first, with `faingo` before the decimals.
 * {@link parseWords} reads the words back.
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
  const [whole, decimals] = decimalParts(value, 'spell');
  return partsWords(whole, decimals, systemOf(options));
}
