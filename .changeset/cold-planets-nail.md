---
"@tevm/actions": minor
"@tevm/vm": minor
"@tevm/memory-client": minor
---

Breaking change. default to createTransaction: true if state mutability is payable or nonpayable and continue defaulting to false otherwise. Before all calls do not create a transaction unless createTransaction: true is set.
