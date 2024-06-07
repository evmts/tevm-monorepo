---
editUrl: false
next: false
prev: false
title: "AnvilSetStorageAtParams"
---

> **AnvilSetStorageAtParams**: `object`

Params for `anvil_setStorageAt` handler

## Type declaration

### address

> `readonly` **address**: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

The address to set the storage for

### position

> `readonly` **position**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/) \| `BigInt`

The position in storage to set

### value

> `readonly` **value**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/) \| `BigInt`

The value to set

## Source

[params/AnvilParams.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L133)
