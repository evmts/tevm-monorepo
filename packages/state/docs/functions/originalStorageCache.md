[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / originalStorageCache

# Function: originalStorageCache()

> **originalStorageCache**(`baseState`, `skipFetchingFromFork`?): `object`

Commits the current change-set to the instance since the
last call to checkpoint.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

• **skipFetchingFromFork?**: `boolean`

## Returns

`object`

### clear()

#### Returns

`void`

### get()

#### Parameters

• **address**: `Address`

• **key**: `Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\>

## Source

[packages/state/src/actions/originalStorageCache.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/originalStorageCache.js#L9)
