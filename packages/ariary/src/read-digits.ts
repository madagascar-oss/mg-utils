// Reads the digits of an amount typed by a user: an optional currency token, then plain or
// grouped digits.
import { CURRENCY_TOKENS, GROUP_SIZE, READABLE_SEPARATORS } from './generated/data.ts';

const SPACE = ' ';
// Spaces, no-break spaces and narrow no-break spaces count as one separator when reading.
const WHITESPACE_SEPARATORS = new RegExp(
  `[${READABLE_SEPARATORS.filter((separator) => /\s/.test(separator)).join('')}]`,
  'g',
);
const SEPARATOR_CLASS = READABLE_SEPARATORS.filter((separator) => !/\s/.test(separator))
  .map((separator) => `\\${separator}`)
  .join('');
const PLAIN_AMOUNT = /^(?:0|[1-9]\d*)$/;
const GROUPED_AMOUNT = new RegExp(
  `^[1-9]\\d{0,${String(GROUP_SIZE - 1)}}([ ${SEPARATOR_CLASS}])\\d{${String(GROUP_SIZE)}}(?:\\1\\d{${String(GROUP_SIZE)}})*$`,
);
const NON_DIGITS = /\D/g;

function stripCurrency(text: string): string | undefined {
  const lower = text.toLowerCase();
  const prefix = CURRENCY_TOKENS.find((token) => lower.startsWith(token)) ?? '';
  const suffix = CURRENCY_TOKENS.find((token) => lower.endsWith(token)) ?? '';
  if (prefix !== '' && suffix !== '') return undefined;
  return text.slice(prefix.length, text.length - suffix.length).trim();
}

/**
 * Extracts the digits of an amount such as `Ar 1 500`, `1.500 Ar`, `MGA 1500` or `1 500`.
 *
 * @param text - An amount as typed by a user.
 * @returns The digits (`'1500'`), or `undefined` when the text is not an amount.
 *
 * @example
 * ```ts
 * readDigits('1.500 Ar'); // '1500'
 * readDigits('1,500'); // undefined
 * ```
 */
export function readDigits(text: string): string | undefined {
  const amount = stripCurrency(text.trim());
  if (amount === undefined) return undefined;
  const normalized = amount.replace(WHITESPACE_SEPARATORS, SPACE);
  const isAmount = PLAIN_AMOUNT.test(normalized) || GROUPED_AMOUNT.test(normalized);
  return isAmount ? normalized.replace(NON_DIGITS, '') : undefined;
}
