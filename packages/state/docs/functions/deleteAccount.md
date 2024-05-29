[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / deleteAccount

# Function: deleteAccount()

> **deleteAccount**(`baseState`, `skipFetchingFromFork`?): (`address`) => `Promise`\<`void`\>

Deletes an account from state under the provided `address`.

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

[packages/state/src/actions/deleteAccount.js:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/deleteAccount.js#L5)
