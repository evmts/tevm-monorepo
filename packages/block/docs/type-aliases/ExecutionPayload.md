[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / ExecutionPayload

# Type Alias: ExecutionPayload

> **ExecutionPayload** = `object`

Defined in: packages/block/src/types.ts:575

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

> **baseFeePerGas**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:587

***

### blobGasUsed?

> `optional` **blobGasUsed**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:591

***

### blockHash

> **blockHash**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:588

***

### blockNumber

> **blockNumber**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:582

***

### excessBlobGas?

> `optional` **excessBlobGas**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:592

***

### executionWitness?

> `optional` **executionWitness**: [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) \| `null`

Defined in: packages/block/src/types.ts:595

***

### extraData

> **extraData**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:586

***

### feeRecipient

> **feeRecipient**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:577

***

### gasLimit

> **gasLimit**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:583

***

### gasUsed

> **gasUsed**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:584

***

### logsBloom

> **logsBloom**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:580

***

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:593

***

### parentHash

> **parentHash**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:576

***

### prevRandao

> **prevRandao**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:581

***

### receiptsRoot

> **receiptsRoot**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:579

***

### requestsRoot?

> `optional` **requestsRoot**: `Hex` \| `string` \| `null`

Defined in: packages/block/src/types.ts:596

***

### stateRoot

> **stateRoot**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:578

***

### timestamp

> **timestamp**: `Hex` \| `string`

Defined in: packages/block/src/types.ts:585

***

### transactions

> **transactions**: `Hex`[] \| `string`[]

Defined in: packages/block/src/types.ts:589

***

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalV1`](WithdrawalV1.md)[]

Defined in: packages/block/src/types.ts:590
