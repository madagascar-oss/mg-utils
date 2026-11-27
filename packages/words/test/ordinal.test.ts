import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { spell, spellOrdinal } from '../src/index.ts';

const FIRST = 'voalohany';
// From 2 on, every ordinal is faha or fah before the cardinal.
const SECOND = 2;
const ORDINAL = /^(fah|faha)/;

describe('spellOrdinal', () => {
  test('puts faha or fah before the cardinal of every number from 2', () => {
    fc.assert(
      fc.property(fc.integer({ min: SECOND, max: Number.MAX_SAFE_INTEGER }), (value) => {
        const ordinal = spellOrdinal(value);
        expect(ordinal).toMatch(ORDINAL);
        expect(ordinal.endsWith(spell(value).slice(1))).toBe(true);
      }),
    );
  });

  test('says voalohany for 1, as a number or as text', () => {
    expect(spellOrdinal(1)).toBe(FIRST);
    expect(spellOrdinal('01')).toBe(FIRST);
  });
});
