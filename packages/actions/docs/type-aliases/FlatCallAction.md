[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / FlatCallAction

# Type Alias: FlatCallAction

> **FlatCallAction** = `object`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L7)

Action details for a call trace entry

## Properties

### callType?

> `optional` **callType**: `"call"` \| `"delegatecall"` \| `"staticcall"`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L9)

The type of call

***

### from

> **from**: [`Address`](Address.md)

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L11)

Sender address

***

### gas

> **gas**: `bigint`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L15)

Gas provided

***

### input

> **input**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L17)

Input data

***

### to

> **to**: [`Address`](Address.md)

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L13)

Recipient address

***

### value

> **value**: `bigint`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L19)

Value transferred
