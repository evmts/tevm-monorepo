[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / modifyAccountFields

# Function: modifyAccountFields()

> **modifyAccountFields**(`baseState`): (`address`, `accountFields`) => `Promise`\<`void`\>

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `storageRoot`, and `codeHash`.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

`Function`

### Parameters

• **address**: `Address`

• **accountFields**: `Partial`\<`Pick`\<`Account`, `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

### Returns

`Promise`\<`void`\>

## Source

[packages/state/src/actions/modifyAccountFields.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/modifyAccountFields.js#L11)
