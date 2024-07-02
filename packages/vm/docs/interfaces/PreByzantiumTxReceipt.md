[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / PreByzantiumTxReceipt

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

[packages/vm/src/utils/BaseTxReceipt.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L14)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused)

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L10)

***

### logs

> **logs**: `Log`[]

Logs emitted

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs)

#### Defined in

[packages/vm/src/utils/BaseTxReceipt.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L18)

***

### stateRoot

> **stateRoot**: `Uint8Array`

Intermediary state root

#### Defined in

[packages/vm/src/utils/PrebyzantiumTxReceipt.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/PrebyzantiumTxReceipt.ts#L11)
