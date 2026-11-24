/**
 * Malagasy Ariary amounts: format, read, words and franc conversion. Part of mg-utils by
 * Madagascar OSS.
 *
 * @packageDocumentation
 */
export { ariaryToFmg, ariaryToWords, fmgToAriary } from './convert.ts';
export {
  formatAriary,
  formatFmg,
  type AriaryFormatOptions,
  type AriarySymbolPosition,
} from './format.ts';
export { parseAriary, safeParseAriary, tryParseAriary } from './parse.ts';
export type { AriaryGrouping } from './generated/data.ts';
export { MgError, SPEC_VERSION, type ErrorCode, type SafeParseResult } from './generated/errors.ts';
