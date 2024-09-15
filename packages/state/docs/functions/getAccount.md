[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / getAccount

# Function: getAccount()

> **getAccount**(`baseState`, `skipFetchingFromFork`?): (`address`) => `Promise`\<`undefined` \| `Account`\>

Gets the account corresponding to the provided `address`.
Returns undefined if account does not exist

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: `Address`

### Returns

`Promise`\<`undefined` \| `Account`\>

## Defined in

[packages/state/src/actions/getAccount.js:9](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/actions/getAccount.js#L9)
