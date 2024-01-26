**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > AnvilResetParams

# Type alias: AnvilResetParams

> **AnvilResetParams**: `object`

Params for `anvil_reset` handler

## Type declaration

### fork

> **fork**: `object`

### fork.block

> **fork.block**?: [`BlockTag`](BlockTag.md) \| [`Hex`](Hex.md) \| `BigInt`

The block number

### fork.url

> **fork.url**?: `string`

The url to fork if forking

## Source

[params/AnvilParams.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L60)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
