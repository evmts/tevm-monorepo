[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / generateTxReceipt

# Function: generateTxReceipt()

> **generateTxReceipt**(`vm`): (`tx`, `txResult`, `cumulativeGasUsed`, `blobGasUsed`?, `blobGasPrice`?) => `Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)\>

Returns the tx receipt.

## Parameters

• **vm**: `BaseVm`

## Returns

`Function`

### Parameters

• **tx**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)

• **txResult**: [`RunTxResult`](../interfaces/RunTxResult.md)

• **cumulativeGasUsed**: `bigint`

• **blobGasUsed?**: `bigint`

• **blobGasPrice?**: `bigint`

### Returns

`Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)\>

## Defined in

packages/vm/types/actions/generateTxResult.d.ts:13
