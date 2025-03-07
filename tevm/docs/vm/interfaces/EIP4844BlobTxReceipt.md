[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / EIP4844BlobTxReceipt

# Interface: EIP4844BlobTxReceipt

Defined in: packages/vm/types/utils/EIP4844BlobTxReceipt.d.ts:2

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Extends

- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: packages/vm/types/utils/BaseTxReceipt.d.ts:13

Bloom bitvector

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`bitvector`](PostByzantiumTxReceipt.md#bitvector)

***

### blobGasPrice

> **blobGasPrice**: `bigint`

Defined in: packages/vm/types/utils/EIP4844BlobTxReceipt.d.ts:16

blob gas price for block transaction was included in

Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
and is only provided as part of receipt metadata.

***

### blobGasUsed

> **blobGasUsed**: `bigint`

Defined in: packages/vm/types/utils/EIP4844BlobTxReceipt.d.ts:9

blob gas consumed by a transaction

Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
and is only provided as part of receipt metadata.

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: packages/vm/types/utils/BaseTxReceipt.d.ts:9

Cumulative gas used in the block including this tx

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`cumulativeBlockGasUsed`](PostByzantiumTxReceipt.md#cumulativeblockgasused)

***

### logs

> **logs**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[]

Defined in: packages/vm/types/utils/BaseTxReceipt.d.ts:17

Logs emitted

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`logs`](PostByzantiumTxReceipt.md#logs)

***

### status

> **status**: `0` \| `1`

Defined in: packages/vm/types/utils/PostByzantiumTxReceipt.d.ts:10

Status of transaction, `1` if successful, `0` if an exception occurred

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`status`](PostByzantiumTxReceipt.md#status)
