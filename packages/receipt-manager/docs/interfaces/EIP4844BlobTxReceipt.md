[**@tevm/receipt-manager**](../README.md) • **Docs**

***

[@tevm/receipt-manager](../globals.md) / EIP4844BlobTxReceipt

# Interface: EIP4844BlobTxReceipt

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Extends

- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Bloom bitvector

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`bitvector`](PostByzantiumTxReceipt.md#bitvector)

#### Defined in

[RecieptManager.ts:24](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L24)

***

### blobGasPrice

> **blobGasPrice**: `bigint`

blob gas price for block transaction was included in

Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
and is only provided as part of receipt metadata.

#### Defined in

[RecieptManager.ts:64](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L64)

***

### blobGasUsed

> **blobGasUsed**: `bigint`

blob gas consumed by a transaction

Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
and is only provided as part of receipt metadata.

#### Defined in

[RecieptManager.ts:57](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L57)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`cumulativeBlockGasUsed`](PostByzantiumTxReceipt.md#cumulativeblockgasused)

#### Defined in

[RecieptManager.ts:20](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L20)

***

### logs

> **logs**: `Log`[]

Logs emitted

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`logs`](PostByzantiumTxReceipt.md#logs)

#### Defined in

[RecieptManager.ts:28](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L28)

***

### status

> **status**: `0` \| `1`

Status of transaction, `1` if successful, `0` if an exception occurred

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`status`](PostByzantiumTxReceipt.md#status)

#### Defined in

[RecieptManager.ts:38](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L38)
