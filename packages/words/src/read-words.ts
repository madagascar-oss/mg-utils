// Malagasy number words → every exact value they can stand for. parse.ts keeps the values that
// spell back to the same words; more than one left means the words are ambiguous.
import { countWords } from './cardinal.ts';
import { SYSTEMS } from './system.ts';
import {
  DECIMAL_SEPARATOR,
  HUNDRED_WORDS,
  JOINER_BELOW_THOUSAND,
  JOINER_BETWEEN_GROUPS,
  JOINER_UNITS_BEFORE_TEN,
  SCALES,
  TEN_WORDS,
  TRADITIONAL_SCALES,
  UNIT_ONE_IN_COMPOUND,
  UNIT_WORDS,
  ZERO_WORD,
} from './generated/data.ts';

/** @internal Readings of words: whole parts, and decimal digits (`undefined` if none). */
export interface Readings {
  readonly wholes: readonly bigint[];
  readonly decimals: readonly string[] | undefined;
}

const BASE = 10;
// A phrase alternates a word and a joiner: word, joiner, word, ….
const TOKENS_PER_STEP = 2;
const TEN = BigInt(BASE);
const HUNDRED = BASE * BASE;
// Readings kept per part: real words have one or two; more only in made-up text.
const MAX_READINGS = 8;
const PHRASE_JOINERS: ReadonlySet<string> = new Set([
  JOINER_BELOW_THOUSAND,
  JOINER_UNITS_BEFORE_TEN,
]);

function wordValues(words: readonly string[], step: number): [string, number][] {
  return words.flatMap((word, digit) => (word === '' ? [] : [[word, digit * step]]));
}

// Every word a phrase below 1000 is made of, with its value.
const PHRASE_VALUES: ReadonlyMap<string, number> = new Map([
  ...wordValues(UNIT_WORDS, 1),
  [UNIT_ONE_IN_COMPOUND, 1],
  ...wordValues(TEN_WORDS, BASE),
  ...wordValues(HUNDRED_WORDS, HUNDRED),
]);

// The longest phrase below 1000: "iraika ambin'ny folo amby zato" style, three words, two joiners.
const MAX_PHRASE_TOKENS = 5;

interface GroupWord {
  readonly factor: bigint;
  readonly hasPhraseCount: boolean;
  // Most words the smaller part before this group can have: the words of factor − 1.
  readonly maxLeftTokens: number;
}

function groupWord(exponent: number, countDigits: number | null): GroupWord {
  const factor = TEN ** BigInt(exponent);
  const maxLeftTokens = countWords(factor - BigInt(1), 'standard').split(' ').length;
  return { factor, hasPhraseCount: countDigits !== null, maxLeftTokens };
}

// Group words of both systems: their power of ten, and whether their count is a phrase below
// 1000 (every group but the largest), which bounds where that count can start. Standard comes
// last so lavitrisa, in both tables, keeps its count of any size.
const GROUP_WORDS: ReadonlyMap<string, GroupWord> = new Map(
  [...TRADITIONAL_SCALES, ...SCALES].map((scale) => [
    scale.word,
    groupWord(scale.exponent, scale.countDigits),
  ]),
);

// "valo amby efapolo amby telonjato": words alternate with amby or ambin'ny.
function readPhrase(tokens: readonly string[]): bigint | undefined {
  let total = 0;
  for (const [index, token] of tokens.entries()) {
    const isJoinerPlace = index % TOKENS_PER_STEP === 1;
    if (isJoinerPlace !== PHRASE_JOINERS.has(token)) return undefined;
    if (!isJoinerPlace) total += PHRASE_VALUES.get(token) ?? Number.NaN;
  }
  return tokens.length % TOKENS_PER_STEP === 1 && !Number.isNaN(total) ? BigInt(total) : undefined;
}

function sums(lefts: Iterable<bigint>, rights: Iterable<bigint>, factor: bigint): bigint[] {
  return [...lefts].flatMap((left) => [...rights].map((right) => left + right * factor));
}

// Smallest part first: what comes before a group is always smaller than one of that group.
function groupSums(lefts: Iterable<bigint>, counts: Iterable<bigint>, factor: bigint): bigint[] {
  return sums(
    [...lefts].filter((left) => left < factor),
    counts,
    factor,
  );
}

function limited(values: Iterable<bigint>): bigint[] {
  return [...new Set(values)].slice(0, MAX_READINGS);
}

