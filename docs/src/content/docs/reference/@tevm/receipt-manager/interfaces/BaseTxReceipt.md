---
editUrl: false
next: false
prev: false
title: "BaseTxReceipt"
---

Abstract interface with common transaction receipt fields

## Extended by

- [`PreByzantiumTxReceipt`](/reference/tevm/receipt-manager/interfaces/prebyzantiumtxreceipt/)
- [`PostByzantiumTxReceipt`](/reference/tevm/receipt-manager/interfaces/postbyzantiumtxreceipt/)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Bloom bitvector

#### Defined in

[RecieptManager.ts:24](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L24)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Defined in

[RecieptManager.ts:20](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L20)

***

### logs

> **logs**: [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

Logs emitted

#### Defined in

[RecieptManager.ts:28](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L28)
