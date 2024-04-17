**@tevm/actions-types** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/actions-types](../README.md) / StructLog

# Type alias: StructLog

> **StructLog**: `object`

## Type declaration

### depth

> **`readonly`** **depth**: `number`

### error?

> **`optional`** **`readonly`** **error**: `object`

### error.error

> **error**: `string`

### error.errorType

> **errorType**: `string`

### gas

> **`readonly`** **gas**: `bigint`

### gasCost

> **`readonly`** **gasCost**: `bigint`

### op

> **`readonly`** **op**: `string`

### pc

> **`readonly`** **pc**: `number`

### stack

> **`readonly`** **stack**: `ReadonlyArray`\<[`Hex`](Hex.md)\>

## Source

[result/DebugResult.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/DebugResult.ts#L4)
