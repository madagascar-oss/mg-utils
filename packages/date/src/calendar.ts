import { MAX_YEAR, MIN_YEAR, WEEKDAY_NAMES } from './generated/data.ts';
import { MgError } from './generated/errors.ts';

/**
 * A calendar date: year 1–9999, month 1–12, day of the month.
 *
 * @example
 * ```ts
 * const independenceDay: CalendarDate = { year: 1960, month: 6, day: 26 };
 * ```
 */
export interface CalendarDate {
  /** Year, 1 to 9999. */
  readonly year: number;
  /** Month, 1 (Janoary) to 12 (Desambra). */
  readonly month: number;
  /** Day of the month, 1 to 31. */
  readonly day: number;
}

/** @internal ISO month number. */
export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
/** @internal ISO weekday: Monday 1 … Sunday 7. */
export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAYS_PER_WEEK = WEEKDAY_NAMES.length - 1;
// JavaScript numbers Sunday 0; ISO 8601 numbers it 7.
const JAVASCRIPT_SUNDAY = 0;

// A UTC date at midnight, so the calendar checks never depend on the local time zone.
function utcDate({ year, month, day }: CalendarDate): Date {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date;
}

function isRealDate(date: CalendarDate): boolean {
  const probe = utcDate(date);
  return (
    probe.getUTCFullYear() === date.year &&
    probe.getUTCMonth() === date.month - 1 &&
    probe.getUTCDate() === date.day
  );
}

function checked(
  date: CalendarDate,
  impossibleDateCode: 'INVALID_FORMAT' | 'OUT_OF_RANGE',
): CalendarDate {
  if (date.year < MIN_YEAR || date.year > MAX_YEAR) {
    throw new MgError('OUT_OF_RANGE', `Years go from ${String(MIN_YEAR)} to ${String(MAX_YEAR)}.`);
  }
  if (!isRealDate(date)) throw new MgError(impossibleDateCode, 'This day does not exist.');
  return date;
}

function fromText(text: string): CalendarDate {
  const match = ISO_DATE.exec(text);
  if (match === null) throw new MgError('INVALID_FORMAT', 'Expected a date as YYYY-MM-DD.');
  const [, year, month, day] = match;
  return checked({ year: Number(year), month: Number(month), day: Number(day) }, 'INVALID_FORMAT');
}

function fromFields(fields: object): CalendarDate {
  const { year, month, day } = fields as Partial<Record<keyof CalendarDate, unknown>>;
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new MgError('INVALID_TYPE', 'Expected whole numbers for year, month and day.');
  }
  return checked({ year, month, day } as CalendarDate, 'OUT_OF_RANGE');
}

function fromDate(date: Date): CalendarDate {
  if (Number.isNaN(date.getTime())) throw new MgError('INVALID_FORMAT', 'Invalid Date.');
  const fields = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  return checked(fields, 'OUT_OF_RANGE');
}

/**
 * @internal Reads any accepted date input at the public boundary.
 *
 * @param input - `YYYY-MM-DD` text, calendar fields or a `Date`.
 * @returns The validated calendar date.
 */
export function toCalendarDate(input: unknown): CalendarDate {
  if (typeof input === 'string') return fromText(input);
  if (input instanceof Date) return fromDate(input);
  if (typeof input === 'object' && input !== null) return fromFields(input);
  throw new MgError('INVALID_TYPE', 'Expected YYYY-MM-DD text, { year, month, day } or a Date.');
}

/**
 * @internal ISO weekday of a valid calendar date.
 *
 * @param date - A date already checked by {@link toCalendarDate}.
 * @returns Monday 1 … Sunday 7.
 */
export function isoWeekdayOf(date: CalendarDate): IsoWeekday {
  const weekday = utcDate(date).getUTCDay();
  return (weekday === JAVASCRIPT_SUNDAY ? DAYS_PER_WEEK : weekday) as IsoWeekday;
}
