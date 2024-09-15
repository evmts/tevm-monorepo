---
editUrl: false
next: false
prev: false
title: "putAccount"
---

> **putAccount**(`baseState`, `skipFetchingFromFork`?): (`address`, `account`?) => `Promise`\<`void`\>

Saves an account into state under the provided `address`.

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **account?**: [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

### Returns

`Promise`\<`void`\>

## Defined in

[packages/state/src/actions/putAccount.js:5](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/actions/putAccount.js#L5)
