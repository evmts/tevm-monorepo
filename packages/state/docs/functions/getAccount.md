[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / getAccount

# Function: getAccount()

> **getAccount**(`baseState`, `skipFetchingFromFork`?): (`address`) => `Promise`\<`undefined` \| `Account`\>

Gets the code corresponding to the provided `address`.

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

[packages/state/src/actions/getAccount.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getAccount.js#L8)
