/**
 * Madagascar (+261) mobile phone numbers. Part of mdg-utils by Mdgascar.
 *
 * @packageDocumentation
 */
export { formatPhone, type PhoneNumberFormat } from './format.ts';
export {
  isValidPhone,
  parsePhone,
  safeParsePhone,
  tryParsePhone,
  type PhoneNumber,
} from './phone-number.ts';
export { OPERATOR_NAMES, type OperatorId } from './generated/data.ts';
export {
  MdgError,
  SPEC_VERSION,
  type ErrorCode,
  type SafeParseResult,
} from './generated/errors.ts';
