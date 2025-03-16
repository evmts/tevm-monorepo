[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / putContractStorage

# Function: putContractStorage()

> **putContractStorage**(`baseState`, `skipFetchingFromFork`?): (`address`, `key`, `value`) => `Promise`\<`void`\>

Defined in: packages/state/dist/index.d.ts:491

Adds value to the cache for the `account`
corresponding to `address` at the provided `key`.
Cannot be more than 32 bytes. Leading zeros are stripped.
If it is empty or filled with zeros, deletes the value.

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

#### value

`Uint8Array`

### Returns

`Promise`\<`void`\>
