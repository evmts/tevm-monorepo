[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / ExecutionPayload

# Type Alias: ExecutionPayload

> **ExecutionPayload**: `object`

Defined in: [packages/block/src/types.ts:263](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L263)

## Type declaration

### baseFeePerGas

> **baseFeePerGas**: `Hex` \| `string`

### blobGasUsed?

> `optional` **blobGasUsed**: `Hex` \| `string`

### blockHash

> **blockHash**: `Hex` \| `string`

### blockNumber

> **blockNumber**: `Hex` \| `string`

### excessBlobGas?

> `optional` **excessBlobGas**: `Hex` \| `string`

### executionWitness?

> `optional` **executionWitness**: [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) \| `null`

### extraData

> **extraData**: `Hex` \| `string`

### feeRecipient

> **feeRecipient**: `Hex` \| `string`

### gasLimit

> **gasLimit**: `Hex` \| `string`

### gasUsed

> **gasUsed**: `Hex` \| `string`

### logsBloom

> **logsBloom**: `Hex` \| `string`

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `Hex` \| `string`

### parentHash

> **parentHash**: `Hex` \| `string`

### prevRandao

> **prevRandao**: `Hex` \| `string`

### receiptsRoot

> **receiptsRoot**: `Hex` \| `string`

### requestsRoot?

> `optional` **requestsRoot**: `Hex` \| `string` \| `null`

### stateRoot

> **stateRoot**: `Hex` \| `string`

### timestamp

> **timestamp**: `Hex` \| `string`

### transactions

> **transactions**: `Hex`[] \| `string`[]

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalV1`](WithdrawalV1.md)[]
