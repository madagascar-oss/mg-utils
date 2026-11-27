import { spell, type SpellOptions } from '@mdgascar/words';
import { CURRENCY_WORD, FRANC_DIVISION_FACTOR, FRANCS_PER_ARIARY } from './generated/data.ts';
import { assertAmount, assertInRange } from './amount.ts';
import { divideExact, multiplyExact } from './decimal.ts';

/**
 * Writes an Ariary amount in Malagasy words.
 *
 * @param amount - Ariary from 0 to `Number.MAX_SAFE_INTEGER`, whole or decimal, or plain
 *   decimal text such as `'2000000000000000.9'`, read exactly.
 * @param options - The words `system`: `standard` (default) or `traditional`.
 * @returns The amount in words followed by `ariary`; decimals follow `faingo`.
 * @throws {@link MdgError} `INVALID_TYPE`, `INVALID_FORMAT` (text) or `OUT_OF_RANGE`.
 *
 * @example
 * ```ts
 * spellAriary(1500); // 'dimanjato sy arivo ariary'
 * spellAriary(1500.5); // 'dimanjato sy arivo faingo dimy ariary'
 * spellAriary(30_000_000, { system: 'traditional' }); // 'telo safatsiroa ariary'
 * spellAriary('2000000000000000.9'); // 'roa tapitrisa lavitrisa faingo sivy ariary'
 * ```
 */
export function spellAriary(amount: number | string, options: SpellOptions = {}): string {
  // Text is checked by spell (rule 13); a number by the Ariary range.
  if (typeof amount !== 'string') assertAmount(amount);
  return `${spell(amount, options)} ${CURRENCY_WORD}`;
}

/**
 * Converts old Malagasy francs (FMG) to ariary: 5 FMG = 1 Ar, exactly in decimal.
 *
 * @param francs - Francs from 0 to `Number.MAX_SAFE_INTEGER`, whole or decimal.
 * @returns The amount in ariary: `7501` → `1500.2`.
 * @throws {@link MdgError} `INVALID_TYPE` if `francs` is not a finite number, `OUT_OF_RANGE` when
 *   it is negative or above `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * ```ts
 * fmgToAriary(7500); // 1500
 * fmgToAriary(7501); // 1500.2
 * ```
 */
export function fmgToAriary(francs: number): number {
  assertAmount(francs);
  return divideExact(francs, FRANC_DIVISION_FACTOR);
}

/**
 * Converts ariary to old Malagasy francs (FMG): 1 Ar = 5 FMG, exactly in decimal.
 *
 * @param amount - Ariary from 0 up, whole or decimal.
 * @returns The amount in francs: `0.07` → `0.35`, never `0.35000000000000003`.
 * @throws {@link MdgError} `INVALID_TYPE` if `amount` is not a finite number, `OUT_OF_RANGE` when
 *   it is negative or the francs would exceed `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * ```ts
 * ariaryToFmg(1500); // 7500
 * ariaryToFmg(0.07); // 0.35
 * ```
 */
export function ariaryToFmg(amount: number): number {
  assertAmount(amount);
  const francs = multiplyExact(amount, FRANCS_PER_ARIARY);
  assertInRange(francs);
  return francs;
}
