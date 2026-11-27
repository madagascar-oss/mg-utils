import { test } from 'vitest';
import { spell } from '../src/index.ts';

const SMALL_NUMBER = 21;
const DECIMAL_NUMBER = 1234.5678;

test('spell throughput', async ({ bench }) => {
  await bench.compare(
    bench('small (21)', () => {
      spell(SMALL_NUMBER);
    }),
    bench('decimal (1234.5678)', () => {
      spell(DECIMAL_NUMBER);
    }),
    bench('largest (Number.MAX_SAFE_INTEGER)', () => {
      spell(Number.MAX_SAFE_INTEGER);
    }),
  );
});
