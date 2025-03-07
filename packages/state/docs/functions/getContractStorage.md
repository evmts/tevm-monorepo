[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / getContractStorage

# Function: getContractStorage()

> **getContractStorage**(`baseState`, `skipFetchingFromFork`?): (`address`, `key`) => `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/state/src/actions/getContractStorage.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getContractStorage.js#L15)

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

`Function`

### Parameters

#### address

`Address`

#### key

`Uint8Array`

### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
