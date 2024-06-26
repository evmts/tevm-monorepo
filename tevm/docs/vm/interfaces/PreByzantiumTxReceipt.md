[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / PreByzantiumTxReceipt

# Interface: PreByzantiumTxReceipt

Pre-Byzantium receipt type with a field
for the intermediary state root

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Bloom bitvector

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector)

#### Defined in

packages/vm/types/utils/types.d.ts:22

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused)

#### Defined in

packages/vm/types/utils/types.d.ts:18

***

### logs

> **logs**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[]

Logs emitted

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs)

#### Defined in

packages/vm/types/utils/types.d.ts:26

***

### stateRoot

> **stateRoot**: `Uint8Array`

Intermediary state root

#### Defined in

packages/vm/types/utils/types.d.ts:36
