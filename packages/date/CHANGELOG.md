# @mdgascar/date

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
