---
id: 011
status: done
priority: P1
area: rpc
---

# Remaining Supportable eth_* And debug_* Compatibility Methods

## Problem

Several supportable Ethereum compatibility methods are missing from Tevm's runtime handlers.

## Scope

- Implement:
  - `eth_getStorageValues`
  - `eth_getBlockAccessList`
  - `eth_getUncleCountByBlockHash`
  - `eth_getUncleCountByBlockNumber`
  - `eth_getUncleByBlockHashAndIndex`
  - `eth_getUncleByBlockNumberAndIndex`
  - `eth_getWork`
  - `eth_hashrate`
  - `eth_submitHashrate`
  - `eth_submitWork`
  - `debug_getBadBlocks`
- Return post-merge no-op or empty values where appropriate.
- Keep behavior explicit for chains/forks where uncles or PoW are not meaningful.

## Acceptance Criteria

- Methods are runtime-registered and typed.
- Tests cover malformed params, unknown blocks, post-merge zero/null behavior, and batch storage reads.
- `eth_getStorageValues` preserves requested address and slot ordering.

## Evidence

- `packages/actions/src/createHandlers.js` registers `eth_getStorageValues`, `eth_getBlockAccessList`, uncle queries, PoW/hashrate no-ops, and `debug_getBadBlocks`.
- `packages/actions/src/eth/ethCompatibilityNoopsProcedure.js` implements post-merge empty/null/zero behavior and storage batch reads through the existing storage handler.
- `packages/actions/src/eth/ethCompatibilityNoopsProcedure.spec.ts` covers malformed/unknown block behavior, post-merge return values, and storage value ordering.
- Verified with focused compatibility tests and full `@tevm/actions` tests.
