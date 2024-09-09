---
editUrl: false
next: false
prev: false
title: "applyTransactions"
---

> **applyTransactions**(`vm`): (`block`, `opts`) => `Promise`\<`object`\>

Applies the transactions in a block, computing the receipts
as well as gas usage and some relevant data. This method is
side-effect free (it doesn't modify the block nor the state).

## Parameters

• **vm**: `BaseVm`

## Returns

`Function`

### Parameters

• **block**: [`Block`](/reference/tevm/block/classes/block/)

• **opts**: [`RunBlockOpts`](/reference/tevm/vm/interfaces/runblockopts/)

### Returns

`Promise`\<`object`\>

#### bloom

> **bloom**: `Bloom`

#### gasUsed

> **gasUsed**: `bigint`

#### preimages

> **preimages**: `Map`\<`string`, `Uint8Array`\>

#### receipts

> **receipts**: [`TxReceipt`](/reference/tevm/vm/type-aliases/txreceipt/)[]

#### receiptsRoot

> **receiptsRoot**: `Uint8Array`

#### results

> **results**: [`RunTxResult`](/reference/tevm/vm/interfaces/runtxresult/)[] = `txResults`

## Defined in

[packages/vm/src/actions/applyTransactions.ts:19](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/applyTransactions.ts#L19)
