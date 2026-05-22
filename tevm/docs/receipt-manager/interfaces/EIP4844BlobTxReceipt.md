[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / EIP4844BlobTxReceipt

# Interface: EIP4844BlobTxReceipt

Receipt type for EIP-4844 blob transactions
Extends the post-Byzantium receipt with additional blob gas fields

## Extends

- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` | Bloom filter bitvector containing indexed log data Used for efficient searching of logs in the blockchain | [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`bitvector`](PostByzantiumTxReceipt.md#bitvector) |
| <a id="blobgasprice"></a> `blobGasPrice` | `bigint` | Price of blob gas for the block the transaction was included in Note: This value is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block and is only provided as part of receipt metadata. | - |
| <a id="blobgasused"></a> `blobGasUsed` | `bigint` | Amount of blob gas consumed by the transaction Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block and is only provided as part of receipt metadata. | - |
| <a id="cumulativeblockgasused"></a> `cumulativeBlockGasUsed` | `bigint` | Cumulative gas used in the block including this transaction Represented as a bigint to handle large gas values accurately | [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`cumulativeBlockGasUsed`](PostByzantiumTxReceipt.md#cumulativeblockgasused) |
| <a id="logs"></a> `logs` | [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[] | Array of logs emitted during transaction execution Each log contains address, topics, and data fields | [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`logs`](PostByzantiumTxReceipt.md#logs) |
| <a id="status"></a> `status` | `0` \| `1` | Status of transaction execution - `1` if successful - `0` if an exception occurred during execution | [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`status`](PostByzantiumTxReceipt.md#status) |
