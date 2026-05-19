[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / BaseTxReceipt

# Interface: BaseTxReceipt

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L22)

Abstract interface with common transaction receipt fields that all receipt types share
This serves as the base for both pre and post-Byzantium transaction receipts

## Extended by

- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)
- [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L33)

Bloom filter bitvector containing indexed log data
Used for efficient searching of logs in the blockchain

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L27)

Cumulative gas used in the block including this transaction
Represented as a bigint to handle large gas values accurately

***

### logs

> **logs**: `ReceiptLog`[]

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L39)

Array of logs emitted during transaction execution
Each log contains address, topics, and data fields
