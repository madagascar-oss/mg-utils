// Exact decimal helpers. Money must never show binary rounding artefacts (0.07 × 5 is
// 0.35000000000000003 in floating point), so these work on decimal digits only.

const DECIMAL_POINT = '.';
const ZERO = '0';
// String(value) of a small number, e.g. '1e-7' or '1.5e-10'.
const NEGATIVE_EXPONENT = /^(\d)(?:\.(\d+))?e-(\d+)$/;
const LEADING_ZEROS = /^0+(?=\d)/;
const TRAILING_DECIMAL_ZEROS = /\.?0+$/;

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

function toScaled(digits: string): Scaled {
  const [whole = '', decimals = ''] = digits.split(DECIMAL_POINT);
  return { units: BigInt(`${whole}${decimals}`), places: decimals.length };
}

// Canonical decimal text: no leading zeros, no trailing decimal zeros.
function toDigits({ units, places }: Scaled): string {
  const digits = units.toString().padStart(places + 1, ZERO);
  const point = digits.length - places;
  const whole = digits.slice(0, point).replace(LEADING_ZEROS, '');
  if (places === 0) return whole;
  return `${whole}${DECIMAL_POINT}${digits.slice(point)}`.replace(TRAILING_DECIMAL_ZEROS, '');
}

/**
 * @internal Multiplies decimal text exactly.
 *
 * @param digits - Canonical decimal text.
 * @param factor - A whole multiplier.
 * @returns `digits × factor`: `'0.07' × 5` → `'0.35'`.
 */
export function multiplyExact(digits: string, factor: number): string {
  const { units, places } = toScaled(digits);
  return toDigits({ units: units * BigInt(factor), places });
}

/**
 * @internal Divides decimal text exactly by a divisor of 10: multiplies by `10 ÷ divisor`,
 * then moves the point one place left.
 *
 * @param digits - Canonical decimal text.
 * @param divisionFactor - `10 ÷ divisor` (2 to divide by 5).
 * @returns `digits ÷ divisor`: `'7501' ÷ 5` → `'1500.2'`.
 */
export function divideExact(digits: string, divisionFactor: number): string {
  const { units, places } = toScaled(digits);
  return toDigits({ units: units * BigInt(divisionFactor), places: places + 1 });
}
