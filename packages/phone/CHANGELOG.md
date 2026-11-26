# @madagascar-oss/phone

## 0.6.0

No changes in this release.

## 0.5.0

No changes in this release.

## 0.4.0

No changes in this release.

## 0.3.0

### Minor Changes

- [#16](https://github.com/madagascar-oss/mg-utils-js/pull/16) [`c5a938a`](https://github.com/madagascar-oss/mg-utils-js/commit/c5a938aa3fdfd72f7a7357f6b45165009271c558) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Add `tryParsePhoneNumber` and `tryParseAriary`: they return the parsed value, or `undefined` instead of throwing, like `PhoneNumber::tryParse()` and `Ariary::tryParse()` in mg-utils-php. Use the `safeParse` functions when you need the error code.

## 0.2.1

### Patch Changes

- Version aligned with the other `@madagascar-oss` packages, which now share one version number. No code change since 0.1.1.

## 0.1.1

### Patch Changes

- [#12](https://github.com/madagascar-oss/mg-utils-js/pull/12) [`c055792`](https://github.com/madagascar-oss/mg-utils-js/commit/c05579266373f29e2b97755eda7715503fd86a43) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.2.0 (new file layout, no data change): `SPEC_VERSION` is now `0.2.0`. Package metadata points at the flattened `packages/` folder.

## 0.1.0

### Minor Changes

- [`2c3bd2f`](https://github.com/madagascar-oss/mg-utils/commit/2c3bd2f2295d212adca8911de0744914e059dd6c) Thanks [@johan-mickael](https://github.com/johan-mickael)! - First release, implementing spec 0.1.0: `numberToWords` for Malagasy number words, and
  `parsePhoneNumber`, `safeParsePhoneNumber`, `isValidPhoneNumber`, `formatPhoneNumber` for
  Madagascar mobile numbers.
