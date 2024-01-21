**@tevm/actions-spec** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > AnvilSetStorageAtParams

# Type alias: AnvilSetStorageAtParams

> **AnvilSetStorageAtParams**: `object`

Params for `anvil_setStorageAt` handler

## Type declaration

### address

> **address**: `Address`

The address to set the storage for

### position

> **position**: `Hex` \| `BigInt`

The position in storage to set

### value

> **value**: `Hex` \| `BigInt`

The value to set

## Source

[params/AnvilParams.ts:134](https://github.com/evmts/tevm-monorepo/blob/main/core/actions-spec/src/params/AnvilParams.ts#L134)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)