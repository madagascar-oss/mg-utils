/**
 * Every mdg-utils module in one package. Part of mdg-utils by Mdgascar.
 *
 * @packageDocumentation
 */
export { spell, type NumberSystem, type SpellOptions } from '@mdgascar/words';
export {
  OPERATOR_NAMES,
  formatPhone,
  isValidPhone,
  parsePhone,
  safeParsePhone,
  tryParsePhone,
  type OperatorId,
  type PhoneNumber,
  type PhoneNumberFormat,
} from '@mdgascar/phone';
export {
  ariaryToFmg,
  spellAriary,
  fmgToAriary,
  formatAriary,
  formatFmg,
  parseAriary,
  safeParseAriary,
  tryParseAriary,
  type AriaryDecimal,
  type AriaryFormatOptions,
  type AriaryGrouping,
  type AriaryParseOptions,
  type AriarySeparatorOptions,
  type AriarySymbolPosition,
} from '@mdgascar/ariary';
export {
  formatDate,
  monthName,
  weekdayName,
  type CalendarDate,
  type DateStyle,
  type NameWidth,
} from '@mdgascar/date';
export { MdgError, SPEC_VERSION, type ErrorCode, type SafeParseResult } from '@mdgascar/phone';
