import { spell } from '@mdgascar/words';
import { DAY_PARTS, MAX_TIME_READ_LENGTH, TIME_FRACTIONS, TIME_WORDS } from './generated/data.ts';
import { MdgError, type ErrorCode, type SafeParseResult } from './generated/errors.ts';

/**
 * A time of day: hour 0–23 and minute 0–59.
 *
 * @example
 * ```ts
 * const time: ClockTime = { hour: 14, minute: 30 };
 * ```
 */
export interface ClockTime {
  /** Hour, 0 to 23. */
  readonly hour: number;
  /** Minute, 0 to 59. */
  readonly minute: number;
}

const HOURS_PER_DAY = 24;
const HOURS_ON_THE_CLOCK = 12;
const MINUTES_PER_HOUR = 60;
// Rule 7: up to a third of an hour the minutes follow the hour with "sy"; from the half hour's
// neighbours they count from "sasany"; from 40 they count down to the next hour with "latsaka".
const LAST_MINUTE_AFTER = 20;
const HALF_HOUR = 30;
const FIRST_MINUTE_BEFORE = MINUTES_PER_HOUR - LAST_MINUTE_AFTER;
const TIME_TEXT = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
const APOSTROPHES = /[‘’ʼ`´]/g;
const SPACES = /\s+/gu;
const FRACTIONS: ReadonlyMap<number, string> = new Map(TIME_FRACTIONS);
const HALF_WORD = String(FRACTIONS.get(HALF_HOUR));

// A number of minutes in words: its own word (fahefany, fahatelony, sasany), or counted.
function minuteWords(minutes: number): string {
  return FRACTIONS.get(minutes) ?? spell(minutes);
}

// The words after the hour, and how many hours later the hour they name is.
function minutePhrase(minute: number): readonly [string, number] {
  const { after, before, more } = TIME_WORDS;
  if (minute === 0) return ['', 0];
  if (minute <= LAST_MINUTE_AFTER) return [`${after} ${minuteWords(minute)}`, 0];
  if (minute < HALF_HOUR)
    return [`${after} ${HALF_WORD} ${before} ${minuteWords(HALF_HOUR - minute)}`, 0];
  if (minute === HALF_HOUR) return [`${after} ${HALF_WORD}`, 0];
  if (minute < FIRST_MINUTE_BEFORE)
    return [`${after} ${HALF_WORD} ${more} ${minuteWords(minute - HALF_HOUR)}`, 0];
  return [`${before} ${minuteWords(MINUTES_PER_HOUR - minute)}`, 1];
}

function timeWords({ hour, minute }: ClockTime): string {
  const [minutes, hoursLater] = minutePhrase(minute);
  const named = (hour + hoursLater) % HOURS_PER_DAY;
  const onTheClock = named % HOURS_ON_THE_CLOCK || HOURS_ON_THE_CLOCK;
  return [TIME_WORDS.prefix, spell(onTheClock), minutes, String(DAY_PARTS[named])]
    .filter((word) => word !== '')
    .join(' ');
}

function isWhole(value: unknown, last: number): value is number {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= last;
}

function fromFields(fields: object): ClockTime {
  const { hour, minute } = fields as Partial<Record<keyof ClockTime, unknown>>;
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    throw new MdgError('INVALID_TYPE', 'Expected whole numbers for hour and minute.');
  }
  if (!isWhole(hour, HOURS_PER_DAY - 1) || !isWhole(minute, MINUTES_PER_HOUR - 1)) {
    throw new MdgError('OUT_OF_RANGE', 'Hours go from 0 to 23 and minutes from 0 to 59.');
  }
  return { hour, minute };
}

function toClockTime(time: unknown): ClockTime {
  if (typeof time === 'string') {
    const match = TIME_TEXT.exec(time);
    if (match === null) throw new MdgError('INVALID_FORMAT', 'Expected a time as HH:MM.');
    return { hour: Number(match[1]), minute: Number(match[2]) };
  }
  if (time instanceof Date) {
    if (Number.isNaN(time.getTime())) throw new MdgError('INVALID_FORMAT', 'Invalid Date.');
    return { hour: time.getHours(), minute: time.getMinutes() };
  }
  if (typeof time === 'object' && time !== null) return fromFields(time);
  throw new MdgError('INVALID_TYPE', 'Expected HH:MM text, { hour, minute } or a Date.');
}

/**
 * Says a time of day in Malagasy: `amin'ny`, the hour on a 12-hour clock, the minutes, then
 * the part of the day.
 *
 * @param time - `HH:MM` text, `{ hour, minute }`, or a `Date` (read in its local time).
 * @returns The time in words.
 * @throws {@link MdgError} `INVALID_FORMAT` for text that is not `HH:MM`, `OUT_OF_RANGE` for an
 *   hour outside 0–23 or a minute outside 0–59, `INVALID_TYPE` for other input.
 *
 * @example
 * ```ts
 * spellTime('14:30'); // "amin'ny roa sy sasany tolakandro"
 * spellTime('07:15'); // "amin'ny fito sy fahefany maraina"
 * spellTime('17:45'); // "amin'ny enina latsaka fahefany hariva"
 * ```
 */
export function spellTime(time: string | ClockTime | Date): string {
  return timeWords(toClockTime(time));
}

// Every time of the day by its words, built once.
let byWords: ReadonlyMap<string, ClockTime> | undefined;

function timesByWords(): ReadonlyMap<string, ClockTime> {
  byWords ??= new Map(
    Array.from({ length: HOURS_PER_DAY * MINUTES_PER_HOUR }, (_, index) => {
      const time = { hour: Math.floor(index / MINUTES_PER_HOUR), minute: index % MINUTES_PER_HOUR };
      return [timeWords(time), time] as const;
    }),
  );
  return byWords;
}

// Case, apostrophes and spacing do not change the time, and "amin'ny" may be left out.
function normalise(text: string): string {
  const words = text.toLowerCase().replace(APOSTROPHES, "'").replace(SPACES, ' ').trim();
  return words.startsWith(`${TIME_WORDS.prefix} `) ? words : `${TIME_WORDS.prefix} ${words}`;
}

function failure(code: ErrorCode, message: string): SafeParseResult<never> {
  return { success: false, error: new MdgError(code, message) };
}

/**
 * Reads a time said in Malagasy without throwing.
 *
 * @param text - A time as {@link spellTime} says it.
 * @returns `{ success: true, data }` with the time, or `{ success: false, error }`.
 *
 * @example
 * ```ts
 * const result = safeParseTime("amin'ny roa sy sasany tolakandro");
 * if (result.success) result.data; // { hour: 14, minute: 30 }
 * ```
 */
export function safeParseTime(text: unknown): SafeParseResult<ClockTime> {
  if (typeof text !== 'string') return failure('INVALID_TYPE', 'Expected the time as text.');
  if (text.length > MAX_TIME_READ_LENGTH) {
    return failure(
      'INVALID_FORMAT',
      `Times are at most ${String(MAX_TIME_READ_LENGTH)} characters.`,
    );
  }
  const time = timesByWords().get(normalise(text));
  if (time === undefined) {
    return failure('INVALID_FORMAT', "Expected a time such as amin'ny roa sy sasany tolakandro.");
  }
  return { success: true, data: time };
}

/**
 * Reads a time said in Malagasy back into hour and minute: the inverse of {@link spellTime}.
 *
 * @param text - A time as {@link spellTime} says it, in any case and spacing, with or without
 *   `amin'ny`.
 * @returns The time.
 * @throws {@link MdgError} `INVALID_TYPE` for non-strings, `INVALID_FORMAT` for anything else.
 *
 * @example
 * ```ts
 * parseTime("amin'ny roa sy sasany tolakandro"); // { hour: 14, minute: 30 }
 * ```
 */
export function parseTime(text: string): ClockTime {
  const result = safeParseTime(text);
  if (!result.success) throw result.error;
  return result.data;
}

/**
 * Reads a time said in Malagasy, or gives `undefined` instead of throwing.
 *
 * @param text - A time as {@link spellTime} says it.
 * @returns The time, or `undefined` when {@link parseTime} would throw.
 *
 * @example
 * ```ts
 * tryParseTime("amin'ny fito maraina"); // { hour: 7, minute: 0 }
 * tryParseTime('seven'); // undefined
 * ```
 */
export function tryParseTime(text: unknown): ClockTime | undefined {
  const result = safeParseTime(text);
  return result.success ? result.data : undefined;
}
