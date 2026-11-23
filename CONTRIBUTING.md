# Contributing to mg-utils

A stranger should be able to make a correct contribution in one evening. If something here
slows you down, that is a bug — please open an issue.

The [organisation guide](https://github.com/madagascar-oss/.github/blob/main/CONTRIBUTING.md)
and [Code of Conduct](https://github.com/madagascar-oss/.github/blob/main/CODE_OF_CONDUCT.md)
apply too.

## Six steps

1. **Find work.** Issues labelled `good first issue`, `help wanted` or `no-code` (data and
   test vectors), or open one from a template.
2. **Claim it.** Comment "I'll take this"; a maintainer assigns it. After 14 days without
   activity it goes back to the pool.
3. **Set up.** Open in Codespaces, or locally install Node.js 22+, pnpm and
   [just](https://just.systems), then run `just setup`.
4. **Change spec first, code second.** Edit `spec/`, add test vectors, run `just codegen`,
   then change code until `just test` passes.
5. **Open the PR.** Link the issue, cite a source for any data, and add a changeset
   (`pnpm changeset`) if users are affected.
6. **Review and merge.** CODEOWNERS requests the reviewer. PRs are squash-merged with a
   [Conventional Commit](https://www.conventionalcommits.org/) title, e.g.
   `fix(phone): accept dots as separators`.

## Commands

| Command                  | Does                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `just setup`             | Install dependencies and git hooks                           |
| `just test`              | Run spec vectors and language tests (100% coverage required) |
| `just codegen`           | Regenerate code from `spec/`                                 |
| `just check`             | Validate `spec/` and check generated code is up to date      |
| `just lint`              | Format, lint, typecheck, find dead code                      |
| `just new-module <name>` | Scaffold a module in spec and every language                 |
| `just api`               | Refresh API reports after an intended public API change      |
| `just bench`             | Benchmarks for hot paths                                     |
| `just demo`              | Serve the live demo locally                                  |
| `just ci`                | Everything CI runs                                           |

## Data rules

- **No source, no merge.** An official page, a law or decree, a regulator publication, or a
  recognised dictionary or grammar.
- Every entry has `checked:` — the date someone last verified it. A monthly job lists entries
  older than 12 months.
- When official sources disagree, keep both in the module README and say which one the data
  follows and why.

## Code rules

See [docs/CODING.md](docs/CODING.md). Most rules are enforced by tools, so CI tells you before
a reviewer does.

## Versioning

The spec and each package follow Semantic Versioning separately.

| Change                               | Spec  | Package                                |
| ------------------------------------ | ----- | -------------------------------------- |
| Typo or wrong value fixed in data    | patch | patch                                  |
| New data (operator, prefix, word)    | minor | minor                                  |
| New helper function                  | minor | minor                                  |
| Output changes for an existing input | major | major                                  |
| Function renamed or removed          | —     | major (deprecated for one minor first) |
| Minimum language version raised      | —     | major                                  |

Each package README states the spec version it implements; CI fails if it does not match.

## Language versions

Supported means still maintained upstream: Node.js maintained LTS lines (22, 24, 26 as of
November 2026), PHP versions under active or security support, Python versions not past end
of life. Dropping a version is a major release.

## Review rules

- First response within 72 hours, even if only "thanks, looking soon".
- PRs under about 300 changed lines; bigger ones are split.
- Review checks the contract (spec + vectors) before code style; bots check style.
