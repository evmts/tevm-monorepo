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

> `readonly` `optional` **blobGasPrice**: `bigint`

### blobGasUsed?

> `readonly` `optional` **blobGasUsed**: `bigint`

### blockHash

> `readonly` **blockHash**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### blockNumber

> `readonly` **blockNumber**: `bigint`

### contractAddress

> `readonly` **contractAddress**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### cumulativeGasUsed

> `readonly` **cumulativeGasUsed**: `bigint`

### from

> `readonly` **from**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### gasUsed

> `readonly` **gasUsed**: `bigint`

### logs

> `readonly` **logs**: readonly [`FilterLog`](/reference/tevm/actions/type-aliases/filterlog/)[]

### logsBloom

> `readonly` **logsBloom**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### status

> `readonly` **status**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### to

> `readonly` **to**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### transactionHash

> `readonly` **transactionHash**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### transactionIndex

> `readonly` **transactionIndex**: `bigint`

## Defined in

[packages/actions/src/common/TransactionReceiptResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionReceiptResult.ts#L7)
