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

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas` | `Hex` \| `string` | [packages/block/src/types.ts:587](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L587) |
| <a id="blobgasused"></a> `blobGasUsed?` | `Hex` \| `string` | [packages/block/src/types.ts:591](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L591) |
| <a id="blockhash"></a> `blockHash` | `Hex` \| `string` | [packages/block/src/types.ts:588](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L588) |
| <a id="blocknumber"></a> `blockNumber` | `Hex` \| `string` | [packages/block/src/types.ts:582](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L582) |
| <a id="excessblobgas"></a> `excessBlobGas?` | `Hex` \| `string` | [packages/block/src/types.ts:592](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L592) |
| <a id="executionwitness"></a> `executionWitness?` | [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) \| `null` | [packages/block/src/types.ts:595](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L595) |
| <a id="extradata"></a> `extraData` | `Hex` \| `string` | [packages/block/src/types.ts:586](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L586) |
| <a id="feerecipient"></a> `feeRecipient` | `Hex` \| `string` | [packages/block/src/types.ts:577](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L577) |
| <a id="gaslimit"></a> `gasLimit` | `Hex` \| `string` | [packages/block/src/types.ts:583](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L583) |
| <a id="gasused"></a> `gasUsed` | `Hex` \| `string` | [packages/block/src/types.ts:584](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L584) |
| <a id="logsbloom"></a> `logsBloom` | `Hex` \| `string` | [packages/block/src/types.ts:580](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L580) |
| <a id="parentbeaconblockroot"></a> `parentBeaconBlockRoot?` | `Hex` \| `string` | [packages/block/src/types.ts:593](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L593) |
| <a id="parenthash"></a> `parentHash` | `Hex` \| `string` | [packages/block/src/types.ts:576](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L576) |
| <a id="prevrandao"></a> `prevRandao` | `Hex` \| `string` | [packages/block/src/types.ts:581](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L581) |
| <a id="receiptsroot"></a> `receiptsRoot` | `Hex` \| `string` | [packages/block/src/types.ts:579](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L579) |
| <a id="requestsroot"></a> `requestsRoot?` | `Hex` \| `string` \| `null` | [packages/block/src/types.ts:596](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L596) |
| <a id="stateroot"></a> `stateRoot` | `Hex` \| `string` | [packages/block/src/types.ts:578](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L578) |
| <a id="timestamp"></a> `timestamp` | `Hex` \| `string` | [packages/block/src/types.ts:585](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L585) |
| <a id="transactions"></a> `transactions` | `Hex`[] \| `string`[] | [packages/block/src/types.ts:589](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L589) |
| <a id="withdrawals"></a> `withdrawals?` | [`WithdrawalV1`](WithdrawalV1.md)[] | [packages/block/src/types.ts:590](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L590) |
