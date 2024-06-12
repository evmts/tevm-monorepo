---
editUrl: false
next: false
prev: false
title: "AnvilResetParams"
---

> **AnvilResetParams**: `object`

Params for `anvil_reset` handler

## Type declaration

### fork

> `readonly` **fork**: `object`

### fork.block?

> `optional` `readonly` **block**: [`BlockTag`](/reference/tevm/actions/type-aliases/blocktag-1/) \| [`Hex`](/reference/tevm/actions/type-aliases/hex-1/) \| `BigInt`

The block number

### fork.url?

> `optional` `readonly` **url**: `string`

The url to fork if forking

## Source

[packages/actions/src/anvil/AnvilParams.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L60)
