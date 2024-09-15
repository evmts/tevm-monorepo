---
editUrl: false
next: false
prev: false
title: "PreByzantiumTxReceipt"
---

Pre-Byzantium receipt type with a field
for the intermediary state root

## Extends

- [`BaseTxReceipt`](/reference/tevm/vm/interfaces/basetxreceipt/)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Bloom bitvector

#### Inherited from

[`BaseTxReceipt`](/reference/tevm/vm/interfaces/basetxreceipt/).[`bitvector`](/reference/tevm/vm/interfaces/basetxreceipt/#bitvector)

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:14](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L14)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[`BaseTxReceipt`](/reference/tevm/vm/interfaces/basetxreceipt/).[`cumulativeBlockGasUsed`](/reference/tevm/vm/interfaces/basetxreceipt/#cumulativeblockgasused)

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:10](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L10)

***

### logs

> **logs**: [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

Logs emitted

#### Inherited from

[`BaseTxReceipt`](/reference/tevm/vm/interfaces/basetxreceipt/).[`logs`](/reference/tevm/vm/interfaces/basetxreceipt/#logs)

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:18](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L18)

***

### stateRoot

> **stateRoot**: `Uint8Array`

Intermediary state root

#### Defined in

[packages/vm/src/utils/PrebyzantiumTxReceipt.ts:11](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/PrebyzantiumTxReceipt.ts#L11)
