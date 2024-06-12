---
editUrl: false
next: false
prev: false
title: "TransactionReceiptResult"
---

> **TransactionReceiptResult**: `object`

Transaction receipt result type for eth JSON-RPC procedures

## Type declaration

### blobGasPrice?

> `optional` `readonly` **blobGasPrice**: `bigint`

### blobGasUsed?

> `optional` `readonly` **blobGasUsed**: `bigint`

### blockHash

> `readonly` **blockHash**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### blockNumber

> `readonly` **blockNumber**: `bigint`

### contractAddress

> `readonly` **contractAddress**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### cumulativeGasUsed

> `readonly` **cumulativeGasUsed**: `bigint`

### from

> `readonly` **from**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### gasUsed

> `readonly` **gasUsed**: `bigint`

### logs

> `readonly` **logs**: readonly [`FilterLog`](/reference/tevm/actions/type-aliases/filterlog-1/)[]

### logsBloom

> `readonly` **logsBloom**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### status

> `readonly` **status**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### to

> `readonly` **to**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### transactionHash

> `readonly` **transactionHash**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### transactionIndex

> `readonly` **transactionIndex**: `bigint`

## Source

[packages/actions/src/common/TransactionReceiptResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L7)
