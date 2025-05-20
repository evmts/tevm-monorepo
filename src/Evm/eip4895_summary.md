# EIP-4895: Beacon chain withdrawals

## Overview

EIP-4895 adds support for withdrawals from the Beacon chain to the EVM execution layer. This enables validators to withdraw their staked ETH and rewards from the consensus layer to the execution layer.

## Specification

Introduced in the Shanghai upgrade (April 2023), EIP-4895 adds a new operation called "withdrawals" which transfers ETH from the consensus layer to the execution layer. Withdrawals are processed in a block before any transaction execution.

Key points:
- Withdrawals are represented in blocks as a list of objects, each containing:
  - `index`: A unique identifier for the withdrawal
  - `validatorIndex`: The index of the validator in the beacon chain
  - `address`: The recipient address in the execution layer
  - `amount`: The amount in Gwei to be withdrawn

- Withdrawals have no gas costs as they're not user-initiated transactions
- They're included in the block header through a new field called `withdrawalsRoot` (a Merkle root)
- Amounts are specified in Gwei (10^9 Wei) and must be converted to Wei for the EVM

## Implementation Details

The implementation follows a simple process:

1. The block processor checks if the current block has withdrawals and EIP-4895 is enabled
2. If so, it processes each withdrawal by:
   - Converting the amount from Gwei to Wei (multiply by 10^9)
   - Finding or creating the recipient account
   - Increasing the account's balance by the withdrawal amount
   - Committing the updated account state

## Key Considerations

- EIP-4895 is only enabled from the Shanghai upgrade forward
- Withdrawals are always processed before transactions in a block
- Withdrawals do not trigger smart contract code execution (they're simple balance increases)
- Zero amount withdrawals are still processed to mark accounts as "touched"
- There is no gas cost for withdrawals as they happen at the protocol level

## Integration Points

In the block processing pipeline, withdrawals are handled after transaction processing but before block rewards:

```
1. Validate block
2. Process transactions
3. Process withdrawals (if EIP-4895 enabled)
4. Process block rewards (for PoW chains)
```

## Rationale

EIP-4895 was designed to be a minimal change to enable withdrawals from the Beacon chain. By implementing withdrawals as direct balance crediting operations rather than transactions:

1. No gas fees are incurred
2. The implementation is simpler
3. There's no risk of failure due to contract errors
4. Withdrawals can happen to any address (even those without code)

## More Information

For more detailed information, refer to the [official EIP-4895 specification](https://eips.ethereum.org/EIPS/eip-4895).