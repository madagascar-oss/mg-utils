/**
 * Malagasy dates: month and weekday names, and dates written in Malagasy. Part of mdg-utils by
 * Mdgascar.
 *
 * @packageDocumentation
 */
export type { CalendarDate } from './calendar.ts';
export { formatDate } from './format.ts';
export { getMonthName, getWeekdayName, type NameWidth } from './names.ts';
export type { DateStyle } from './generated/data.ts';
export { MdgError, SPEC_VERSION, type ErrorCode } from './generated/errors.ts';
