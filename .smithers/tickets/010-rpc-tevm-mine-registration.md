---
id: 010
status: done
priority: P1
area: rpc
---

# Register tevm_mine in runtime handlers

`TevmRequestType` contains `tevm_mine` but `createHandlers` currently exposes `tevm_miner`.

## Acceptance
- `tevm_mine` is registered directly in `createHandlers`
- Alias behavior is documented if `tevm_miner` remains

## Evidence

- `packages/actions/src/createHandlers.js` registers canonical `tevm_mine` and retains `tevm_miner` as a backward-compatible alias.
- `packages/actions/src/rpcMethodMatrix.ts` records `tevm_miner` as the alias.
- `packages/actions/src/createHandlers.spec.ts` covers both runtime paths.
