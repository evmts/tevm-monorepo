[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / ExecutionPayload

# Type Alias: ExecutionPayload

> **ExecutionPayload**: `object`

Defined in: [packages/block/src/types.ts:575](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L575)

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
