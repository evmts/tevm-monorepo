[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / generateTxReceipt

# Function: generateTxReceipt()

> **generateTxReceipt**(`vm`): (`tx`, `txResult`, `cumulativeGasUsed`, `blobGasUsed?`, `blobGasPrice?`) => `Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)\>

Defined in: [packages/vm/src/actions/generateTxResult.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/generateTxResult.ts#L23)

Returns the tx receipt.

## Parameters

### vm

`BaseVm`

## Returns

> (`tx`, `txResult`, `cumulativeGasUsed`, `blobGasUsed?`, `blobGasPrice?`): `Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)\>

### Parameters

#### tx

`TypedTransaction`

#### txResult

[`RunTxResult`](../interfaces/RunTxResult.md)

#### cumulativeGasUsed

`bigint`

#### blobGasUsed?

`bigint`

#### blobGasPrice?

`bigint`

### Returns

`Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)\>
