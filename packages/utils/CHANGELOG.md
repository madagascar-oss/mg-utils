# @mdgascar/utils

## 0.7.0

### Minor Changes

- [#30](https://github.com/mdgascar/mdg-utils-js/pull/30) [`b3fbafd`](https://github.com/mdgascar/mdg-utils-js/commit/b3fbafd46f0f5bcd408f076603ff2b4e9aba39a9) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Spec 0.6.0. **Breaking**: Telma is now Yas Madagascar, so the operator id `telma` is now `yas` (`OPERATOR_NAMES.yas` is `'Yas Madagascar'`). New prefix 035 for Airtel Madagascar (on sale since 22 June 2026): `parsePhoneNumber('035 12 345 67').operator` is `'airtel'`.

### Patch Changes

- Updated dependencies [[`b3fbafd`](https://github.com/mdgascar/mdg-utils-js/commit/b3fbafd46f0f5bcd408f076603ff2b4e9aba39a9)]:
  - @mdgascar/phone@0.7.0
  - @mdgascar/ariary@0.7.0
  - @mdgascar/date@0.7.0
  - @mdgascar/words@0.7.0

## 0.6.0

### Minor Changes

- [#25](https://github.com/mdgascar/mdg-utils-js/pull/25) [`bb7f20e`](https://github.com/mdgascar/mdg-utils-js/commit/bb7f20e67414398bf74b189cf1493f03a215e912) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.5.0 for Ariary amounts.
  
  - No more 999 999 999 999 cap: amounts go up to `Number.MAX_SAFE_INTEGER`, so `ariaryToWords(1_000_000_000_000)` → `arivo lavitrisa ariary`.
  - Decimal amounts, after a comma: `formatAriary(1500.5)` → `Ar 1 500,5`, `parseAriary('1 500,50 Ar')` → `1500.5`, `ariaryToWords(1500.5)` → `dimanjato sy arivo faingo dimy ariary`.
  - **Behaviour change:** `parseAriary('1,500')` now returns `1.5` instead of throwing `INVALID_FORMAT`. For English-style text pass `{ grouping: 'comma', decimal: 'dot' }`.
  - New `grouping: 'comma'` and `decimal: 'comma' | 'dot'` options for formatting and for the three parsers. The defaults stay Malagasy.
  - FMG conversion is exact decimal arithmetic and accepts any francs: `fmgToAriary(7501)` → `1500.2`, `ariaryToFmg(0.07)` → `0.35`.

- [#25](https://github.com/mdgascar/mdg-utils-js/pull/25) [`bb7f20e`](https://github.com/mdgascar/mdg-utils-js/commit/bb7f20e67414398bf74b189cf1493f03a215e912) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.5.0 for number words. `numberToWords` now spells any number up to `Number.MAX_SAFE_INTEGER`: `lavitrisa` takes any count, so `10¹²` → `arivo lavitrisa` and `1 999 999 999 999` → `… sy sivy amby sivifolo sy sivinjato sy arivo lavitrisa`. It also reads decimals with `faingo`: `3.14` → `telo faingo efatra ambin'ny folo`, `0.008` → `aotra faingo aotra aotra valo`. Numbers above 999 999 999 999 and decimals no longer throw.

### Patch Changes

- Updated dependencies [[`bb7f20e`](https://github.com/mdgascar/mdg-utils-js/commit/bb7f20e67414398bf74b189cf1493f03a215e912), [`bb7f20e`](https://github.com/mdgascar/mdg-utils-js/commit/bb7f20e67414398bf74b189cf1493f03a215e912)]:
  - @mdgascar/ariary@0.6.0
  - @mdgascar/words@0.6.0
  - @mdgascar/date@0.6.0
  - @mdgascar/phone@0.6.0

## 0.5.0

### Minor Changes

- [#21](https://github.com/mdgascar/mdg-utils-js/pull/21) [`1e83a65`](https://github.com/mdgascar/mdg-utils-js/commit/1e83a655eb5e6b4414c74755f918296155760492) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.4.0 for number words (output change): a count of one is bare only for `arivo`. `10 000` → `iray alina`, `100 000` → `iray hetsy`, `1 000 000` → `iray tapitrisa`, `10⁹` → `iray lavitrisa`; `1 000` stays `arivo`. `ariaryToWords` follows.

### Patch Changes

- Updated dependencies [[`1e83a65`](https://github.com/mdgascar/mdg-utils-js/commit/1e83a655eb5e6b4414c74755f918296155760492)]:
  - @mdgascar/words@0.5.0
  - @mdgascar/ariary@0.5.0
  - @mdgascar/date@0.5.0
  - @mdgascar/phone@0.5.0

## 0.4.0

### Minor Changes

- [#19](https://github.com/mdgascar/mdg-utils-js/pull/19) [`19b8b7b`](https://github.com/mdgascar/mdg-utils-js/commit/19b8b7bfa45a629bab6832d1783e6f0573f5421b) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.3.0 for number words (output changes):
  
  - 200–900 join the smaller part with `sy` at every size: `205` → `dimy sy roanjato`, `348` → `valo amby efapolo sy telonjato`, `2 586` → `enina amby valopolo sy dimanjato sy roa arivo`. Exactly 100 keeps `amby` (`105` → `dimy amby zato`).
  - A 1 before `sy` stays `iray`: `201` → `iray sy roanjato`.
  - 11–19 are spelled `ambin'ny` (was `ambin' ny`): `11` → `iraika ambin'ny folo`.
  
  `ariaryToWords` follows the same rules.

### Patch Changes

- Updated dependencies [[`19b8b7b`](https://github.com/mdgascar/mdg-utils-js/commit/19b8b7bfa45a629bab6832d1783e6f0573f5421b)]:
  - @mdgascar/words@0.4.0
  - @mdgascar/ariary@0.4.0
  - @mdgascar/date@0.4.0
  - @mdgascar/phone@0.4.0

## 0.3.0

### Minor Changes

- [#16](https://github.com/mdgascar/mdg-utils-js/pull/16) [`c5a938a`](https://github.com/mdgascar/mdg-utils-js/commit/c5a938aa3fdfd72f7a7357f6b45165009271c558) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Add `tryParsePhoneNumber` and `tryParseAriary`: they return the parsed value, or `undefined` instead of throwing, like `PhoneNumber::tryParse()` and `Ariary::tryParse()` in mdg-utils-php. Use the `safeParse` functions when you need the error code.

### Patch Changes

- Updated dependencies [[`c5a938a`](https://github.com/mdgascar/mdg-utils-js/commit/c5a938aa3fdfd72f7a7357f6b45165009271c558)]:
  - @mdgascar/phone@0.3.0
  - @mdgascar/ariary@0.3.0
  - @mdgascar/date@0.3.0
  - @mdgascar/words@0.3.0

## 0.2.1

### Patch Changes

- [#12](https://github.com/mdgascar/mdg-utils-js/pull/12) [`c055792`](https://github.com/mdgascar/mdg-utils-js/commit/c05579266373f29e2b97755eda7715503fd86a43) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.2.0 (new file layout, no data change): `SPEC_VERSION` is now `0.2.0`. Package metadata points at the flattened `packages/` folder.
- Updated dependencies [[`c055792`](https://github.com/mdgascar/mdg-utils-js/commit/c05579266373f29e2b97755eda7715503fd86a43)]:
  - @mdgascar/words@0.1.1
  - @mdgascar/phone@0.1.1
  - @mdgascar/ariary@0.2.1
  - @mdgascar/date@0.2.1

## 0.2.0

### Minor Changes

- [#9](https://github.com/mdgascar/mdg-utils/pull/9) [`03f19fd`](https://github.com/mdgascar/mdg-utils/commit/03f19fdceb85ab1172c26cdf0d5b0802577e2397) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Re-export the new `ariary` and `date` modules.

### Patch Changes

- Updated dependencies [[`f352b10`](https://github.com/mdgascar/mdg-utils/commit/f352b10a491c447151a3437c2e2e9036f1563de8), [`92a9a1e`](https://github.com/mdgascar/mdg-utils/commit/92a9a1eac60cf755fdd6a8097ffb3cf2fe219d2a)]:
  - @mdgascar/ariary@0.2.0
  - @mdgascar/date@0.2.0

## 0.1.0

### Minor Changes

- [`2c3bd2f`](https://github.com/mdgascar/mdg-utils/commit/2c3bd2f2295d212adca8911de0744914e059dd6c) Thanks [@johan-mickael](https://github.com/johan-mickael)! - First release, implementing spec 0.1.0: `numberToWords` for Malagasy number words, and
  `parsePhoneNumber`, `safeParsePhoneNumber`, `isValidPhoneNumber`, `formatPhoneNumber` for
  Madagascar mobile numbers.

### Patch Changes

- Updated dependencies [[`2c3bd2f`](https://github.com/mdgascar/mdg-utils/commit/2c3bd2f2295d212adca8911de0744914e059dd6c)]:
  - @mdgascar/words@0.1.0
  - @mdgascar/phone@0.1.0
