import { test } from 'vitest';
import { numberToWords } from '../src/index.ts';

const SMALL_NUMBER = 21;
const LARGEST_SUPPORTED_NUMBER = 999_999_999_999;

test('numberToWords throughput', async ({ bench }) => {
  await bench.compare(
    bench('small (21)', () => {
      numberToWords(SMALL_NUMBER);
    }),
    bench('largest (999 999 999 999)', () => {
      numberToWords(LARGEST_SUPPORTED_NUMBER);
    }),
  );
});
