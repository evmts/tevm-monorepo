---
editUrl: false
next: false
prev: false
title: "modifyAccountFields"
---

> **modifyAccountFields**(`baseState`, `skipFetchingFromFork`?): (`address`, `accountFields`) => `Promise`\<`void`\>

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `storageRoot`, and `codeHash`.

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **accountFields**: `Partial`\<`Pick`\<[`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/), `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

### Returns

`Promise`\<`void`\>

## Defined in

[packages/state/src/actions/modifyAccountFields.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/modifyAccountFields.js#L11)
