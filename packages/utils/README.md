# @mdgascar/utils

Every mdg-utils module in one install: Malagasy number words, phone numbers, Ariary amounts
and dates.

Implements spec 0.10.0.

```sh
npm install @mdgascar/utils
```

```ts
import { formatAriary, formatDate, formatPhone, spell, spellTime } from '@mdgascar/utils';

spell(21); // 'iraika amby roapolo'
formatPhone('0341234567', 'international'); // '+261 34 12 345 67'
formatAriary(1500); // 'Ar 1 500'
formatDate('2026-11-23', 'full'); // 'Alatsinainy 23 Novambra 2026'
spellTime('14:30'); // "amin'ny roa sy sasany tolakandro"
```

Prefer the single-module packages (`@mdgascar/words`, `phone`, `ariary`, `date`) when
you need only one.

Docs, API reference and a live playground: [mdgascar.github.io/mdg-utils-docs/docs/installation/using-utils-bundle/](https://mdgascar.github.io/mdg-utils-docs/docs/installation/using-utils-bundle/).
