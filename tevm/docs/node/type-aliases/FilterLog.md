[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [node](../README.md) / FilterLog

# Type Alias: FilterLog

> **FilterLog** = `object`

Defined in: packages/node/dist/index.d.ts:276

Log entry stored in a filter
Uses bigint for blockNumber, logIndex, and transactionIndex for consistency with TEVM's internal types

## Properties

### address

> **address**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/node/dist/index.d.ts:280

Address that emitted the log

***

### blockHash

> **blockHash**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/node/dist/index.d.ts:284

Block hash containing the log

***

### blockNumber

> **blockNumber**: `bigint`

Defined in: packages/node/dist/index.d.ts:288

Block number containing the log

***

### data

> **data**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/node/dist/index.d.ts:292

Non-indexed log data

***

### logIndex

> **logIndex**: `bigint`

Defined in: packages/node/dist/index.d.ts:296

Index of the log within the block

***

### removed

> **removed**: `boolean`

Defined in: packages/node/dist/index.d.ts:300

Whether the log was removed due to a chain reorganization

***

### topics

> **topics**: \[[`Hex`](../../index/type-aliases/Hex.md), `...Hex[]`\]

Defined in: packages/node/dist/index.d.ts:304

Indexed log topics

***

### transactionHash

> **transactionHash**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/node/dist/index.d.ts:308

Transaction hash that created the log

***

### transactionIndex

> **transactionIndex**: `bigint`

Defined in: packages/node/dist/index.d.ts:312

Index of the transaction within the block
