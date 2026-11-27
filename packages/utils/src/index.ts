/**
 * Every mdg-utils module in one package. Part of mdg-utils by Mdgascar.
 *
 * @packageDocumentation
 */
export {
  parseWords,
  safeParseWords,
  spell,
  spellOrdinal,
  tryParseWords,
  type NumberSystem,
  type ParseResultKind,
  type ParseWordsOptions,
  type ParsedValue,
  type SpellOptions,
} from '@mdgascar/words';
export {
  OPERATOR_NAMES,
  formatPhone,
  isValidPhone,
  parsePhone,
  safeParsePhone,
  tryParsePhone,
  type OperatorId,
  type PhoneArea,
  type PhoneLineType,
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
  type AmountResultKind,
  type AmountResultOptions,
  type AmountValue,
  type AriaryCurrencyDisplay,
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
  parseDate,
  parseTime,
  safeParseDate,
  safeParseTime,
  spellTime,
  tryParseDate,
  tryParseTime,
  type ClockTime,
  weekdayName,
  type CalendarDate,
  type DateStyle,
  type NameWidth,
} from '@mdgascar/date';
export { MdgError, SPEC_VERSION, type ErrorCode, type SafeParseResult } from '@mdgascar/phone';
