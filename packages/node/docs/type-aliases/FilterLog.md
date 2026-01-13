[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / FilterLog

# Type Alias: FilterLog

> **FilterLog** = `object`

Defined in: [packages/node/src/Filter.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L13)

Log entry stored in a filter
Uses bigint for blockNumber, logIndex, and transactionIndex for consistency with TEVM's internal types

## Properties

### address

> **address**: `Hex`

Defined in: [packages/node/src/Filter.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L17)

Address that emitted the log

***

### blockHash

> **blockHash**: `Hex`

Defined in: [packages/node/src/Filter.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L21)

Block hash containing the log

***

### blockNumber

> **blockNumber**: `bigint`

Defined in: [packages/node/src/Filter.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L25)

Block number containing the log

***

### data

> **data**: `Hex`

Defined in: [packages/node/src/Filter.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L29)

Non-indexed log data

***

### logIndex

> **logIndex**: `bigint`

Defined in: [packages/node/src/Filter.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L33)

Index of the log within the block

***

### removed

> **removed**: `boolean`

Defined in: [packages/node/src/Filter.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L37)

Whether the log was removed due to a chain reorganization

***

### topics

> **topics**: \[`Hex`, `...Hex[]`\]

Defined in: [packages/node/src/Filter.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L41)

Indexed log topics

***

### transactionHash

> **transactionHash**: `Hex`

Defined in: [packages/node/src/Filter.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L45)

Transaction hash that created the log

***

### transactionIndex

> **transactionIndex**: `bigint`

Defined in: [packages/node/src/Filter.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L49)

Index of the transaction within the block
