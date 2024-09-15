---
editUrl: false
next: false
prev: false
title: "BaseTxReceipt"
---

Abstract interface with common transaction receipt fields

## Extended by

- [`PreByzantiumTxReceipt`](/reference/tevm/vm/interfaces/prebyzantiumtxreceipt/)
- [`PostByzantiumTxReceipt`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Bloom bitvector

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:14](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L14)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:10](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L10)

***

### logs

> **logs**: [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

Logs emitted

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:18](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L18)
