# @madagascar-oss/ariary

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
