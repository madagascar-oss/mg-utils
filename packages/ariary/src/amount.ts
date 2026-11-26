import { MIN_AMOUNT } from './generated/data.ts';
import { MgError } from './generated/errors.ts';

/** @internal The spec sets no maximum: amounts stop where a number stops being exact. */
export const MAX_AMOUNT = Number.MAX_SAFE_INTEGER;

/**
 * @internal Validates an amount, whole or decimal, at the public boundary.
 *
 * @param value - The amount the caller passed.
 */
export function assertAmount(value: unknown): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new MgError('INVALID_TYPE', 'Amounts are finite numbers.');
  }
  assertInRange(value);
}

/**
 * @internal Throws OUT_OF_RANGE for a number below 0 or above {@link MAX_AMOUNT}.
 *
 * @param value - A finite number.
 */
export function assertInRange(value: number): void {
  if (value < MIN_AMOUNT || value > MAX_AMOUNT) {
    throw new MgError(
      'OUT_OF_RANGE',
      `Amounts go from ${String(MIN_AMOUNT)} to ${String(MAX_AMOUNT)}.`,
    );
  }
}
