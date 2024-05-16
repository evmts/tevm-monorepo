---
editUrl: false
next: false
prev: false
title: "putContractStorage"
---

> **putContractStorage**(`baseState`): (`address`, `key`, `value`) => `Promise`\<`void`\>

Adds value to the cache for the `account`
corresponding to `address` at the provided `key`.
Cannot be more than 32 bytes. Leading zeros are stripped.
If it is empty or filled with zeros, deletes the value.

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **key**: `Uint8Array`

• **value**: `Uint8Array`

### Returns

`Promise`\<`void`\>

## Source

[packages/state/src/actions/putContractStorage.js:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/putContractStorage.js#L20)
