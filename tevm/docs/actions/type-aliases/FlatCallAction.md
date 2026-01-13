[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / FlatCallAction

# Type Alias: FlatCallAction

> **FlatCallAction** = `object`

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:6

Action details for a call trace entry

## Properties

### callType?

> `optional` **callType**: `"call"` \| `"delegatecall"` \| `"staticcall"`

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:8

The type of call

***

### from

> **from**: [`Address`](Address.md)

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:10

Sender address

***

### gas

> **gas**: `bigint`

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:14

Gas provided

***

### input

> **input**: [`Hex`](Hex.md)

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:16

Input data

***

### to

> **to**: [`Address`](Address.md)

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:12

Recipient address

***

### value

> **value**: `bigint`

Defined in: packages/actions/types/common/FlatCallTraceResult.d.ts:18

Value transferred
