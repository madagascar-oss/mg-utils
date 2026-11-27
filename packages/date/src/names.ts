import {
  MONTH_ABBREVIATIONS,
  MONTH_NAMES,
  WEEKDAY_ABBREVIATIONS,
  WEEKDAY_NAMES,
} from './generated/data.ts';
import { MdgError } from './generated/errors.ts';
import type { IsoWeekday, MonthNumber } from './calendar.ts';

/**
 * Name width: `wide` (`Novambra`, default) or `abbreviated` (`Nov`).
 *
 * @example
 * ```ts
 * const width: NameWidth = 'abbreviated';
 * ```
 */
export type NameWidth = 'wide' | 'abbreviated';

const NAME_WIDTHS: ReadonlySet<unknown> = new Set<NameWidth>(['wide', 'abbreviated']);

function checkedNumber(value: unknown, last: number, what: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new MdgError('INVALID_TYPE', `Expected a whole ${what} number.`);
  }
  if (value < 1 || value > last) {
    throw new MdgError('OUT_OF_RANGE', `${what} numbers go from 1 to ${String(last)}.`);
  }
  return value;
}

function checkedWidth(width: unknown): NameWidth {
  if (!NAME_WIDTHS.has(width)) throw new MdgError('INVALID_TYPE', 'Width is wide or abbreviated.');
  return width as NameWidth;
}

/**
 * @internal Month name for a valid month number.
 *
 * @param month - Month 1–12.
 * @param width - `wide` or `abbreviated`.
 * @returns The Malagasy month name.
 */
export function monthNameOf(month: MonthNumber, width: NameWidth): string {
  return width === 'wide' ? MONTH_NAMES[month] : MONTH_ABBREVIATIONS[month];
}

/**
 * @internal Weekday name for a valid ISO weekday.
 *
 * @param weekday - Monday 1 … Sunday 7.
 * @param width - `wide` or `abbreviated`.
 * @returns The Malagasy weekday name.
 */
export function weekdayNameOf(weekday: IsoWeekday, width: NameWidth): string {
  return width === 'wide' ? WEEKDAY_NAMES[weekday] : WEEKDAY_ABBREVIATIONS[weekday];
}

/**
 * The Malagasy name of a month.
 *
 * @param month - Month number, 1 (Janoary) to 12 (Desambra).
 * @param width - `wide` (default) or `abbreviated`.
 * @returns The month name.
 * @throws {@link MdgError} `OUT_OF_RANGE` outside 1–12, `INVALID_TYPE` for non-integers or an
 *   unknown width.
 *
 * @example
 * ```ts
 * monthName(6); // 'Jona'
 * monthName(11, 'abbreviated'); // 'Nov'
 * ```
 */
export function monthName(month: number, width: NameWidth = 'wide'): string {
  const checkedMonth = checkedNumber(month, MONTH_NAMES.length - 1, 'Month');
  return monthNameOf(checkedMonth as MonthNumber, checkedWidth(width));
}

/**
 * The Malagasy name of a weekday, numbered as in ISO 8601 (Monday 1 … Sunday 7).
 *
 * @param isoWeekday - 1 (Alatsinainy) to 7 (Alahady).
 * @param width - `wide` (default) or `abbreviated`.
 * @returns The weekday name.
 * @throws {@link MdgError} `OUT_OF_RANGE` outside 1–7, `INVALID_TYPE` for non-integers or an
 *   unknown width.
 *
 * @example
 * ```ts
 * weekdayName(1); // 'Alatsinainy'
 * weekdayName(7, 'abbreviated'); // 'Alah'
 * ```
 */
export function weekdayName(isoWeekday: number, width: NameWidth = 'wide'): string {
  const checkedWeekday = checkedNumber(isoWeekday, WEEKDAY_NAMES.length - 1, 'Weekday');
  return weekdayNameOf(checkedWeekday as IsoWeekday, checkedWidth(width));
}
