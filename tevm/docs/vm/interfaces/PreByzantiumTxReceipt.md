[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / PreByzantiumTxReceipt

# Interface: PreByzantiumTxReceipt

Defined in: packages/vm/types/utils/PrebyzantiumTxReceipt.d.ts:6

Pre-Byzantium receipt type with a field
for the intermediary state root

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

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

### stateRoot

> **stateRoot**: `Uint8Array`

Defined in: packages/vm/types/utils/PrebyzantiumTxReceipt.d.ts:10

Intermediary state root
