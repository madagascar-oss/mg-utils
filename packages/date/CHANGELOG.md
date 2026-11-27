# @mdgascar/date

## 0.10.0

### Minor Changes

- [#52](https://github.com/mdgascar/mdg-utils-js/pull/52) [`a66cdbc`](https://github.com/mdgascar/mdg-utils-js/commit/a66cdbc7c5db4b5e2df6e5183d0de16d45590bc4) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Spec 0.9.0.
  
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

## 0.9.0

### Minor Changes

- [#49](https://github.com/mdgascar/mdg-utils-js/pull/49) [`2d31dfa`](https://github.com/mdgascar/mdg-utils-js/commit/2d31dfa3a927d1bc0ce62e3de6fd8491586b9959) Thanks [@johan-mickael](https://github.com/johan-mickael)! - **Breaking:** the public API now uses the domain's words (spec 0.8.0). Rename your calls:
  
  | Was                                                               | Now                                             |
  | ----------------------------------------------------------------- | ----------------------------------------------- |
  | `numberToWords`                                                   | `spell`                                         |
  | `ariaryToWords`                                                   | `spellAriary`                                   |
  | `parsePhoneNumber`, `safeParsePhoneNumber`, `tryParsePhoneNumber` | `parsePhone`, `safeParsePhone`, `tryParsePhone` |
  | `isValidPhoneNumber`, `formatPhoneNumber`                         | `isValidPhone`, `formatPhone`                   |
  | `getMonthName`, `getWeekdayName`                                  | `monthName`, `weekdayName`                      |
  
  The options type `NumberToWordsOptions` is now `SpellOptions`. Behaviour is unchanged; the other types keep their names (`PhoneNumber`, `NumberSystem`, …).

- [#47](https://github.com/mdgascar/mdg-utils-js/pull/47) [`4c29b12`](https://github.com/mdgascar/mdg-utils-js/commit/4c29b12f81806119c5edf9c8c07ff214d7448e47) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.8.0: `spell` and `spellAriary` also take plain decimal text, read
  exactly with no floating-point rounding: `spell('2000000000000000.9')` →
  `roa tapitrisa lavitrisa faingo sivy`. Text that is not plain decimal throws `INVALID_FORMAT`.
  In the traditional system, a number of 10¹⁹ or more (text only) is written in the standard
  system.

## 0.8.0

### Minor Changes

- [#43](https://github.com/mdgascar/mdg-utils-js/pull/43) [`29d0754`](https://github.com/mdgascar/mdg-utils-js/commit/29d0754175927bab231542b57751dcd7d862dc08) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.7.0: `numberToWords(value, { system: 'traditional' })` and
  `ariaryToWords(amount, { system: 'traditional' })` name every power of ten
  (`30 000 000` → `telo safatsiroa`). The standard system stays the default and its output is
  unchanged. New types `NumberSystem` and `NumberToWordsOptions`.

## 0.7.0

No changes in this release.

## 0.6.0

No changes in this release.

## 0.5.0

No changes in this release.

## 0.4.0

No changes in this release.

## 0.3.0

No changes in this release.

## 0.2.1

### Patch Changes

- [#12](https://github.com/mdgascar/mdg-utils-js/pull/12) [`c055792`](https://github.com/mdgascar/mdg-utils-js/commit/c05579266373f29e2b97755eda7715503fd86a43) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.2.0 (new file layout, no data change): `SPEC_VERSION` is now `0.2.0`. Package metadata points at the flattened `packages/` folder.

## 0.2.0

### Minor Changes

- [#8](https://github.com/mdgascar/mdg-utils/pull/8) [`92a9a1e`](https://github.com/mdgascar/mdg-utils/commit/92a9a1eac60cf755fdd6a8097ffb3cf2fe219d2a) Thanks [@johan-mickael](https://github.com/johan-mickael)! - New package: write dates in Malagasy (`Alatsinainy 23 Novambra 2026`) with CLDR styles plus a `numeric` style (`23/11/2026`), and get month and weekday names.
