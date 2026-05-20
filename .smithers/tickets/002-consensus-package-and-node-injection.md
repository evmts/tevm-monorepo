---
id: 002
status: done
priority: P0
area: consensus
---

# Add @tevm/consensus Package And Node Injection

## Problem

Light client support should be implemented as a new `tevm/consensus` package that can be injected into the Tevm node, similar to state manager and other pluggable runtime dependencies.

## Scope

- Add a new workspace package, likely `packages/consensus`, exported as `tevm/consensus`.
- Define a consensus service interface consumed by `@tevm/node`.
- Add node options for injecting a consensus implementation.
- Keep the package independent from Voltaire-specific APIs.
- Support a no-op consensus implementation for ordinary in-memory trusted/devnet mode.
- Support a light-client consensus implementation for proof-backed read mode.

## Acceptance Criteria

- `tevm/package.json` exports `./consensus`.
- `createTevmNode` accepts an injected consensus service without breaking existing node construction.
- The no-op consensus implementation preserves current behavior.
- The light-client implementation can be wired without changing state manager APIs directly.
- Unit tests cover injection, defaults, and node copy behavior.

## Evidence

- `packages/consensus` exists as `@tevm/consensus`, and `tevm/package.json` exports `./consensus`.
- `packages/node/src/createTevmNode.js` accepts `options.consensus`, defaults to `createNoopConsensusService`, and preserves consensus on node copy.
- `packages/node/src/TevmNodeOptions.ts` and `packages/node/src/TevmNode.ts` expose the consensus injection surface.
- Verified with `pnpm --filter @tevm/consensus typecheck`, `pnpm --filter @tevm/node typecheck`, `pnpm --filter @tevm/consensus exec vitest run src/createConsensusService.spec.ts`, and `pnpm --filter @tevm/node exec vitest run src/createTevmNode.spec.ts`.
