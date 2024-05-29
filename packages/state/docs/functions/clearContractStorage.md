[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / clearContractStorage

# Function: clearContractStorage()

> **clearContractStorage**(`baseState`, `skipFetchingFromFork`?): (`address`) => `Promise`\<`void`\>

Clears all storage entries for the account corresponding to `address`.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: `Address`

### Returns

`Promise`\<`void`\>

## Source

[packages/state/src/actions/clearContractStorage.js:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/clearContractStorage.js#L5)
