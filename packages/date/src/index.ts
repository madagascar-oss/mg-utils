/**
 * Malagasy dates: month and weekday names, and dates written in Malagasy. Part of mdg-utils by
 * Mdgascar.
 *
 * @packageDocumentation
 */
export type { CalendarDate } from './calendar.ts';
export { formatDate } from './format.ts';
export { parseDate, safeParseDate, tryParseDate } from './parse.ts';
export { monthName, weekdayName, type NameWidth } from './names.ts';
export type { DateStyle } from './generated/data.ts';
export {
  MdgError,
  SPEC_VERSION,
  type ErrorCode,
  type SafeParseResult,
} from './generated/errors.ts';
