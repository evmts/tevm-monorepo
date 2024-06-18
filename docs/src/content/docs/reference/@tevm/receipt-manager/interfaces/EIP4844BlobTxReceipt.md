---
editUrl: false
next: false
prev: false
title: "EIP4844BlobTxReceipt"
---

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Extends

- [`PostByzantiumTxReceipt`](/reference/tevm/receipt-manager/interfaces/postbyzantiumtxreceipt/)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Bloom bitvector

#### Inherited from

[`PostByzantiumTxReceipt`](/reference/tevm/receipt-manager/interfaces/postbyzantiumtxreceipt/).[`bitvector`](/reference/tevm/receipt-manager/interfaces/postbyzantiumtxreceipt/#bitvector)

#### Source

[RecieptManager.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L24)

***

### blobGasPrice

> **blobGasPrice**: `bigint`

blob gas price for block transaction was included in

Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
and is only provided as part of receipt metadata.

#### Source

[RecieptManager.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L64)

***

### blobGasUsed

> **blobGasUsed**: `bigint`

blob gas consumed by a transaction

Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
and is only provided as part of receipt metadata.

#### Source

[RecieptManager.ts:57](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L57)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[`PostByzantiumTxReceipt`](/reference/tevm/receipt-manager/interfaces/postbyzantiumtxreceipt/).[`cumulativeBlockGasUsed`](/reference/tevm/receipt-manager/interfaces/postbyzantiumtxreceipt/#cumulativeblockgasused)

#### Source

[RecieptManager.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L20)

***

### logs

> **logs**: [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

Logs emitted

#### Inherited from

[`PostByzantiumTxReceipt`](/reference/tevm/receipt-manager/interfaces/postbyzantiumtxreceipt/).[`logs`](/reference/tevm/receipt-manager/interfaces/postbyzantiumtxreceipt/#logs)

#### Source

[RecieptManager.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L28)

***

### status

> **status**: `0` \| `1`

Status of transaction, `1` if successful, `0` if an exception occurred

#### Inherited from

[`PostByzantiumTxReceipt`](/reference/tevm/receipt-manager/interfaces/postbyzantiumtxreceipt/).[`status`](/reference/tevm/receipt-manager/interfaces/postbyzantiumtxreceipt/#status)

#### Source

[RecieptManager.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L38)
