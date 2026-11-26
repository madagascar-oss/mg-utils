// Reads the digits of an amount typed by a user: an optional currency token, then plain or
// grouped digits, then optionally a decimal separator and the decimals.
import { CURRENCY_TOKENS, GROUP_SIZE, READABLE_SEPARATORS } from './generated/data.ts';

const SPACE = ' ';
const WHITESPACE = /\s/;
const PLAIN_AMOUNT = /^(?:0|[1-9]\d*)$/;
const DECIMALS = /^\d+$/;
const NON_DIGITS = /\D/g;
const REGEX_SPECIAL = /[\\^$.*+?()[\]{}|-]/g;
const DECIMAL_POINT = '.';

/** @internal What a reader accepts: grouping characters between digit groups, and the decimal one. */
export interface ReadSeparators {
  readonly grouping: readonly string[];
  readonly decimal: string;
}

type Reader = (amount: string) => string | undefined;

const readers = new Map<string, Reader>();

function isWhitespace(character: string): boolean {
  return WHITESPACE.test(character);
}

function escapeForClass(character: string): string {
  return character.replace(REGEX_SPECIAL, '\\$&');
}

// One digit group of three after the first, repeating the same separator: '1 500 000'.
function groupedPattern(separatorClass: string): RegExp {
  const group = `\\d{${String(GROUP_SIZE)}}`;
  return new RegExp(
    `^[1-9]\\d{0,${String(GROUP_SIZE - 1)}}([${separatorClass}])${group}(?:\\1${group})*$`,
  );
}

// Spaces of every kind count as one separator: they are turned into a plain space first.
function wholeReader(grouping: readonly string[]): Reader {
  const spaces = grouping.filter(isWhitespace);
  const normalizeSpaces = new RegExp(`[${spaces.map(escapeForClass).join('')}]`, 'g');
  const others = grouping.filter((character) => !isWhitespace(character));
  const separators = [...(spaces.length > 0 ? [SPACE] : []), ...others];
  const grouped = groupedPattern(separators.map(escapeForClass).join(''));
  return (whole) => {
    const normalized = spaces.length > 0 ? whole.replace(normalizeSpaces, SPACE) : whole;
    const isAmount = PLAIN_AMOUNT.test(normalized) || grouped.test(normalized);
    return isAmount ? normalized.replace(NON_DIGITS, '') : undefined;
  };
}

function makeReader({ grouping, decimal }: ReadSeparators): Reader {
  const wholeDigits = wholeReader(grouping);
  return (amount) => {
    const [whole = '', decimals, extra] = amount.split(decimal);
    if (extra !== undefined) return undefined;
    const digits = wholeDigits(whole);
    if (digits === undefined || decimals === undefined) return digits;
    return DECIMALS.test(decimals) ? `${digits}${DECIMAL_POINT}${decimals}` : undefined;
  };
}

function readerFor(separators: ReadSeparators): Reader {
  const key = `${separators.grouping.join('')}|${separators.decimal}`;
  const cached = readers.get(key);
  if (cached !== undefined) return cached;
  const reader = makeReader(separators);
  readers.set(key, reader);
  return reader;
}

function stripCurrency(text: string): string | undefined {
  const lower = text.toLowerCase();
  const prefix = CURRENCY_TOKENS.find((token) => lower.startsWith(token)) ?? '';
  const suffix = CURRENCY_TOKENS.find((token) => lower.endsWith(token)) ?? '';
  if (prefix !== '' && suffix !== '') return undefined;
  return text.slice(prefix.length, text.length - suffix.length).trim();
}

/**
 * @internal The grouping characters a reader accepts.
 *
 * @param grouping - The chosen grouping character, or undefined for every Malagasy one.
 * @param decimal - The decimal character, which never counts as grouping.
 * @returns Every Malagasy separator (spaces and dot) when none is chosen; else the chosen one,
 *   a space standing for every kind of space.
 */
export function readableGrouping(grouping: string | undefined, decimal: string): string[] {
  if (grouping === undefined) return READABLE_SEPARATORS.filter((value) => value !== decimal);
  return isWhitespace(grouping) ? READABLE_SEPARATORS.filter(isWhitespace) : [grouping];
}

/**
 * Extracts the digits of an amount such as `Ar 1 500`, `1.500 Ar`, `MGA 1500` or `1 500,50`.
 *
 * @param text - An amount as typed by a user.
 * @param separators - The grouping and decimal characters to accept.
 * @returns The digits with a `.` before any decimals (`'1500'`, `'1500.50'`), or `undefined`
 *   when the text is not an amount.
 *
 * @example
 * ```ts
 * readDigits('1 500,50', { grouping: [' ', '.'], decimal: ',' }); // '1500.50'
 * ```
 */
export function readDigits(text: string, separators: ReadSeparators): string | undefined {
  const amount = stripCurrency(text.trim());
  if (amount === undefined) return undefined;
  return readerFor(separators)(amount);
}
