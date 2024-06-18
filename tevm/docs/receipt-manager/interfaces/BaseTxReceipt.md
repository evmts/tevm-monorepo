[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / BaseTxReceipt

# Interface: BaseTxReceipt

Abstract interface with common transaction receipt fields

## Extended by

- [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)
- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Bloom bitvector

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:17

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:13

***

### logs

> **logs**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[]

Logs emitted

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:21
