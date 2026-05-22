[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / ExecutionPayload

# Type Alias: ExecutionPayload

> **ExecutionPayload** = `object`

Represents the execution layer data of an Ethereum block

Introduced with The Merge (Paris fork), the ExecutionPayload is passed between
the consensus layer and execution layer as part of the Engine API. It contains
all the information needed for transaction execution and state updates.

The structure has evolved over time with various Ethereum upgrades:
- The Merge (Paris): Basic structure with transactions
- Shanghai: Added withdrawals field
- Cancun: Added blobGasUsed, excessBlobGas, parentBeaconBlockRoot
- Verkle/EIP-6800 payload fields are modeled only; Tevm execution is unsupported

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

| Property | Type |
| ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="blobgasused"></a> `blobGasUsed?` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="blockhash"></a> `blockHash` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="blocknumber"></a> `blockNumber` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="excessblobgas"></a> `excessBlobGas?` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="executionwitness"></a> `executionWitness?` | [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) \| `null` |
| <a id="extradata"></a> `extraData` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="feerecipient"></a> `feeRecipient` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="gaslimit"></a> `gasLimit` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="gasused"></a> `gasUsed` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="logsbloom"></a> `logsBloom` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="parentbeaconblockroot"></a> `parentBeaconBlockRoot?` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="parenthash"></a> `parentHash` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="prevrandao"></a> `prevRandao` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="receiptsroot"></a> `receiptsRoot` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="requestsroot"></a> `requestsRoot?` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` \| `null` |
| <a id="stateroot"></a> `stateRoot` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="timestamp"></a> `timestamp` | [`Hex`](../../index/type-aliases/Hex.md) \| `string` |
| <a id="transactions"></a> `transactions` | [`Hex`](../../index/type-aliases/Hex.md)[] \| `string`[] |
| <a id="withdrawals"></a> `withdrawals?` | [`WithdrawalV1`](WithdrawalV1.md)[] |
