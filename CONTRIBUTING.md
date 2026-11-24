# Contributing to mg-utils-js

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
3. **Set up.** Open in Codespaces, or locally install Node.js 22.18+, pnpm and
   [just](https://just.systems), clone with `--recurse-submodules`, then run `just setup`.
4. **Change spec first, code second.** Data and vectors live in
   [mg-utils-spec](https://github.com/madagascar-oss/mg-utils-spec). Once a spec release is out, Renovate opens a PR here
   bumping the `spec/` submodule; run `just codegen`, then change code until `just test` passes. Work on a branch named `<type>/<short-name>`
   from `dev`, e.g. `feat/ariary-format` or `fix/phone-dots`.
5. **Open the PR against `dev`.** Link the issue, cite a source for any data, and add a changeset
   (`pnpm changeset`) if users are affected.
6. **Review and merge.** CODEOWNERS requests the reviewer. PRs are squash-merged with a
   [Conventional Commit](https://www.conventionalcommits.org/) title, e.g.
   `fix(phone): accept dots as separators`.

## Branches and releases

```text
feat/… fix/… docs/… chore/…  ──squash──▶  dev  ──merge──▶  main  ──▶ npm
```

- **`dev`** is the default branch. Every change reaches it through a squash-merged PR from a
  `<type>/<short-name>` branch, where `<type>` is a Conventional Commit type.
- **`main`** only receives merge commits from `dev`. Nobody commits to `main` or `dev`
  directly; rulesets and the `branch-flow` check enforce both.
- **Releasing:** Changesets keeps a `chore: release packages` PR open against `dev`. Merge
  it, then open a PR from `dev` to `main` and merge it. That merge publishes to npm.
- **Every commit is signed** (GitHub shows "Verified"). Set up
  [commit signing](https://docs.github.com/authentication/managing-commit-signature-verification)
  before your first PR.

## Commands

| Command                  | Does                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `just setup`             | Install dependencies and git hooks                           |
| `just test`              | Run spec vectors and language tests (100% coverage required) |
| `just codegen`           | Regenerate code from `spec/`                                 |
| `just check`             | Check generated code is up to date with `spec/`              |
| `just lint`              | Format, lint, typecheck, find dead code                      |
| `just new-module <name>` | Scaffold the JS package for a module in `spec/`              |
| `just api`               | Refresh API reports after an intended public API change      |
| `just bench`             | Benchmarks for hot paths                                     |
| `just demo`              | Serve the live demo locally                                  |
| `just ci`                | Everything CI runs                                           |

## Data rules

See [mg-utils-spec](https://github.com/madagascar-oss/mg-utils-spec/blob/dev/CONTRIBUTING.md#data-rules): no source, no merge.

## Code rules

See [docs/CODING.md](docs/CODING.md). Most rules are enforced by tools, so CI tells you before
a reviewer does.

## Versioning

The spec and the packages follow Semantic Versioning separately. All `@madagascar-oss/*`
packages share **one version number** (Changesets `fixed` group): a release bumps them
together, so `words` 0.3.0 always goes with `utils` 0.3.0. Spec bumps follow the
[spec rules](https://github.com/madagascar-oss/mg-utils-spec/blob/dev/CONTRIBUTING.md#versioning).

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
November 2026). Dropping a version is a major release.

## Review rules

- First response within 72 hours, even if only "thanks, looking soon".
- PRs under about 300 changed lines; bigger ones are split.
- Review checks the contract (spec + vectors) before code style; bots check style.
