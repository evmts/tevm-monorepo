[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / ExecutionPayload

# Type Alias: ExecutionPayload

> **ExecutionPayload** = `object`

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

## Properties

### baseFeePerGas

> **baseFeePerGas**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:560

***

### blobGasUsed?

> `optional` **blobGasUsed**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:564

***

### blockHash

> **blockHash**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:561

***

### blockNumber

> **blockNumber**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:555

***

### excessBlobGas?

> `optional` **excessBlobGas**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:565

***

### executionWitness?

> `optional` **executionWitness**: [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) \| `null`

Defined in: packages/block/types/types.d.ts:567

***

### extraData

> **extraData**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:559

***

### feeRecipient

> **feeRecipient**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:550

***

### gasLimit

> **gasLimit**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:556

***

### gasUsed

> **gasUsed**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:557

***

### logsBloom

> **logsBloom**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:553

***

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:566

***

### parentHash

> **parentHash**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:549

***

### prevRandao

> **prevRandao**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:554

***

### receiptsRoot

> **receiptsRoot**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:552

***

### requestsRoot?

> `optional` **requestsRoot**: [`Hex`](../../index/type-aliases/Hex.md) \| `string` \| `null`

Defined in: packages/block/types/types.d.ts:568

***

### stateRoot

> **stateRoot**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:551

***

### timestamp

> **timestamp**: [`Hex`](../../index/type-aliases/Hex.md) \| `string`

Defined in: packages/block/types/types.d.ts:558

***

### transactions

> **transactions**: [`Hex`](../../index/type-aliases/Hex.md)[] \| `string`[]

Defined in: packages/block/types/types.d.ts:562

***

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalV1`](WithdrawalV1.md)[]

Defined in: packages/block/types/types.d.ts:563
