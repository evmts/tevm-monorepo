[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / forkAndCacheBlock

# Function: forkAndCacheBlock()

> **forkAndCacheBlock**(`client`, `block`, `executeBlock`?): `Promise`\<`void`\>

Will fork a given block number and save the state roots to state manager

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

• **block**: `Block`

• **executeBlock?**: `boolean`= `false`

## Returns

`Promise`\<`void`\>

## Source

[packages/actions/src/internal/forkAndCacheBlock.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/internal/forkAndCacheBlock.js#L10)
