**@tevm/blockchain** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > BaseTxReceipt

# Interface: BaseTxReceipt

Abstract interface with common transaction receipt fields

## Extended By

- [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)
- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Bloom bitvector

#### Source

[RecieptManager.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L25)

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Cumulative gas used in the block including this tx

#### Source

[RecieptManager.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L21)

***

### logs

> **logs**: `Log`[]

Logs emitted

#### Source

[RecieptManager.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L29)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
