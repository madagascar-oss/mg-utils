// GENERATED — edit spec/ instead. Run `just codegen` to refresh.

// From spec/modules/phone/data.yaml, spec 0.8.0.

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

/** Identifier of a Malagasy mobile operator. */
export type OperatorId = 'orange' | 'airtel' | 'yas' | 'blueline';

/**
 * Display name of each mobile operator, by {@link OperatorId}.
 *
 * @example
 * ```ts
 * OPERATOR_NAMES[parsePhoneNumber('034 12 345 67').operator]; // 'Yas Madagascar'
 * ```
 */
export const OPERATOR_NAMES = {
  orange: 'Orange Madagascar',
  airtel: 'Airtel Madagascar',
  yas: 'Yas Madagascar',
  blueline: 'Blueline',
} as const;

/** @internal Two-digit operator code → operator. */
export const OPERATOR_BY_PREFIX: ReadonlyMap<string, OperatorId> = new Map<string, OperatorId>([
  ['32', 'orange'],
  ['33', 'airtel'],
  ['34', 'yas'],
  ['35', 'airtel'],
  ['37', 'orange'],
  ['38', 'yas'],
  ['39', 'blueline'],
]);

/** @internal */
export const OPERATOR_PREFIX_LENGTH = 2 as const;
