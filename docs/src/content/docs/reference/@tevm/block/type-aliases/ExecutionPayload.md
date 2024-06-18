---
editUrl: false
next: false
prev: false
title: "ExecutionPayload"
---

> **ExecutionPayload**: `object`

## Type declaration

### baseFeePerGas

> **baseFeePerGas**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### blobGasUsed?

> `optional` **blobGasUsed**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### blockHash

> **blockHash**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### blockNumber

> **blockNumber**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### excessBlobGas?

> `optional` **excessBlobGas**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### executionWitness?

> `optional` **executionWitness**: [`VerkleExecutionWitness`](/reference/tevm/block/interfaces/verkleexecutionwitness/) \| `null`

### extraData

> **extraData**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### feeRecipient

> **feeRecipient**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### gasLimit

> **gasLimit**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### gasUsed

> **gasUsed**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### logsBloom

> **logsBloom**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### parentHash

> **parentHash**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### prevRandao

> **prevRandao**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### receiptsRoot

> **receiptsRoot**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### requestsRoot?

> `optional` **requestsRoot**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string` \| `null`

### stateRoot

> **stateRoot**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### timestamp

> **timestamp**: [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `string`

### transactions

> **transactions**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)[] \| `string`[]

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalV1`](/reference/tevm/block/type-aliases/withdrawalv1/)[]

## Source

[types.ts:263](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L263)
