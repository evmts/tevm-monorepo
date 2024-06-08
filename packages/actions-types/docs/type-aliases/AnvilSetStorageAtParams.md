[**@tevm/actions-types**](../README.md) • **Docs**

***

[@tevm/actions-types](../globals.md) / AnvilSetStorageAtParams

# Type alias: AnvilSetStorageAtParams

> **AnvilSetStorageAtParams**: `object`

Params for `anvil_setStorageAt` handler

## Type declaration

### address

> `readonly` **address**: [`Address`](Address.md)

The address to set the storage for

### position

> `readonly` **position**: [`Hex`](Hex.md) \| `BigInt`

The position in storage to set

### value

> `readonly` **value**: [`Hex`](Hex.md) \| `BigInt`

The value to set

## Source

[params/AnvilParams.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L133)
