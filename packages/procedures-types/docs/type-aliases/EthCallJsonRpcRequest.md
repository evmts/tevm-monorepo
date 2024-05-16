[**@tevm/procedures-types**](../README.md) • **Docs**

***

[@tevm/procedures-types](../globals.md) / EthCallJsonRpcRequest

# Type alias: EthCallJsonRpcRequest

> **EthCallJsonRpcRequest**: `JsonRpcRequest`\<`"eth_call"`, readonly [[`JsonRpcTransaction`](JsonRpcTransaction.md), `BlockTag` \| `Hex`, [`SerializeToJson`](SerializeToJson.md)\<`BaseCallParams`\[`"stateOverrideSet"`\]\>, [`SerializeToJson`](SerializeToJson.md)\<`BaseCallParams`\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `eth_call` procedure

## Source

[requests/EthJsonRpcRequest.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/requests/EthJsonRpcRequest.ts#L50)
