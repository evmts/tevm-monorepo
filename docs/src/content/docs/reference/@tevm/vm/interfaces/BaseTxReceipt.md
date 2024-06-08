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

#### Source

[packages/vm/src/utils/types.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L24)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Source

[packages/vm/src/utils/types.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L20)

***

### logs

> **logs**: [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

Logs emitted

#### Source

[packages/vm/src/utils/types.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L28)
