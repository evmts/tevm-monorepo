[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / forkAndCacheBlock

# Function: forkAndCacheBlock()

> **forkAndCacheBlock**(`client`, `block`, `executeBlock`?): `Promise`\<`Vm`\>

Defined in: [packages/actions/src/internal/forkAndCacheBlock.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/internal/forkAndCacheBlock.js#L14)

Will fork a given block number and save the state roots to state manager

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

### block

`Block`

### executeBlock?

`boolean` = `false`

## Returns

`Promise`\<`Vm`\>

A vm that forks the given block
