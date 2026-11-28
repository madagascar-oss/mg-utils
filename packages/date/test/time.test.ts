import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { parseTime, spellTime, tryParseTime } from '../src/index.ts';

const LAST_HOUR = 23;
const LAST_MINUTE = 59;
const AFTERNOON_HOUR = 14;
const HALF_HOUR = 30;
const HALF_PAST_TWO = "amin'ny roa sy sasany tolakandro";

const clockTimes = fc.record({
  hour: fc.integer({ min: 0, max: LAST_HOUR }),
  minute: fc.integer({ min: 0, max: LAST_MINUTE }),
});

describe('spellTime and parseTime', () => {
  test('read back every time of the day', () => {
    fc.assert(
      fc.property(clockTimes, (time) => {
        expect(parseTime(spellTime(time))).toEqual(time);
      }),
    );
  });

  test('spellTime reads a Date in its local time', () => {
    const date = new Date();
    date.setHours(AFTERNOON_HOUR, HALF_HOUR);
    expect(spellTime(date)).toBe(HALF_PAST_TWO);
  });

  test('spellTime rejects an invalid Date', () => {
    expect(() => spellTime(new Date(Number.NaN))).toThrow(
      expect.objectContaining({ code: 'INVALID_FORMAT' }),
    );
  });

  test('tryParseTime gives the time, or undefined instead of throwing', () => {
    expect(tryParseTime(HALF_PAST_TWO)).toEqual({ hour: AFTERNOON_HOUR, minute: HALF_HOUR });
    expect(tryParseTime('two thirty')).toBeUndefined();
  });

  test('parseTime rejects text longer than the limit', () => {
    expect(() => parseTime('roa '.repeat(HALF_HOUR + HALF_HOUR))).toThrow(
      expect.objectContaining({ code: 'INVALID_FORMAT' }),
    );
  });
});
