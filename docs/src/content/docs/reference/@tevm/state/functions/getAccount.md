---
editUrl: false
next: false
prev: false
title: "getAccount"
---

> **getAccount**(`baseState`, `skipFetchingFromFork`?): (`address`) => `Promise`\<`undefined` \| [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)\>

Gets the code corresponding to the provided `address`.

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

[packages/state/src/actions/getAccount.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getAccount.js#L8)
