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

> `readonly` **address**: [`Address`](/reference/tevm/actions/type-aliases/address-1/)

The address to set the storage for

### position

> `readonly` **position**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/) \| `BigInt`

The position in storage to set

### value

> `readonly` **value**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/) \| `BigInt`

The value to set

## Source

[packages/actions/src/anvil/AnvilParams.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L133)
