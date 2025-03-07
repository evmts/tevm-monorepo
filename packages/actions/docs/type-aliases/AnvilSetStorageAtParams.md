[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilSetStorageAtParams

# Type Alias: AnvilSetStorageAtParams

> **AnvilSetStorageAtParams**: `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:122](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L122)

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
