---
'@mdgascar/words': minor
'@mdgascar/phone': minor
'@mdgascar/ariary': minor
'@mdgascar/date': minor
'@mdgascar/utils': minor
---

Spec 0.9.0.

- **words**: counts before a group word are one phrase joined by `amby`, so every number below
  one million billion has its own words: 201 000 000 is now `iraika amby roanjato tapitrisa`
  (it shared `iray sy roanjato tapitrisa` with 200 000 001), 280 000 000 is
  `valopolo amby roanjato tapitrisa` (dictionary, Wikipedia). New `spellOrdinal` (`fahatelo`)
  and `parseWords` / `safeParseWords` / `tryParseWords`, which read the words back.
- **ariary**: nothing is rounded anymore. Reading or converting an amount a number cannot hold
  throws `PRECISION_LOSS`; `{ as: 'text' }` gives the exact digits. Every function that takes
  an amount also takes decimal text. Reading takes up to 329 characters, so every formatted
  amount reads back.
- **phone**: `036` (Yas) and fixed lines (`020`, `022`) are valid. A parsed number has `type`
  (`mobile` or `fixed`) and `area` (the town of a geographic number, or `null`).
- **date**: new `parseDate` / `safeParseDate` / `tryParseDate` read every style back.

Breaking:

| Before                                                         | Now                              |
| -------------------------------------------------------------- | -------------------------------- |
| `spell(201_000_000)` → `iray sy roanjato tapitrisa`            | `iraika amby roanjato tapitrisa` |
| `parseAriary` above `Number.MAX_SAFE_INTEGER` → `OUT_OF_RANGE` | `PRECISION_LOSS`                 |
| `ariaryToFmg` result too large → `OUT_OF_RANGE`                | `PRECISION_LOSS`                 |
| `parsePhone('020 22 421 19')` → `UNKNOWN_OPERATOR`             | a fixed-line number              |
| `formatAriary('1500')` → `INVALID_TYPE`                        | `Ar 1 500`                       |
