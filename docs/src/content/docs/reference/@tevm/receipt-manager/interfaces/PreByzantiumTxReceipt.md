---
editUrl: false
next: false
prev: false
title: "PreByzantiumTxReceipt"
---

Pre-Byzantium receipt type with a field
for the intermediary state root

## Extends

- [`BaseTxReceipt`](/reference/tevm/receipt-manager/interfaces/basetxreceipt/)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Bloom bitvector

#### Inherited from

[`BaseTxReceipt`](/reference/tevm/receipt-manager/interfaces/basetxreceipt/).[`bitvector`](/reference/tevm/receipt-manager/interfaces/basetxreceipt/#bitvector)

#### Defined in

[RecieptManager.ts:24](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L24)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[`BaseTxReceipt`](/reference/tevm/receipt-manager/interfaces/basetxreceipt/).[`cumulativeBlockGasUsed`](/reference/tevm/receipt-manager/interfaces/basetxreceipt/#cumulativeblockgasused)

#### Defined in

[RecieptManager.ts:20](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L20)

***

### logs

> **logs**: [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

Logs emitted

#### Inherited from

[`BaseTxReceipt`](/reference/tevm/receipt-manager/interfaces/basetxreceipt/).[`logs`](/reference/tevm/receipt-manager/interfaces/basetxreceipt/#logs)

#### Defined in

[RecieptManager.ts:28](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L28)

***

### stateRoot

> **stateRoot**: `Uint8Array`

Intermediary state root

#### Defined in

[RecieptManager.ts:48](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L48)
