---
id: 010
status: todo
priority: P1
area: rpc
---

# Register tevm_mine in runtime handlers

`TevmRequestType` contains `tevm_mine` but `createHandlers` currently exposes `tevm_miner`.

## Acceptance
- `tevm_mine` is registered directly in `createHandlers`
- Alias behavior is documented if `tevm_miner` remains
