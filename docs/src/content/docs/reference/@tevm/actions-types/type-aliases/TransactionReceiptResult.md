---
editUrl: false
next: false
prev: false
title: "TransactionReceiptResult"
---

> **TransactionReceiptResult**: `object`

Transaction receipt result type for eth JSON-RPC procedures

## Type declaration

### blockHash

> **`readonly`** **blockHash**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### blockNumber

> **`readonly`** **blockNumber**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### contractAddress

> **`readonly`** **contractAddress**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### cumulativeGasUsed

> **`readonly`** **cumulativeGasUsed**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### from

> **`readonly`** **from**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### gasUsed

> **`readonly`** **gasUsed**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### logs

> **`readonly`** **logs**: readonly [`FilterLog`](/reference/tevm/actions-types/type-aliases/filterlog/)[]

### logsBloom

> **`readonly`** **logsBloom**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### status

> **`readonly`** **status**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### to

> **`readonly`** **to**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### transactionHash

> **`readonly`** **transactionHash**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### transactionIndex

> **`readonly`** **transactionIndex**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

## Source

[common/TransactionReceiptResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/TransactionReceiptResult.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
