[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / getContractCode

# Function: getContractCode()

> **getContractCode**(`baseState`, `skipFetchingFromFork`?): (`address`) => `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: packages/state/dist/index.d.ts:307

Gets the code corresponding to the provided `address`.
Returns an empty `Uint8Array` if the account has no associated code.

When running in fork mode:
1. First checks main cache for the code
2. Then checks fork cache if main cache misses
3. Finally fetches from remote provider if neither cache has the code
4. When fetched from remote, stores in both main and fork caches

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

### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
