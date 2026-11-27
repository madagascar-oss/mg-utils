/**
 * Every mdg-utils module in one package. Part of mdg-utils by Mdgascar.
 *
 * @packageDocumentation
 */
export { numberToWords, type NumberSystem, type NumberToWordsOptions } from '@mdgascar/words';
export {
  OPERATOR_NAMES,
  formatPhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumber,
  safeParsePhoneNumber,
  tryParsePhoneNumber,
  type OperatorId,
  type PhoneNumber,
  type PhoneNumberFormat,
} from '@mdgascar/phone';
export {
  ariaryToFmg,
  ariaryToWords,
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
  getMonthName,
  getWeekdayName,
  type CalendarDate,
  type DateStyle,
  type NameWidth,
} from '@mdgascar/date';
export { MdgError, SPEC_VERSION, type ErrorCode, type SafeParseResult } from '@mdgascar/phone';
