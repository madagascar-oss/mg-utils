// date: spec data → lookup tables → TypeScript constants.
import { constant, literal } from '../emit.ts';

interface DateData {
  readonly months: readonly {
    readonly number: number;
    readonly name: string;
    readonly abbreviation: string;
  }[];
  readonly weekdays: readonly {
    readonly isoNumber: number;
    readonly name: string;
    readonly abbreviation: string;
  }[];
  readonly styles: readonly { readonly id: string; readonly pattern: string }[];
  readonly time: {
    readonly prefix: string;
    readonly after: string;
    readonly before: string;
    readonly more: string;
  };
  readonly fractions: readonly { readonly minutes: number; readonly word: string }[];
  readonly dayParts: readonly {
    readonly from: number;
    readonly to: number;
    readonly word: string;
  }[];
  readonly limits: {
    readonly minYear: number;
    readonly maxYear: number;
    readonly maxReadLength: number;
    readonly maxTimeReadLength: number;
  };
}

interface DateTables {
  /** Index = month number (1–12); index 0 is ''. */
  readonly monthNames: readonly string[];
  readonly monthAbbreviations: readonly string[];
  /** Index = ISO weekday (Monday 1 … Sunday 7); index 0 is ''. */
  readonly weekdayNames: readonly string[];
  readonly weekdayAbbreviations: readonly string[];
  /** Style id → CLDR pattern; the first entry is the default. */
  readonly styles: readonly (readonly [string, string])[];
  readonly minYear: number;
  readonly maxYear: number;
  readonly maxReadLength: number;
  readonly maxTimeReadLength: number;
  readonly time: DateData['time'];
  readonly fractions: readonly (readonly [number, string])[];
  readonly dayParts: readonly string[];
}

function byNumber<T>(
  entries: readonly T[],
  numberOf: (entry: T) => number,
  pick: (entry: T) => string,
): string[] {
  const sorted = [...entries].sort((left, right) => numberOf(left) - numberOf(right));
  sorted.forEach((entry, index) => {
    if (numberOf(entry) !== index + 1) throw new Error(`spec gap at number ${String(index + 1)}`);
  });
  return ['', ...sorted.map(pick)];
}

function dateTables(data: DateData): DateTables {
  const monthNumber = (month: DateData['months'][number]): number => month.number;
  const weekdayNumber = (weekday: DateData['weekdays'][number]): number => weekday.isoNumber;
  return {
    monthNames: byNumber(data.months, monthNumber, (month) => month.name),
    monthAbbreviations: byNumber(data.months, monthNumber, (month) => month.abbreviation),
    weekdayNames: byNumber(data.weekdays, weekdayNumber, (weekday) => weekday.name),
    weekdayAbbreviations: byNumber(data.weekdays, weekdayNumber, (weekday) => weekday.abbreviation),
    styles: data.styles.map(({ id, pattern }) => [id, pattern] as const),
    minYear: data.limits.minYear,
    maxReadLength: data.limits.maxReadLength,
    maxYear: data.limits.maxYear,
    maxTimeReadLength: data.limits.maxTimeReadLength,
    time: data.time,
    fractions: data.fractions.map(({ minutes, word }) => [minutes, word] as const),
    dayParts: dayPartByHour(data.dayParts),
  };
}

const HOURS_PER_DAY = 24;

/** The part of the day of each hour 0–23, checking the ranges cover every hour exactly once. */
function dayPartByHour(parts: DateData['dayParts']): string[] {
  return Array.from({ length: HOURS_PER_DAY }, (_, hour) => {
    const matches = parts.filter(({ from, to }) => hour >= from && hour <= to);
    if (matches.length !== 1)
      throw new Error(`day parts: hour ${String(hour)} is not covered once`);
    return matches[0]?.word ?? '';
  });
}

export function emit(data: DateData): string[] {
  const tables = dateTables(data);
  const styleUnion = tables.styles.map(([id]) => literal(id)).join(' | ');
  return [
    constant('MONTH_NAMES', tables.monthNames, 'Index = month number; index 0 is unused.'),
    constant('MONTH_ABBREVIATIONS', tables.monthAbbreviations, 'Index = month number.'),
    constant(
      'WEEKDAY_NAMES',
      tables.weekdayNames,
      'Index = ISO weekday (Monday 1); index 0 is unused.',
    ),
    constant('WEEKDAY_ABBREVIATIONS', tables.weekdayAbbreviations, 'Index = ISO weekday.'),
    `/** Date style for {@link formatDate}; \`long\` is the default. */\nexport type DateStyle = ${styleUnion};`,
    `/** @internal Style → CLDR pattern; the first entry is the default. */\nexport const STYLE_PATTERNS: ReadonlyMap<DateStyle, string> = new Map<DateStyle, string>(${literal(tables.styles)});`,
    constant('DEFAULT_STYLE', tables.styles[0]?.[0] ?? ''),
    constant('MIN_YEAR', tables.minYear),
    constant('MAX_READ_LENGTH', tables.maxReadLength, 'Longest text parseDate reads.'),
    constant('MAX_YEAR', tables.maxYear),
    constant('TIME_WORDS', tables.time, 'Rule 7: the words around the hour.'),
    constant('TIME_FRACTIONS', tables.fractions, 'Minutes with a word of their own.'),
    constant('DAY_PARTS', tables.dayParts, 'Index = hour 0–23 → part of the day.'),
    constant('MAX_TIME_READ_LENGTH', tables.maxTimeReadLength, 'Longest text parseTime reads.'),
  ];
}
