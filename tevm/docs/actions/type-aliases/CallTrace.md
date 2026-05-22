[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallTrace

# Type Alias: CallTrace

> **CallTrace** = `object`

Call trace for V2 debugging

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="calls"></a> `calls?` | `CallTrace`[] | Sub-calls made during this call |
| <a id="error"></a> `error?` | `string` | Error message if the call failed |
| <a id="from"></a> `from` | [`Address`](Address.md) | The sender address |
| <a id="gas"></a> `gas` | `bigint` | The gas provided |
| <a id="gasused"></a> `gasUsed` | `bigint` | The gas used |
| <a id="input"></a> `input` | [`Hex`](Hex.md) | The input data |
| <a id="output"></a> `output` | [`Hex`](Hex.md) | The output/return data |
| <a id="to"></a> `to?` | [`Address`](Address.md) | The recipient address (or created contract address) |
| <a id="type"></a> `type` | `string` | The type of call (CALL, DELEGATECALL, STATICCALL, CREATE, CREATE2) |
| <a id="value"></a> `value?` | `bigint` | The value transferred |
