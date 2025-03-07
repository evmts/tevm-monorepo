[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / PreByzantiumTxReceipt

# Interface: PreByzantiumTxReceipt

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:37

Pre-Byzantium receipt type with a field
for the intermediary state root

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:17

Bloom bitvector

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:13

Cumulative gas used in the block including this tx

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused)

***

### logs

> **logs**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[]

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:21

Logs emitted

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs)

***

### stateRoot

> **stateRoot**: `Uint8Array`

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:41

Intermediary state root
