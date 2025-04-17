---
"tevm": minor
"@tevm/actions": minor
"@tevm/memory-client": minor
---

feat(actions): Deprecate `createTransaction` parameter and add `addToMempool` and `addToBlockchain` parameters.

This change makes the API more intuitive when working with transactions:

- Added `addToMempool`: Add the transaction to mempool (requires manual mining later)
- Added `addToBlockchain`: Add the transaction to mempool and automatically mine it
- Deprecated `createTransaction`: Still works but shows warning, use `addToMempool` instead

This helps address a common issue where users forget to mine transactions after creating them. The `addToBlockchain` parameter automatically forces mining mode to "auto" temporarily to ensure the transaction is immediately included in a block.