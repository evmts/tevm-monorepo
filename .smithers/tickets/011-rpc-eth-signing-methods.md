---
id: 011
status: todo
priority: P1
area: rpc
---

# Implement eth signing dispatch parity

`eth_sign` and `eth_signTransaction` are typed but not wired through `createHandlers`.

## Acceptance
- runtime handlers for `eth_sign` and `eth_signTransaction` are registered or explicitly deprecated from types
