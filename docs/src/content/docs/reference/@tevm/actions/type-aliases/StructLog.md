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

> `readonly` `optional` **error**: `object`

### error.error

> **error.error**: `string`

### error.errorType

> **error.errorType**: `string`

### gas

> `readonly` **gas**: `bigint`

### gasCost

> `readonly` **gasCost**: `bigint`

### op

> `readonly` **op**: `string`

### pc

> `readonly` **pc**: `number`

### stack

> `readonly` **stack**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)[]

## Defined in

[packages/actions/src/debug/DebugResult.ts:4](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L4)
