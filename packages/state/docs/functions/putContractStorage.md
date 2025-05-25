[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / putContractStorage

# Function: putContractStorage()

> **putContractStorage**(`baseState`): (`address`, `key`, `value`) => `Promise`\<`void`\>

Defined in: packages/state/src/actions/putContractStorage.js:13

Adds value to the cache for the `account`
corresponding to `address` at the provided `key`.
Cannot be more than 32 bytes. Leading zeros are stripped.
If it is empty or filled with zeros, deletes the value.

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

## Returns

> (`address`, `key`, `value`): `Promise`\<`void`\>

### Parameters

#### address

`Address`

#### key

`Uint8Array`

#### value

`Uint8Array`

### Returns

`Promise`\<`void`\>
