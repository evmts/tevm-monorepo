[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / BaseTxReceipt

# Interface: BaseTxReceipt

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:10

Abstract interface with common transaction receipt fields that all receipt types share
This serves as the base for both pre and post-Byzantium transaction receipts

## Extended by

- [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)
- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:20

Bloom filter bitvector containing indexed log data
Used for efficient searching of logs in the blockchain

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:15

Cumulative gas used in the block including this transaction
Represented as a bigint to handle large gas values accurately

***

### logs

> **logs**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[]

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:25

Array of logs emitted during transaction execution
Each log contains address, topics, and data fields
