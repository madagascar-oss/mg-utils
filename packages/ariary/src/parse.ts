import { MAX_AMOUNT } from './amount.ts';
import { MdgError, type ErrorCode, type SafeParseResult } from './generated/errors.ts';
import { readableGrouping, readDigits, type ReadSeparators } from './read-digits.ts';
import {
  assertOptionsObject,
  decimalFor,
  groupingFor,
  type AriarySeparatorOptions,
} from './separators.ts';

/**
 * Options for reading amounts: which `grouping` and `decimal` separators the text uses.
 * Without `grouping`, every Malagasy one is accepted (spaces or dot); `decimal` defaults to a
 * comma. Say so for text in another convention: `{ grouping: 'comma', decimal: 'dot' }`.
 *
 * @example
 * ```ts
 * const english: AriaryParseOptions = { grouping: 'comma', decimal: 'dot' };
 * ```
 */
export type AriaryParseOptions = AriarySeparatorOptions;

const PARSE_OPTION_KEYS: ReadonlySet<string> = new Set(['grouping', 'decimal']);

// Bounded so a parser that reads user input never scans unbounded text.
const MAX_INPUT_LENGTH = 32;

function failure(code: ErrorCode, message: string): SafeParseResult<never> {
  return { success: false, error: new MdgError(code, message) };
}

// The parsers never throw for bad options either: the error comes back as a value.
function safeReadSeparators(options: unknown): ReadSeparators | MdgError {
  try {
    return readSeparatorsFor(options);
  } catch (error) {
    return error as MdgError;
  }
}

function readSeparatorsFor(options: unknown): ReadSeparators {
  assertOptionsObject(options);
  if (Object.keys(options).some((key) => !PARSE_OPTION_KEYS.has(key))) {
    throw new MdgError('INVALID_TYPE', 'Reading takes only the grouping and decimal options.');
  }
  const separators = options as AriaryParseOptions;
  const decimal = decimalFor(separators);
  const grouping =
    separators.grouping === undefined ? undefined : groupingFor(separators.grouping, decimal);
  return { grouping: readableGrouping(grouping, decimal), decimal };
}

/**
 * Reads an Ariary amount without throwing.
 *
 * @param text - An amount such as `Ar 1 500`, `1.500 Ar`, `MGA 1500` or `1 500,50`.
 * @param options - Optional `grouping` and `decimal`; see {@link AriaryParseOptions}.
 * @returns `{ success: true, data }` with the amount, or `{ success: false, error }`.
 *
 * @example
 * ```ts
 * const result = safeParseAriary('1 500 Ar');
 * if (result.success) result.data; // 1500
 * ```
 */
export function safeParseAriary(
  text: unknown,
  options: AriaryParseOptions = {},
): SafeParseResult<number> {
  if (typeof text !== 'string') return failure('INVALID_TYPE', 'Expected the amount as text.');
  const separators = safeReadSeparators(options);
  if (separators instanceof MdgError) return { success: false, error: separators };
  if (text.length > MAX_INPUT_LENGTH) {
    return failure('INVALID_FORMAT', `Amounts are at most ${String(MAX_INPUT_LENGTH)} characters.`);
  }
  const digits = readDigits(text, separators);
  if (digits === undefined) {
    return failure('INVALID_FORMAT', 'Expected an amount such as Ar 1 500 or Ar 1 500,50.');
  }
  const amount = Number(digits);
  if (amount > MAX_AMOUNT) {
    return failure('OUT_OF_RANGE', `Amounts go up to ${String(MAX_AMOUNT)}.`);
  }
  return { success: true, data: amount };
}

/**
 * Reads an Ariary amount written in any common way.
 *
 * @param text - An amount such as `Ar 1 500`, `1.500 Ar`, `MGA 1500` or `1 500,50`.
 * @param options - Optional `grouping` and `decimal`; see {@link AriaryParseOptions}.
 * @returns The amount, whole or decimal.
 * @throws {@link MdgError} `INVALID_TYPE` for non-strings or bad options, `INVALID_FORMAT` for text
 *   that is not an amount (signs, a dot as decimal point by default), `OUT_OF_RANGE` above
 *   `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * ```ts
 * parseAriary('Ar 1 500'); // 1500
 * parseAriary('1.500 Ar'); // 1500
 * parseAriary('1 500,50 Ar'); // 1500.5
 * parseAriary('1,500.50', { grouping: 'comma', decimal: 'dot' }); // 1500.5
 * ```
 */
export function parseAriary(text: string, options: AriaryParseOptions = {}): number {
  const result = safeParseAriary(text, options);
  if (!result.success) throw result.error;
  return result.data;
}

/**
 * Reads an Ariary amount, or gives `undefined` instead of throwing.
 *
 * Use {@link safeParseAriary} when you need to know why the text was rejected.
 *
 * @param text - An amount such as `Ar 1 500`, `1.500 Ar`, `MGA 1500` or `1 500,50`.
 * @param options - Optional `grouping` and `decimal`; see {@link AriaryParseOptions}.
 * @returns The amount, or `undefined` when {@link parseAriary} would throw.
 *
 * @example
 * ```ts
 * tryParseAriary('1.500 Ar'); // 1500
 * tryParseAriary('1.5'); // undefined
 * ```
 */
export function tryParseAriary(
  text: unknown,
  options: AriaryParseOptions = {},
): number | undefined {
  const result = safeParseAriary(text, options);
  return result.success ? result.data : undefined;
}
