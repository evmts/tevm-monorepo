[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / PreByzantiumTxReceipt

# Interface: PreByzantiumTxReceipt

Pre-Byzantium receipt type used before the Byzantium hard fork
Contains a state root field instead of the status code used in later versions

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` | Bloom filter bitvector containing indexed log data Used for efficient searching of logs in the blockchain | [`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector) |
| <a id="cumulativeblockgasused"></a> `cumulativeBlockGasUsed` | `bigint` | Cumulative gas used in the block including this transaction Represented as a bigint to handle large gas values accurately | [`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused) |
| <a id="logs"></a> `logs` | [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[] | Array of logs emitted during transaction execution Each log contains address, topics, and data fields | [`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs) |
| <a id="stateroot"></a> `stateRoot` | `Uint8Array` | Intermediary state root after transaction execution This is a 32-byte Merkle root of the state trie | - |
