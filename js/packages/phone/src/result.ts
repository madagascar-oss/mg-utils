import type { MgError } from './generated/errors.ts';

/**
 * Outcome of a `safeParse…` function: the value, or the error that would have been thrown.
 *
 * @example
 * ```ts
 * const result = safeParsePhoneNumber(input);
 * if (result.success) console.log(result.data.e164);
 * else console.log(result.error.code);
 * ```
 */
export type SafeParseResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: MgError };
