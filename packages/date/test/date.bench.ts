import { test } from 'vitest';
import { formatDate } from '../src/index.ts';

const SAMPLE_DATE = '2026-11-23';

test('date throughput', async ({ bench }) => {
  await bench.compare(
    bench('formatDate long', () => {
      formatDate(SAMPLE_DATE);
    }),
    bench('formatDate full', () => {
      formatDate(SAMPLE_DATE, 'full');
    }),
  );
});
