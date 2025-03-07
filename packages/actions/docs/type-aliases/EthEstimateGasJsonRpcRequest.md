[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthEstimateGasJsonRpcRequest

# Type Alias: EthEstimateGasJsonRpcRequest

> **EthEstimateGasJsonRpcRequest**: `JsonRpcRequest`\<`"eth_estimateGas"`, readonly \[[`JsonRpcTransaction`](JsonRpcTransaction.md), `BlockTag` \| `Hex`, `SerializeToJson`\<[`BaseCallParams`](BaseCallParams.md)\[`"stateOverrideSet"`\]\>, `SerializeToJson`\<[`BaseCallParams`](BaseCallParams.md)\[`"blockOverrideSet"`\]\>\]\>

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:74](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L74)

JSON-RPC request for `eth_estimateGas` procedure
