import { test } from 'vitest';
import { numberToWords } from '../src/index.ts';

const SMALL_NUMBER = 21;
const DECIMAL_NUMBER = 1234.5678;

test('numberToWords throughput', async ({ bench }) => {
  await bench.compare(
    bench('small (21)', () => {
      numberToWords(SMALL_NUMBER);
    }),
    bench('decimal (1234.5678)', () => {
      numberToWords(DECIMAL_NUMBER);
    }),
    bench('largest (Number.MAX_SAFE_INTEGER)', () => {
      numberToWords(Number.MAX_SAFE_INTEGER);
    }),
  );
});
