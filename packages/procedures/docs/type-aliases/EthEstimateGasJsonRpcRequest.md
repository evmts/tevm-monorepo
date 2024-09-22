[**@tevm/procedures**](../README.md) • **Docs**

***

[@tevm/procedures](../globals.md) / EthEstimateGasJsonRpcRequest

# Type Alias: EthEstimateGasJsonRpcRequest

> **EthEstimateGasJsonRpcRequest**: `JsonRpcRequest`\<`"eth_estimateGas"`, readonly [[`JsonRpcTransaction`](JsonRpcTransaction.md), `BlockTag` \| `Hex`, [`SerializeToJson`](SerializeToJson.md)\<`BaseCallParams`\[`"stateOverrideSet"`\]\>, [`SerializeToJson`](SerializeToJson.md)\<`BaseCallParams`\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `eth_estimateGas` procedure

## Defined in

[packages/procedures/src/eth/EthJsonRpcRequest.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/eth/EthJsonRpcRequest.ts#L73)
