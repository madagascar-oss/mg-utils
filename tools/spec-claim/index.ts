// Every package README states the spec version it implements ("Implements spec 0.1.0").
// CI runs this after the spec vectors pass, so a claim can only match vectors that passed.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { PACKAGES_DIR, readSpecVersion } from '../lib/spec.ts';

const CLAIM = /Implements spec (\d+\.\d+\.\d+)/;
const specVersion = readSpecVersion();
const problems = readdirSync(PACKAGES_DIR).flatMap((name) => {
  const readme = readFileSync(join(PACKAGES_DIR, name, 'README.md'), 'utf8');
  const claimed = CLAIM.exec(readme)?.[1];
  if (claimed === undefined) return [`${name}: README has no "Implements spec x.y.z" line`];
  return claimed === specVersion
    ? []
    : [`${name}: claims spec ${claimed}, repository spec is ${specVersion}`];
});

if (problems.length > 0) {
  console.error(`Spec claims are wrong:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`All packages implement spec ${specVersion}.`);
