// spec/ → TypeScript constants. Output is formatted with Prettier so `git diff --exit-code`
// after `just codegen` detects any drift between spec and generated code.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as prettier from 'prettier';
import {
  PACKAGES_DIR,
  ROOT_DIR,
  hasPackage,
  listModules,
  moduleFile,
  readErrors,
  readSpecVersion,
  readYaml,
  stripProvenance,
} from '../lib/spec.ts';
import { errorsFile } from './errors-file.ts';
import { dataFile } from './modules/index.ts';

const specVersion = readSpecVersion();
const errors = readErrors();
const prettierConfig = await prettier.resolveConfig(join(ROOT_DIR, 'package.json'));

async function write(path: string, source: string): Promise<void> {
  const formatted = await prettier.format(source, { ...prettierConfig, filepath: path });
  writeFileSync(path, formatted);
}

const written: string[] = [];
for (const module of listModules().filter(hasPackage)) {
  const outDir = join(PACKAGES_DIR, module, 'src', 'generated');
  mkdirSync(outDir, { recursive: true });
  const data = stripProvenance(readYaml(moduleFile(module, 'data.yaml')));
  await write(join(outDir, 'data.ts'), dataFile(module, data, specVersion));
  await write(join(outDir, 'errors.ts'), errorsFile(errors, specVersion));
  written.push(module);
}
console.log(`Generated TypeScript for: ${written.join(', ') || '(no packages)'}`);
