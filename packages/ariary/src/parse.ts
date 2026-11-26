import { MAX_AMOUNT } from './amount.ts';
import { MgError, type ErrorCode, type SafeParseResult } from './generated/errors.ts';
import { readDigits } from './read-digits.ts';

// Bounded so a parser that reads user input never scans unbounded text.
const MAX_INPUT_LENGTH = 32;

function failure(code: ErrorCode, message: string): SafeParseResult<never> {
  return { success: false, error: new MgError(code, message) };
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
 *   amount (commas, decimals, signs), `OUT_OF_RANGE` above `Number.MAX_SAFE_INTEGER`.
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
