[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / WithdrawalsBytes

# Type Alias: WithdrawalsBytes

> **WithdrawalsBytes**: `Uint8Array`[]

Defined in: [packages/block/src/types.ts:233](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L233)

Represents the raw byte representation of Ethereum withdrawal objects

Each element in the array is a serialized withdrawal object from the Beacon chain.
Used in post-merge Ethereum as part of the engine API and block structure for
processing withdrawals from the consensus layer to the execution layer.

## Example

```typescript
import { WithdrawalsBytes } from '@tevm/block'

// Decode withdrawals from their byte representation
function decodeWithdrawals(withdrawalBytes: WithdrawalsBytes): WithdrawalV1[] {
  return withdrawalBytes.map(bytes => {
    // Implement decoding logic to extract withdrawal data
    return {
      index: getUint64FromBytes(bytes, 0),
      validatorIndex: getUint64FromBytes(bytes, 8),
      address: getAddressFromBytes(bytes, 16),
      amount: getUint64FromBytes(bytes, 48)
    }
  })
}
```
