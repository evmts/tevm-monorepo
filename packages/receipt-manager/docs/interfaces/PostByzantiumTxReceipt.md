[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / PostByzantiumTxReceipt

# Interface: PostByzantiumTxReceipt

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L47)

Receipt type for Byzantium and beyond (EIP-658)
Replaces the intermediary state root field with a status code field
Introduced in the Byzantium hard fork

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Extended by

- [`EIP4844BlobTxReceipt`](EIP4844BlobTxReceipt.md)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` | Bloom filter bitvector containing indexed log data Used for efficient searching of logs in the blockchain | [`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector) | [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L33) |
| <a id="cumulativeblockgasused"></a> `cumulativeBlockGasUsed` | `bigint` | Cumulative gas used in the block including this transaction Represented as a bigint to handle large gas values accurately | [`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused) | [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L27) |
| <a id="logs"></a> `logs` | `ReceiptLog`[] | Array of logs emitted during transaction execution Each log contains address, topics, and data fields | [`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs) | [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L39) |
| <a id="status"></a> `status` | `0` \| `1` | Status of transaction execution - `1` if successful - `0` if an exception occurred during execution | - | [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L53) |
