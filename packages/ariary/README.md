# @madagascar-oss/ariary

Malagasy Ariary amounts: format the Malagasy way (`Ar 1 500`, never a comma), read amounts
typed by users, write them in words, and convert old francs (FMG). Zero third-party
dependencies, ESM + CommonJS + types.

Implements spec 0.4.0.

```sh
npm install @madagascar-oss/ariary
```

```ts
import {
  ariaryToFmg,
  ariaryToWords,
  fmgToAriary,
  formatAriary,
  formatFmg,
  parseAriary,
  safeParseAriary,
  tryParseAriary,
} from '@madagascar-oss/ariary';

formatAriary(1500); // 'Ar 1 500' (no-break spaces)
formatAriary(1500, { grouping: 'dot' }); // 'Ar 1.500'
formatAriary(1500, { symbolPosition: 'after' }); // '1 500 Ar'

parseAriary('1.500 Ar'); // 1500
parseAriary('1,500'); // throws MgError INVALID_FORMAT: commas are not thousand separators
tryParseAriary('1,500'); // undefined (never throws)
safeParseAriary('1,500'); // { success: false, error: MgError INVALID_FORMAT }

ariaryToWords(1500); // 'dimanjato sy arivo ariary'
fmgToAriary(7500); // 1500
ariaryToFmg(1500); // 7500
formatFmg(7500); // 'Fmg 7 500'
```

Rules, sources and recorded decisions: [spec/ariary](https://github.com/madagascar-oss/mg-utils-spec/blob/dev/modules/ariary/README.md).

Docs, API reference and a live playground: [madagascar-oss.github.io/mg-utils-docs/docs/ariary/](https://madagascar-oss.github.io/mg-utils-docs/docs/ariary/).
