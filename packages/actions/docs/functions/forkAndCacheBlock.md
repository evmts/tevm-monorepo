[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / forkAndCacheBlock

# Function: forkAndCacheBlock()

> **forkAndCacheBlock**(`client`, `block`, `executeBlock`?): `Promise`\<`Vm`\>

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

• **block**: `Block`

• **executeBlock?**: `boolean` = `false`

## Returns

`Promise`\<`Vm`\>

A vm that forks the given block

## Defined in

[packages/actions/src/internal/forkAndCacheBlock.js:14](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/internal/forkAndCacheBlock.js#L14)
