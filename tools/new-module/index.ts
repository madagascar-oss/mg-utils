// Scaffolds a module everywhere: spec files, a JS package and test wiring.
// Usage: just new-module <name>   (lower-case, e.g. ariary)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  JSON_INDENT,
  PACKAGES_DIR,
  ROOT_DIR,
  SPEC_DIR,
  isoDate,
  readSpecVersion,
} from '../lib/spec.ts';

const MODULE_NAME = /^[a-z][a-z0-9]*$/;
const name = process.argv[2] ?? '';
if (!MODULE_NAME.test(name)) {
  console.error('Usage: just new-module <name>  (lower-case letters and digits, e.g. ariary)');
  process.exit(1);
}
const specDir = join(SPEC_DIR, name);
const packageDir = join(PACKAGES_DIR, name);
if (existsSync(specDir) || existsSync(packageDir)) {
  console.error(`Module "${name}" already exists.`);
  process.exit(1);
}

const pascal = name.charAt(0).toUpperCase() + name.slice(1);
const fnName = `check${pascal}Input`;
const today = isoDate();

function write(path: string, content: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, content);
  console.log(`created ${path.slice(ROOT_DIR.length)}`);
}

write(
  join(specDir, 'README.md'),
  `# ${name}

What this module does, in one sentence.

Main function: \`${fnName}(input)\` (placeholder — rename it in spec and code).

## Rules

1. Write each rule in plain words, with an example.

## Errors

| Input | Code |
| --- | --- |
| Not a string | \`INVALID_TYPE\` |

## Sources

- Link every official source used in \`data.yaml\`.

## Recorded disagreements

- None yet.
`,
);

write(
  join(specDir, 'data.yaml'),
  `# Data for ${name}. Every entry needs \`source:\` (https URL) and \`checked:\` (date).
entries: []
# - id: example
#   value: "..."
#   source: https://...
#   checked: ${today}
`,
);

write(
  join(specDir, 'schema.json'),
  `${JSON.stringify(
    {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      $id: `https://github.com/madagascar-oss/mg-utils/spec/${name}/schema.json`,
      title: name,
      type: 'object',
      additionalProperties: false,
      required: ['entries'],
      properties: {
        entries: { type: 'array', items: { $ref: '../_schemas/source.schema.json' } },
      },
    },
    null,
    JSON_INDENT,
  )}\n`,
);

write(
  join(specDir, 'tests.yaml'),
  `# Shared test vectors for ${fnName}. Every language must pass all of them.
- input: "example"
  expected: "example"
- input: null
  error: INVALID_TYPE
`,
);

const wordsManifest = JSON.parse(
  readFileSync(join(PACKAGES_DIR, 'words', 'package.json'), 'utf8'),
) as Record<string, unknown>;
const manifest = JSON.stringify(
  {
    ...wordsManifest,
    name: `@madagascar-oss/${name}`,
    description: `TODO: describe ${name}.`,
    keywords: ['madagascar', 'malagasy', name],
  },
  null,
  JSON_INDENT,
).replaceAll('js/packages/words', `js/packages/${name}`);
write(join(packageDir, 'package.json'), `${manifest}\n`);
for (const file of ['tsup.config.ts', 'api-extractor.json', 'LICENSE']) {
  write(join(packageDir, file), readFileSync(join(PACKAGES_DIR, 'words', file), 'utf8'));
}

write(
  join(packageDir, 'README.md'),
  `# @madagascar-oss/${name}

TODO: one-sentence description.

Implements spec ${readSpecVersion()}.

\`\`\`sh
npm install @madagascar-oss/${name}
\`\`\`

Rules and sources: [spec/${name}](../../../spec/${name}/README.md).
`,
);

write(
  join(packageDir, 'src', 'index.ts'),
  `/**
 * TODO: describe ${name}. Part of mg-utils by Madagascar OSS.
 *
 * @packageDocumentation
 */
export { ${fnName} } from './${name}.ts';
export { MgError, SPEC_VERSION, type ErrorCode } from './generated/errors.ts';
`,
);

write(
  join(packageDir, 'src', `${name}.ts`),
  `import { MgError } from './generated/errors.ts';

/**
 * Placeholder: replace with the module's real function, spec first.
 *
 * @param input - A string.
 * @returns The same string.
 * @throws {@link MgError} \`INVALID_TYPE\` if \`input\` is not a string.
 *
 * @example
 * \`\`\`ts
 * ${fnName}('example'); // 'example'
 * \`\`\`
 */
export function ${fnName}(input: unknown): string {
  if (typeof input !== 'string') throw new MgError('INVALID_TYPE', 'Expected a string.');
  return input;
}
`,
);

write(join(packageDir, 'etc', '.gitkeep'), '');

const phpDir = join(ROOT_DIR, 'php');
write(
  join(phpDir, 'src', pascal, `${pascal}.php`),
  `<?php

declare(strict_types=1);

namespace Madagascar\\MgUtils\\${pascal};

/**
 * TODO: describe ${name}.
 */
final class ${pascal}
{
    /**
     * Placeholder: replace with the module's real function, spec first.
     *
     * Example: \`${pascal}::checkInput('example')\` returns \`'example'\`.
     */
    public static function checkInput(string $input): string
    {
        return $input;
    }
}
`,
);
write(
  join(phpDir, 'tests', 'spec-functions', `${name}.php`),
  `<?php

declare(strict_types=1);

use Madagascar\\MgUtils\\${pascal}\\${pascal};

return [
    // @phpstan-ignore argument.type
    '${fnName}' => static fn(mixed $input): string => ${pascal}::checkInput($input),
];
`,
);

const defaultsPath = join(ROOT_DIR, 'js', 'test-runner', 'default-functions.json');
const defaults = JSON.parse(readFileSync(defaultsPath, 'utf8')) as Record<string, string>;
const sorted = Object.fromEntries(Object.entries({ ...defaults, [name]: fnName }).sort());
writeFileSync(defaultsPath, `${JSON.stringify(sorted, null, JSON_INDENT)}\n`);
console.log(`registered ${name} → ${fnName} in js/test-runner/default-functions.json`);
console.log('Next: edit spec/ first, then run `just codegen` and `just test`.');
