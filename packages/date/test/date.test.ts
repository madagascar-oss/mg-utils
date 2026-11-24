import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { formatDate, type CalendarDate } from '../src/index.ts';

// Years with four digits, so the CLDR `short` style (y-MM-dd) writes them exactly as ISO text.
const FIRST_FOUR_DIGIT_YEAR = 1000;
const LAST_SUPPORTED_YEAR = 9999;
const DECEMBER_INDEX = 11;
const LAST_DAY_OF_DECEMBER = 31;
const INDEPENDENCE_MONTH = 6;
const JUNE_INDEX = INDEPENDENCE_MONTH - 1;
const INDEPENDENCE_DAY = 26;
const INDEPENDENCE_YEAR = 1960;
const BEFORE_FIRST_YEAR = -1;

const isoDates = fc
  .date({
    min: new Date(Date.UTC(FIRST_FOUR_DIGIT_YEAR, 0, 1)),
    max: new Date(Date.UTC(LAST_SUPPORTED_YEAR, DECEMBER_INDEX, LAST_DAY_OF_DECEMBER)),
    noInvalidDate: true,
  })
  .map((date) => date.toISOString().slice(0, '2026-11-23'.length));

describe('formatDate', () => {
  test('writes the short style exactly as the ISO text it reads', () => {
    fc.assert(
      fc.property(isoDates, (text) => {
        expect(formatDate(text, 'short')).toBe(text);
      }),
    );
  });

  test('reads a Date in its local calendar fields', () => {
    const independenceDay = new Date(INDEPENDENCE_YEAR, JUNE_INDEX, INDEPENDENCE_DAY);

    expect(formatDate(independenceDay, 'full')).toBe('Alahady 26 Jona 1960');
  });

  test('throws INVALID_FORMAT for an Invalid Date', () => {
    expect(() => formatDate(new Date(Number.NaN))).toThrow(
      expect.objectContaining({ code: 'INVALID_FORMAT' }),
    );
  });

  test('throws OUT_OF_RANGE for a Date before year 1', () => {
    const date = new Date(0);
    date.setFullYear(BEFORE_FIRST_YEAR);

    expect(() => formatDate(date)).toThrow(expect.objectContaining({ code: 'OUT_OF_RANGE' }));
  });

  test('throws INVALID_TYPE when a calendar field is not a whole number', () => {
    const fields = {
      year: String(INDEPENDENCE_YEAR),
      month: INDEPENDENCE_MONTH,
      day: INDEPENDENCE_DAY,
    } as unknown as CalendarDate;

    expect(() => formatDate(fields)).toThrow(expect.objectContaining({ code: 'INVALID_TYPE' }));
  });
});
