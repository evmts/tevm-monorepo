---
editUrl: false
next: false
prev: false
title: "handlePendingTransactionsWarning"
---

> **handlePendingTransactionsWarning**(`client`, `params`, `code`, `deployedBytecode`): `Promise`\<`void`\>

Handles warning for pending transactions in the transaction pool.

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

The TEVM base client instance.

• **params**: [`CallParams`](/reference/tevm/actions/type-aliases/callparams/)\<`boolean`\>

The call parameters.

• **code**: `undefined` \| `string`

The code to execute.

• **deployedBytecode**: `undefined` \| `string`

The deployed bytecode to use.

## Returns

`Promise`\<`void`\>

A promise that resolves when the check is complete.

## Throws

This function does not throw errors.

## Defined in

[packages/actions/src/Call/handlePendingTransactionsWarning.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/handlePendingTransactionsWarning.js#L14)
