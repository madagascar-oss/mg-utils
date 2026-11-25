// Prints TypeScript literals and constants for generated files.
export const GENERATED_HEADER = '// GENERATED — edit spec/ instead. Run `just codegen` to refresh.';

const NON_ASCII = /[^\x20-\x7e]/g;
const HEX = 16;
const UNICODE_ESCAPE_WIDTH = 4;

/** JSON literal with non-ASCII characters escaped, so invisible spaces stay visible in code. */
export function literal(value: unknown): string {
  return JSON.stringify(value).replace(
    NON_ASCII,
    (character) =>
      `\\u${character.charCodeAt(0).toString(HEX).padStart(UNICODE_ESCAPE_WIDTH, '0')}`,
  );
}

export function constant(name: string, value: unknown, doc = ''): string {
  return `/** @internal${doc === '' ? '' : ` ${doc}`} */\nexport const ${name} = ${literal(value)} as const;`;
}

/** A constant that is part of the public API, so it carries full TSDoc. */
export function publicConstant(name: string, value: unknown, doc: string): string {
  return `${doc}\nexport const ${name} = ${literal(value)} as const;`;
}
