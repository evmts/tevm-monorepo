[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / PostByzantiumTxReceipt

# Interface: PostByzantiumTxReceipt

Defined in: packages/vm/types/utils/PostByzantiumTxReceipt.d.ts:6

Receipt type for Byzantium and beyond replacing the intermediary
state root field with a status code field (EIP-658)

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Extended by

- [`EIP4844BlobTxReceipt`](EIP4844BlobTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: packages/vm/types/utils/BaseTxReceipt.d.ts:13

Bloom bitvector

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: packages/vm/types/utils/BaseTxReceipt.d.ts:9

Cumulative gas used in the block including this tx

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused)

***

### logs

> **logs**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[]

Defined in: packages/vm/types/utils/BaseTxReceipt.d.ts:17

Logs emitted

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs)

***

### status

> **status**: `0` \| `1`

Defined in: packages/vm/types/utils/PostByzantiumTxReceipt.d.ts:10

Status of transaction, `1` if successful, `0` if an exception occurred
