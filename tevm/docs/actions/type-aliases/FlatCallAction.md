[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / FlatCallAction

# Type Alias: FlatCallAction

> **FlatCallAction** = `object`

Action details for a call trace entry

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="calltype"></a> `callType?` | `"call"` \| `"delegatecall"` \| `"staticcall"` | The type of call |
| <a id="from"></a> `from` | [`Address`](Address.md) | Sender address |
| <a id="gas"></a> `gas` | `bigint` | Gas provided |
| <a id="input"></a> `input` | [`Hex`](Hex.md) | Input data |
| <a id="to"></a> `to` | [`Address`](Address.md) | Recipient address |
| <a id="value"></a> `value` | `bigint` | Value transferred |
