# @madagascar-oss/utils

## 0.3.0

### Minor Changes

- [#16](https://github.com/madagascar-oss/mg-utils-js/pull/16) [`c5a938a`](https://github.com/madagascar-oss/mg-utils-js/commit/c5a938aa3fdfd72f7a7357f6b45165009271c558) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Add `tryParsePhoneNumber` and `tryParseAriary`: they return the parsed value, or `undefined` instead of throwing, like `PhoneNumber::tryParse()` and `Ariary::tryParse()` in mg-utils-php. Use the `safeParse` functions when you need the error code.

### Patch Changes

- Updated dependencies [[`c5a938a`](https://github.com/madagascar-oss/mg-utils-js/commit/c5a938aa3fdfd72f7a7357f6b45165009271c558)]:
  - @madagascar-oss/phone@0.3.0
  - @madagascar-oss/ariary@0.3.0
  - @madagascar-oss/date@0.3.0
  - @madagascar-oss/words@0.3.0

## 0.2.1

### Patch Changes

- [#12](https://github.com/madagascar-oss/mg-utils-js/pull/12) [`c055792`](https://github.com/madagascar-oss/mg-utils-js/commit/c05579266373f29e2b97755eda7715503fd86a43) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.2.0 (new file layout, no data change): `SPEC_VERSION` is now `0.2.0`. Package metadata points at the flattened `packages/` folder.
- Updated dependencies [[`c055792`](https://github.com/madagascar-oss/mg-utils-js/commit/c05579266373f29e2b97755eda7715503fd86a43)]:
  - @madagascar-oss/words@0.1.1
  - @madagascar-oss/phone@0.1.1
  - @madagascar-oss/ariary@0.2.1
  - @madagascar-oss/date@0.2.1

## 0.2.0

### Minor Changes

- [#9](https://github.com/madagascar-oss/mg-utils/pull/9) [`03f19fd`](https://github.com/madagascar-oss/mg-utils/commit/03f19fdceb85ab1172c26cdf0d5b0802577e2397) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Re-export the new `ariary` and `date` modules.

### Patch Changes

- Updated dependencies [[`f352b10`](https://github.com/madagascar-oss/mg-utils/commit/f352b10a491c447151a3437c2e2e9036f1563de8), [`92a9a1e`](https://github.com/madagascar-oss/mg-utils/commit/92a9a1eac60cf755fdd6a8097ffb3cf2fe219d2a)]:
  - @madagascar-oss/ariary@0.2.0
  - @madagascar-oss/date@0.2.0

## 0.1.0

### Minor Changes

- [`2c3bd2f`](https://github.com/madagascar-oss/mg-utils/commit/2c3bd2f2295d212adca8911de0744914e059dd6c) Thanks [@johan-mickael](https://github.com/johan-mickael)! - First release, implementing spec 0.1.0: `numberToWords` for Malagasy number words, and
  `parsePhoneNumber`, `safeParsePhoneNumber`, `isValidPhoneNumber`, `formatPhoneNumber` for
  Madagascar mobile numbers.

### Patch Changes

- Updated dependencies [[`2c3bd2f`](https://github.com/madagascar-oss/mg-utils/commit/2c3bd2f2295d212adca8911de0744914e059dd6c)]:
  - @madagascar-oss/words@0.1.0
  - @madagascar-oss/phone@0.1.0
