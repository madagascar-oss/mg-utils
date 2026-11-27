# @mdgascar/phone

## 0.8.0

### Minor Changes

- [#43](https://github.com/mdgascar/mdg-utils-js/pull/43) [`29d0754`](https://github.com/mdgascar/mdg-utils-js/commit/29d0754175927bab231542b57751dcd7d862dc08) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Implement spec 0.7.0: `numberToWords(value, { system: 'traditional' })` and
  `ariaryToWords(amount, { system: 'traditional' })` name every power of ten
  (`30 000 000` → `telo safatsiroa`). The standard system stays the default and its output is
  unchanged. New types `NumberSystem` and `NumberToWordsOptions`.

## 0.7.0

### Minor Changes

- [#30](https://github.com/mdgascar/mdg-utils-js/pull/30) [`b3fbafd`](https://github.com/mdgascar/mdg-utils-js/commit/b3fbafd46f0f5bcd408f076603ff2b4e9aba39a9) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Spec 0.6.0. **Breaking**: Telma is now Yas Madagascar, so the operator id `telma` is now `yas` (`OPERATOR_NAMES.yas` is `'Yas Madagascar'`). New prefix 035 for Airtel Madagascar (on sale since 22 June 2026): `parsePhoneNumber('035 12 345 67').operator` is `'airtel'`.

## 0.6.0

No changes in this release.

## 0.5.0

No changes in this release.

## 0.4.0

No changes in this release.

## 0.3.0

### Minor Changes

- [#16](https://github.com/mdgascar/mdg-utils-js/pull/16) [`c5a938a`](https://github.com/mdgascar/mdg-utils-js/commit/c5a938aa3fdfd72f7a7357f6b45165009271c558) Thanks [@johan-mickael](https://github.com/johan-mickael)! - Add `tryParsePhoneNumber` and `tryParseAriary`: they return the parsed value, or `undefined` instead of throwing, like `PhoneNumber::tryParse()` and `Ariary::tryParse()` in mdg-utils-php. Use the `safeParse` functions when you need the error code.

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
