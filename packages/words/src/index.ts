/**
 * Malagasy number words. Part of mdg-utils by Mdgascar.
 *
 * @packageDocumentation
 */
export { spell } from './spell.ts';
export type { NumberSystem, SpellOptions } from './system.ts';
export { spellOrdinal } from './ordinal.ts';
export {
  parseWords,
  safeParseWords,
  tryParseWords,
  type ParseResultKind,
  type ParsedValue,
  type ParseWordsOptions,
} from './parse.ts';
export {
  MdgError,
  SPEC_VERSION,
  type ErrorCode,
  type SafeParseResult,
} from './generated/errors.ts';
