# @madagascar-oss/ariary

## 0.5.0

### Minor Changes

- [#21](https://github.com/madagascar-oss/mg-utils-js/pull/21) [`1e83a65`](https://github.com/madagascar-oss/mg-utils-js/commit/1e83a655eb5e6b4414c74755f918296155760492) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.4.0 for number words (output change): a count of one is bare only for `arivo`. `10 000` → `iray alina`, `100 000` → `iray hetsy`, `1 000 000` → `iray tapitrisa`, `10⁹` → `iray lavitrisa`; `1 000` stays `arivo`. `ariaryToWords` follows.

### Patch Changes

- Updated dependencies [[`1e83a65`](https://github.com/madagascar-oss/mg-utils-js/commit/1e83a655eb5e6b4414c74755f918296155760492)]:
  - @madagascar-oss/words@0.5.0

## 0.4.0

### Minor Changes

- [#19](https://github.com/madagascar-oss/mg-utils-js/pull/19) [`19b8b7b`](https://github.com/madagascar-oss/mg-utils-js/commit/19b8b7bfa45a629bab6832d1783e6f0573f5421b) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.3.0 for number words (output changes):
  
  - 200–900 join the smaller part with `sy` at every size: `205` → `dimy sy roanjato`, `348` → `valo amby efapolo sy telonjato`, `2 586` → `enina amby valopolo sy dimanjato sy roa arivo`. Exactly 100 keeps `amby` (`105` → `dimy amby zato`).
  - A 1 before `sy` stays `iray`: `201` → `iray sy roanjato`.
  - 11–19 are spelled `ambin'ny` (was `ambin' ny`): `11` → `iraika ambin'ny folo`.
  
  `ariaryToWords` follows the same rules.

### Patch Changes

- Updated dependencies [[`19b8b7b`](https://github.com/madagascar-oss/mg-utils-js/commit/19b8b7bfa45a629bab6832d1783e6f0573f5421b)]:
  - @madagascar-oss/words@0.4.0

## 0.3.0

### Minor Changes

- [#16](https://github.com/madagascar-oss/mg-utils-js/pull/16) [`c5a938a`](https://github.com/madagascar-oss/mg-utils-js/commit/c5a938aa3fdfd72f7a7357f6b45165009271c558) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Add `tryParsePhoneNumber` and `tryParseAriary`: they return the parsed value, or `undefined` instead of throwing, like `PhoneNumber::tryParse()` and `Ariary::tryParse()` in mg-utils-php. Use the `safeParse` functions when you need the error code.

### Patch Changes

- Updated dependencies []:
  - @madagascar-oss/words@0.3.0

## 0.2.1

### Patch Changes

- [#12](https://github.com/madagascar-oss/mg-utils-js/pull/12) [`c055792`](https://github.com/madagascar-oss/mg-utils-js/commit/c05579266373f29e2b97755eda7715503fd86a43) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.2.0 (new file layout, no data change): `SPEC_VERSION` is now `0.2.0`. Package metadata points at the flattened `packages/` folder.
- Updated dependencies [[`c055792`](https://github.com/madagascar-oss/mg-utils-js/commit/c05579266373f29e2b97755eda7715503fd86a43)]:
  - @madagascar-oss/words@0.1.1

## 0.2.0

### Minor Changes

- [#7](https://github.com/madagascar-oss/mg-utils/pull/7) [`f352b10`](https://github.com/madagascar-oss/mg-utils/commit/f352b10a491c447151a3437c2e2e9036f1563de8) Thanks [@johan-mickael](https://github.com/johan-mickael)! - New package: format Ariary amounts the Malagasy way (`Ar 1 500`, space or dot grouping, never a comma), read amounts typed by users, write them in words, and convert old francs (FMG).
