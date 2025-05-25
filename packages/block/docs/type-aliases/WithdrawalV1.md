[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / WithdrawalV1

# Type Alias: WithdrawalV1

> **WithdrawalV1** = `object`

Defined in: packages/block/src/types.ts:526

Represents an Ethereum withdrawal from the consensus layer to the execution layer

Introduced in the Shanghai/Capella upgrade (EIP-4895), these withdrawals allow validators
to receive ETH from the beacon chain to their execution layer accounts.

## See

https://eips.ethereum.org/EIPS/eip-4895 for detailed information

## Example

```typescript
import { WithdrawalV1 } from '@tevm/block'

// Example withdrawal object
const withdrawal: WithdrawalV1 = {
  index: '0x42',                                     // Sequential index
  validatorIndex: '0x7b',                            // Index of the validator
  address: '0x0c54fccd2e384b4bb6f2e405bf5cbc15a017aafb', // Recipient address
  amount: '0x1bc16d674ec80000'                       // Amount in Gwei (2 ETH)
}

// Process withdrawals in a block
function processWithdrawals(withdrawals: WithdrawalV1[]): void {
  for (const withdrawal of withdrawals) {
    // Credit the amount to the recipient's account
    creditAccount(withdrawal.address, BigInt(withdrawal.amount))
  }
}
```

## Properties

### address

> **address**: `Hex`

Defined in: packages/block/src/types.ts:529

***

### amount

> **amount**: `Hex`

Defined in: packages/block/src/types.ts:530

***

### index

> **index**: `Hex`

Defined in: packages/block/src/types.ts:527

***

### validatorIndex

> **validatorIndex**: `Hex`

Defined in: packages/block/src/types.ts:528
