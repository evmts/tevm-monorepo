[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [node](../README.md) / FilterLog

# Type Alias: FilterLog

> **FilterLog** = `object`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:270

Log entry stored in a filter
Uses bigint for blockNumber, logIndex, and transactionIndex for consistency with TEVM's internal types

## Properties

### address

> **address**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:274

Address that emitted the log

***

### blockHash

> **blockHash**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:278

Block hash containing the log

***

### blockNumber

> **blockNumber**: `bigint`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:282

Block number containing the log

***

### data

> **data**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:286

Non-indexed log data

***

### logIndex

> **logIndex**: `bigint`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:290

Index of the log within the block

***

### removed

> **removed**: `boolean`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:294

Whether the log was removed due to a chain reorganization

***

### topics

> **topics**: \[[`Hex`](../../index/type-aliases/Hex.md), `...Hex[]`\]

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:298

Indexed log topics

***

### transactionHash

> **transactionHash**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:302

Transaction hash that created the log

***

### transactionIndex

> **transactionIndex**: `bigint`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:306

Index of the transaction within the block
