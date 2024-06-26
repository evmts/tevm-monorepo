[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / StructLog

# Type Alias: StructLog

> **StructLog**: `object`

## Type declaration

### depth

> `readonly` **depth**: `number`

### error?

> `readonly` `optional` **error**: `object`

### error.error

> **error**: `string`

### error.errorType

> **errorType**: `string`

### gas

> `readonly` **gas**: `bigint`

### gasCost

> `readonly` **gasCost**: `bigint`

### op

> `readonly` **op**: `string`

### pc

> `readonly` **pc**: `number`

### stack

> `readonly` **stack**: [`Hex`](Hex.md)[]

## Defined in

[packages/actions/src/debug/DebugResult.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L4)
