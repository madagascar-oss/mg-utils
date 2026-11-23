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
  type OperatorId,
  type PhoneNumber,
  type PhoneNumberFormat,
  type SafeParseResult,
} from '@madagascar-oss/phone';
export { MgError, SPEC_VERSION, type ErrorCode } from '@madagascar-oss/phone';
