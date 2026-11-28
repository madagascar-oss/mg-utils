// GENERATED — edit spec/ instead. Run `just codegen` to refresh.

// From spec/modules/phone/data.yaml, spec 0.10.0.

/** @internal */
export const COUNTRY_CODE = '261' as const;

/** @internal */
export const INTERNATIONAL_PREFIX = '00' as const;

/** @internal */
export const TRUNK_PREFIX = '0' as const;

/** @internal */
export const NATIONAL_NUMBER_LENGTH = 9 as const;

/** @internal Digit group sizes of the national number. */
export const GROUPING = [2, 2, 3, 2] as const;

/** Identifier of a Malagasy telephone operator. */
export type OperatorId = 'orange' | 'airtel' | 'yas' | 'blueline' | 'gulfsat';

/**
 * Display name of each operator, by {@link OperatorId}.
 *
 * @example
 * ```ts
 * OPERATOR_NAMES[parsePhone('034 12 345 67').operator]; // 'Yas Madagascar'
 * ```
 */
export const OPERATOR_NAMES = {
  orange: 'Orange Madagascar',
  airtel: 'Airtel Madagascar',
  yas: 'Yas Madagascar',
  blueline: 'Blueline',
  gulfsat: 'Gulfsat Madagascar',
} as const;

/** @internal Two-digit operator code → operator and line type. */
export const OPERATOR_BY_PREFIX: ReadonlyMap<
  string,
  { readonly operator: OperatorId; readonly type: 'mobile' | 'fixed' }
> = new Map<string, { readonly operator: OperatorId; readonly type: 'mobile' | 'fixed' }>([
  ['20', { operator: 'yas', type: 'fixed' }],
  ['22', { operator: 'gulfsat', type: 'fixed' }],
  ['32', { operator: 'orange', type: 'mobile' }],
  ['33', { operator: 'airtel', type: 'mobile' }],
  ['34', { operator: 'yas', type: 'mobile' }],
  ['35', { operator: 'airtel', type: 'mobile' }],
  ['36', { operator: 'yas', type: 'mobile' }],
  ['37', { operator: 'orange', type: 'mobile' }],
  ['38', { operator: 'yas', type: 'mobile' }],
  ['39', { operator: 'blueline', type: 'mobile' }],
]);

/** @internal */
export const OPERATOR_PREFIX_LENGTH = 2 as const;

/** @internal Operator code whose next digit is a zone. */
export const FIXED_ZONE_PREFIX = '20' as const;

/** @internal Assigned zone digits after it. */
export const FIXED_ZONE_DIGITS = ['2', '4', '5', '6', '7', '8', '9'] as const;

/** @internal Geographic numbers, longest prefix first. */
export const AREAS = [
  { prefix: '20722', name: 'Manakara', province: 'Fianarantsoa' },
  { prefix: '20729', name: 'Mananjary', province: 'Fianarantsoa' },
  { prefix: '2053', name: 'Toamasina', province: 'Toamasina' },
  { prefix: '2054', name: 'Ambatondrazaka', province: 'Toamasina' },
  { prefix: '2056', name: 'Moramanga', province: 'Toamasina' },
  { prefix: '2057', name: 'Sainte-Marie', province: 'Toamasina' },
  { prefix: '2062', name: 'Mahajanga', province: 'Mahajanga' },
  { prefix: '2067', name: 'Antsohihy', province: 'Mahajanga' },
  { prefix: '2069', name: 'Maintirano', province: 'Mahajanga' },
  { prefix: '2073', name: 'Farafangana', province: 'Fianarantsoa' },
  { prefix: '2075', name: 'Fianarantsoa', province: 'Fianarantsoa' },
  { prefix: '2082', name: 'Antsiranana', province: 'Antsiranana' },
  { prefix: '2086', name: 'Nosy Be', province: 'Antsiranana' },
  { prefix: '2088', name: 'Sambava', province: 'Antsiranana' },
  { prefix: '2092', name: 'Tolagnaro', province: 'Toliary' },
  { prefix: '2094', name: 'Toliary', province: 'Toliary' },
  { prefix: '2095', name: 'Morondava', province: 'Toliary' },
  { prefix: '202', name: 'Antananarivo', province: 'Antananarivo' },
] as const;
