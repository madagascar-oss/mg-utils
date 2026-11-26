# mdg-utils-js

Small, dependency-free JavaScript helpers for Malagasy data — number words, phone numbers,
Ariary amounts and dates — built from **one shared spec** so every language behaves the same.

[![CI](https://github.com/mdgascar/mdg-utils-js/actions/workflows/ci.yml/badge.svg)](https://github.com/mdgascar/mdg-utils-js/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@mdgascar/utils?label=%40mdgascar%2Futils)](https://www.npmjs.com/package/@mdgascar/utils)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/mdgascar/mdg-utils-js/badge)](https://scorecard.dev/viewer/?uri=github.com/mdgascar/mdg-utils-js)

Implements [spec](https://github.com/mdgascar/mdg-utils-spec) **0.6.0** · [Docs & playground](https://mdgascar.github.io/mdg-utils-docs/) · PHP: [mdg-utils-php](https://github.com/mdgascar/mdg-utils-php)

## Modules

| Module                                                                                 | What it does                                                           | Package                               |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------- |
| [words](https://github.com/mdgascar/mdg-utils-spec/blob/dev/modules/words/README.md)   | `21` → `iraika amby roapolo`                                           | [`@mdgascar/words`](packages/words)   |
| [phone](https://github.com/mdgascar/mdg-utils-spec/blob/dev/modules/phone/README.md)   | Parse, validate and format `+261` mobile numbers                       | [`@mdgascar/phone`](packages/phone)   |
| [ariary](https://github.com/mdgascar/mdg-utils-spec/blob/dev/modules/ariary/README.md) | `1500` → `Ar 1 500`, parse, words, FMG                                 | [`@mdgascar/ariary`](packages/ariary) |
| [date](https://github.com/mdgascar/mdg-utils-spec/blob/dev/modules/date/README.md)     | `2026-11-23` → `Alatsinainy 23 Novambra 2026`, month and weekday names | [`@mdgascar/date`](packages/date)     |

`@mdgascar/utils` bundles every JavaScript module. Each package keeps its own
`CHANGELOG.md`, written by Changesets on release.

```ts
import { formatPhoneNumber, numberToWords } from '@mdgascar/utils';

numberToWords(2026); // 'enina amby roapolo sy roa arivo'
formatPhoneNumber('0341234567', 'international'); // '+261 34 12 345 67'
```

## How it works

```text
spec/modules/<module>/data.yaml  ──codegen──▶ packages/<module>/src/generated/
spec/modules/<module>/tests.yaml ──────────▶ conformance/ runs every vector
```

- **One source of truth.** Malagasy data lives once in [mdg-utils-spec](https://github.com/mdgascar/mdg-utils-spec), included
  here as a git submodule at `spec/`, each value with an official source and the date it was
  checked. Code never hard-codes it.
- **Tests are the contract.** A language port is done when it passes every vector.
- **Zero runtime dependencies.** ESM + CommonJS + types.

Why one repository per language: [ADR 0003](https://github.com/mdgascar/mdg-utils-spec/blob/dev/docs/adr/0003-split-repos-per-language.md).

## Documentation

Guides, the API reference and a live playground (JavaScript and PHP) are at
**[mdgascar.github.io/mdg-utils-docs](https://mdgascar.github.io/mdg-utils-docs/)**.

## Repository layout

```text
packages/<module>/   one npm package each: src/ · test/ · etc/ (API report) · README · CHANGELOG
conformance/         runs every spec vector against the packages
spec/                mdg-utils-spec, git submodule (read-only here)
tools/               codegen, new-module, spec-claim (dev only, never published)
docs/                coding handbook
```

## Contributing

Data and test vectors go to [mdg-utils-spec](https://github.com/mdgascar/mdg-utils-spec) — no code needed. Code changes: start with
[CONTRIBUTING.md](CONTRIBUTING.md) and issues labelled
[`good first issue`](https://github.com/mdgascar/mdg-utils-js/labels/good%20first%20issue) or
[`no-code`](https://github.com/mdgascar/mdg-utils-js/labels/no-code).

## License

[MIT](LICENSE)
