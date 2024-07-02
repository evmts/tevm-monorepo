---
editUrl: false
next: false
prev: false
title: "generateTxReceipt"
---

> **generateTxReceipt**(`vm`): (`tx`, `txResult`, `cumulativeGasUsed`, `blobGasUsed`?, `blobGasPrice`?) => `Promise`\<[`TxReceipt`](/reference/tevm/vm/type-aliases/txreceipt/)\>

Returns the tx receipt.

## Parameters

• **vm**: `BaseVm`

## Returns

`Function`

### Parameters

• **tx**: [`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/)

• **txResult**: [`RunTxResult`](/reference/tevm/vm/interfaces/runtxresult/)

• **cumulativeGasUsed**: `bigint`

• **blobGasUsed?**: `bigint`

• **blobGasPrice?**: `bigint`

### Returns

`Promise`\<[`TxReceipt`](/reference/tevm/vm/type-aliases/txreceipt/)\>

## Defined in

[packages/vm/src/actions/generateTxResult.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/generateTxResult.ts#L23)
