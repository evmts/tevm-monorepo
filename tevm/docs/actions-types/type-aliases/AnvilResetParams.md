[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [actions-types](../README.md) / AnvilResetParams

# Type alias: AnvilResetParams

> **AnvilResetParams**: `object`

Params for `anvil_reset` handler

## Type declaration

### fork

> `readonly` **fork**: `object`

### fork.block?

> `optional` `readonly` **block**: [`BlockTag`](BlockTag.md) \| [`Hex`](Hex.md) \| `BigInt`

The block number

### fork.url?

> `optional` `readonly` **url**: `string`

The url to fork if forking

## Source

packages/actions-types/types/params/AnvilParams.d.ts:47
