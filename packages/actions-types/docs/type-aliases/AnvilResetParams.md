[**@tevm/actions-types**](../README.md) • **Docs**

***

[@tevm/actions-types](../globals.md) / AnvilResetParams

# Type alias: AnvilResetParams

> **AnvilResetParams**: `object`

Params for `anvil_reset` handler

## Type declaration

### fork

> **fork**: `object`

### fork.block?

> `optional` **block**: [`BlockTag`](BlockTag.md) \| [`Hex`](Hex.md) \| `BigInt`

The block number

### fork.url?

> `optional` **url**: `string`

The url to fork if forking

## Source

[params/AnvilParams.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L60)
