[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / BaseTxReceipt

# Interface: BaseTxReceipt

Defined in: [ReceiptManager.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L17)

Abstract interface with common transaction receipt fields that all receipt types share
This serves as the base for both pre and post-Byzantium transaction receipts

## Extended by

- [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)
- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: [ReceiptManager.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L28)

Bloom filter bitvector containing indexed log data
Used for efficient searching of logs in the blockchain

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: [ReceiptManager.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L22)

Cumulative gas used in the block including this transaction
Represented as a bigint to handle large gas values accurately

***

### logs

> **logs**: `Log`[]

Defined in: [ReceiptManager.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L34)

Array of logs emitted during transaction execution
Each log contains address, topics, and data fields
