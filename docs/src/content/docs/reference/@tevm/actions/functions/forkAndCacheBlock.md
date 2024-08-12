---
editUrl: false
next: false
prev: false
title: "forkAndCacheBlock"
---

> **forkAndCacheBlock**(`client`, `block`, `executeBlock`?): `Promise`\<[`Vm`](/reference/tevm/vm/type-aliases/vm/)\>

Will fork a given block number and save the state roots to state manager

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

• **block**: [`Block`](/reference/tevm/block/classes/block/)

• **executeBlock?**: `boolean` = `false`

## Returns

`Promise`\<[`Vm`](/reference/tevm/vm/type-aliases/vm/)\>

A vm that forks the given block

## Defined in

[packages/actions/src/internal/forkAndCacheBlock.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/internal/forkAndCacheBlock.js#L14)
