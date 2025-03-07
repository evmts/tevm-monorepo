[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / ExecutionPayload

# Type Alias: ExecutionPayload

> **ExecutionPayload**: `object`

Defined in: packages/block/types/types.d.ts:236

## Type declaration

### baseFeePerGas

> **baseFeePerGas**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### blobGasUsed?

> `optional` **blobGasUsed**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### blockHash

> **blockHash**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### blockNumber

> **blockNumber**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### excessBlobGas?

> `optional` **excessBlobGas**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### executionWitness?

> `optional` **executionWitness**: [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) \| `null`

### extraData

> **extraData**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### feeRecipient

> **feeRecipient**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### gasLimit

> **gasLimit**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### gasUsed

> **gasUsed**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### logsBloom

> **logsBloom**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### parentHash

> **parentHash**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### prevRandao

> **prevRandao**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### receiptsRoot

> **receiptsRoot**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### requestsRoot?

> `optional` **requestsRoot**: [`Hex`](../../index/type-aliases/Hex.md) \| `string` \| `null`

### stateRoot

> **stateRoot**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### timestamp

> **timestamp**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

### transactions

> **transactions**: [`Hex`](../../index/type-aliases/Hex.md)[] \| `string`[]

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalV1`](WithdrawalV1.md)[]
