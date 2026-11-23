// GENERATED — edit spec/ instead. Run `just codegen` to refresh.

// From spec/words/data.yaml, spec 0.1.0.

/** @internal */
export const ZERO_WORD = 'aotra' as const;

/** @internal Index = digit; index 0 is unused. */
export const UNIT_WORDS = [
  '',
  'iray',
  'roa',
  'telo',
  'efatra',
  'dimy',
  'enina',
  'fito',
  'valo',
  'sivy',
] as const;

/** @internal */
export const UNIT_ONE_IN_COMPOUND = 'iraika' as const;

/** @internal Index = tens digit. */
export const TEN_WORDS = [
  '',
  'folo',
  'roapolo',
  'telopolo',
  'efapolo',
  'dimampolo',
  'enimpolo',
  'fitopolo',
  'valopolo',
  'sivifolo',
] as const;

/** @internal Index = hundreds digit. */
export const HUNDRED_WORDS = [
  '',
  'zato',
  'roanjato',
  'telonjato',
  'efajato',
  'dimanjato',
  'eninjato',
  'fitonjato',
  'valonjato',
  'sivinjato',
] as const;

/** @internal Ascending by value. */
export const SCALES = [
  { value: 1000, word: 'arivo', maxCount: 9 },
  { value: 10000, word: 'alina', maxCount: 9 },
  { value: 100000, word: 'hetsy', maxCount: 9 },
  { value: 1000000, word: 'tapitrisa', maxCount: 999 },
  { value: 1000000000, word: 'lavitrisa', maxCount: 999 },
] as const;

/** @internal */
export const JOINER_UNITS_BEFORE_TEN = "ambin' ny" as const;

/** @internal */
export const JOINER_BELOW_THOUSAND = 'amby' as const;

/** @internal */
export const JOINER_BETWEEN_GROUPS = 'sy' as const;

/** @internal */
export const MIN_VALUE = 0 as const;

/** @internal */
export const MAX_VALUE = 999999999999 as const;
