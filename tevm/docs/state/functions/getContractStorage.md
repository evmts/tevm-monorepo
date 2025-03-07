[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / getContractStorage

# Function: getContractStorage()

> **getContractStorage**(`baseState`, `skipFetchingFromFork`?): (`address`, `key`) => `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: packages/state/dist/index.d.ts:301

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

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### key

`Uint8Array`

### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
