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

> `readonly` `optional` **fork.block**: [`BlockTag`](/reference/tevm/actions/type-aliases/blocktag/) \| [`Hex`](/reference/tevm/actions/type-aliases/hex/) \| `BigInt`

The block number

### fork.url?

> `readonly` `optional` **fork.url**: `string`

The url to fork if forking

## Defined in

[packages/actions/src/anvil/AnvilParams.ts:60](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L60)
