// The generated errors.ts shared by every package: error codes, MgError and SafeParseResult.
import type { ErrorDefinition } from '../lib/spec.ts';
import { GENERATED_HEADER, literal } from './emit.ts';

export function errorsFile(errors: readonly ErrorDefinition[], specVersion: string): string {
  const codeUnion = errors.map((error) => literal(error.code)).join(' | ');
  const docs = errors.map((error) => ` * - \`${error.code}\`: ${error.description}`).join('\n');
  return `${GENERATED_HEADER}

/** Version of the shared spec this code was generated from. */
export const SPEC_VERSION = ${literal(specVersion)};

/**
 * Error code shared by every mg-utils language port.
 *
${docs}
 */
export type ErrorCode = ${codeUnion};

/**
 * Outcome of a \`safeParse…\` function: the value, or the error that would have been thrown.
 *
 * @example
 * \`\`\`ts
 * const result = safeParsePhoneNumber(input);
 * if (result.success) console.log(result.data);
 * else console.log(result.error.code);
 * \`\`\`
 */
export type SafeParseResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: MgError };

/**
 * Error thrown by mg-utils functions. Check \`code\`, which is the same in every language.
 *
 * @example
 * \`\`\`ts
 * try {
 *   numberToWords(-1);
 * } catch (error) {
 *   if (error instanceof MgError && error.code === 'OUT_OF_RANGE') {
 *     // handle it
 *   }
 * }
 * \`\`\`
 */
export class MgError extends Error {
  /** Always \`'MgError'\`. */
  override readonly name = 'MgError';
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
   * Makes \`instanceof MgError\` true for errors from any mg-utils package or build.
   *
   * @remarks Each package, and its ESM and CommonJS builds, has its own copy of this class,
   * so the check looks at the error's shape instead of its prototype chain.
   *
   * @param value - Any value, usually a caught error.
   * @returns \`true\` when \`value\` is an mg-utils error.
   */
  static override [Symbol.hasInstance](value: unknown): boolean {
    return value instanceof Error && value.name === 'MgError' && 'code' in value;
  }
}
`;
}
