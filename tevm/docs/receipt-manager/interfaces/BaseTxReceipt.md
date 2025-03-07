[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / BaseTxReceipt

# Interface: BaseTxReceipt

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:9

Abstract interface with common transaction receipt fields

## Extended by

- [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)
- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:17

Bloom bitvector

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:13

Cumulative gas used in the block including this tx

***

### logs

> **logs**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[]

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:21

Logs emitted
