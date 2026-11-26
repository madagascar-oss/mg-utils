import { numberToWords } from '@madagascar-oss/words';
import { CURRENCY_WORD, FRANCS_PER_ARIARY } from './generated/data.ts';
import { MgError } from './generated/errors.ts';
import { assertAmount, MAX_AMOUNT_IN_FRANCS } from './amount.ts';

/**
 * Writes an Ariary amount in Malagasy words.
 *
 * @param amount - Whole ariary from 0 to `Number.MAX_SAFE_INTEGER`.
 * @returns The amount in words followed by `ariary`.
 * @throws {@link MgError} `INVALID_TYPE` or `OUT_OF_RANGE`.
 *
 * @example
 * ```ts
 * ariaryToWords(1500); // 'dimanjato sy arivo ariary'
 * ```
 */
export function ariaryToWords(amount: number): string {
  assertAmount(amount);
  return `${numberToWords(amount)} ${CURRENCY_WORD}`;
}

/**
 * Converts old Malagasy francs (FMG) to ariary: 5 FMG = 1 Ar.
 *
 * @param francs - A whole multiple of 5 francs.
 * @returns The amount in ariary.
 * @throws {@link MgError} `OUT_OF_RANGE` when `francs` is negative, too large, or not a multiple
 *   of 5; `INVALID_TYPE` for non-integers.
 *
 * @example
 * ```ts
 * fmgToAriary(7500); // 1500
 * ```
 */
export function fmgToAriary(francs: number): number {
  assertAmount(francs);
  if (francs % FRANCS_PER_ARIARY !== 0) {
    throw new MgError(
      'OUT_OF_RANGE',
      `Only multiples of ${String(FRANCS_PER_ARIARY)} FMG convert to whole ariary.`,
    );
  }
  return francs / FRANCS_PER_ARIARY;
}

/**
 * Converts ariary to old Malagasy francs (FMG): 1 Ar = 5 FMG.
 *
 * @param amount - Whole ariary from 0 to `Number.MAX_SAFE_INTEGER / 5` (rounded down).
 * @returns The amount in francs.
 * @throws {@link MgError} `INVALID_TYPE`, or `OUT_OF_RANGE` when negative or when the francs
 *   would exceed `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * ```ts
 * ariaryToFmg(1500); // 7500
 * ```
 */
export function ariaryToFmg(amount: number): number {
  assertAmount(amount, MAX_AMOUNT_IN_FRANCS);
  return amount * FRANCS_PER_ARIARY;
}
