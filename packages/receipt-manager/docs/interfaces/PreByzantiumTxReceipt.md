[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / PreByzantiumTxReceipt

# Interface: PreByzantiumTxReceipt

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L60)

Pre-Byzantium receipt type used before the Byzantium hard fork
Contains a state root field instead of the status code used in later versions

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` | Bloom filter bitvector containing indexed log data Used for efficient searching of logs in the blockchain | [`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector) | [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L33) |
| <a id="cumulativeblockgasused"></a> `cumulativeBlockGasUsed` | `bigint` | Cumulative gas used in the block including this transaction Represented as a bigint to handle large gas values accurately | [`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused) | [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L27) |
| <a id="logs"></a> `logs` | `ReceiptLog`[] | Array of logs emitted during transaction execution Each log contains address, topics, and data fields | [`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs) | [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L39) |
| <a id="stateroot"></a> `stateRoot` | `Uint8Array` | Intermediary state root after transaction execution This is a 32-byte Merkle root of the state trie | - | [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L65) |
