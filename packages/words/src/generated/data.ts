// GENERATED — edit spec/ instead. Run `just codegen` to refresh.

// From spec/modules/words/data.yaml, spec 0.8.0.

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

/** @internal Ascending; countDigits null = no limit. */
export const SCALES = [
  { word: 'arivo', exponent: 3, countDigits: 1 },
  { word: 'alina', exponent: 4, countDigits: 1 },
  { word: 'hetsy', exponent: 5, countDigits: 1 },
  { word: 'tapitrisa', exponent: 6, countDigits: 3 },
  { word: 'lavitrisa', exponent: 9, countDigits: null },
] as const;

/** @internal Rule 12: one name per power of ten, ascending, each taking one digit. */
export const TRADITIONAL_SCALES = [
  { word: 'arivo', exponent: 3, countDigits: 1 },
  { word: 'alina', exponent: 4, countDigits: 1 },
  { word: 'hetsy', exponent: 5, countDigits: 1 },
  { word: 'tapitrisa', exponent: 6, countDigits: 1 },
  { word: 'safatsiroa', exponent: 7, countDigits: 1 },
  { word: 'tsitamboisa', exponent: 8, countDigits: 1 },
  { word: 'lavitrisa', exponent: 9, countDigits: 1 },
  { word: 'alinkisa', exponent: 10, countDigits: 1 },
  { word: 'tsipesimpesenina', exponent: 11, countDigits: 1 },
  { word: 'tsitokotsiforohana', exponent: 12, countDigits: 1 },
  { word: 'tsihitanoanoa', exponent: 13, countDigits: 1 },
  { word: 'safatsiroafaharoa', exponent: 14, countDigits: 1 },
  { word: 'tsitamboisafaharoa', exponent: 15, countDigits: 1 },
  { word: 'lavitrisafaharoa', exponent: 16, countDigits: 1 },
  { word: 'alinkisafaharoa', exponent: 17, countDigits: 1 },
  { word: 'tsipesimpeseninafaharoa', exponent: 18, countDigits: 1 },
] as const;

/** @internal */
export const DECIMAL_SEPARATOR = 'faingo' as const;

/** @internal */
export const JOINER_UNITS_BEFORE_TEN = "ambin'ny" as const;

/** @internal */
export const JOINER_BELOW_THOUSAND = 'amby' as const;

/** @internal */
export const JOINER_BETWEEN_GROUPS = 'sy' as const;

/** @internal */
export const MIN_VALUE = 0 as const;

/** @internal Longest decimal text read (rule 13). */
export const MAX_TEXT_LENGTH = 100 as const;
