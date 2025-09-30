[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthEstimateGasJsonRpcRequest

# Type Alias: EthEstimateGasJsonRpcRequest

> **EthEstimateGasJsonRpcRequest** = [`JsonRpcRequest`](../../index/type-aliases/JsonRpcRequest.md)\<`"eth_estimateGas"`, readonly \[[`JsonRpcTransaction`](JsonRpcTransaction.md), [`BlockTag`](../../index/type-aliases/BlockTag.md) \| [`Hex`](../../index/type-aliases/Hex.md), `SerializeToJson`\<[`BaseCallParams`](BaseCallParams.md)\[`"stateOverrideSet"`\]\>, `SerializeToJson`\<[`BaseCallParams`](BaseCallParams.md)\[`"blockOverrideSet"`\]\>\]\>

Defined in: packages/actions/types/eth/EthJsonRpcRequest.d.ts:71

JSON-RPC request for `eth_estimateGas` procedure
