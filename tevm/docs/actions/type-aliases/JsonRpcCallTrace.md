[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / JsonRpcCallTrace

# Type Alias: JsonRpcCallTrace

> **JsonRpcCallTrace** = `object`

JSON-RPC call trace for eth_simulateV2

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="calls"></a> `calls?` | `JsonRpcCallTrace`[] | Sub-calls |
| <a id="error"></a> `error?` | `string` | Error message if call failed |
| <a id="from"></a> `from` | [`Address`](../../index/type-aliases/Address.md) | Sender address |
| <a id="gas"></a> `gas` | [`Hex`](../../index/type-aliases/Hex.md) | Gas provided |
| <a id="gasused"></a> `gasUsed` | [`Hex`](../../index/type-aliases/Hex.md) | Gas used |
| <a id="input"></a> `input` | [`Hex`](../../index/type-aliases/Hex.md) | Input data |
| <a id="output"></a> `output` | [`Hex`](../../index/type-aliases/Hex.md) | Output data |
| <a id="to"></a> `to?` | [`Address`](../../index/type-aliases/Address.md) | Recipient or created contract address |
| <a id="type"></a> `type` | `string` | Call type (CALL, DELEGATECALL, STATICCALL, CREATE, CREATE2) |
| <a id="value"></a> `value?` | [`Hex`](../../index/type-aliases/Hex.md) | Value transferred |
