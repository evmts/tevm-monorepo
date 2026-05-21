---
id: 003
status: done
priority: P0
area: consensus
depends_on: [002]
---

# Light Client Sync Status And Checkpoint Management

## Problem

Tevm needs light client mode with explicit sync status, checkpoint selection, and consensus-head tracking. ZEVM exposes this as `zevm_lightSyncStatus`; Tevm should expose canonical `tevm_lightSyncStatus` and may add `zevm_lightSyncStatus` as an alias if useful.

## Scope

- Add light client status state to `@tevm/consensus`.
- Track `ready`, `status`, `network`, `checkpointSource`, `lastCheckpoint`, `optimisticSlot`, `safeSlot`, and `finalizedSlot`.
- Support mainnet, sepolia, and holesky chain ID mappings.
- Implement checkpoint sources:
  - explicit config.
  - persisted checkpoint file.
  - default checkpoint.
- Implement checkpoint age validation and strict/non-strict startup policy.
- Keep checkpoint startup configuration separate from runtime state mutation.

## Acceptance Criteria

- `tevm_lightSyncStatus` returns a stable JSON-RPC result.
- The result enforces `finalizedSlot <= safeSlot <= optimisticSlot`.
- `ready` transitions only through the consensus service.
- Startup handles missing, malformed, unreadable, stale, and explicit checkpoint inputs deterministically.
- Tests cover all checkpoint-source paths and readiness transitions.

## Evidence

- `packages/consensus/src/createLightClientConsensusService.ts` owns readiness and normalized light sync status.
- `packages/node/src/lightSync.ts` handles explicit, persisted, default, stale, malformed, unreadable, and strict checkpoint selection.
- `packages/actions/src/createHandlers.js` registers `tevm_lightSyncStatus` and the compatibility `zevm_lightSyncStatus` alias.
- Verified with `packages/consensus/src/createConsensusService.spec.ts`, `packages/node/src/lightSync.spec.ts`, `packages/node/src/createTevmNode.spec.ts`, and full `@tevm/actions` tests.
