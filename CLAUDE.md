# Tevm Monorepo Commands and Style Guide

## Commands
- Build: `bun build` or `nx run-many --targets=build:dist,build:app,build:types`
- Lint: `bun lint` or `biome check . --write --unsafe && biome format . --write`
- Test all: `bun test` or `bun test:run`
- Test single file: `vitest run <path-to-file>` (e.g. `vitest run packages/state/src/actions/saveStateRoot.spec.ts`)
- Test specific test: `vitest run <path-to-file> -t "<test-name>"`
- Test with coverage: `bun test:coverage`

## Style Guide
- Formatting: Biome with tabs (2 spaces wide), 120 char line width, single quotes
- Types: JavaScript with JSDoc preferred over TypeScript
- Imports: Organized by Biome, use barrel files (index.js/ts) for exports
- Naming: camelCase for functions/variables, PascalCase for classes/types
- Error handling: Extend BaseError, include detailed diagnostics
- Barrel files: Use explicit exports to prevent breaking changes

## Setup
- Package manager: pnpm 9.x.x
- Script runner: Bun
- Requires env vars for tests: TEVM_RPC_URLS_MAINNET, TEVM_RPC_URLS_OPTIMISM