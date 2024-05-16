---
editUrl: false
next: false
prev: false
title: "getContractCode"
---

> **getContractCode**(`baseState`): (`address`) => `Promise`\<`Uint8Array`\>

Gets the code corresponding to the provided `address`.
Returns an empty `Uint8Array` if the account has no associated code.

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

### Returns

`Promise`\<`Uint8Array`\>

## Source

[packages/state/src/actions/getContractCode.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getContractCode.js#L11)
