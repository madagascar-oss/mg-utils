# @madagascar-oss/utils

Every mg-utils module in one install: Malagasy number words, phone numbers, Ariary amounts
and dates.

Implements spec 0.5.0.

```sh
npm install @madagascar-oss/utils
```

```ts
import { formatAriary, formatDate, formatPhoneNumber, numberToWords } from '@madagascar-oss/utils';

numberToWords(21); // 'iraika amby roapolo'
formatPhoneNumber('0341234567', 'international'); // '+261 34 12 345 67'
formatAriary(1500); // 'Ar 1 500'
formatDate('2026-11-23', 'full'); // 'Alatsinainy 23 Novambra 2026'
```

Prefer the single-module packages (`@madagascar-oss/words`, `phone`, `ariary`, `date`) when
you need only one.

Docs, API reference and a live playground: [madagascar-oss.github.io/mg-utils-docs/docs/installation/using-utils-bundle/](https://madagascar-oss.github.io/mg-utils-docs/docs/installation/using-utils-bundle/).
