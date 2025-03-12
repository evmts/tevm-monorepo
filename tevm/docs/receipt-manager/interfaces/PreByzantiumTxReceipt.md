[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / PreByzantiumTxReceipt

# Interface: PreByzantiumTxReceipt

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:44

Pre-Byzantium receipt type used before the Byzantium hard fork
Contains a state root field instead of the status code used in later versions

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:20

Bloom filter bitvector containing indexed log data
Used for efficient searching of logs in the blockchain

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:15

Cumulative gas used in the block including this transaction
Represented as a bigint to handle large gas values accurately

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused)

***

### logs

> **logs**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[]

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:25

Array of logs emitted during transaction execution
Each log contains address, topics, and data fields

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs)

***

### stateRoot

> **stateRoot**: `Uint8Array`

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:49

Intermediary state root after transaction execution
This is a 32-byte Merkle root of the state trie
