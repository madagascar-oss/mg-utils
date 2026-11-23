// spec/ → native constants. Output is formatted with Prettier so `git diff --exit-code`
// after `just codegen` detects any drift between spec and generated code.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
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
import { errorCodeFile, pascalCase, specFile } from './php/emit.ts';
import { moduleFiles } from './php/modules.ts';
import { errorsFile } from './typescript/emit.ts';
import { dataFile } from './typescript/modules.ts';

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

// PHP: one folder per module under php/src, generated files written verbatim.
const phpSourceDir = join(ROOT_DIR, 'php', 'src');
function writePhp(relativePath: string, source: string): void {
  const path = join(phpSourceDir, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, source);
}

if (existsSync(phpSourceDir)) {
  writePhp('ErrorCode.php', errorCodeFile(errors));
  writePhp('Spec.php', specFile(specVersion));
  const phpModules = listModules().filter((module) =>
    existsSync(join(phpSourceDir, pascalCase(module))),
  );
  for (const module of phpModules) {
    const data = stripProvenance(readYaml(moduleFile(module, 'data.yaml')));
    for (const output of moduleFiles(module, data, specVersion))
      writePhp(output.path, output.source);
  }
  console.log(`Generated PHP for: ${phpModules.join(', ') || '(no modules)'}`);
}
