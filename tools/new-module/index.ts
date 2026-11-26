// Scaffolds the JS side of a module that already exists in spec/: a package and test wiring.
// Usage: just new-module <name>   (lower-case, e.g. ariary)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSON_INDENT, MODULES_DIR, PACKAGES_DIR, ROOT_DIR, readSpecVersion } from '../lib/spec.ts';

const MODULE_NAME = /^[a-z][a-z0-9]*$/;
const name = process.argv[2] ?? '';
if (!MODULE_NAME.test(name)) {
  console.error('Usage: just new-module <name>  (lower-case letters and digits, e.g. ariary)');
  process.exit(1);
}
if (!existsSync(join(MODULES_DIR, name, 'data.yaml'))) {
  console.error(
    `Module "${name}" is not in spec/. Add it to mdg-utils-spec and bump the submodule first.`,
  );
  process.exit(1);
}
const packageDir = join(PACKAGES_DIR, name);
if (existsSync(packageDir)) {
  console.error(`Module "${name}" already exists.`);
  process.exit(1);
}

const pascal = name.charAt(0).toUpperCase() + name.slice(1);
const fnName = `check${pascal}Input`;

function write(path: string, content: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, content);
  console.log(`created ${path.slice(ROOT_DIR.length)}`);
}

const wordsManifest = JSON.parse(
  readFileSync(join(PACKAGES_DIR, 'words', 'package.json'), 'utf8'),
) as Record<string, unknown>;
const manifest = JSON.stringify(
  {
    ...wordsManifest,
    name: `@mdgascar/${name}`,
    description: `TODO: describe ${name}.`,
    keywords: ['madagascar', 'malagasy', name],
  },
  null,
  JSON_INDENT,
).replaceAll('packages/words', `packages/${name}`);
write(join(packageDir, 'package.json'), `${manifest}\n`);
for (const file of ['tsup.config.ts', 'api-extractor.json', 'LICENSE']) {
  write(join(packageDir, file), readFileSync(join(PACKAGES_DIR, 'words', file), 'utf8'));
}

write(
  join(packageDir, 'README.md'),
  `# @mdgascar/${name}

TODO: one-sentence description.

Implements spec ${readSpecVersion()}.

\`\`\`sh
npm install @mdgascar/${name}
\`\`\`

Rules and sources: [spec/${name}](https://github.com/mdgascar/mdg-utils-spec/blob/dev/modules/${name}/README.md).
`,
);

write(
  join(packageDir, 'src', 'index.ts'),
  `/**
 * TODO: describe ${name}. Part of mdg-utils by Mdgascar.
 *
 * @packageDocumentation
 */
export { ${fnName} } from './${name}.ts';
export { MdgError, SPEC_VERSION, type ErrorCode } from './generated/errors.ts';
`,
);

write(
  join(packageDir, 'src', `${name}.ts`),
  `import { MdgError } from './generated/errors.ts';

/**
 * Placeholder: replace with the module's real function, spec first.
 *
 * @param input - A string.
 * @returns The same string.
 * @throws {@link MdgError} \`INVALID_TYPE\` if \`input\` is not a string.
 *
 * @example
 * \`\`\`ts
 * ${fnName}('example'); // 'example'
 * \`\`\`
 */
export function ${fnName}(input: unknown): string {
  if (typeof input !== 'string') throw new MdgError('INVALID_TYPE', 'Expected a string.');
  return input;
}
`,
);

write(join(packageDir, 'etc', '.gitkeep'), '');

const defaultsPath = join(ROOT_DIR, 'conformance', 'functions.json');
const defaults = JSON.parse(readFileSync(defaultsPath, 'utf8')) as Record<string, string>;
const sorted = Object.fromEntries(Object.entries({ ...defaults, [name]: fnName }).sort());
writeFileSync(defaultsPath, `${JSON.stringify(sorted, null, JSON_INDENT)}\n`);
console.log(`registered ${name} → ${fnName} in conformance/functions.json`);
console.log('Next: run `just codegen` and `just test`.');
