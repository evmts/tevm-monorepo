---
id: 004
status: done
priority: P0
area: consensus
depends_on: [002, 003]
---

# Light Client Proof-Backed Reads

## Problem

Light client mode needs proof-backed execution reads served through Tevm's normal RPC path while using consensus-backed heads and proof verification.

## Scope

- Implement light-mode handling for:
  - `eth_chainId`
  - `eth_blockNumber`
  - `eth_getBalance`
  - `eth_getCode`
  - `eth_getStorageAt`
  - `eth_getTransactionCount`
- Use consensus service heads for `latest`, `safe`, and `finalized`.
- Reject `pending` in light proof-backed reads.
- Enforce a retained numeric history window.
- Verify account/storage/code/nonce proofs against resolved state roots.
- Return explicit errors for not-ready, unsupported selector, malformed upstream proof payload, and proof verification failure.

## Acceptance Criteria

- Proof-backed reads work without local writable state.
- `eth_blockNumber` is readiness-gated.
- `eth_chainId` and `tevm_lightSyncStatus` work before readiness.
- Numeric selector behavior is tested for genesis, retained history, and outside-window cases.
- Trusted/devnet mode behavior is unchanged.

## Evidence

- `packages/actions/src/eth/lightClientRead.js` centralizes selector handling, readiness gates, state-root lookup, proof fetch, payload validation, and proof verification errors.
- Light mode paths are wired into `eth_chainId`, `eth_blockNumber`, `eth_getBalance`, `eth_getCode`, `eth_getStorageAt`, and `eth_getTransactionCount`.
- `packages/actions/src/requestProcedure.js` allows `eth_chainId`, `tevm_lightSyncStatus`, and `zevm_lightSyncStatus` before light-client readiness while gating other reads.
- Verified with `packages/actions/src/eth/lightClientRead.spec.ts`, handler-specific light-client tests, `pnpm --filter @tevm/actions typecheck`, and full `@tevm/actions` tests.