/** Reads the counts in one list of tokens, remembering each span it has read. */
class CountReader {
  private readonly spans = new Map<string, bigint[]>();
  private readonly tokens: readonly string[];

  constructor(tokens: readonly string[]) {
    this.tokens = tokens;
  }

  /**
   * Counts written exactly as spell writes a count before a group word.
   *
   * @param start - First token of the count.
   * @param end - Token after the count.
   * @returns The counts those tokens spell.
   */
  counts(start: number, end: number): bigint[] {
    const text = this.tokens.slice(start, end).join(' ');
    return this.values(start, end).filter((count) =>
      SYSTEMS.some((system) => countWords(count, system) === text),
    );
  }

  // Every value of tokens[start, end): a phrase, or parts joined by amby ending in a group.
  private values(start: number, end: number): bigint[] {
    const key = `${String(start)}:${String(end)}`;
    const known = this.spans.get(key);
    if (known !== undefined) return known;
    const phrase = readPhrase(this.tokens.slice(start, end));
    const found = limited([...(phrase === undefined ? [] : [phrase]), ...this.grouped(start, end)]);
    this.spans.set(key, found);
    return found;
  }

  // "dimy arivo amby roa alina": whatever comes before an amby, plus a count of the last group.
  private grouped(start: number, end: number): bigint[] {
    const group = GROUP_WORDS.get(String(this.tokens[end - 1]));
    if (group === undefined) return [];
    const first = group.hasPhraseCount ? Math.max(start, end - 1 - MAX_PHRASE_TOKENS) : start;
    const last = Math.min(end - 1, start + group.maxLeftTokens + 1);
    const found: bigint[] = [];
    for (let split = first; split <= last; split += 1) {
      if (split > start && this.tokens[split - 1] !== JOINER_BELOW_THOUSAND) continue;
      const lefts = split === start ? [BigInt(0)] : this.values(start, split - 1);
      const counts = split === end - 1 ? [BigInt(1)] : this.counts(split, end - 1);
      found.push(...groupSums(lefts, counts, group.factor));
    }
    return found;
  }
}

function splitOn(tokens: readonly string[], separator: string): string[][] {
  const parts: string[][] = [[]];
  for (const token of tokens) {
    if (token === separator) parts.push([]);
    else parts[parts.length - 1]?.push(token);
  }
  return parts;
}

// One group of a whole number: a count and a group word ("roa arivo"), or a phrase.
function groupValues(tokens: readonly string[]): bigint[] {
  const factor = GROUP_WORDS.get(String(tokens[tokens.length - 1]))?.factor;
  if (factor === undefined) {
    const phrase = readPhrase(tokens);
    return phrase === undefined ? [] : [phrase];
  }
  const counts =
    tokens.length === 1 ? [BigInt(1)] : new CountReader(tokens).counts(0, tokens.length - 1);
  return counts.map((count) => count * factor);
}

// A whole number: groups joined by "sy", or "aotra".
function wholeValues(tokens: readonly string[]): bigint[] {
  if (tokens.length === 1 && tokens[0] === ZERO_WORD) return [BigInt(0)];
  return splitOn(tokens, JOINER_BETWEEN_GROUPS).reduce<bigint[]>(
    (totals, group) => limited(sums(totals, groupValues(group), BigInt(1))),
    [BigInt(0)],
  );
}

// After "faingo": one "aotra" per leading zero, then a whole number.
function decimalValues(tokens: readonly string[]): string[] {
  const zeros = tokens.findIndex((token) => token !== ZERO_WORD);
  if (zeros < 0) return [];
  const prefix = '0'.repeat(zeros);
  return wholeValues(tokens.slice(zeros)).map((value) => `${prefix}${value.toString()}`);
}

/**
 * @internal Every value normalised words can stand for, before checking which ones
 * {@link spell} writes as those words.
 *
 * @param words - Lowercase words separated by single spaces.
 * @returns The candidate whole parts and decimals; empty lists when nothing reads.
 */
export function readWords(words: string): Readings {
  const [wholeTokens = [], decimalTokens, ...extra] = splitOn(words.split(' '), DECIMAL_SEPARATOR);
  if (extra.length > 0) return { wholes: [], decimals: undefined };
  return {
    wholes: wholeValues(wholeTokens),
    decimals: decimalTokens === undefined ? undefined : decimalValues(decimalTokens),
  };
}
