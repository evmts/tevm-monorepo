[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / BaseTxReceipt

# Interface: BaseTxReceipt

Defined in: packages/vm/types/utils/BaseTxReceipt.d.ts:5

Abstract interface with common transaction receipt fields

## Extended by

- [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)
- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: packages/vm/types/utils/BaseTxReceipt.d.ts:13

Bloom bitvector

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: packages/vm/types/utils/BaseTxReceipt.d.ts:9

Cumulative gas used in the block including this tx

***

### logs

> **logs**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[]

Defined in: packages/vm/types/utils/BaseTxReceipt.d.ts:17

Logs emitted
