---
editUrl: false
next: false
prev: false
title: "EIP4844BlobTxReceipt"
---

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Extends

- [`PostByzantiumTxReceipt`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Bloom bitvector

#### Inherited from

[`PostByzantiumTxReceipt`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/).[`bitvector`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/#bitvector)

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L14)

***

### blobGasPrice

> **blobGasPrice**: `bigint`

blob gas price for block transaction was included in

Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
and is only provided as part of receipt metadata.

#### Defined in

[packages/vm/src/utils/EIP4844BlobTxReceipt.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/EIP4844BlobTxReceipt.ts#L17)

***

### blobGasUsed

> **blobGasUsed**: `bigint`

blob gas consumed by a transaction

Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
and is only provided as part of receipt metadata.

#### Defined in

[packages/vm/src/utils/EIP4844BlobTxReceipt.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/EIP4844BlobTxReceipt.ts#L10)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[`PostByzantiumTxReceipt`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/).[`cumulativeBlockGasUsed`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/#cumulativeblockgasused)

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L10)

***

### logs

> **logs**: [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

Logs emitted

#### Inherited from

[`PostByzantiumTxReceipt`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/).[`logs`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/#logs)

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L18)

***

### status

> **status**: `0` \| `1`

Status of transaction, `1` if successful, `0` if an exception occurred

#### Inherited from

[`PostByzantiumTxReceipt`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/).[`status`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/#status)

#### Defined in

[packages/vm/src/utils/PostByzantiumTxReceipt.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/PostByzantiumTxReceipt.ts#L11)
