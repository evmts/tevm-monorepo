[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / PostByzantiumTxReceipt

# Interface: PostByzantiumTxReceipt

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:32

Receipt type for Byzantium and beyond (EIP-658)
Replaces the intermediary state root field with a status code field
Introduced in the Byzantium hard fork

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Extended by

- [`EIP4844BlobTxReceipt`](EIP4844BlobTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:20

Bloom filter bitvector containing indexed log data
Used for efficient searching of logs in the blockchain

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:15

Cumulative gas used in the block including this transaction
Represented as a bigint to handle large gas values accurately

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused)

***

### logs

> **logs**: [`Log`](../../evm/type-aliases/Log.md)[]

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:25

Array of logs emitted during transaction execution
Each log contains address, topics, and data fields

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs)

***

### status

> **status**: `0` \| `1`

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:38

Status of transaction execution
- `1` if successful
- `0` if an exception occurred during execution
