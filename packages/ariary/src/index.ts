/**
 * Malagasy Ariary amounts: format, read, words and franc conversion. Part of mdg-utils by
 * Mdgascar.
 *
 * @packageDocumentation
 */
export { ariaryToFmg, spellAriary, fmgToAriary } from './convert.ts';
export {
  formatAriary,
  formatFmg,
  type AriaryCurrencyDisplay,
  type AriaryFormatOptions,
  type AriarySymbolPosition,
} from './format.ts';
export { parseAriary, safeParseAriary, tryParseAriary, type AriaryParseOptions } from './parse.ts';
export type { AriarySeparatorOptions } from './separators.ts';
export type { AmountResultKind, AmountResultOptions, AmountValue } from './amount.ts';
export type { AriaryDecimal, AriaryGrouping } from './generated/data.ts';
export type { NumberSystem, SpellOptions } from '@mdgascar/words';
export {
  MdgError,
  SPEC_VERSION,
  type ErrorCode,
  type SafeParseResult,
} from './generated/errors.ts';
