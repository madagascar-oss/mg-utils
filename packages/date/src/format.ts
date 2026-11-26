import { DEFAULT_STYLE, STYLE_PATTERNS, type DateStyle } from './generated/data.ts';
import { MdgError } from './generated/errors.ts';
import { isoWeekdayOf, toCalendarDate, type CalendarDate, type MonthNumber } from './calendar.ts';
import { monthNameOf, weekdayNameOf } from './names.ts';

type PatternToken = 'EEEE' | 'MMMM' | 'MMM' | 'MM' | 'dd' | 'd' | 'y';

// CLDR pattern letters used by the spec styles; longest first so `MMMM` wins over `MM`.
const PATTERN_TOKEN = /EEEE|MMMM|MMM|MM|dd|d|y/g;
const TWO_DIGITS = 2;

function twoDigits(value: number): string {
  return String(value).padStart(TWO_DIGITS, '0');
}

function render(pattern: string, date: CalendarDate): string {
  const month = date.month as MonthNumber;
  const values: Readonly<Record<PatternToken, string>> = {
    EEEE: weekdayNameOf(isoWeekdayOf(date), 'wide'),
    MMMM: monthNameOf(month, 'wide'),
    MMM: monthNameOf(month, 'abbreviated'),
    MM: twoDigits(date.month),
    dd: twoDigits(date.day),
    d: String(date.day),
    y: String(date.year),
  };
  return pattern.replace(PATTERN_TOKEN, (token) => values[token as PatternToken]);
}

/**
 * Writes a date in Malagasy.
 *
 * @param date - `YYYY-MM-DD` text, `{ year, month, day }`, or a `Date` (read in its local
 *   calendar fields).
 * @param style - `long` (default), `full`, `medium`, `short` (CLDR) or `numeric` (`dd/MM/y`).
 * @returns The formatted date.
 * @throws {@link MdgError} `INVALID_FORMAT` for text that is not a real `YYYY-MM-DD` date,
 *   `OUT_OF_RANGE` for impossible fields or years outside 1–9999, `INVALID_TYPE` for other
 *   input or an unknown style.
 *
 * @example
 * ```ts
 * formatDate('2026-11-23'); // '23 Novambra 2026'
 * formatDate('2026-11-23', 'full'); // 'Alatsinainy 23 Novambra 2026'
 * formatDate({ year: 1960, month: 6, day: 26 }, 'numeric'); // '26/06/1960'
 * ```
 */
export function formatDate(
  date: string | CalendarDate | Date,
  style: DateStyle = DEFAULT_STYLE,
): string {
  const pattern = STYLE_PATTERNS.get(style);
  if (pattern === undefined) {
    throw new MdgError(
      'INVALID_TYPE',
      `Style is one of: ${[...STYLE_PATTERNS.keys()].join(', ')}.`,
    );
  }
  return render(pattern, toCalendarDate(date));
}
