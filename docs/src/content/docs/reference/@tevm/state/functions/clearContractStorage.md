---
editUrl: false
next: false
prev: false
title: "clearContractStorage"
---

> **clearContractStorage**(`baseState`, `skipFetchingFromFork`?): (`address`) => `Promise`\<`void`\>

Clears all storage entries for the account corresponding to `address`.

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

[packages/state/src/actions/clearContractStorage.js:5](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/actions/clearContractStorage.js#L5)
