// Copies the built ESM bundles next to the demo page so it runs with no bundler.
import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { PACKAGES_DIR, ROOT_DIR } from '../lib/spec.ts';

const libDir = join(ROOT_DIR, 'docs', 'site', 'lib');
mkdirSync(libDir, { recursive: true });
for (const name of ['words', 'phone', 'ariary', 'date']) {
  copyFileSync(join(PACKAGES_DIR, name, 'dist', 'index.js'), join(libDir, `${name}.js`));
}
console.log(`Demo files copied to ${libDir}`);
