/**
 * Malagasy dates: month and weekday names, and dates written in Malagasy. Part of mg-utils by
 * Madagascar OSS.
 *
 * @packageDocumentation
 */
export type { CalendarDate } from './calendar.ts';
export { formatDate } from './format.ts';
export { getMonthName, getWeekdayName, type NameWidth } from './names.ts';
export type { DateStyle } from './generated/data.ts';
export { MgError, SPEC_VERSION, type ErrorCode } from './generated/errors.ts';
