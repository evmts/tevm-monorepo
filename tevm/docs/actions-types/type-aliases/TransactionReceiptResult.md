**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > TransactionReceiptResult

# Type alias: TransactionReceiptResult

> **TransactionReceiptResult**: `object`

Transaction receipt result type for eth JSON-RPC procedures

## Type declaration

### blockHash

> **`readonly`** **blockHash**: [`Hex`](../../index/type-aliases/Hex.md)

### blockNumber

> **`readonly`** **blockNumber**: [`Hex`](../../index/type-aliases/Hex.md)

### contractAddress

> **`readonly`** **contractAddress**: [`Hex`](../../index/type-aliases/Hex.md)

### cumulativeGasUsed

> **`readonly`** **cumulativeGasUsed**: [`Hex`](../../index/type-aliases/Hex.md)

### from

> **`readonly`** **from**: [`Hex`](../../index/type-aliases/Hex.md)

### gasUsed

> **`readonly`** **gasUsed**: [`Hex`](../../index/type-aliases/Hex.md)

### logs

> **`readonly`** **logs**: readonly [`FilterLog`](FilterLog.md)[]

### logsBloom

> **`readonly`** **logsBloom**: [`Hex`](../../index/type-aliases/Hex.md)

### status

> **`readonly`** **status**: [`Hex`](../../index/type-aliases/Hex.md)

### to

> **`readonly`** **to**: [`Hex`](../../index/type-aliases/Hex.md)

### transactionHash

> **`readonly`** **transactionHash**: [`Hex`](../../index/type-aliases/Hex.md)

### transactionIndex

> **`readonly`** **transactionIndex**: [`Hex`](../../index/type-aliases/Hex.md)

## Source

packages/actions-types/types/common/TransactionReceiptResult.d.ts:6

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
