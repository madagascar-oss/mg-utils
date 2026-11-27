import {
  MAX_READ_LENGTH,
  MONTH_ABBREVIATIONS,
  MONTH_NAMES,
  STYLE_PATTERNS,
  WEEKDAY_NAMES,
  type DateStyle,
} from './generated/data.ts';
import { MdgError, type ErrorCode, type SafeParseResult } from './generated/errors.ts';
import { checkedTextDate, isoWeekdayOf, type CalendarDate } from './calendar.ts';

type PatternToken = 'EEEE' | 'MMMM' | 'MMM' | 'MM' | 'dd' | 'd' | 'y';

// Fields read from one style, before the calendar checks them.
interface ReadFields {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly weekday: number | undefined;
}

type FieldName = keyof ReadFields;

// Each pattern letter (CLDR, as in formatDate) becomes a capture: names by their index,
// numbers as people type them (one or two digits for day and month, up to four for the year).
const PATTERN_TOKEN = /EEEE|MMMM|MMM|MM|dd|d|y|\s+|[^\sEMdy]+/g;
const REGEX_SPECIAL = /[\\^$.*+?()[\]{}|-]/g;
const ANY_SPACE = '\\s+';
const DAY_OR_MONTH = '(\\d{1,2})';
const YEAR = '(\\d{1,4})';
const WHITESPACE = /^\s+$/;

function namesPattern(names: readonly string[]): string {
  return `(${names.filter((name) => name !== '').join('|')})`;
}

const TOKEN_PATTERNS: Readonly<Record<PatternToken, readonly [string, FieldName]>> = {
  EEEE: [namesPattern(WEEKDAY_NAMES), 'weekday'],
  MMMM: [namesPattern(MONTH_NAMES), 'month'],
  MMM: [namesPattern(MONTH_ABBREVIATIONS), 'month'],
  MM: [DAY_OR_MONTH, 'month'],
  dd: [DAY_OR_MONTH, 'day'],
  d: [DAY_OR_MONTH, 'day'],
  y: [YEAR, 'year'],
};

interface StyleReader {
  readonly pattern: RegExp;
  readonly fields: readonly [FieldName, PatternToken][];
}

function styleReader(stylePattern: string): StyleReader {
  const fields: [FieldName, PatternToken][] = [];
  const source = Array.from(stylePattern.matchAll(PATTERN_TOKEN), ([part]) => {
    if (WHITESPACE.test(part)) return ANY_SPACE;
    const token = TOKEN_PATTERNS[part as PatternToken] as
      (typeof TOKEN_PATTERNS)[PatternToken] | undefined;
    if (token === undefined) return part.replace(REGEX_SPECIAL, '\\$&');
    fields.push([token[1], part as PatternToken]);
    return token[0];
  });
  return { pattern: new RegExp(`^${source.join('')}$`, 'i'), fields };
}

const READERS: ReadonlyMap<DateStyle, StyleReader> = new Map(
  [...STYLE_PATTERNS].map(([style, pattern]) => [style, styleReader(pattern)]),
);

function nameIndex(names: readonly string[], text: string): number {
  return names.findIndex((name) => name.toLowerCase() === text.toLowerCase());
}

// The number a capture stands for: a name's index, or the digits.
function capturedValue(token: PatternToken, text: string): number {
  if (token === 'EEEE') return nameIndex(WEEKDAY_NAMES, text);
  if (token === 'MMMM') return nameIndex(MONTH_NAMES, text);
  if (token === 'MMM') return nameIndex(MONTH_ABBREVIATIONS, text);
  return Number(text);
}

function readStyle(text: string, reader: StyleReader): ReadFields | undefined {
  const match = reader.pattern.exec(text);
  if (match === null) return undefined;
  const fields: Partial<Record<FieldName, number>> = {};
  reader.fields.forEach(([name, token], index) => {
    fields[name] = capturedValue(token, String(match[index + 1]));
  });
  // Every style writes a year, a month and a day; the weekday only in `full`.
  return {
    year: Number(fields.year),
    month: Number(fields.month),
    day: Number(fields.day),
    weekday: fields.weekday,
  };
}

function failure(code: ErrorCode, message: string): SafeParseResult<never> {
  return { success: false, error: new MdgError(code, message) };
}

function readersFor(style: unknown): readonly StyleReader[] | undefined {
  if (style === undefined) return [...READERS.values()];
  const reader = READERS.get(style as DateStyle);
  return reader === undefined ? undefined : [reader];
}

