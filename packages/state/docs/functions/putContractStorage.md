[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / putContractStorage

# Function: putContractStorage()

> **putContractStorage**(`baseState`, `skipFetchingFromFork`?): (`address`, `key`, `value`) => `Promise`\<`void`\>

Defined in: [packages/state/src/actions/putContractStorage.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/putContractStorage.js#L12)

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

`Address`

#### key

`Uint8Array`

#### value

`Uint8Array`

### Returns

`Promise`\<`void`\>
