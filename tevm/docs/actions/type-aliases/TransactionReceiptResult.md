[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [actions](../README.md) / TransactionReceiptResult

# Type Alias: TransactionReceiptResult

> **TransactionReceiptResult**: `object`

Transaction receipt result type for eth JSON-RPC procedures

## Type declaration

### blobGasPrice?

> `readonly` `optional` **blobGasPrice**: `bigint`

### blobGasUsed?

> `readonly` `optional` **blobGasUsed**: `bigint`

### blockHash

> `readonly` **blockHash**: [`Hex`](Hex.md)

### blockNumber

> `readonly` **blockNumber**: `bigint`

### contractAddress

> `readonly` **contractAddress**: [`Hex`](Hex.md)

### cumulativeGasUsed

> `readonly` **cumulativeGasUsed**: `bigint`

### from

> `readonly` **from**: [`Hex`](Hex.md)

### gasUsed

> `readonly` **gasUsed**: `bigint`

### logs

> `readonly` **logs**: readonly [`FilterLog`](FilterLog.md)[]

### logsBloom

> `readonly` **logsBloom**: [`Hex`](Hex.md)

### status

> `readonly` **status**: [`Hex`](Hex.md)

### to

> `readonly` **to**: [`Hex`](Hex.md)

### transactionHash

> `readonly` **transactionHash**: [`Hex`](Hex.md)

### transactionIndex

> `readonly` **transactionIndex**: `bigint`

## Defined in

packages/actions/types/common/TransactionReceiptResult.d.ts:6
