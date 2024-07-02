---
"@tevm/utils": patch
---

Added PREFUNDED_PRIVATE_KEYS PREFUNDED_ACCOUNTS and PREFUNDED_ADDRESSES to @tevm/utils. These are all an array of 10 objects including hex private keys, hex public keys, and viem accounts respectively. The viem accounts can be used to add an account to `memoryClient` via passing in `account: PREFUNDED_ACCOUNTS[0]` to `createMemoryClient`