// The calendar checks the fields; a weekday, when written, must be the date's own.
function checkedFields(fields: ReadFields): SafeParseResult<CalendarDate> {
  try {
    const date = checkedTextDate({ year: fields.year, month: fields.month, day: fields.day });
    if (fields.weekday !== undefined && fields.weekday !== isoWeekdayOf(date)) {
      return failure('INVALID_FORMAT', 'The weekday does not match the date.');
    }
    return { success: true, data: date };
  } catch (error) {
    return { success: false, error: error as MdgError };
  }
}

/**
 * Reads a Malagasy date without throwing.
 *
 * @param text - A date as {@link formatDate} writes it, in any style, any case and spacing.
 * @param style - Optional: read only this style.
 * @returns `{ success: true, data }` with the calendar date, or `{ success: false, error }`.
 *
 * @example
 * ```ts
 * const result = safeParseDate('23 Novambra 2026');
 * if (result.success) result.data; // { year: 2026, month: 11, day: 23 }
 * ```
 */
export function safeParseDate(text: unknown, style?: DateStyle): SafeParseResult<CalendarDate> {
  if (typeof text !== 'string') return failure('INVALID_TYPE', 'Expected the date as text.');
  const readers = readersFor(style);
  if (readers === undefined) {
    return failure('INVALID_TYPE', `Style is one of: ${[...READERS.keys()].join(', ')}.`);
  }
  const trimmed = text.trim();
  if (text.length > MAX_READ_LENGTH) {
    return failure('INVALID_FORMAT', `Dates are at most ${String(MAX_READ_LENGTH)} characters.`);
  }
  const [first, ...others] = readers.flatMap((reader) => readStyle(trimmed, reader) ?? []);
  if (first === undefined) {
    return failure('INVALID_FORMAT', 'Expected a date such as 23 Novambra 2026 or 23/11/2026.');
  }
  return oneDate(checkedFields(first), others.map(checkedFields));
}

function dateKey({ year, month, day }: CalendarDate): string {
  return [year, month, day].join('-');
}

// A text two styles read as different dates ('5 Mey 12': May is 'Mey' in both) is ambiguous.
function oneDate(
  first: SafeParseResult<CalendarDate>,
  others: readonly SafeParseResult<CalendarDate>[],
): SafeParseResult<CalendarDate> {
  const [date, ...rest] = [first, ...others].flatMap((result) =>
    result.success ? [result.data] : [],
  );
  if (date === undefined) return first;
  if (rest.some((other) => dateKey(other) !== dateKey(date))) {
    return failure('AMBIGUOUS', 'This text reads as more than one date; pass the style.');
  }
  return { success: true, data: date };
}

/**
 * Reads a Malagasy date back into calendar fields: the inverse of {@link formatDate}.
 *
 * @param text - A date in any style {@link formatDate} writes: `23 Novambra 2026`,
 *   `Alatsinainy 23 Novambra 2026`, `2026 Nov 23`, `2026-11-23` or `23/11/2026`. Case and
 *   spacing do not matter; day and month may have one digit.
 * @param style - Optional: read only this style.
 * @returns The calendar date.
 * @throws {@link MdgError} `INVALID_TYPE` for non-strings or an unknown style,
 *   `INVALID_FORMAT` for text in no style, a day that does not exist or a wrong weekday,
 *   `OUT_OF_RANGE` for a year outside 1–9999, `AMBIGUOUS` when two styles read different dates
 *   (only for years up to 31, such as `5 Mey 12`; pass the style).
 *
 * @example
 * ```ts
 * parseDate('23 Novambra 2026'); // { year: 2026, month: 11, day: 23 }
 * parseDate('23/11/2026'); // { year: 2026, month: 11, day: 23 }
 * ```
 */
export function parseDate(text: string, style?: DateStyle): CalendarDate {
  const result = safeParseDate(text, style);
  if (!result.success) throw result.error;
  return result.data;
}

/**
 * Reads a Malagasy date, or gives `undefined` instead of throwing.
 *
 * @param text - A date in any style {@link formatDate} writes.
 * @param style - Optional: read only this style.
 * @returns The calendar date, or `undefined` when {@link parseDate} would throw.
 *
 * @example
 * ```ts
 * tryParseDate('23/11/2026'); // { year: 2026, month: 11, day: 23 }
 * tryParseDate('30/02/2026'); // undefined
 * ```
 */
export function tryParseDate(text: unknown, style?: DateStyle): CalendarDate | undefined {
  const result = safeParseDate(text, style);
  return result.success ? result.data : undefined;
}
