import { MAX_AMOUNT, MIN_AMOUNT } from './generated/data.ts';
import { MgError } from './generated/errors.ts';

/**
 * @internal Validates a whole amount at the public boundary.
 *
 * @param value - The amount the caller passed.
 * @param max - Largest accepted amount; ariary by default.
 */
export function assertAmount(value: unknown, max: number = MAX_AMOUNT): asserts value is number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new MgError('INVALID_TYPE', 'Amounts are whole numbers.');
  }
  if (value < MIN_AMOUNT || value > max) {
    throw new MgError('OUT_OF_RANGE', `Amounts go from ${String(MIN_AMOUNT)} to ${String(max)}.`);
  }
}
