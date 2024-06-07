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

#### Source

[packages/vm/src/utils/types.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L24)

***

### blobGasPrice

> **blobGasPrice**: `bigint`

blob gas price for block transaction was included in

Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
and is only provided as part of receipt metadata.

#### Source

[packages/vm/src/utils/types.ts:67](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L67)

***

### blobGasUsed

> **blobGasUsed**: `bigint`

blob gas consumed by a transaction

Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
and is only provided as part of receipt metadata.

#### Source

[packages/vm/src/utils/types.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L60)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[`PostByzantiumTxReceipt`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/).[`cumulativeBlockGasUsed`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/#cumulativeblockgasused)

#### Source

[packages/vm/src/utils/types.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L20)

***

### logs

> **logs**: [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

Logs emitted

#### Inherited from

[`PostByzantiumTxReceipt`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/).[`logs`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/#logs)

#### Source

[packages/vm/src/utils/types.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L28)

***

### status

> **status**: `0` \| `1`

Status of transaction, `1` if successful, `0` if an exception occurred

#### Inherited from

[`PostByzantiumTxReceipt`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/).[`status`](/reference/tevm/vm/interfaces/postbyzantiumtxreceipt/#status)

#### Source

[packages/vm/src/utils/types.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L50)
