import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { formatDate, parseDate, tryParseDate, type DateStyle } from '../src/index.ts';

const STYLES: readonly DateStyle[] = ['long', 'full', 'medium', 'short', 'numeric'];
const MIN_YEAR = 1;
const MAX_YEAR = 9999;
const DAYS_IN_SHORTEST_MONTH = 28;
const MONTHS = 12;
// A year up to 31 can pass for a day, so two styles may read one text differently.
const MAX_DAY = 31;
// 23 November 2026, the date in '23/11/2026'.
const SAMPLE_YEAR = 2026;
const SAMPLE_MONTH = 11;
const SAMPLE_DAY = 23;
const SAMPLE = { year: SAMPLE_YEAR, month: SAMPLE_MONTH, day: SAMPLE_DAY };

const calendarDates = fc.record({
  year: fc.integer({ min: MIN_YEAR, max: MAX_YEAR }),
  month: fc.integer({ min: 1, max: MONTHS }),
  day: fc.integer({ min: 1, max: DAYS_IN_SHORTEST_MONTH }),
});

describe('parseDate', () => {
  test('reads back every date formatDate writes, in every style', () => {
    fc.assert(
      fc.property(calendarDates, fc.constantFrom(...STYLES), (date, style) => {
        expect(parseDate(formatDate(date, style), style)).toEqual(date);
      }),
    );
  });
});

describe('parseDate without a style', () => {
  test('reads every style back for years from 32, where no two styles collide', () => {
    fc.assert(
      fc.property(
        calendarDates.filter((date) => date.year > MAX_DAY),
        fc.constantFrom(...STYLES),
        (date, style) => {
          expect(parseDate(formatDate(date, style))).toEqual(date);
        },
      ),
    );
  });
});

describe('tryParseDate', () => {
  test('gives the date, or undefined instead of throwing', () => {
    expect(tryParseDate('23/11/2026')).toEqual(SAMPLE);
    expect(tryParseDate('30/02/2026')).toBeUndefined();
  });
});
