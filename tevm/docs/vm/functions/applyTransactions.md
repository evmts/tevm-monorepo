[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / applyTransactions

# Function: applyTransactions()

> **applyTransactions**(`vm`): (`block`, `opts`) => `Promise`\<`object`\>

Applies the transactions in a block, computing the receipts
as well as gas usage and some relevant data. This method is
side-effect free (it doesn't modify the block nor the state).

## Parameters

• **vm**: `BaseVm`

## Returns

`Function`

### Parameters

• **block**: [`Block`](../../block/classes/Block.md)

• **opts**: [`RunBlockOpts`](../interfaces/RunBlockOpts.md)

### Returns

`Promise`\<`object`\>

#### bloom

> **bloom**: `Bloom`

#### gasUsed

> **gasUsed**: `bigint`

#### preimages

> **preimages**: `Map`\<`string`, `Uint8Array`\>

#### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

#### receiptsRoot

> **receiptsRoot**: `Uint8Array`

#### results

> **results**: [`RunTxResult`](../interfaces/RunTxResult.md)[]

## Defined in

packages/vm/types/actions/applyTransactions.d.ts:10
