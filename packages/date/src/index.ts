/**
 * Malagasy dates and times: dates written and read in Malagasy, times said in words, month
 * and weekday names. Part of mdg-utils by
 * Mdgascar.
 *
 * @packageDocumentation
 */
export type { CalendarDate } from './calendar.ts';
export { formatDate } from './format.ts';
export { parseDate, safeParseDate, tryParseDate } from './parse.ts';
export { parseTime, safeParseTime, spellTime, tryParseTime, type ClockTime } from './time.ts';
export { monthName, weekdayName, type NameWidth } from './names.ts';
export type { DateStyle } from './generated/data.ts';
export {
  MdgError,
  SPEC_VERSION,
  type ErrorCode,
  type SafeParseResult,
} from './generated/errors.ts';
