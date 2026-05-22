[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / FlatCallAction

# Type Alias: FlatCallAction

> **FlatCallAction** = `object`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L7)

Action details for a call trace entry

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="calltype"></a> `callType?` | `"call"` \| `"delegatecall"` \| `"staticcall"` | The type of call | [packages/actions/src/common/FlatCallTraceResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L9) |
| <a id="from"></a> `from` | [`Address`](Address.md) | Sender address | [packages/actions/src/common/FlatCallTraceResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L11) |
| <a id="gas"></a> `gas` | `bigint` | Gas provided | [packages/actions/src/common/FlatCallTraceResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L15) |
| <a id="input"></a> `input` | [`Hex`](Hex.md) | Input data | [packages/actions/src/common/FlatCallTraceResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L17) |
| <a id="to"></a> `to` | [`Address`](Address.md) | Recipient address | [packages/actions/src/common/FlatCallTraceResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L13) |
| <a id="value"></a> `value` | `bigint` | Value transferred | [packages/actions/src/common/FlatCallTraceResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L19) |
