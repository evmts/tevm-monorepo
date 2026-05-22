[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / PostByzantiumTxReceipt

# Interface: PostByzantiumTxReceipt

Receipt type for Byzantium and beyond (EIP-658)
Replaces the intermediary state root field with a status code field
Introduced in the Byzantium hard fork

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Extended by

- [`EIP4844BlobTxReceipt`](EIP4844BlobTxReceipt.md)

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` | Bloom filter bitvector containing indexed log data Used for efficient searching of logs in the blockchain | [`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector) |
| <a id="cumulativeblockgasused"></a> `cumulativeBlockGasUsed` | `bigint` | Cumulative gas used in the block including this transaction Represented as a bigint to handle large gas values accurately | [`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused) |
| <a id="logs"></a> `logs` | [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[] | Array of logs emitted during transaction execution Each log contains address, topics, and data fields | [`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs) |
| <a id="status"></a> `status` | `0` \| `1` | Status of transaction execution - `1` if successful - `0` if an exception occurred during execution | - |
