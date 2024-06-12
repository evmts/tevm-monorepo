[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / TransactionReceiptResult

# Type alias: TransactionReceiptResult

> **TransactionReceiptResult**: `object`

Transaction receipt result type for eth JSON-RPC procedures

## Type declaration

### blobGasPrice?

> `optional` `readonly` **blobGasPrice**: `bigint`

### blobGasUsed?

> `optional` `readonly` **blobGasUsed**: `bigint`

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

## Source

[packages/actions/src/common/TransactionReceiptResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L7)
