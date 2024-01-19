**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [api](../README.md) > TransactionReceiptResult

# Type alias: TransactionReceiptResult

> **TransactionReceiptResult**: `object`

Transaction receipt result type for eth JSON-RPC procedures

## Type declaration

### blockHash

> **`readonly`** **blockHash**: `Hex`

### blockNumber

> **`readonly`** **blockNumber**: `Hex`

### contractAddress

> **`readonly`** **contractAddress**: `Hex`

### cumulativeGasUsed

> **`readonly`** **cumulativeGasUsed**: `Hex`

### from

> **`readonly`** **from**: `Hex`

### gasUsed

> **`readonly`** **gasUsed**: `Hex`

### logs

> **`readonly`** **logs**: readonly [`FilterLog`](FilterLog.md)[]

### logsBloom

> **`readonly`** **logsBloom**: `Hex`

### status

> **`readonly`** **status**: `Hex`

### to

> **`readonly`** **to**: `Hex`

### transactionHash

> **`readonly`** **transactionHash**: `Hex`

### transactionIndex

> **`readonly`** **transactionIndex**: `Hex`

## Source

vm/api/dist/index.d.ts:670

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
