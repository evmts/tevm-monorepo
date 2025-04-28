---
"@tevm/actions": patch
---

Fixes tx nonce calculation from account state in `createTransaction`.

This previously incremented the nonce by the number of transactions for this account in the tx pool, when the vm would actually already have incremented the nonce for the next transaction.
