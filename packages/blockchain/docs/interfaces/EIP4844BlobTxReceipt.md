**@tevm/blockchain** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > EIP4844BlobTxReceipt

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

#### Source

[RecieptManager.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L25)

***

### blobGasPrice

> **blobGasPrice**: `bigint`

blob gas price for block transaction was included in

Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
and is only provided as part of receipt metadata.

#### Source

[RecieptManager.ts:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L65)

***

### blobGasUsed

> **blobGasUsed**: `bigint`

blob gas consumed by a transaction

Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
and is only provided as part of receipt metadata.

#### Source

[RecieptManager.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L58)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`cumulativeBlockGasUsed`](PostByzantiumTxReceipt.md#cumulativeblockgasused)

#### Source

[RecieptManager.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L21)

***

### logs

> **logs**: `Log`[]

Logs emitted

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`logs`](PostByzantiumTxReceipt.md#logs)

#### Source

[RecieptManager.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L29)

***

### status

> **status**: `0` \| `1`

Status of transaction, `1` if successful, `0` if an exception occurred

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`status`](PostByzantiumTxReceipt.md#status)

#### Source

[RecieptManager.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L39)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
