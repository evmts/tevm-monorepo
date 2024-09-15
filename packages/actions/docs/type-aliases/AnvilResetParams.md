[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / AnvilResetParams

# Type Alias: AnvilResetParams

> **AnvilResetParams**: `object`

Params for `anvil_reset` handler

## Type declaration

### fork

> `readonly` **fork**: `object`

### fork.block?

> `readonly` `optional` **block**: [`BlockTag`](BlockTag.md) \| [`Hex`](Hex.md) \| `BigInt`

The block number

### fork.url?

> `readonly` `optional` **url**: `string`

The url to fork if forking

## Defined in

[packages/actions/src/anvil/AnvilParams.ts:60](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L60)
