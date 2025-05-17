[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / getContractStorage

# Function: getContractStorage()

> **getContractStorage**(`baseState`, `skipFetchingFromFork?`): (`address`, `key`) => `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/state/src/actions/getContractStorage.js:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getContractStorage.js#L22)

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

When running in fork mode:
1. First checks main cache for the value
2. Then checks fork cache if main cache misses
3. Finally fetches from remote provider if neither cache has the value
4. When fetched from remote, stores in both main and fork caches

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

> (`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

### Parameters

#### address

`Address`

#### key

`Uint8Array`

### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
