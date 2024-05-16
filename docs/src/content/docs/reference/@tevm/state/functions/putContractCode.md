---
editUrl: false
next: false
prev: false
title: "putContractCode"
---

> **putContractCode**(`baseState`): (`address`, `value`) => `Promise`\<`void`\>

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **value**: `Uint8Array`

### Returns

`Promise`\<`void`\>

## Source

[packages/state/src/actions/putContractCode.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/putContractCode.js#L6)
