# mg-utils-js

Small, dependency-free JavaScript helpers for Malagasy data — number words, phone numbers,
Ariary amounts and dates — built from **one shared spec** so every language behaves the same.

[![CI](https://github.com/madagascar-oss/mg-utils-js/actions/workflows/ci.yml/badge.svg)](https://github.com/madagascar-oss/mg-utils-js/actions/workflows/ci.yml)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/madagascar-oss/mg-utils-js/badge)](https://scorecard.dev/viewer/?uri=github.com/madagascar-oss/mg-utils-js)

Implements [spec](https://github.com/madagascar-oss/mg-utils-spec) **0.2.0** · [Live demo](https://madagascar-oss.github.io/mg-utils-js/) · PHP: [mg-utils-php](https://github.com/madagascar-oss/mg-utils-php)

## Modules

| Module                                                                                      | What it does                                                           | Package                                     |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------- |
| [words](https://github.com/madagascar-oss/mg-utils-spec/blob/dev/modules/words/README.md)   | `21` → `iraika amby roapolo`                                           | [`@madagascar-oss/words`](packages/words)   |
| [phone](https://github.com/madagascar-oss/mg-utils-spec/blob/dev/modules/phone/README.md)   | Parse, validate and format `+261` mobile numbers                       | [`@madagascar-oss/phone`](packages/phone)   |
| [ariary](https://github.com/madagascar-oss/mg-utils-spec/blob/dev/modules/ariary/README.md) | `1500` → `Ar 1 500`, parse, words, FMG                                 | [`@madagascar-oss/ariary`](packages/ariary) |
| [date](https://github.com/madagascar-oss/mg-utils-spec/blob/dev/modules/date/README.md)     | `2026-11-23` → `Alatsinainy 23 Novambra 2026`, month and weekday names | [`@madagascar-oss/date`](packages/date)     |

`@madagascar-oss/utils` bundles every JavaScript module. Each package keeps its own
`CHANGELOG.md`, written by Changesets on release.

```ts
import { formatPhoneNumber, numberToWords } from '@madagascar-oss/utils';

numberToWords(2026); // 'enina amby roapolo sy roa arivo'
formatPhoneNumber('0341234567', 'international'); // '+261 34 12 345 67'
```

## How it works

```text
spec/modules/<module>/data.yaml  ──codegen──▶ packages/<module>/src/generated/
spec/modules/<module>/tests.yaml ──────────▶ conformance/ runs every vector
```

- **One source of truth.** Malagasy data lives once in [mg-utils-spec](https://github.com/madagascar-oss/mg-utils-spec), included
  here as a git submodule at `spec/`, each value with an official source and the date it was
  checked. Code never hard-codes it.
- **Tests are the contract.** A language port is done when it passes every vector.
- **Zero runtime dependencies.** ESM + CommonJS + types.

Why one repository per language: [ADR 0003](https://github.com/madagascar-oss/mg-utils-spec/blob/dev/docs/adr/0003-split-repos-per-language.md).

## Repository layout

```text
packages/<module>/   one npm package each: src/ · test/ · etc/ (API report) · README · CHANGELOG
conformance/         runs every spec vector against the packages
spec/                mg-utils-spec, git submodule (read-only here)
tools/               codegen, new-module, spec-claim (dev only, never published)
demo/                live demo page, deployed to GitHub Pages
docs/                coding handbook
```

## Contributing

Data and test vectors go to [mg-utils-spec](https://github.com/madagascar-oss/mg-utils-spec) — no code needed. Code changes: start with
[CONTRIBUTING.md](CONTRIBUTING.md) and issues labelled
[`good first issue`](https://github.com/madagascar-oss/mg-utils-js/labels/good%20first%20issue) or
[`no-code`](https://github.com/madagascar-oss/mg-utils-js/labels/no-code).

## License

[MIT](LICENSE)
