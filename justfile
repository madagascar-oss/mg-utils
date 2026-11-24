# mg-utils-js — every command in one place. Run `just` to list them.
set shell := ["bash", "-euo", "pipefail", "-c"]

# List commands
default:
    @just --list

# Install dependencies and git hooks (target: under 5 minutes)
setup:
    command -v pnpm >/dev/null || npm install --global pnpm@10
    git submodule update --init
    pnpm install --frozen-lockfile
    pnpm hooks

# Regenerate native code from spec/ (never edit generated files by hand)
codegen:
    pnpm codegen

# Fail if generated code drifted from the spec
check:
    pnpm codegen
    git diff --exit-code -- 'packages/*/src/generated' || (echo "Generated code is out of date: run 'just codegen' and commit." && exit 1)

# Format, lint, typecheck and look for dead code
lint:
    pnpm lint

# Fix formatting and auto-fixable lint errors
format:
    pnpm format

# Run spec vectors and language tests with 100% coverage
test:
    pnpm test

# Run benchmarks for hot paths
bench:
    pnpm bench

# Build every package (ESM + CommonJS + types)
build:
    pnpm build

# Refresh API reports after an intended public API change
api: build
    pnpm api

# Everything CI runs
ci: check lint test build
    pnpm -r --filter "./packages/*" exec api-extractor run
    pnpm spec-claim

# Scaffold the JS package for a module that exists in spec/
new-module name:
    pnpm new-module {{name}}
    pnpm install
    pnpm codegen
