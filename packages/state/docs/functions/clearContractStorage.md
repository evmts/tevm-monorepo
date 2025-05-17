[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / clearContractStorage

# Function: clearContractStorage()

> **clearContractStorage**(`baseState`, `skipFetchingFromFork?`): (`address`) => `Promise`\<`void`\>

Defined in: [packages/state/src/actions/clearContractStorage.js:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/clearContractStorage.js#L5)

Clears all storage entries for the account corresponding to `address`.

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

> (`address`): `Promise`\<`void`\>

### Parameters

#### address

`Address`

### Returns

`Promise`\<`void`\>
