**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > TransactionReceiptResult

# Type alias: TransactionReceiptResult

> **TransactionReceiptResult**: `object`

Transaction receipt result type for eth JSON-RPC procedures

## Type declaration

### blobGasPrice

> **`readonly`** **blobGasPrice**: `bigint`

### blobGasUsed

> **`readonly`** **blobGasUsed**: `bigint`

### blockHash

> **`readonly`** **blockHash**: [`Hex`](Hex.md)

### blockNumber

> **`readonly`** **blockNumber**: `bigint`

### contractAddress

> **`readonly`** **contractAddress**: [`Hex`](Hex.md)

### cumulativeGasUsed

> **`readonly`** **cumulativeGasUsed**: `bigint`

### from

> **`readonly`** **from**: [`Hex`](Hex.md)

### gasUsed

> **`readonly`** **gasUsed**: `bigint`

### logs

> **`readonly`** **logs**: readonly [`FilterLog`](FilterLog.md)[]

### logsBloom

> **`readonly`** **logsBloom**: [`Hex`](Hex.md)

### status

> **`readonly`** **status**: [`Hex`](Hex.md)

### to

> **`readonly`** **to**: [`Hex`](Hex.md)

### transactionHash

> **`readonly`** **transactionHash**: [`Hex`](Hex.md)

### transactionIndex

> **`readonly`** **transactionIndex**: `bigint`

## Source

packages/actions-types/types/common/TransactionReceiptResult.d.ts:6

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
