---
editUrl: false
next: false
prev: false
title: "getAccount"
---

> **getAccount**(`baseState`, `skipFetchingFromFork`?): (`address`) => `Promise`\<`undefined` \| [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)\>

Gets the account corresponding to the provided `address`.
Returns undefined if account does not exist

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

### Returns

`Promise`\<`undefined` \| [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)\>

## Defined in

[packages/state/src/actions/getAccount.js:9](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/actions/getAccount.js#L9)
