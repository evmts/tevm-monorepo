[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilSetStorageAtParams

# Type Alias: AnvilSetStorageAtParams

> **AnvilSetStorageAtParams** = `object`

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:127

Params for `anvil_setStorageAt` handler

## Properties

### address

> `readonly` **address**: [`Address`](Address.md)

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:131

The address to set the storage for

***

### position

> `readonly` **position**: [`Hex`](Hex.md) \| `BigInt`

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:135

The position in storage to set

***

### value

> `readonly` **value**: [`Hex`](Hex.md) \| `BigInt`

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:139

The value to set
