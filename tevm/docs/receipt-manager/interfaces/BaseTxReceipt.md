[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / BaseTxReceipt

# Interface: BaseTxReceipt

Abstract interface with common transaction receipt fields that all receipt types share
This serves as the base for both pre and post-Byzantium transaction receipts

## Extended by

- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)
- [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` | Bloom filter bitvector containing indexed log data Used for efficient searching of logs in the blockchain |
| <a id="cumulativeblockgasused"></a> `cumulativeBlockGasUsed` | `bigint` | Cumulative gas used in the block including this transaction Represented as a bigint to handle large gas values accurately |
| <a id="logs"></a> `logs` | [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[] | Array of logs emitted during transaction execution Each log contains address, topics, and data fields |
