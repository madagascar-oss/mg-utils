import { wholeWords } from './cardinal.ts';
import { decimalParts } from './decimal-text.ts';
import {
  ORDINAL_FIRST,
  ORDINAL_PREFIX,
  ORDINAL_PREFIX_BEFORE_VOWEL,
  VOWELS,
} from './generated/data.ts';
import { MdgError } from './generated/errors.ts';
import { systemOf, type SpellOptions } from './system.ts';

const STARTS_WITH_VOWEL: ReadonlySet<string> = new Set(VOWELS);
const LEADING_ZEROS = /^0+/;
const ONE = '1';
const POINT = '.';

// Rule 14: whole digits from 1 up; a point in text or decimals in a number are not ordinals.
function ordinalDigits(value: unknown): string {
  if (typeof value === 'string' && value.includes(POINT)) {
    throw new MdgError('INVALID_FORMAT', 'spellOrdinal reads whole digits, with no point.');
  }
  const [whole, decimals] = decimalParts(value, 'spellOrdinal');
  if (decimals !== undefined) {
    throw new MdgError('INVALID_TYPE', 'spellOrdinal expects a whole number.');
  }
  const significant = whole.replace(LEADING_ZEROS, '');
  if (significant === '') {
    throw new MdgError('OUT_OF_RANGE', 'Ordinals start at 1 (voalohany).');
  }
  return significant;
}

/**
 * Writes the Malagasy ordinal of a whole number: `faha` before the cardinal words, `fah`
 * before a vowel, and `voalohany` for 1.
 *
 * @param value - A whole number from 1 to `Number.MAX_SAFE_INTEGER`, or digit text such as
 *   `'1000000000000000000'`, read exactly.
 * @param options - Optional `system`: `standard` (default) or `traditional`.
 * @returns The ordinal: `3` → `'fahatelo'`.
 * @throws {@link MdgError} `INVALID_TYPE` for a number with decimals, a value that is not a
 *   number or text, or unknown options; `INVALID_FORMAT` for text that is not digits;
 *   `OUT_OF_RANGE` below 1 or above `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * ```ts
 * spellOrdinal(1); // 'voalohany'
 * spellOrdinal(3); // 'fahatelo'
 * spellOrdinal(4); // 'fahefatra'
 * spellOrdinal(11); // "fahiraika ambin'ny folo"
 * spellOrdinal(1000); // 'faharivo'
 * ```
 */
export function spellOrdinal(value: number | string, options: SpellOptions = {}): string {
  const digits = ordinalDigits(value);
  const cardinal = wholeWords(digits, systemOf(options));
  if (digits === ONE) return ORDINAL_FIRST;
  const prefix = STARTS_WITH_VOWEL.has(cardinal.charAt(0))
    ? ORDINAL_PREFIX_BEFORE_VOWEL
    : ORDINAL_PREFIX;
  return `${prefix}${cardinal}`;
}
