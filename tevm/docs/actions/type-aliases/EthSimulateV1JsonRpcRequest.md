[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV1JsonRpcRequest

# Type Alias: EthSimulateV1JsonRpcRequest

> **EthSimulateV1JsonRpcRequest**: [`JsonRpcRequest`](../../index/type-aliases/JsonRpcRequest.md)\<`"eth_simulateV1"`, readonly \[\{ `account`: [`Address`](../../index/type-aliases/Address.md); `blockNumber`: [`BlockTag`](../../index/type-aliases/BlockTag.md) \| [`Hex`](../../index/type-aliases/Hex.md); `blockOverrides`: \{ `baseFeePerGas`: [`Hex`](../../index/type-aliases/Hex.md); `coinbase`: [`Address`](../../index/type-aliases/Address.md); `difficulty`: [`Hex`](../../index/type-aliases/Hex.md); `gasLimit`: [`Hex`](../../index/type-aliases/Hex.md); `number`: [`Hex`](../../index/type-aliases/Hex.md); `timestamp`: [`Hex`](../../index/type-aliases/Hex.md); \}; `blockStateCalls`: `object`[]; `stateOverrides`: `object`[]; `traceAssetChanges`: `boolean`; \}\]\>

Defined in: packages/actions/types/eth/EthJsonRpcRequest.d.ts:217

JSON-RPC request for the `eth_simulateV1` procedure
Simulates a series of transactions at a specific block height with optional state overrides
