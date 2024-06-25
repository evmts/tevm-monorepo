[**@tevm/receipt-manager**](../README.md) • **Docs**

***

[@tevm/receipt-manager](../globals.md) / PreByzantiumTxReceipt

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

[RecieptManager.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L24)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused)

#### Defined in

[RecieptManager.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L20)

***

### logs

> **logs**: `Log`[]

Logs emitted

#### Inherited from

[`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs)

#### Defined in

[RecieptManager.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L28)

***

### stateRoot

> **stateRoot**: `Uint8Array`

Intermediary state root

#### Defined in

[RecieptManager.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L48)
