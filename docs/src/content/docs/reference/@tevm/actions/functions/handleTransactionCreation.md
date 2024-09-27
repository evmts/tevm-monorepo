---
editUrl: false
next: false
prev: false
title: "handleTransactionCreation"
---

> **handleTransactionCreation**(`client`, `params`, `executedCall`, `evmInput`): `Promise`\<`object` \| `object`\>

Handles the creation of a transaction based on the call parameters and execution result.

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

The TEVM base client instance.

• **params**: [`CallParams`](/reference/tevm/actions/type-aliases/callparams/)\<`boolean`\>

The call parameters.

• **executedCall**: [`ExecuteCallResult`](/reference/tevm/actions/type-aliases/executecallresult/)

The result of the executed call.

• **evmInput**: [`EvmRunCallOpts`](/reference/tevm/evm/interfaces/evmruncallopts/)

The EVM input parameters.

## Returns

`Promise`\<`object` \| `object`\>

A promise that resolves to the transaction hash or undefined.

## Throws

Returns errors as values

## Defined in

[packages/actions/src/Call/handleTransactionCreation.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/handleTransactionCreation.js#L15)
