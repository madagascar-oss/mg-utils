import { CURRENCY_TOKENS, GROUP_SIZE, MAX_AMOUNT, READABLE_SEPARATORS } from './generated/data.ts';
import { MgError, type ErrorCode, type SafeParseResult } from './generated/errors.ts';

// Bounded so a parser that reads user input never scans unbounded text.
const MAX_INPUT_LENGTH = 32;
const SPACE = ' ';
// Spaces, no-break spaces and narrow no-break spaces count as one separator when reading.
const WHITESPACE_SEPARATORS = new RegExp(
  `[${READABLE_SEPARATORS.filter((separator) => /\s/.test(separator)).join('')}]`,
  'g',
);
const SEPARATOR_CLASS = READABLE_SEPARATORS.filter((separator) => !/\s/.test(separator))
  .map((separator) => `\\${separator}`)
  .join('');
const PLAIN_AMOUNT = /^(?:0|[1-9]\d*)$/;
const GROUPED_AMOUNT = new RegExp(
  `^[1-9]\\d{0,${String(GROUP_SIZE - 1)}}([ ${SEPARATOR_CLASS}])\\d{${String(GROUP_SIZE)}}(?:\\1\\d{${String(GROUP_SIZE)}})*$`,
);
const NON_DIGITS = /\D/g;

function failure(code: ErrorCode, message: string): SafeParseResult<never> {
  return { success: false, error: new MgError(code, message) };
}

function stripCurrency(text: string): string | undefined {
  const lower = text.toLowerCase();
  const prefix = CURRENCY_TOKENS.find((token) => lower.startsWith(token)) ?? '';
  const suffix = CURRENCY_TOKENS.find((token) => lower.endsWith(token)) ?? '';
  if (prefix !== '' && suffix !== '') return undefined;
  return text.slice(prefix.length, text.length - suffix.length).trim();
}

function readDigits(text: string): string | undefined {
  const amount = stripCurrency(text.trim());
  if (amount === undefined) return undefined;
  const normalized = amount.replace(WHITESPACE_SEPARATORS, SPACE);
  const isAmount = PLAIN_AMOUNT.test(normalized) || GROUPED_AMOUNT.test(normalized);
  return isAmount ? normalized.replace(NON_DIGITS, '') : undefined;
}

/**
 * Reads an Ariary amount without throwing.
 *
 * @param text - An amount such as `Ar 1 500`, `1.500 Ar`, `MGA 1500` or `1 500`.
 * @returns `{ success: true, data }` with the amount, or `{ success: false, error }`.
 *
 * @example
 * ```ts
 * const result = safeParseAriary('1 500 Ar');
 * if (result.success) result.data; // 1500
 * ```
 */
export function safeParseAriary(text: unknown): SafeParseResult<number> {
  if (typeof text !== 'string') return failure('INVALID_TYPE', 'Expected the amount as text.');
  if (text.length > MAX_INPUT_LENGTH) {
    return failure('INVALID_FORMAT', `Amounts are at most ${String(MAX_INPUT_LENGTH)} characters.`);
  }
  const digits = readDigits(text);
  if (digits === undefined) {
    return failure(
      'INVALID_FORMAT',
      'Expected an amount such as Ar 1 500 (no commas, no decimals).',
    );
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
 * @param text - An amount such as `Ar 1 500`, `1.500 Ar`, `MGA 1500` or `1 500`.
 * @returns The amount in whole ariary.
 * @throws {@link MgError} `INVALID_TYPE` for non-strings, `INVALID_FORMAT` for text that is not an
 *   amount (commas, decimals, signs), `OUT_OF_RANGE` above 999 999 999 999.
 *
 * @example
 * ```ts
 * parseAriary('Ar 1 500'); // 1500
 * parseAriary('1.500 Ar'); // 1500
 * ```
 */
export function parseAriary(text: string): number {
  const result = safeParseAriary(text);
  if (!result.success) throw result.error;
  return result.data;
}

/**
 * Reads an Ariary amount, or gives `undefined` instead of throwing.
 *
 * Use {@link safeParseAriary} when you need to know why the text was rejected.
 *
 * @param text - An amount such as `Ar 1 500`, `1.500 Ar`, `MGA 1500` or `1 500`.
 * @returns The amount in whole ariary, or `undefined` when {@link parseAriary} would throw.
 *
 * @example
 * ```ts
 * tryParseAriary('1.500 Ar'); // 1500
 * tryParseAriary('1,500'); // undefined
 * ```
 */
export function tryParseAriary(text: unknown): number | undefined {
  const result = safeParseAriary(text);
  return result.success ? result.data : undefined;
}
