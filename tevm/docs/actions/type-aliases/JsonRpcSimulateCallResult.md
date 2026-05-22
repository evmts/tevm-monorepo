[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / JsonRpcSimulateCallResult

# Type Alias: JsonRpcSimulateCallResult

> **JsonRpcSimulateCallResult** = `object`

JSON-RPC response call result for eth_simulateV1

## Properties

| Property | Type |
| ------ | ------ |
| <a id="error"></a> `error?` | `object` |
| `error.code` | `number` |
| `error.data?` | [`Hex`](../../index/type-aliases/Hex.md) |
| `error.message` | `string` |
| <a id="gasused"></a> `gasUsed` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="logs"></a> `logs` | `SerializeToJson`\<[`FilterLog`](FilterLog.md)\>[] |
| <a id="returndata"></a> `returnData` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="status"></a> `status` | [`Hex`](../../index/type-aliases/Hex.md) |
