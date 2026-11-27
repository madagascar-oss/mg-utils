# @mdgascar/words

Write numbers in Malagasy words. Zero dependencies, ESM + CommonJS + types.

Implements spec 0.7.0.

```sh
npm install @mdgascar/words
```

```ts
import { numberToWords } from '@mdgascar/words';

numberToWords(21); // 'iraika amby roapolo'
numberToWords(2026); // 'enina amby roapolo sy roa arivo'
numberToWords(280000); // 'valo alina sy roa hetsy'
numberToWords(3.14); // "telo faingo efatra ambin'ny folo"
numberToWords(0.008); // 'aotra faingo aotra aotra valo'
```

Takes any number from 0 to `Number.MAX_SAFE_INTEGER` (9 007 199 254 740 991), whole or decimal.
Only number values are accepted: strings are not parsed. Other input throws `MdgError` with code
`INVALID_TYPE` or `OUT_OF_RANGE`.

## Traditional system

Malagasy also has a name for every power of ten (`safatsiroa` 10⁷, `tsitamboisa` 10⁸,
`lavitrisa` 10⁹, `alinkisa` 10¹⁰, …), not used in everyday writing. Ask for it with
`system: 'traditional'`; the default is `'standard'`:

```ts
numberToWords(30_000_000); // 'telopolo tapitrisa'
numberToWords(30_000_000, { system: 'traditional' }); // 'telo safatsiroa'
```

Rules, sources and recorded disagreements: [spec/words](https://github.com/mdgascar/mdg-utils-spec/blob/dev/modules/words/README.md).

Docs, API reference and a live playground: [mdgascar.github.io/mdg-utils-docs/docs/words/](https://mdgascar.github.io/mdg-utils-docs/docs/words/).
