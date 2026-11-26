// MdgError is generated into every package, so its behaviour is checked once for all of them.
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

type MdgErrorClass = new (code: string, message: string) => Error & { code: string };

const packagesDir = fileURLToPath(new URL('../packages/', import.meta.url));
const packageNames = readdirSync(packagesDir);

describe.each(packageNames)('@mdgascar/%s MdgError', async (name) => {
  const { MdgError } = (await import(`@mdgascar/${name}`)) as { MdgError: MdgErrorClass };

  test('keeps the shared code and name', () => {
    const error = new MdgError('OUT_OF_RANGE', 'too big');
    expect(error).toMatchObject({ name: 'MdgError', code: 'OUT_OF_RANGE', message: 'too big' });
  });

  test('matches an MdgError with instanceof', () => {
    expect(new MdgError('INVALID_TYPE', 'x') instanceof MdgError).toBe(true);
  });

  test('does not match a plain Error', () => {
    expect(new Error('x') instanceof MdgError).toBe(false);
  });

  test('does not match an object that only looks like an MdgError', () => {
    expect({ name: 'MdgError', code: 'INVALID_TYPE' } instanceof MdgError).toBe(false);
  });
});
