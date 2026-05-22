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

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` | Bloom filter bitvector containing indexed log data Used for efficient searching of logs in the blockchain | [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L33) |
| <a id="cumulativeblockgasused"></a> `cumulativeBlockGasUsed` | `bigint` | Cumulative gas used in the block including this transaction Represented as a bigint to handle large gas values accurately | [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L27) |
| <a id="logs"></a> `logs` | `ReceiptLog`[] | Array of logs emitted during transaction execution Each log contains address, topics, and data fields | [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L39) |
