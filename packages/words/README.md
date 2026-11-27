# @mdgascar/words

Write numbers in Malagasy words. Zero dependencies, ESM + CommonJS + types.

Implements spec 0.8.0.

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
Other input throws `MdgError` with code `INVALID_TYPE` or `OUT_OF_RANGE`.

## Exact digits: decimal text

A JavaScript number keeps about 15–17 significant digits, so `2_000_000_000_000_000.9` is
already `2000000000000001` before any function sees it. Pass the digits as text to read them
exactly, at any size:

```ts
numberToWords(2_000_000_000_000_000.9); // 'iray sy roa tapitrisa lavitrisa' (the float)
numberToWords('2000000000000000.9'); // 'roa tapitrisa lavitrisa faingo sivy'
```

Text is digits with an optional `.` and decimals, at most 100 characters; anything else
(`'1 500'`, `'-1'`, `'1e5'`) throws `INVALID_FORMAT`.

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
