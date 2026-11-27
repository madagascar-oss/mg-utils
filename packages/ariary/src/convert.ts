import { spell, type SpellOptions } from '@mdgascar/words';
import { CURRENCY_WORD, FRANC_DIVISION_FACTOR, FRANCS_PER_ARIARY } from './generated/data.ts';
import { MdgError } from './generated/errors.ts';
import {
  amountDigits,
  amountResult,
  resultKind,
  type AmountResultKind,
  type AmountValue,
} from './amount.ts';
import { divideExact, multiplyExact } from './decimal.ts';

/**
 * Writes an Ariary amount in Malagasy words.
 *
 * @param amount - Ariary from 0 to `Number.MAX_SAFE_INTEGER`, whole or decimal, or plain
 *   decimal text such as `'1500.25'`, read exactly.
 * @param options - The words `system`: `standard` (default) or `traditional`.
 * @returns The amount in words followed by `ariary`; decimals follow `faingo`.
 * @throws {@link MdgError} `INVALID_TYPE`, `INVALID_FORMAT` (text) or `OUT_OF_RANGE`.
 *
 * @example
 * ```ts
 * spellAriary(1500); // 'dimanjato sy arivo ariary'
 * spellAriary(1500.5); // 'dimanjato sy arivo faingo dimy ariary'
 * ```
 */
export function spellAriary(amount: number | string, options: SpellOptions = {}): string {
  // Text is checked by spell (words rule 13); a number by the Ariary range.
  if (typeof amount !== 'string') amountDigits(amount);
  return `${spell(amount, options)} ${CURRENCY_WORD}`;
}

function kindFor(options: unknown): AmountResultKind {
  const kind = resultKind(options);
  if (kind === undefined) throw new MdgError('INVALID_TYPE', "as is 'number' or 'text'.");
  return kind;
}

/**
 * Converts old Malagasy francs (FMG) to ariary: 5 FMG = 1 Ar, exactly in decimal.
 *
 * @param francs - Francs from 0 up, whole or decimal, as a number or decimal text.
 * @param options - Optional `as`: `number` (default) or `text` for the exact digits.
 * @returns The amount in ariary: `7501` → `1500.2`.
 * @throws {@link MdgError} `INVALID_TYPE` for a value that is not a finite number or text,
 *   `INVALID_FORMAT` for text that is not plain decimal, `OUT_OF_RANGE` for a negative number,
 *   `PRECISION_LOSS` when a number cannot hold the result exactly.
 *
 * @example
 * ```ts
 * fmgToAriary(7500); // 1500
 * fmgToAriary(7501); // 1500.2
 * ```
 */
export function fmgToAriary<Kind extends AmountResultKind = 'number'>(
  francs: number | string,
  options: { readonly as?: Kind } = {},
): AmountValue<Kind> {
  const digits = amountDigits(francs);
  return amountResult(
    divideExact(digits, FRANC_DIVISION_FACTOR),
    kindFor(options),
  ) as AmountValue<Kind>;
}

/**
 * Converts ariary to old Malagasy francs (FMG): 1 Ar = 5 FMG, exactly in decimal.
 *
 * @param amount - Ariary from 0 up, whole or decimal, as a number or decimal text.
 * @param options - Optional `as`: `number` (default) or `text` for the exact digits.
 * @returns The amount in francs: `0.07` → `0.35`, never `0.35000000000000003`.
 * @throws {@link MdgError} as {@link fmgToAriary}.
 *
 * @example
 * ```ts
 * ariaryToFmg(1500); // 7500
 * ```
 */
export function ariaryToFmg<Kind extends AmountResultKind = 'number'>(
  amount: number | string,
  options: { readonly as?: Kind } = {},
): AmountValue<Kind> {
  const digits = amountDigits(amount);
  return amountResult(
    multiplyExact(digits, FRANCS_PER_ARIARY),
    kindFor(options),
  ) as AmountValue<Kind>;
}
