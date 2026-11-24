// MgError is generated into every package, so its behaviour is checked once for all of them.
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

type MgErrorClass = new (code: string, message: string) => Error & { code: string };

const packagesDir = fileURLToPath(new URL('../packages/', import.meta.url));
const packageNames = readdirSync(packagesDir);

describe.each(packageNames)('@madagascar-oss/%s MgError', async (name) => {
  const { MgError } = (await import(`@madagascar-oss/${name}`)) as { MgError: MgErrorClass };

  test('keeps the shared code and name', () => {
    const error = new MgError('OUT_OF_RANGE', 'too big');
    expect(error).toMatchObject({ name: 'MgError', code: 'OUT_OF_RANGE', message: 'too big' });
  });

  test('matches an MgError with instanceof', () => {
    expect(new MgError('INVALID_TYPE', 'x') instanceof MgError).toBe(true);
  });

  test('does not match a plain Error', () => {
    expect(new Error('x') instanceof MgError).toBe(false);
  });

  test('does not match an object that only looks like an MgError', () => {
    expect({ name: 'MgError', code: 'INVALID_TYPE' } instanceof MgError).toBe(false);
  });
});
