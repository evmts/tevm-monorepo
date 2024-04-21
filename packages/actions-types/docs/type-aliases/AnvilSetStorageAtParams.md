**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > AnvilSetStorageAtParams

# Type alias: AnvilSetStorageAtParams

> **AnvilSetStorageAtParams**: `object`

Params for `anvil_setStorageAt` handler

## Type declaration

### address

> **address**: [`Address`](Address.md)

The address to set the storage for

### position

> **position**: [`Hex`](Hex.md) \| `BigInt`

The position in storage to set

### value

> **value**: [`Hex`](Hex.md) \| `BigInt`

The value to set

## Source

[params/AnvilParams.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L133)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
