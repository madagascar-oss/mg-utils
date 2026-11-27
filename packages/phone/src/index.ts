/**
 * Madagascar (+261) phone numbers, mobile and fixed. Part of mdg-utils by Mdgascar.
 *
 * @packageDocumentation
 */
export { formatPhone, type PhoneNumberFormat } from './format.ts';
export {
  isValidPhone,
  parsePhone,
  safeParsePhone,
  tryParsePhone,
  type PhoneArea,
  type PhoneLineType,
  type PhoneNumber,
} from './phone-number.ts';
export { OPERATOR_NAMES, type OperatorId } from './generated/data.ts';
export {
  MdgError,
  SPEC_VERSION,
  type ErrorCode,
  type SafeParseResult,
} from './generated/errors.ts';
