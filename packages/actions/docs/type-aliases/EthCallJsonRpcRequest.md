[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthCallJsonRpcRequest

# Type Alias: EthCallJsonRpcRequest

> **EthCallJsonRpcRequest**: `JsonRpcRequest`\<`"eth_call"`, readonly \[[`JsonRpcTransaction`](JsonRpcTransaction.md), `BlockTag` \| `Hex`, `SerializeToJson`\<[`BaseCallParams`](BaseCallParams.md)\[`"stateOverrideSet"`\]\>, `SerializeToJson`\<[`BaseCallParams`](BaseCallParams.md)\[`"blockOverrideSet"`\]\>\]\>

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L52)

JSON-RPC request for `eth_call` procedure
