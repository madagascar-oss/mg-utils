/**
 * Every mg-utils module in one package. Part of mg-utils by Madagascar OSS.
 *
 * @packageDocumentation
 */
export { numberToWords } from '@madagascar-oss/words';
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
} from '@madagascar-oss/phone';
export {
  ariaryToFmg,
  ariaryToWords,
  fmgToAriary,
  formatAriary,
  formatFmg,
  parseAriary,
  safeParseAriary,
  tryParseAriary,
  type AriaryFormatOptions,
  type AriaryGrouping,
  type AriarySymbolPosition,
} from '@madagascar-oss/ariary';
export {
  formatDate,
  getMonthName,
  getWeekdayName,
  type CalendarDate,
  type DateStyle,
  type NameWidth,
} from '@madagascar-oss/date';
export { MgError, SPEC_VERSION, type ErrorCode, type SafeParseResult } from '@madagascar-oss/phone';
