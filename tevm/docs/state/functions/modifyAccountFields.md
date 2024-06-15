[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [state](../README.md) / modifyAccountFields

# Function: modifyAccountFields()

> **modifyAccountFields**(`baseState`, `skipFetchingFromFork`?): (`address`, `accountFields`) => `Promise`\<`void`\>

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `storageRoot`, and `codeHash`.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **accountFields**: `Partial`\<`Pick`\<[`EthjsAccount`](../../utils/classes/EthjsAccount.md), `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

### Returns

`Promise`\<`void`\>

## Source

packages/state/dist/index.d.ts:321
