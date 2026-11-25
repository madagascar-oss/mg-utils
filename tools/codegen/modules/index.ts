// Picks the emitter for a spec module; modules without one get a generic data constant.
import * as words from './words.ts';
import * as phone from './phone.ts';
import * as ariary from './ariary.ts';
import * as date from './date.ts';
import { constant, GENERATED_HEADER } from '../emit.ts';

const EMITTERS: Readonly<Record<string, (data: never) => string[]>> = {
  words: words.emit,
  phone: phone.emit,
  ariary: ariary.emit,
  date: date.emit,
};

export function dataFile(module: string, data: unknown, specVersion: string): string {
  const emit = EMITTERS[module];
  const body = emit === undefined ? [constant('DATA', data)] : emit(data as never);
  return (
    [
      GENERATED_HEADER,
      `// From spec/modules/${module}/data.yaml, spec ${specVersion}.`,
      ...body,
    ].join('\n\n') + '\n'
  );
}
