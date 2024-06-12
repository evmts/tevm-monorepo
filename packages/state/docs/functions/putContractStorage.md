[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / putContractStorage

# Function: putContractStorage()

> **putContractStorage**(`baseState`, `skipFetchingFromFork`?): (`address`, `key`, `value`) => `Promise`\<`void`\>

Adds value to the cache for the `account`
corresponding to `address` at the provided `key`.
Cannot be more than 32 bytes. Leading zeros are stripped.
If it is empty or filled with zeros, deletes the value.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: `Address`

• **key**: `Uint8Array`

• **value**: `Uint8Array`

### Returns

`Promise`\<`void`\>

## Source

[packages/state/src/actions/putContractStorage.js:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/putContractStorage.js#L21)
