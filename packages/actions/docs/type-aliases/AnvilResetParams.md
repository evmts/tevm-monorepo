[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / AnvilResetParams

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

[packages/actions/src/anvil/AnvilParams.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L60)
