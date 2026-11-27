# @mdgascar/ariary

Malagasy Ariary amounts: format the Malagasy way (`Ar 1 500,5`: space or dot for thousands,
comma for decimals; other conventions opt-in), read amounts
typed by users, write them in words, and convert old francs (FMG). Zero third-party
dependencies, ESM + CommonJS + types.

Implements spec 0.8.0.

```sh
npm install @mdgascar/ariary
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
} from '@mdgascar/ariary';

formatAriary(1500); // 'Ar 1 500' (no-break spaces)
formatAriary(1500.5); // 'Ar 1 500,5' (decimal comma)
formatAriary(1500, { grouping: 'dot' }); // 'Ar 1.500'
formatAriary(1500, { symbolPosition: 'after' }); // '1 500 Ar'
formatAriary(1500.5, { grouping: 'comma', decimal: 'dot' }); // 'Ar 1,500.5' (opt-in)

parseAriary('1.500 Ar'); // 1500
parseAriary('1 500,50 Ar'); // 1500.5
parseAriary('1,500'); // 1.5: by default the comma is the decimal separator
parseAriary('1,500', { grouping: 'comma', decimal: 'dot' }); // 1500, for English-style text
tryParseAriary('1.5'); // undefined (never throws): a dot is not a decimal point by default
safeParseAriary('1.5'); // { success: false, error: MdgError INVALID_FORMAT }

ariaryToWords(1500); // 'dimanjato sy arivo ariary'
ariaryToWords(1500.5); // 'dimanjato sy arivo faingo dimy ariary'
ariaryToWords(30_000_000, { system: 'traditional' }); // 'telo safatsiroa ariary'
ariaryToWords('2000000000000000.9'); // exact text: 'roa tapitrisa lavitrisa faingo sivy ariary'
fmgToAriary(7500); // 1500
fmgToAriary(7501); // 1500.2
ariaryToFmg(0.07); // 0.35 (exact, never 0.35000000000000003)
formatFmg(7500); // 'Fmg 7 500'
```

Rules, sources and recorded decisions: [spec/ariary](https://github.com/mdgascar/mdg-utils-spec/blob/dev/modules/ariary/README.md).

Docs, API reference and a live playground: [mdgascar.github.io/mdg-utils-docs/docs/ariary/](https://mdgascar.github.io/mdg-utils-docs/docs/ariary/).
