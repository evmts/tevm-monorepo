[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / EthCallJsonRpcRequest

# Type Alias: EthCallJsonRpcRequest

> **EthCallJsonRpcRequest**: `JsonRpcRequest`\<`"eth_call"`, readonly [[`JsonRpcTransaction`](JsonRpcTransaction.md), `BlockTag` \| `Hex`, `SerializeToJson`\<[`BaseCallParams`](BaseCallParams.md)\[`"stateOverrideSet"`\]\>, `SerializeToJson`\<[`BaseCallParams`](BaseCallParams.md)\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `eth_call` procedure

## Defined in

[packages/actions/src/eth/EthJsonRpcRequest.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L51)
