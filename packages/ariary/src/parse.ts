import { canonical, exactNumber, type AmountResultKind } from './amount.ts';
import { MAX_READ_LENGTH } from './generated/data.ts';
import { MdgError, type ErrorCode, type SafeParseResult } from './generated/errors.ts';
import { readableGrouping, readDigits, type ReadSeparators } from './read-digits.ts';
import {
  assertOptionsObject,
  decimalFor,
  groupingFor,
  type AriarySeparatorOptions,
} from './separators.ts';

/**
 * Options for reading amounts: which `grouping` and `decimal` separators the text uses, and
 * what to give back. Without `grouping`, every Malagasy one is accepted (spaces or dot);
 * `decimal` defaults to a comma. Say so for text in another convention:
 * `{ grouping: 'comma', decimal: 'dot' }`.
 *
 * @example
 * ```ts
 * const english: AriaryParseOptions = { grouping: 'comma', decimal: 'dot' };
 * ```
 */
export interface AriaryParseOptions extends AriarySeparatorOptions {
  /** `number` (default), or `text` for the exact decimal digits of any amount. */
  readonly as?: AmountResultKind;
}

interface ReadOptions extends ReadSeparators {
  readonly kind: AmountResultKind;
}

const PARSE_OPTION_KEYS: ReadonlySet<string> = new Set(['grouping', 'decimal', 'as']);
const RESULT_KINDS: ReadonlySet<unknown> = new Set<AmountResultKind>(['number', 'text']);

function failure(code: ErrorCode, message: string): SafeParseResult<never> {
  return { success: false, error: new MdgError(code, message) };
}

// The parsers never throw for bad options either: the error comes back as a value.
function safeReadOptions(options: unknown): ReadOptions | MdgError {
  try {
    return readOptionsFor(options);
  } catch (error) {
    return error as MdgError;
  }
}

function readOptionsFor(options: unknown): ReadOptions {
  assertOptionsObject(options);
  if (Object.keys(options).some((key) => !PARSE_OPTION_KEYS.has(key))) {
    throw new MdgError('INVALID_TYPE', 'Reading takes only the grouping, decimal and as options.');
  }
  const { as: kind = 'number', ...separators } = options as AriaryParseOptions;
  if (!RESULT_KINDS.has(kind)) throw new MdgError('INVALID_TYPE', "as is 'number' or 'text'.");
  const decimal = decimalFor(separators);
  const grouping =
    separators.grouping === undefined ? undefined : groupingFor(separators.grouping, decimal);
  return { grouping: readableGrouping(grouping, decimal), decimal, kind };
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
): SafeParseResult<number | string> {
  if (typeof text !== 'string') return failure('INVALID_TYPE', 'Expected the amount as text.');
  const read = safeReadOptions(options);
  if (read instanceof MdgError) return { success: false, error: read };
  if (text.length > MAX_READ_LENGTH) {
    return failure('INVALID_FORMAT', `Amounts are at most ${String(MAX_READ_LENGTH)} characters.`);
  }
  const digits = readDigits(text, read);
  if (digits === undefined) {
    return failure('INVALID_FORMAT', 'Expected an amount such as Ar 1 500 or Ar 1 500,50.');
  }
  const exact = canonical(digits);
  return read.kind === 'text' ? { success: true, data: exact } : exactNumber(exact);
}

/**
 * Reads an Ariary amount written in any common way.
 *
 * @param text - An amount such as `Ar 1 500`, `1.500 Ar`, `MGA 1500` or `1 500,50`.
 * @param options - Optional `grouping` and `decimal`; see {@link AriaryParseOptions}.
 * @returns The amount, whole or decimal.
 * @throws {@link MdgError} `INVALID_TYPE` for non-strings or bad options, `INVALID_FORMAT` for text
 *   that is not an amount (signs, a dot as decimal point by default), `PRECISION_LOSS` when a
 *   number cannot hold the amount exactly (pass `{ as: 'text' }` for the exact digits).
 *
 * @example
 * ```ts
 * parseAriary('Ar 1 500'); // 1500
 * parseAriary('1.500 Ar'); // 1500
 * parseAriary('1 500,50 Ar'); // 1500.5
 * parseAriary('1,500.50', { grouping: 'comma', decimal: 'dot' }); // 1500.5
 * ```
 */
export function parseAriary(
  text: string,
  options?: AriarySeparatorOptions & { readonly as?: 'number' },
): number;
export function parseAriary(
  text: string,
  options: AriarySeparatorOptions & { readonly as: 'text' },
): string;
export function parseAriary(text: string, options: AriaryParseOptions = {}): number | string {
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
): number | string | undefined {
  const result = safeParseAriary(text, options);
  return result.success ? result.data : undefined;
}
