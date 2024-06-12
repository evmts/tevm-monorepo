---
editUrl: false
next: false
prev: false
title: "StructLog"
---

> **StructLog**: `object`

## Type declaration

### depth

> `readonly` **depth**: `number`

### error?

> `optional` `readonly` **error**: `object`

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

> `readonly` **stack**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)[]

## Source

[packages/actions/src/debug/DebugResult.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L4)
