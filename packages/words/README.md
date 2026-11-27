# @mdgascar/words

Malagasy number words: write numbers in words, ordinals, and read words back into numbers.
Zero dependencies, ESM + CommonJS + types.

Implements spec 0.9.0.

```sh
npm install @mdgascar/words
```

```ts
import { parseWords, spell, spellOrdinal, tryParseWords } from '@mdgascar/words';

spell(21); // 'iraika amby roapolo'
spell(2026); // 'enina amby roapolo sy roa arivo'
spell(3.5); // 'telo faingo dimy'

spellOrdinal(1); // 'voalohany'
spellOrdinal(3); // 'fahatelo'

parseWords('roa arivo'); // 2000
```

`spell` takes any number from 0 to `Number.MAX_SAFE_INTEGER`, whole or decimal. Bad input
throws `MdgError` with a code such as `INVALID_TYPE` or `OUT_OF_RANGE`.

## Reading words back

`parseWords` reads the words `spell` writes, in any case and spacing. It never rounds: a value
a number cannot hold exactly throws `PRECISION_LOSS`, and `{ as: 'text' }` gives the exact
digits instead. `safeParseWords` returns the error instead of throwing; `tryParseWords` returns
`undefined`.

```ts
parseWords('Iraika amby roapolo'); // 21
tryParseWords('twenty'); // undefined
```

## Traditional system

Malagasy also has a name for every power of ten, not used in everyday writing:

```ts
spell(30_000_000); // 'telopolo tapitrisa'
spell(30_000_000, { system: 'traditional' }); // 'telo safatsiroa'
```

Rules, sources and recorded disagreements: [spec/words](https://github.com/mdgascar/mdg-utils-spec/blob/dev/modules/words/README.md).

Docs, API reference and a live playground: [mdgascar.github.io/mdg-utils-docs/docs/words/](https://mdgascar.github.io/mdg-utils-docs/docs/words/).
