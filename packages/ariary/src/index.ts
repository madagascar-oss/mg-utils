/**
 * Malagasy Ariary amounts: format, read, words and franc conversion. Part of mdg-utils by
 * Mdgascar.
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
export { parseAriary, safeParseAriary, tryParseAriary, type AriaryParseOptions } from './parse.ts';
export type { AriarySeparatorOptions } from './separators.ts';
export type { AriaryDecimal, AriaryGrouping } from './generated/data.ts';
export type { NumberSystem, NumberToWordsOptions } from '@mdgascar/words';
export {
  MdgError,
  SPEC_VERSION,
  type ErrorCode,
  type SafeParseResult,
} from './generated/errors.ts';
