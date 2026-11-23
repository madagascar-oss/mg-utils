# mg-utils

Small, dependency-free helpers for Malagasy data — number words and phone numbers today,
Ariary amounts and dates next — with **one shared spec** and the same behaviour in every
language.

[![CI](https://github.com/madagascar-oss/mg-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/madagascar-oss/mg-utils/actions/workflows/ci.yml)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/madagascar-oss/mg-utils/badge)](https://scorecard.dev/viewer/?uri=github.com/madagascar-oss/mg-utils)

Spec version: **0.1.0** · [Live demo](https://madagascar-oss.github.io/mg-utils/)

## Modules

| Module                        | What it does                                     | JavaScript                                   | PHP     |
| ----------------------------- | ------------------------------------------------ | -------------------------------------------- | ------- |
| [words](spec/words/README.md) | `21` → `iraika amby roapolo`                     | [`@madagascar-oss/words`](js/packages/words) | planned |
| [phone](spec/phone/README.md) | Parse, validate and format `+261` mobile numbers | [`@madagascar-oss/phone`](js/packages/phone) | planned |
| ariary                        | Format Ariary amounts                            | planned                                      | planned |
| date                          | Malagasy month and day names                     | planned                                      | planned |

`@madagascar-oss/utils` bundles every JavaScript module.

```ts
import { formatPhoneNumber, numberToWords } from '@madagascar-oss/utils';

numberToWords(2026); // 'enina amby roapolo sy roa arivo'
formatPhoneNumber('0341234567', 'international'); // '+261 34 12 345 67'
```

## How it works

```text
spec/<module>/data.yaml ──codegen──▶ js/packages/<module>/src/generated/
spec/<module>/tests.yaml ──────────▶ every language runs the same vectors
```

- **One source of truth.** Malagasy data lives once in `spec/`, each value with an official
  source and the date it was checked. Code never hard-codes it.
- **Tests are the contract.** A language port is done when it passes every vector.
- **Zero runtime dependencies.** ESM + CommonJS + types for JavaScript.

Why a monorepo with a shared spec: [ADR 0001](docs/adr/0001-polyglot-monorepo-shared-spec.md).

## Contributing

You can help without writing code: fix data with a source, or add test vectors. Start with
[CONTRIBUTING.md](CONTRIBUTING.md) and issues labelled
[`good first issue`](https://github.com/madagascar-oss/mg-utils/labels/good%20first%20issue) or
[`no-code`](https://github.com/madagascar-oss/mg-utils/labels/no-code).

## License

[MIT](LICENSE)
