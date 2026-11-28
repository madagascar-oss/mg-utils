// GENERATED — edit spec/ instead. Run `just codegen` to refresh.

/** Version of the shared spec this code was generated from. */
export const SPEC_VERSION = '0.10.0';

/**
 * Error code shared by every mdg-utils language port.
 *
 * - `INVALID_TYPE`: The input is not of the accepted type (for example a string or a non-integer where an integer is expected).
 * - `OUT_OF_RANGE`: The input has the right type but lies outside the supported range.
 * - `INVALID_FORMAT`: The input text cannot be read as a value of this module (wrong characters or wrong length).
 * - `UNKNOWN_OPERATOR`: The phone number is well formed but its operator code is not assigned to an operator.
 * - `PRECISION_LOSS`: The value is exact in the text but the port's number type cannot hold it exactly; ask for the exact text instead.
 * - `AMBIGUOUS`: The text reads as more than one value, so none is chosen.
 */
export type ErrorCode =
  | 'INVALID_TYPE'
  | 'OUT_OF_RANGE'
  | 'INVALID_FORMAT'
  | 'UNKNOWN_OPERATOR'
  | 'PRECISION_LOSS'
  | 'AMBIGUOUS';

/**
 * Outcome of a `safeParse…` function: the value, or the error that would have been thrown.
 *
 * @example
 * ```ts
 * const result = safeParsePhone(input);
 * if (result.success) console.log(result.data);
 * else console.log(result.error.code);
 * ```
 */
export type SafeParseResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: MdgError };

/**
 * Error thrown by mdg-utils functions. Check `code`, which is the same in every language.
 *
 * @example
 * ```ts
 * try {
 *   spell(-1);
 * } catch (error) {
 *   if (error instanceof MdgError && error.code === 'OUT_OF_RANGE') {
 *     // handle it
 *   }
 * }
 * ```
 */
export class MdgError extends Error {
  /** Always `'MdgError'`. */
  override readonly name = 'MdgError';
  /** Why the call failed; the same code in every language. */
  readonly code: ErrorCode;

  /**
   * Creates an error with a shared spec code.
   *
   * @param code - Shared spec error code.
   * @param message - Human-readable explanation, in English.
   */
  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
  }

  /**
   * Makes `instanceof MdgError` true for errors from any mdg-utils package or build.
   *
   * @remarks Each package, and its ESM and CommonJS builds, has its own copy of this class,
   * so the check looks at the error's shape instead of its prototype chain.
   *
   * @param value - Any value, usually a caught error.
   * @returns `true` when `value` is an mdg-utils error.
   */
  static override [Symbol.hasInstance](value: unknown): boolean {
    return value instanceof Error && value.name === 'MdgError' && 'code' in value;
  }
}
