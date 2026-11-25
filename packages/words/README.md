# @madagascar-oss/words

Write numbers in Malagasy words. Zero dependencies, ESM + CommonJS + types.

Implements spec 0.4.0.

```sh
npm install @madagascar-oss/words
```

```ts
import { numberToWords } from '@madagascar-oss/words';

numberToWords(21); // 'iraika amby roapolo'
numberToWords(2026); // 'enina amby roapolo sy roa arivo'
numberToWords(280_000); // 'valo alina sy roa hetsy'
```

Supports integers from 0 to 999 999 999 999. Other input throws `MgError` with code
`INVALID_TYPE` or `OUT_OF_RANGE`.

Rules, sources and recorded disagreements: [spec/words](https://github.com/madagascar-oss/mg-utils-spec/blob/dev/modules/words/README.md).

Docs, API reference and a live playground: [madagascar-oss.github.io/mg-utils-docs/docs/words/](https://madagascar-oss.github.io/mg-utils-docs/docs/words/).
