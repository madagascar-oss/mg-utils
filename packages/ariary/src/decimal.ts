// Exact decimal helpers. Amounts are number values, but money must never show binary rounding
// artefacts (0.07 × 5 is 0.35000000000000003 in floating point), so these work on the decimal
// digits of the value's shortest exact form.

const DECIMAL_POINT = '.';
const ZERO = '0';
// String(value) of a small number, e.g. '1e-7' or '1.5e-10'.
const NEGATIVE_EXPONENT = /^(\d)(?:\.(\d+))?e-(\d+)$/;

/**
 * @internal The shortest exact decimal form of a number, never in exponent notation.
 *
 * @param value - A non-negative finite number.
 * @returns Its digits: `1500.5` → `'1500.5'`, `1e-7` → `'0.0000001'`.
 */
export function plainDecimal(value: number): string {
  const text = String(value);
  const match = NEGATIVE_EXPONENT.exec(text);
  if (match === null) return text;
  const [, lead = '', rest = '', exponent = ''] = match;
  return `0${DECIMAL_POINT}${ZERO.repeat(Number(exponent) - 1)}${lead}${rest}`;
}

interface Scaled {
  /** All the digits, as one integer. */
  readonly units: bigint;
  /** How many of them come after the point. */
  readonly places: number;
}

function toScaled(value: number): Scaled {
  const [whole = '', decimals = ''] = plainDecimal(value).split(DECIMAL_POINT);
  return { units: BigInt(`${whole}${decimals}`), places: decimals.length };
}

function toNumber({ units, places }: Scaled): number {
  const digits = units.toString().padStart(places + 1, ZERO);
  const point = digits.length - places;
  return Number(`${digits.slice(0, point)}${DECIMAL_POINT}${digits.slice(point)}`);
}

/**
 * @internal Multiplies exactly in decimal, then reads the result as the nearest number.
 *
 * @param value - A non-negative finite number.
 * @param factor - A whole multiplier.
 * @returns `value × factor`: `0.07 × 5` → `0.35`.
 */
export function multiplyExact(value: number, factor: number): number {
  const { units, places } = toScaled(value);
  return toNumber({ units: units * BigInt(factor), places });
}

/**
 * @internal Divides exactly by a divisor of 10: multiplies by `10 ÷ divisor`, then moves the
 * point one place left.
 *
 * @param value - A non-negative finite number.
 * @param divisionFactor - `10 ÷ divisor` (2 to divide by 5).
 * @returns `value ÷ divisor`: `7501 ÷ 5` → `1500.2`.
 */
export function divideExact(value: number, divisionFactor: number): number {
  const { units, places } = toScaled(value);
  return toNumber({ units: units * BigInt(divisionFactor), places: places + 1 });
}
