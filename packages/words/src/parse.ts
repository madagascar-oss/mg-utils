import { plainDecimal } from './decimal-text.ts';
import { MAX_WORDS_LENGTH } from './generated/data.ts';
import { MdgError, type ErrorCode, type SafeParseResult } from './generated/errors.ts';
import { readWords } from './read-words.ts';
import { partsWords } from './spell.ts';
import { SYSTEMS } from './system.ts';

/**
 * What {@link parseWords} gives back: a `number` (default), or the exact decimal `text`.
 *
 * @example
 * ```ts
 * const exact: ParseResultKind = 'text';
 * ```
 */
export type ParseResultKind = 'number' | 'text';

/**
 * Options for {@link parseWords}.
 *
 * @example
 * ```ts
 * const options: ParseWordsOptions = { as: 'text' };
 * ```
 */
export interface ParseWordsOptions {
  /** `number` (default), or `text` for the exact decimal digits of any size. */
  readonly as?: ParseResultKind;
}

const RESULT_KINDS: ReadonlySet<unknown> = new Set<ParseResultKind>(['number', 'text']);
const OPTION_KEYS: ReadonlySet<string> = new Set(['as']);
const APOSTROPHES = /[‘’ʼ`´]/g;
const SPACES = /\s+/gu;
// Older spellings of "ambin'ny" (dictionary: "ambin' ny"; Assimil: "amby ny").
const SPLIT_AMBINNY = /\bambin' ny\b|\bamby ny\b/g;
const AMBINNY = "ambin'ny";
const TRAILING_ZEROS = /0+$/;

function failure(code: ErrorCode, message: string): SafeParseResult<never> {
  return { success: false, error: new MdgError(code, message) };
}

function resultKind(options: unknown): ParseResultKind | undefined {
  if (typeof options !== 'object' || options === null) return undefined;
  if (Object.keys(options).some((key) => !OPTION_KEYS.has(key))) return undefined;
  const { as = 'number' } = options as ParseWordsOptions;
  return RESULT_KINDS.has(as) ? as : undefined;
}

// Case, apostrophes, spacing and older spellings do not change the number.
function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(APOSTROPHES, "'")
    .replace(SPACES, ' ')
    .trim()
    .replace(SPLIT_AMBINNY, AMBINNY);
}

// Every exact value whose spelling is these words: one, none, or (rarely) more.
function spelledReadings(words: string): string[] {
  const { wholes, decimals } = readWords(words);
  const texts = wholes.flatMap((whole) =>
    (decimals ?? ['']).map((digits) => {
      const significant = digits.replace(TRAILING_ZEROS, '');
      return significant === '' ? whole.toString() : `${whole.toString()}.${significant}`;
    }),
  );
  return [...new Set(texts)].filter((text) => {
    const [whole = '', decimal] = text.split('.');
    return SYSTEMS.some((system) => partsWords(whole, decimal, system) === words);
  });
}

function readExact(words: string): SafeParseResult<string> {
  const readings = spelledReadings(words);
  const [only, ...others] = readings;
  if (only === undefined) {
    return failure('INVALID_FORMAT', 'Expected Malagasy number words, as spell writes them.');
  }
  if (others.length > 0) {
    return failure('AMBIGUOUS', `These words read as ${readings.join(' and as ')}.`);
  }
  return { success: true, data: only };
}

// A number only when it holds the digits exactly: never a silent rounding.
function asNumber(text: string): SafeParseResult<number> {
  const value = Number(text);
  if (value <= Number.MAX_SAFE_INTEGER && plainDecimal(value) === text) {
    return { success: true, data: value };
  }
  return failure(
    'PRECISION_LOSS',
    `${text} does not fit a number exactly; pass { as: 'text' } for the exact digits.`,
  );
}

/**
 * Reads Malagasy number words without throwing.
 *
 * @param text - Words as {@link spell} writes them, in either system, in any case and spacing.
 * @param options - Optional `as`: `number` (default) or `text` for the exact digits.
 * @returns `{ success: true, data }` with the number or text, or `{ success: false, error }`.
 *
 * @example
 * ```ts
 * const result = safeParseWords('roa arivo');
 * if (result.success) result.data; // 2000
 * ```
 */
export function safeParseWords(
  text: unknown,
  options: ParseWordsOptions = {},
): SafeParseResult<number | string> {
  if (typeof text !== 'string') return failure('INVALID_TYPE', 'Expected the words as text.');
  const kind = resultKind(options);
  if (kind === undefined) return failure('INVALID_TYPE', "as is 'number' or 'text'.");
  if (text.length > MAX_WORDS_LENGTH) {
    return failure('INVALID_FORMAT', `Words are at most ${String(MAX_WORDS_LENGTH)} characters.`);
  }
  const exact = readExact(normalise(text));
  if (!exact.success || kind === 'text') return exact;
  return asNumber(exact.data);
}

/**
 * Reads Malagasy number words back into a number: the exact inverse of {@link spell}.
 *
 * @param text - Words as {@link spell} writes them, in either system. Case, spacing, curly
 *   apostrophes and the older `ambin' ny` and `amby ny` do not matter.
 * @param options - Optional `as`: `number` (default) or `text` for the exact decimal digits.
 * @returns The number, or its digits as text with `{ as: 'text' }`.
 * @throws {@link MdgError} `INVALID_TYPE` for non-strings or bad options, `INVALID_FORMAT` for
 *   anything spell does not write, `AMBIGUOUS` for the rare words that two numbers share (from
 *   one million billion up), `PRECISION_LOSS` when a number cannot hold the value exactly.
 *
 * @example
 * ```ts
 * parseWords('valo amby efapolo amby telonjato'); // 348
 * parseWords("telo faingo efatra ambin'ny folo"); // 3.14
 * parseWords('telo safatsiroa'); // 30000000
 * parseWords('iray lavitrisa lavitrisa', { as: 'text' }); // '1000000000000000000'
 * ```
 */
export function parseWords(text: string, options?: { readonly as?: 'number' }): number;
export function parseWords(text: string, options: { readonly as: 'text' }): string;
export function parseWords(text: string, options: ParseWordsOptions = {}): number | string {
  const result = safeParseWords(text, options);
  if (!result.success) throw result.error;
  return result.data;
}

/**
 * Reads Malagasy number words, or gives `undefined` instead of throwing.
 *
 * @param text - Words as {@link spell} writes them.
 * @param options - Optional `as`: `number` (default) or `text`.
 * @returns The value, or `undefined` when {@link parseWords} would throw.
 *
 * @example
 * ```ts
 * tryParseWords('roa arivo'); // 2000
 * tryParseWords('roa sy arivo sy'); // undefined
 * ```
 */
export function tryParseWords(
  text: unknown,
  options: ParseWordsOptions = {},
): number | string | undefined {
  const result = safeParseWords(text, options);
  return result.success ? result.data : undefined;
}
