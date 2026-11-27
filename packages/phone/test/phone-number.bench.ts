import { test } from 'vitest';
import { formatPhone, parsePhone } from '../src/index.ts';

test('phone throughput', async ({ bench }) => {
  await bench.compare(
    bench('parsePhone national with spaces', () => {
      parsePhone('034 12 345 67');
    }),
    bench('formatPhone international', () => {
      formatPhone('+261341234567', 'international');
    }),
  );
});
