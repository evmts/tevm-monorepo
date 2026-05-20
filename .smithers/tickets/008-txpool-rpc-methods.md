---
id: 008
status: todo
priority: P0
area: txpool
---

# Txpool RPC Methods

## Problem

Tevm has a txpool package and many transaction submission features, but the runtime RPC path does not expose geth-style txpool methods.

## Scope

- Implement:
  - `txpool_content`
  - `txpool_contentFrom`
  - `txpool_inspect`
  - `txpool_status`
- Ensure pending and queued transaction classification is nonce-aware.
- Preserve sender metadata for impersonated or unsigned transactions.
- Use JSON-RPC shapes compatible with geth/anvil where practical.

## Acceptance Criteria

- Methods are runtime-registered and typed.
- Tests cover empty pool, multiple senders, pending versus queued txs, filtering by sender, dropped transactions, mined transactions, and replacement transactions.
- `txpool_status` counts match `txpool_content`.

