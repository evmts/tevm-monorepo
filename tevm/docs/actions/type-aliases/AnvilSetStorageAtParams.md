[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilSetStorageAtParams

# Type Alias: AnvilSetStorageAtParams

> **AnvilSetStorageAtParams**: `object`

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:99

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
