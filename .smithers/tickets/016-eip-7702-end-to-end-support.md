---
id: 016
status: todo
priority: P0
area: hardforks
depends_on: [015]
---

# EIP-7702 End-To-End Support

## Problem

Tevm has EIP-7702 utilities and transaction types, but block ingestion currently treats `0x4` as "not yet supported" in `CUSTOM_Tx_TYPES.js`. Tevm needs full EIP-7702 support across runtime, txpool, state, and forked chains.

## Scope

- Support type `0x04` EIP-7702 transactions end to end.
- Validate authorization lists.
- Apply delegated code semantics during execution.
- Support EIP-7702 in txpool admission and sorting.
- Support forked block fetching, block hydration, transaction lookup, receipt lookup, and serialization.
- Support RPC request fields involving `authorizationList`.

## Acceptance Criteria

- Remove or update the "not yet supported" treatment for `0x4`.
- Tests cover signing, raw transaction decode, txpool admission, block inclusion, forked block ingestion, delegated code execution, receipts, and error cases.
- EIP-7702 is gated by the correct hardfork.

