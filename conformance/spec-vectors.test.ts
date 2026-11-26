// Runs every vector in spec/modules/*/tests.yaml against the JavaScript packages.
// A module is "done" in JS when all of its vectors pass here.
import { describe, expect, test } from 'vitest';
import { hasPackage, listModules, readTestVectors, type TestVector } from '../tools/lib/spec.ts';
import defaultFunctions from './functions.json' with { type: 'json' };

type AnyFunction = (...args: unknown[]) => unknown;

async function loadExports(module: string): Promise<Record<string, unknown>> {
  return (await import(`@mdgascar/${module}`)) as Record<string, unknown>;
}

function formatArgument(argument: unknown): string {
  return typeof argument === 'string' ? JSON.stringify(argument) : String(argument);
}

function describeVector(vector: TestVector): string {
  const call = `${vector.fn ?? ''}(${[vector.input, ...(vector.args ?? [])].map(formatArgument).join(', ')})`;
  const outcome =
    vector.error === undefined ? JSON.stringify(vector.expected) : `throws ${vector.error}`;
  return `${call} → ${outcome}`;
}

const modules = listModules().filter(hasPackage);

describe.each(modules)('spec/modules/%s/tests.yaml', async (module) => {
  const exports = await loadExports(module);
  const defaultFunction = (defaultFunctions as Record<string, string>)[module];

  test.each(readTestVectors(module).map((vector) => [describeVector(vector), vector] as const))(
    '%s',
    (_name, vector) => {
      const fnName = vector.fn ?? defaultFunction;
      const fn = fnName === undefined ? undefined : exports[fnName];
      expect(fn, `export ${String(fnName)}`).toBeTypeOf('function');
      const call = (): unknown => (fn as AnyFunction)(vector.input, ...(vector.args ?? []));

      if (vector.error === undefined) {
        expect(call()).toEqual(vector.expected);
      } else {
        expect(call).toThrow(expect.objectContaining({ name: 'MdgError', code: vector.error }));
      }
    },
  );
});
