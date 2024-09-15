[**@tevm/procedures**](../README.md) • **Docs**

***

[@tevm/procedures](../globals.md) / EthCallJsonRpcRequest

# Type Alias: EthCallJsonRpcRequest

> **EthCallJsonRpcRequest**: `JsonRpcRequest`\<`"eth_call"`, readonly [[`JsonRpcTransaction`](JsonRpcTransaction.md), `BlockTag` \| `Hex`, [`SerializeToJson`](SerializeToJson.md)\<`BaseCallParams`\[`"stateOverrideSet"`\]\>, [`SerializeToJson`](SerializeToJson.md)\<`BaseCallParams`\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `eth_call` procedure

## Defined in

[packages/procedures/src/eth/EthJsonRpcRequest.ts:50](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/procedures/src/eth/EthJsonRpcRequest.ts#L50)
