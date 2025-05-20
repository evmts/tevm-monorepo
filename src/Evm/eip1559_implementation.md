# EIP-1559 Implementation: Fee Market Change

## Overview

EIP-1559 introduces a significant change to Ethereum's fee market mechanism, replacing the first-price auction model with a more predictable fee structure. This implementation adds support for the new transaction type, base fee calculation, and fee burning mechanism introduced in the London hardfork.

## Implementation Details

### 1. Block Header Changes

Added fields to the block header structure:
- `base_fee_per_gas`: The minimum gas price required for all transactions in the block (in wei)
- Added calculation logic for the next block's base fee based on current block utilization

```zig
// Base fee calculation formula (simplified)
const delta = (block_gas_used - target_gas_used) / target_gas_used;
const change_denominator = 8; // Base fee can change by at most 1/8 (12.5%) per block
const next_base_fee = current_base_fee * (1 + delta / change_denominator);
```

### 2. Transaction Type Support

Added support for Type-2 transactions (EIP-1559 transactions) which include:
- `chain_id`: Chain ID for replay protection
- `nonce`: Sender's nonce
- `max_priority_fee_per_gas`: Maximum fee per gas to be given to miners (tip)
- `max_fee_per_gas`: Maximum total fee per gas the sender is willing to pay
- `gas_limit`: Maximum gas the transaction may consume
- `destination`: Recipient address (null for contract creation)
- `amount`: Value in wei to be transferred
- `data`: Transaction data payload
- `access_list`: List of addresses and storage keys the transaction plans to access (EIP-2930)
- `signature_yParity`: Signature Y parity
- `signature_r`: Signature R value
- `signature_s`: Signature S value

### 3. Fee Calculation Mechanism

Implemented the new fee calculation logic:
- The base fee is determined by the block
- The priority fee (tip to miners) is specified by the sender
- The effective gas price is calculated as: `min(max_fee_per_gas, base_fee_per_gas + max_priority_fee_per_gas)`
- Only the priority fee goes to the miner/validator
- The base fee is burned (removed from circulation)

### 4. Base Fee Adjustment Algorithm

Implemented the algorithm to adjust the base fee between blocks:
- Target block gas usage is typically 50% of the maximum block gas limit
- If a block uses exactly the target gas, the base fee remains unchanged
- If a block uses more than the target gas, the base fee increases (up to 12.5% per block)
- If a block uses less than the target gas, the base fee decreases (up to 12.5% per block)
- Formula: `next_base_fee = current_base_fee * (1 + (gas_used - target_gas) / target_gas / 8)`

### 5. Fee Burning Mechanism

Added logic to burn the base fee portion of transaction fees:
- The base fee portion is not added to any account's balance
- For accounting purposes, burned fees are tracked but effectively removed from circulation

### 6. Backwards Compatibility

Maintained compatibility with legacy transactions:
- Legacy (Type-0) transactions are still supported
- The `gas_price` in legacy transactions is treated as both the max fee and max priority fee
- Both transaction types use the same base fee burning mechanism

## Chain Rule Integration

The EIP-1559 flag (`IsEIP1559`) in the `ChainRules` struct determines whether the new fee market is active:
- For London and later hardforks: `IsEIP1559` is set to `true`
- For pre-London hardforks: `IsEIP1559` is set to `false`

## Testing

Created comprehensive tests for:
1. Base fee adjustment algorithm under various block utilization scenarios
2. Processing of Type-2 (EIP-1559) transactions
3. Fee burning mechanism and priority fee distribution
4. Compatibility with legacy transactions
5. Edge cases like minimum base fee values

## Performance Considerations

The EIP-1559 implementation requires more computation than the previous fee model:
- Base fee calculation between blocks adds minimal overhead
- Fee splitting (base fee vs. priority fee) adds minimal computational cost
- The largest impact is in state updates for handling the fee burning mechanism

## Security Considerations

The implementation addresses several security aspects:
- Ensures the base fee cannot decrease or increase too rapidly (max 12.5% per block)
- Validates that the max fee is greater than or equal to the base fee for all transactions
- Properly handles overflow protection in fee calculations
- Maintains compatibility with existing replay protection mechanisms

## References

1. [EIP-1559: Fee market change](https://eips.ethereum.org/EIPS/eip-1559)
2. [Ethereum Yellow Paper formal specification](https://ethereum.github.io/yellowpaper/paper.pdf)
3. [Analysis of EIP-1559](https://notes.ethereum.org/@vbuterin/eip-1559-faq)