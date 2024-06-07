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

> `optional` `readonly` **block**: [`BlockTag`](/reference/tevm/actions-types/type-aliases/blocktag/) \| [`Hex`](/reference/tevm/actions-types/type-aliases/hex/) \| `BigInt`

The block number

### fork.url?

> `optional` `readonly` **url**: `string`

The url to fork if forking

## Source

[params/AnvilParams.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/AnvilParams.ts#L60)
