import { test } from 'vitest';
import { formatAriary, parseAriary } from '../src/index.ts';

const SAMPLE_AMOUNT = 2_026_000;
const SAMPLE_TEXT = 'Ar 2 026 000';

test('ariary throughput', async ({ bench }) => {
  await bench.compare(
    bench('formatAriary', () => {
      formatAriary(SAMPLE_AMOUNT);
    }),
    bench('parseAriary', () => {
      parseAriary(SAMPLE_TEXT);
    }),
  );
});
