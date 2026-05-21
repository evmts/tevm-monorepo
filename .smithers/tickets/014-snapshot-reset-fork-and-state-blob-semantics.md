---
id: 014
status: done
priority: P1
area: state
---

# Snapshot, Reset, Fork, And State Blob Semantics

## Problem

Tevm has snapshot, reset, dump state, load state, and fork URL controls, but they need a complete contract for state, chain, txpool, receipts, logs, mining overrides, impersonation, and time controls.

## Scope

- Define and implement snapshot/revert boundaries.
- Ensure reset invalidates snapshots and handles fork enable/disable/replacement.
- Define `setRpcUrl` semantics for active fork backing.
- Define stable `dumpState` and `loadState` blob format for Tevm.
- Decide whether to support a ZEVM-compatible state blob alias in addition to Tevm's format.

## Acceptance Criteria

- Snapshot/revert restores local state, local chain, txpool, receipt/log indexes, mining config, block env overrides, impersonation state, and time controls as specified.
- Reset clears pending txs and invalidates snapshots.
- Reset preserves or changes fork configuration according to documented params.
- Dump/load state tests cover deterministic output and malformed blobs.

## Evidence

- `packages/actions/src/internal/snapshotMetadata.js` centralizes snapshot capture/restore for state root/state, local blockchain maps, txpool transactions, receipt-manager map DB entries, mining config, block environment overrides, impersonation, and time controls.
- `packages/actions/src/anvil/anvilSnapshotProcedure.js`, `packages/actions/src/anvil/anvilRevertProcedure.js`, and `packages/actions/src/createHandlers.js` use the shared snapshot helpers for `anvil_*` and `evm_*` snapshot/revert behavior.
- `packages/actions/src/anvil/anvilResetProcedure.js` clears txpool state through the shared helper, resets receipts/snapshots, clears filters and overrides, and keeps the documented fork URL boundary.
- `docs/parity-suites.md` documents snapshot/revert/reset/setRpcUrl/dump/load semantics and the active fork URL limitation.
- Tests cover state revert, txpool restoration, chain-head and receipt-index restoration, mining/block/time/impersonation restoration, reset snapshot invalidation, reset txpool/receipt clearing, deterministic dump, malformed load, and `zevmState` alias handling.
- Verified with `pnpm --filter @tevm/actions exec vitest run src/anvil/anvilSnapshotProcedure.spec.ts src/anvil/anvilRevertProcedure.spec.ts src/anvil/anvilResetProcedure.spec.ts src/anvil/anvilDumpStateProcedure.spec.ts src/anvil/anvilLoadStateProcedure.spec.ts src/anvil/anvilSetRpcUrlProcedure.spec.ts src/createHandlers.spec.ts`.
