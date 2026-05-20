---
id: 012
status: done
priority: P2
area: rpc
---

# Add uncle/hashrate RPC parity

`eth_hashrate` and uncle query methods are typed but not runtime-registered.

## Acceptance
- methods are implemented or removed/deprecated from typed request maps

## Evidence

- `packages/actions/src/createHandlers.js` registers the uncle query methods plus `eth_hashrate`, `eth_submitHashrate`, and `eth_submitWork`.
- `packages/actions/src/eth/ethCompatibilityNoopsProcedure.js` returns explicit post-merge zero/null behavior where uncles or PoW are not meaningful.
- Verified with `packages/actions/src/eth/ethCompatibilityNoopsProcedure.spec.ts` and full `@tevm/actions` tests.
