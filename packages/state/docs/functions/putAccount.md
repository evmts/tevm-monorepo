[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / putAccount

# Function: putAccount()

> **putAccount**(`baseState`, `skipFetchingFromFork`?): (`address`, `account`?) => `Promise`\<`void`\>

Defined in: [packages/state/src/actions/putAccount.js:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/putAccount.js#L5)

Saves an account into state under the provided `address`.

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

#### account?

`Account`

### Returns

`Promise`\<`void`\>
