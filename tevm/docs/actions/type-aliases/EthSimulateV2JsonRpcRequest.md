[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV2JsonRpcRequest

# Type Alias: EthSimulateV2JsonRpcRequest

> **EthSimulateV2JsonRpcRequest** = [`JsonRpcRequest`](../../index/type-aliases/JsonRpcRequest.md)\<`"eth_simulateV2"`, readonly \[`object`, [`BlockTag`](../../index/type-aliases/BlockTag.md) \| [`Hex`](../../index/type-aliases/Hex.md)\]\>

Defined in: packages/actions/types/eth/EthJsonRpcRequest.d.ts:319

JSON-RPC request for `eth_simulateV2` procedure
Extends V1 with additional options for contract creation detection and call tracing
