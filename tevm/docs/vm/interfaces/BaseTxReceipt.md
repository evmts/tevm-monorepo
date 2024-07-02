[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / BaseTxReceipt

# Interface: BaseTxReceipt

Abstract interface with common transaction receipt fields

## Extended by

- [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)
- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Bloom bitvector

#### Defined in

packages/vm/types/utils/BaseTxReceipt.d.ts:13

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Defined in

packages/vm/types/utils/BaseTxReceipt.d.ts:9

***

### logs

> **logs**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[]

Logs emitted

#### Defined in

packages/vm/types/utils/BaseTxReceipt.d.ts:17
