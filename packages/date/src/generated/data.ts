// GENERATED — edit spec/ instead. Run `just codegen` to refresh.

// From spec/modules/date/data.yaml, spec 0.10.0.

/** @internal Index = month number; index 0 is unused. */
export const MONTH_NAMES = [
  '',
  'Janoary',
  'Febroary',
  'Martsa',
  'Aprily',
  'Mey',
  'Jona',
  'Jolay',
  'Aogositra',
  'Septambra',
  'Oktobra',
  'Novambra',
  'Desambra',
] as const;

/** @internal Index = month number. */
export const MONTH_ABBREVIATIONS = [
  '',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mey',
  'Jon',
  'Jol',
  'Aog',
  'Sep',
  'Okt',
  'Nov',
  'Des',
] as const;

/** @internal Index = ISO weekday (Monday 1); index 0 is unused. */
export const WEEKDAY_NAMES = [
  '',
  'Alatsinainy',
  'Talata',
  'Alarobia',
  'Alakamisy',
  'Zoma',
  'Asabotsy',
  'Alahady',
] as const;

/** @internal Index = ISO weekday. */
export const WEEKDAY_ABBREVIATIONS = [
  '',
  'Alats',
  'Tal',
  'Alar',
  'Alak',
  'Zom',
  'Asab',
  'Alah',
] as const;

/** Date style for {@link formatDate}; `long` is the default. */
export type DateStyle = 'long' | 'full' | 'medium' | 'short' | 'numeric';

/** @internal Style → CLDR pattern; the first entry is the default. */
export const STYLE_PATTERNS: ReadonlyMap<DateStyle, string> = new Map<DateStyle, string>([
  ['long', 'd MMMM y'],
  ['full', 'EEEE d MMMM y'],
  ['medium', 'y MMM d'],
  ['short', 'y-MM-dd'],
  ['numeric', 'dd/MM/y'],
]);

/** @internal */
export const DEFAULT_STYLE = 'long' as const;

/** @internal */
export const MIN_YEAR = 1 as const;

/** @internal Longest text parseDate reads. */
export const MAX_READ_LENGTH = 64 as const;

/** @internal */
export const MAX_YEAR = 9999 as const;

/** @internal Rule 7: the words around the hour. */
export const TIME_WORDS = {
  prefix: "amin'ny",
  after: 'sy',
  before: 'latsaka',
  more: 'mahery',
} as const;

/** @internal Minutes with a word of their own. */
export const TIME_FRACTIONS = [
  [15, 'fahefany'],
  [20, 'fahatelony'],
  [30, 'sasany'],
] as const;

/** @internal Index = hour 0–23 → part of the day. */
export const DAY_PARTS = [
  'alina',
  'maraina',
  'maraina',
  'maraina',
  'maraina',
  'maraina',
  'maraina',
  'maraina',
  'maraina',
  'maraina',
  'maraina',
  'maraina',
  'atoandro',
  'tolakandro',
  'tolakandro',
  'tolakandro',
  'tolakandro',
  'tolakandro',
  'hariva',
  'hariva',
  'hariva',
  'hariva',
  'hariva',
  'hariva',
] as const;

/** @internal Longest text parseTime reads. */
export const MAX_TIME_READ_LENGTH = 128 as const;
