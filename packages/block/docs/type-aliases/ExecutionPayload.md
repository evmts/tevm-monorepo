**@tevm/block** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ExecutionPayload

# Type alias: ExecutionPayload

> **ExecutionPayload**: `object`

## Type declaration

### baseFeePerGas

> **baseFeePerGas**: `Hex` \| `string`

### blobGasUsed

> **blobGasUsed**?: `Hex` \| `string`

### blockHash

> **blockHash**: `Hex` \| `string`

### blockNumber

> **blockNumber**: `Hex` \| `string`

### excessBlobGas

> **excessBlobGas**?: `Hex` \| `string`

### executionWitness

> **executionWitness**?: [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) \| `null`

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

### parentBeaconBlockRoot

> **parentBeaconBlockRoot**?: `Hex` \| `string`

### parentHash

> **parentHash**: `Hex` \| `string`

### prevRandao

> **prevRandao**: `Hex` \| `string`

### receiptsRoot

> **receiptsRoot**: `Hex` \| `string`

### requestsRoot

> **requestsRoot**?: `Hex` \| `string` \| `null`

### stateRoot

> **stateRoot**: `Hex` \| `string`

### timestamp

> **timestamp**: `Hex` \| `string`

### transactions

> **transactions**: `Hex`[] \| `string`[]

### withdrawals

> **withdrawals**?: [`WithdrawalV1`](WithdrawalV1.md)[]

## Source

[types.ts:263](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L263)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
