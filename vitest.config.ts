import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const packagesDir = fileURLToPath(new URL('js/packages/', import.meta.url));
const packageAliases = Object.fromEntries(
  readdirSync(packagesDir).map((name) => [
    `@madagascar-oss/${name}`,
    `${packagesDir}${name}/src/index.ts`,
  ]),
);

// Handbook: 100% coverage on library code; CI fails below it.
const FULL_COVERAGE = 100;

export default defineConfig({
  resolve: { alias: packageAliases },
  test: {
    include: ['js/**/*.test.ts', 'tools/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['js/packages/*/src/**/*.ts'],
      exclude: ['js/packages/utils/src/**', 'js/packages/*/src/generated/data.ts'],
      reporter: ['text', 'lcov'],
      thresholds: {
        branches: FULL_COVERAGE,
        functions: FULL_COVERAGE,
        lines: FULL_COVERAGE,
        statements: FULL_COVERAGE,
      },
    },
  },
});
