[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / ExecutionPayload

# Type Alias: ExecutionPayload

> **ExecutionPayload**: `object`

Defined in: packages/block/types/types.d.ts:548

Represents the execution layer data of an Ethereum block

Introduced with The Merge (Paris fork), the ExecutionPayload is passed between
the consensus layer and execution layer as part of the Engine API. It contains
all the information needed for transaction execution and state updates.

The structure has evolved over time with various Ethereum upgrades:
- The Merge (Paris): Basic structure with transactions
- Shanghai: Added withdrawals field
- Cancun: Added blobGasUsed, excessBlobGas, parentBeaconBlockRoot
- Prague (planned): Will add verkle-related fields

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

## See

https://github.com/ethereum/execution-apis/blob/main/src/engine/shanghai.md

## Example

```typescript
import { ExecutionPayload } from '@tevm/block'

// Engine API handler receiving a payload from the consensus layer
async function handleNewPayload(payload: ExecutionPayload): Promise<{status: string}> {
  // Validate the payload
  const validationResult = await validateExecutionPayload(payload)

  if (validationResult.valid) {
    // Execute transactions and update state
    await executeTransactions(payload.transactions)

    // Process withdrawals if present
    if (payload.withdrawals) {
      await processWithdrawals(payload.withdrawals)
    }

    return { status: 'VALID' }
  } else {
    return { status: 'INVALID', validationError: validationResult.error }
  }
}
```
