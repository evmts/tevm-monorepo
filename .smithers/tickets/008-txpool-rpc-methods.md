---
id: 008
status: done
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

## Evidence

- `packages/actions/src/createHandlers.js` registers `txpool_content`, `txpool_contentFrom`, `txpool_inspect`, and `txpool_status`.
- Txpool RPC output is built from the Tevm txpool and classifies pending versus queued transactions by sender nonce.
- `packages/actions/src/requestProcedure.spec.ts` covers empty pool, multiple senders, pending/queued classification, filtering, mined/dropped tx removal, replacement transactions, unsigned tx metadata, and status counts.
- Verified with focused request tests and full `pnpm --filter @tevm/actions test:run`.
