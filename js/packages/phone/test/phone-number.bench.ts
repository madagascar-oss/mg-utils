import { test } from 'vitest';
import { formatPhoneNumber, parsePhoneNumber } from '../src/index.ts';

test('phone throughput', async ({ bench }) => {
  await bench.compare(
    bench('parsePhoneNumber national with spaces', () => {
      parsePhoneNumber('034 12 345 67');
    }),
    bench('formatPhoneNumber international', () => {
      formatPhoneNumber('+261341234567', 'international');
    }),
  );
});
