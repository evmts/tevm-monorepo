---
editUrl: false
next: false
prev: false
title: "PostByzantiumTxReceipt"
---

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Extends

- [`BaseTxReceipt`](/reference/tevm/vm/interfaces/basetxreceipt/)

## Extended by

- [`EIP4844BlobTxReceipt`](/reference/tevm/vm/interfaces/eip4844blobtxreceipt/)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Bloom bitvector

#### Inherited from

[`BaseTxReceipt`](/reference/tevm/vm/interfaces/basetxreceipt/).[`bitvector`](/reference/tevm/vm/interfaces/basetxreceipt/#bitvector)

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L14)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[`BaseTxReceipt`](/reference/tevm/vm/interfaces/basetxreceipt/).[`cumulativeBlockGasUsed`](/reference/tevm/vm/interfaces/basetxreceipt/#cumulativeblockgasused)

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L10)

***

### logs

> **logs**: [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

Logs emitted

#### Inherited from

[`BaseTxReceipt`](/reference/tevm/vm/interfaces/basetxreceipt/).[`logs`](/reference/tevm/vm/interfaces/basetxreceipt/#logs)

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L18)

***

### status

> **status**: `0` \| `1`

Status of transaction, `1` if successful, `0` if an exception occurred

#### Defined in

[packages/vm/src/utils/PostByzantiumTxReceipt.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/PostByzantiumTxReceipt.ts#L11)
