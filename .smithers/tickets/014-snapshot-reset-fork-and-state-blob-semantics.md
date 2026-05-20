---
id: 014
status: todo
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

