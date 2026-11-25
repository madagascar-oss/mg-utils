import { MgError, type ErrorCode, type SafeParseResult } from './generated/errors.ts';

/**
 * A rejected parse carrying its spec error code.
 *
 * @param code - The spec error code.
 * @param message - What was wrong with the input.
 * @returns `{ success: false, error }`.
 *
 * @example
 * ```ts
 * failure('INVALID_FORMAT', 'Expected a number.'); // { success: false, error: MgError }
 * ```
 */
export function failure(code: ErrorCode, message: string): SafeParseResult<never> {
  return { success: false, error: new MgError(code, message) };
}
