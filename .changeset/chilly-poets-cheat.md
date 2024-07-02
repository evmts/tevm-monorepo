---
"@tevm/sync-storage-persister": patch
"@tevm/base-client": patch
"@tevm/http-client": patch
"@tevm/precompiles": patch
"@tevm/blockchain": patch
"@tevm/decorators": patch
"@tevm/predeploys": patch
"@tevm/procedures": patch
"@tevm/ethers": minor
"@tevm/contract": minor
"@tevm/actions": patch
"@tevm/jsonrpc": patch
"@tevm/viem": minor
"@tevm/common": patch
"@tevm/errors": patch
"@tevm/server": minor
"@tevm/txpool": patch
"@tevm/block": patch
"@tevm/state": minor
"@tevm/utils": patch
"@tevm/trie": patch
"@tevm/evm": patch
"@tevm/rlp": patch
"@tevm/tx": patch
"@tevm/vm": patch
"tevm": patch
---

Implemented new typesafe error system based on viem errors and the JSON-RPC spec for error codes. All errors come with a typesafe `name` property along with link to docs about the error. They also have a `code` property that maps to ethereum JSON-RPC error codes. All concrete errors are implemented in the `@tevm/errors` package. Each function will then export a union error type of all the errors it and it's sub-functions can throw.
