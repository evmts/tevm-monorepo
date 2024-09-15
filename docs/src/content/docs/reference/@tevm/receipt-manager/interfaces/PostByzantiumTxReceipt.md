---
editUrl: false
next: false
prev: false
title: "PostByzantiumTxReceipt"
---

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Extends

- [`BaseTxReceipt`](/reference/tevm/receipt-manager/interfaces/basetxreceipt/)

## Extended by

- [`EIP4844BlobTxReceipt`](/reference/tevm/receipt-manager/interfaces/eip4844blobtxreceipt/)

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

### status

> **status**: `0` \| `1`

Status of transaction, `1` if successful, `0` if an exception occurred

#### Defined in

[RecieptManager.ts:38](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L38)
