# @mdgascar/words

## 0.11.0

### Minor Changes

- [#56](https://github.com/mdgascar/mdg-utils-js/pull/56) [`5d51fdf`](https://github.com/mdgascar/mdg-utils-js/commit/5d51fdf5c87836fa4def16030137f98d12833206) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Spec 0.10.0.
  
  - **date**: `spellTime` says the time of day in Malagasy: `spellTime('14:30')` →
    `amin'ny roa sy sasany tolakandro`, `spellTime('17:45')` → `amin'ny enina latsaka fahefany hariva`.
    `parseTime` / `safeParseTime` / `tryParseTime` read it back.
  - **ariary**: `currencyDisplay: 'code'` writes the ISO code: `formatAriary(1500, { currencyDisplay: 'code' })`
    → `MGA 1 500` (`MGF` for old francs).

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

### Minor Changes

- [#25](https://github.com/mdgascar/mdg-utils-js/pull/25) [`bb7f20e`](https://github.com/mdgascar/mdg-utils-js/commit/bb7f20e67414398bf74b189cf1493f03a215e912) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.5.0 for number words. `numberToWords` now spells any number up to `Number.MAX_SAFE_INTEGER`: `lavitrisa` takes any count, so `10¹²` → `arivo lavitrisa` and `1 999 999 999 999` → `… sy sivy amby sivifolo sy sivinjato sy arivo lavitrisa`. It also reads decimals with `faingo`: `3.14` → `telo faingo efatra ambin'ny folo`, `0.008` → `aotra faingo aotra aotra valo`. Numbers above 999 999 999 999 and decimals no longer throw.

## 0.5.0

### Minor Changes

- [#21](https://github.com/mdgascar/mdg-utils-js/pull/21) [`1e83a65`](https://github.com/mdgascar/mdg-utils-js/commit/1e83a655eb5e6b4414c74755f918296155760492) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.4.0 for number words (output change): a count of one is bare only for `arivo`. `10 000` → `iray alina`, `100 000` → `iray hetsy`, `1 000 000` → `iray tapitrisa`, `10⁹` → `iray lavitrisa`; `1 000` stays `arivo`. `ariaryToWords` follows.

## 0.4.0

### Minor Changes

- [#19](https://github.com/mdgascar/mdg-utils-js/pull/19) [`19b8b7b`](https://github.com/mdgascar/mdg-utils-js/commit/19b8b7bfa45a629bab6832d1783e6f0573f5421b) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.3.0 for number words (output changes):
  
  - 200–900 join the smaller part with `sy` at every size: `205` → `dimy sy roanjato`, `348` → `valo amby efapolo sy telonjato`, `2 586` → `enina amby valopolo sy dimanjato sy roa arivo`. Exactly 100 keeps `amby` (`105` → `dimy amby zato`).
  - A 1 before `sy` stays `iray`: `201` → `iray sy roanjato`.
  - 11–19 are spelled `ambin'ny` (was `ambin' ny`): `11` → `iraika ambin'ny folo`.
  
  `ariaryToWords` follows the same rules.

## 0.3.0

No changes in this release.

## 0.2.1

### Patch Changes

- Version aligned with the other `@mdgascar` packages, which now share one version number. No code change since 0.1.1.

## 0.1.1

### Patch Changes

- [#12](https://github.com/mdgascar/mdg-utils-js/pull/12) [`c055792`](https://github.com/mdgascar/mdg-utils-js/commit/c05579266373f29e2b97755eda7715503fd86a43) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.2.0 (new file layout, no data change): `SPEC_VERSION` is now `0.2.0`. Package metadata points at the flattened `packages/` folder.

## 0.1.0

### Minor Changes

- [`2c3bd2f`](https://github.com/mdgascar/mdg-utils/commit/2c3bd2f2295d212adca8911de0744914e059dd6c) Thanks [@johan-mickael](https://github.com/johan-mickael)! - First release, implementing spec 0.1.0: `numberToWords` for Malagasy number words, and
  `parsePhoneNumber`, `safeParsePhoneNumber`, `isValidPhoneNumber`, `formatPhoneNumber` for
  Madagascar mobile numbers.
