[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / modifyAccountFields

# Function: modifyAccountFields()

> **modifyAccountFields**(`baseState`, `skipFetchingFromFork?`): (`address`, `accountFields`) => `Promise`\<`void`\>

Defined in: packages/state/src/actions/modifyAccountFields.js:11

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `storageRoot`, and `codeHash`.

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

> (`address`, `accountFields`): `Promise`\<`void`\>

### Parameters

#### address

`Address`

#### accountFields

`Partial`

### Returns

`Promise`\<`void`\>
