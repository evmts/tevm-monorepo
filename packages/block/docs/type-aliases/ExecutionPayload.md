[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / ExecutionPayload

# Type Alias: ExecutionPayload

> **ExecutionPayload** = `object`

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

Defined in: [packages/block/src/types.ts:587](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L587)

***

### blobGasUsed?

> `optional` **blobGasUsed**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:591](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L591)

***

### blockHash

> **blockHash**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:588](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L588)

***

### blockNumber

> **blockNumber**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:582](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L582)

***

### excessBlobGas?

> `optional` **excessBlobGas**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:592](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L592)

***

### executionWitness?

> `optional` **executionWitness**: [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) \| `null`

Defined in: [packages/block/src/types.ts:595](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L595)

***

### extraData

> **extraData**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:586](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L586)

***

### feeRecipient

> **feeRecipient**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:577](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L577)

***

### gasLimit

> **gasLimit**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:583](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L583)

***

### gasUsed

> **gasUsed**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:584](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L584)

***

### logsBloom

> **logsBloom**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:580](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L580)

***

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:593](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L593)

***

### parentHash

> **parentHash**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:576](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L576)

***

### prevRandao

> **prevRandao**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:581](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L581)

***

### receiptsRoot

> **receiptsRoot**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:579](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L579)

***

### requestsRoot?

> `optional` **requestsRoot**: `Hex` \| `string` \| `null`

Defined in: [packages/block/src/types.ts:596](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L596)

***

### stateRoot

> **stateRoot**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:578](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L578)

***

### timestamp

> **timestamp**: `Hex` \| `string`

Defined in: [packages/block/src/types.ts:585](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L585)

***

### transactions

> **transactions**: `Hex`[] \| `string`[]

Defined in: [packages/block/src/types.ts:589](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L589)

***

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalV1`](WithdrawalV1.md)[]

Defined in: [packages/block/src/types.ts:590](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L590)
