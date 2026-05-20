# Wave 1 typecheck repair (round 9)

**Scope:** extensions/viem

## Errors fixed
- extensions/viem/src/tevmViemExtension.js:102 - aligned `tevm_getAccount` request with `GetAccountJsonRpcRequest` by serializing `blockTag` before passing the one-item params tuple to `request`.
