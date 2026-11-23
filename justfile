# mg-utils — every command in one place. Run `just` to list them.
set shell := ["bash", "-euo", "pipefail", "-c"]

# List commands
default:
    @just --list

# Install dependencies and git hooks (target: under 5 minutes)
setup:
    command -v pnpm >/dev/null || npm install --global pnpm@10
    pnpm install --frozen-lockfile
    pnpm hooks

# Regenerate native code from spec/ (never edit generated files by hand)
codegen:
    pnpm codegen

# Validate spec/ files and fail if generated code drifted from the spec
check:
    pnpm validate
    pnpm codegen
    git diff --exit-code -- 'js/packages/*/src/generated' || (echo "Generated code is out of date: run 'just codegen' and commit." && exit 1)

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
    pnpm -r --filter "./js/packages/*" exec api-extractor run
    pnpm spec-claim

# List data entries whose `checked:` date is older than 12 months
stale-data:
    pnpm stale-data

# Scaffold a new module in spec/ and every language
new-module name:
    pnpm new-module {{name}}
    pnpm install
    pnpm codegen

# Build and serve the live demo on http://localhost:8080
demo: build
    pnpm demo
