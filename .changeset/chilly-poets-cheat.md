---
"@tevm/sync-storage-persister": minor
"@tevm/base-client": minor
"@tevm/http-client": minor
"@tevm/precompiles": minor
"@tevm/blockchain": minor
"@tevm/decorators": minor
"@tevm/predeploys": minor
"@tevm/procedures": minor
"@tevm/ethers": minor
"@tevm/contract": minor
"@tevm/actions": minor
"@tevm/jsonrpc": minor
"@tevm/viem": minor
"@tevm/common": minor
"@tevm/errors": minor
"@tevm/server": minor
"@tevm/txpool": minor
"@tevm/block": minor
"@tevm/state": minor
"@tevm/utils": minor
"@tevm/trie": minor
"@tevm/evm": minor
"@tevm/rlp": minor
"@tevm/tx": minor
"@tevm/vm": minor
"tevm": minor
---

Implemented new typesafe error system based on viem errors and the JSON-RPC spec for error codes. All errors come with a typesafe `name` property along with link to docs about the error. They also have a `code` property that maps to ethereum JSON-RPC error codes. All concrete errors are implemented in the `@tevm/errors` package. Each function will then export a union error type of all the errors it and it's sub-functions can throw.
