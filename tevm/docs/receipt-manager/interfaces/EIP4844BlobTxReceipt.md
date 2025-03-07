[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / EIP4844BlobTxReceipt

# Interface: EIP4844BlobTxReceipt

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:43

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Extends

- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:17

Bloom bitvector

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`bitvector`](PostByzantiumTxReceipt.md#bitvector)

***

### blobGasPrice

> **blobGasPrice**: `bigint`

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:57

blob gas price for block transaction was included in

Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
and is only provided as part of receipt metadata.

***

### blobGasUsed

> **blobGasUsed**: `bigint`

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:50

blob gas consumed by a transaction

Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
and is only provided as part of receipt metadata.

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:13

Cumulative gas used in the block including this tx

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`cumulativeBlockGasUsed`](PostByzantiumTxReceipt.md#cumulativeblockgasused)

***

### logs

> **logs**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[]

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:21

Logs emitted

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`logs`](PostByzantiumTxReceipt.md#logs)

***

### status

> **status**: `0` \| `1`

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:31

Status of transaction, `1` if successful, `0` if an exception occurred

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`status`](PostByzantiumTxReceipt.md#status)
