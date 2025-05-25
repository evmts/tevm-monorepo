[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / originalStorageCache

# Function: originalStorageCache()

> **originalStorageCache**(`baseState`, `skipFetchingFromFork?`): `object`

Defined in: packages/state/src/actions/originalStorageCache.js:9

Commits the current change-set to the instance since the
last call to checkpoint.

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

`object`

### clear()

> **clear**(): `void`

#### Returns

`void`

### get()

> **get**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
