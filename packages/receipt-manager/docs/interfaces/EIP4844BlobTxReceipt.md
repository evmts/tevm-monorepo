[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / EIP4844BlobTxReceipt

# Interface: EIP4844BlobTxReceipt

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L72)

Receipt type for EIP-4844 blob transactions
Extends the post-Byzantium receipt with additional blob gas fields

## Extends

- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L33)

Bloom filter bitvector containing indexed log data
Used for efficient searching of logs in the blockchain

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`bitvector`](PostByzantiumTxReceipt.md#bitvector)

***

### blobGasPrice

> **blobGasPrice**: `bigint`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:87](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L87)

Price of blob gas for the block the transaction was included in

Note: This value is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
and is only provided as part of receipt metadata.

***

### blobGasUsed

> **blobGasUsed**: `bigint`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L79)

Amount of blob gas consumed by the transaction

Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
and is only provided as part of receipt metadata.

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L27)

Cumulative gas used in the block including this transaction
Represented as a bigint to handle large gas values accurately

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`cumulativeBlockGasUsed`](PostByzantiumTxReceipt.md#cumulativeblockgasused)

***

### logs

> **logs**: `ReceiptLog`[]

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L39)

Array of logs emitted during transaction execution
Each log contains address, topics, and data fields

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`logs`](PostByzantiumTxReceipt.md#logs)

***

### status

> **status**: `0` \| `1`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L53)

Status of transaction execution
- `1` if successful
- `0` if an exception occurred during execution

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`status`](PostByzantiumTxReceipt.md#status)
