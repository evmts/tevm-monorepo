[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / PostByzantiumTxReceipt

# Interface: PostByzantiumTxReceipt

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Extended by

- [`EIP4844BlobTxReceipt`](EIP4844BlobTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Bloom bitvector

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector)

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:17

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused)

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:13

***

### logs

> **logs**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[]

Logs emitted

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs)

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:21

***

### status

> **status**: `0` \| `1`

Status of transaction, `1` if successful, `0` if an exception occurred

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:31