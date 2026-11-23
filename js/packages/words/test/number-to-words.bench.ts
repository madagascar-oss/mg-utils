import { test } from 'vitest';
import { numberToWords } from '../src/index.ts';

test('numberToWords throughput', async ({ bench }) => {
  await bench.compare(
    bench('small (21)', () => {
      numberToWords(21);
    }),
    bench('largest (999 999 999 999)', () => {
      numberToWords(999_999_999_999);
    }),
  );
});
