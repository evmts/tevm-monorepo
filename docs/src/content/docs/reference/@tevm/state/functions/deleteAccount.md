---
editUrl: false
next: false
prev: false
title: "deleteAccount"
---

> **deleteAccount**(`baseState`, `skipFetchingFromFork`?): (`address`) => `Promise`\<`void`\>

Deletes an account from state under the provided `address`.

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

### Returns

`Promise`\<`void`\>

## Defined in

[packages/state/src/actions/deleteAccount.js:5](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/actions/deleteAccount.js#L5)
