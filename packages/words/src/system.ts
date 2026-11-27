import { MdgError } from './generated/errors.ts';

/**
 * How large numbers are named: `standard` (default; `telopolo tapitrisa` for 30 000 000) or
 * `traditional`, with one name per power of ten (`telo safatsiroa`).
 *
 * @example
 * ```ts
 * const system: NumberSystem = 'traditional';
 * ```
 */
export type NumberSystem = 'standard' | 'traditional';

/**
 * Options for {@link spell} and {@link spellOrdinal}.
 *
 * @example
 * ```ts
 * const options: SpellOptions = { system: 'traditional' };
 * ```
 */
export interface SpellOptions {
  /** `standard` (default) or `traditional`. */
  readonly system?: NumberSystem;
}

/** @internal Both systems, standard first. */
export const SYSTEMS: readonly NumberSystem[] = ['standard', 'traditional'];
const DEFAULT_SYSTEM: NumberSystem = 'standard';

/**
 * @internal The system the options ask for, after checking them.
 *
 * @param options - The options the caller passed.
 * @returns `standard` or `traditional`.
 */
export function systemOf(options: unknown): NumberSystem {
  if (typeof options !== 'object' || options === null) {
    throw new MdgError('INVALID_TYPE', 'spell options must be an object.');
  }
  const { system = DEFAULT_SYSTEM } = options as SpellOptions;
  if (!SYSTEMS.includes(system)) {
    throw new MdgError('INVALID_TYPE', 'system is standard or traditional.');
  }
  return system;
}
