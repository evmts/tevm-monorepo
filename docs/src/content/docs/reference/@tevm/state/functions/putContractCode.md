---
editUrl: false
next: false
prev: false
title: "putContractCode"
---

> **putContractCode**(`baseState`, `skipFetchingFromFork`?): (`address`, `value`) => `Promise`\<`void`\>

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **value**: `Uint8Array`

### Returns

`Promise`\<`void`\>

## Defined in

[packages/state/src/actions/putContractCode.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/putContractCode.js#L10)
