[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / BaseTxReceipt

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

[packages/vm/src/utils/types.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L24)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Source

[packages/vm/src/utils/types.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L20)

***

### logs

> **logs**: `Log`[]

Logs emitted

#### Source

[packages/vm/src/utils/types.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L28)
