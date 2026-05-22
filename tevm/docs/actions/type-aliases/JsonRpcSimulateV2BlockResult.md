[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / JsonRpcSimulateV2BlockResult

# Type Alias: JsonRpcSimulateV2BlockResult

> **JsonRpcSimulateV2BlockResult** = `object`

JSON-RPC response block result for eth_simulateV2 (extends V1)

## Properties

| Property | Type |
| ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas?` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="calls"></a> `calls` | [`JsonRpcSimulateV2CallResult`](JsonRpcSimulateV2CallResult.md)[] |
| <a id="feerecipient"></a> `feeRecipient?` | [`Address`](../../index/type-aliases/Address.md) |
| <a id="gaslimit"></a> `gasLimit` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="gasused"></a> `gasUsed` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="hash"></a> `hash` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="number"></a> `number` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="timestamp"></a> `timestamp` | [`Hex`](../../index/type-aliases/Hex.md) |
