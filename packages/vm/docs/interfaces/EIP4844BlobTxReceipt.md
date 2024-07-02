[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / EIP4844BlobTxReceipt

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

[packages/vm/src/utils/BaseTxReceipt.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L14)

***

### blobGasPrice

> **blobGasPrice**: `bigint`

blob gas price for block transaction was included in

Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
and is only provided as part of receipt metadata.

#### Defined in

[packages/vm/src/utils/EIP4844BlobTxReceipt.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/EIP4844BlobTxReceipt.ts#L17)

***

### blobGasUsed

> **blobGasUsed**: `bigint`

blob gas consumed by a transaction

Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
and is only provided as part of receipt metadata.

#### Defined in

[packages/vm/src/utils/EIP4844BlobTxReceipt.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/EIP4844BlobTxReceipt.ts#L10)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`cumulativeBlockGasUsed`](PostByzantiumTxReceipt.md#cumulativeblockgasused)

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L10)

***

### logs

> **logs**: `Log`[]

Logs emitted

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`logs`](PostByzantiumTxReceipt.md#logs)

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L18)

***

### status

> **status**: `0` \| `1`

Status of transaction, `1` if successful, `0` if an exception occurred

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`status`](PostByzantiumTxReceipt.md#status)

#### Defined in

[packages/vm/src/utils/PostByzantiumTxReceipt.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/PostByzantiumTxReceipt.ts#L11)
