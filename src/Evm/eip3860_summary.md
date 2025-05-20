# EIP-3860: Limit and Meter Initcode

## Summary

EIP-3860 introduces a limit on the maximum size of initcode to 49152 bytes (2 * 24576 bytes) and applies a gas cost of 2 gas for every 32-byte chunk of initcode. This extends EIP-170, which already limits the maximum deployed contract code size to 24576 bytes.

## Key Features

1. **Initcode Size Limit**: Maximum length of initcode is limited to 49152 bytes, which is twice the code length limit established in EIP-170.

2. **Gas Metering**: Each 32-byte chunk (word) of initcode costs an additional 2 gas to account for the work performed during jumpdest analysis.

3. **Error Handling**: Transactions with initcode exceeding the size limit are rejected and fail (they don't get included in blocks).

## Motivation

Before EIP-3860, there was no explicit protocol level limit on the size of initcode, and the gas metering of jumpdest analysis (which is performed on the entire initcode) was not accounted for.

The lack of a size limit specifically meant that:

1. The implementation complexity for EVM engines was higher since they had to handle arbitrary size initcode.

2. The jumpdest analysis performed during contract creation was not properly metered in gas, creating a potential attack vector where an attacker could trigger jumpdest analysis of large amounts of code with relatively little gas.

3. EVM implementations had to account for corner cases like initcode that doesn't fit in 16-bit offsets.

## Benefits

1. **Security**: Makes attacks involving jumpdest analysis of large initcode too expensive to be practical.

2. **Simplified EVM Implementation**: Provides a clear upper bound for initcode, which simplifies EVM implementations by guaranteeing all code, code offsets, and jump offsets fit in 16 bits.

3. **Fair Gas Pricing**: Properly accounts for the computational work of jumpdest analysis, ensuring the gas cost reflects the actual resource usage.

## When to Apply

EIP-3860 applies to:

1. All contract creation operations: CREATE and CREATE2 opcodes.

2. All contract creations via transactions (contract deployment).

## Implementation Details

- **Gas Calculation**: 2 gas for each 32-byte chunk of initcode, rounded up.
- **Maximum Size**: 49152 bytes (2 * 24576)
- **Error Condition**: When initcode exceeds the maximum size, the transaction or CREATE/CREATE2 operation fails.

## Added in Hardfork

- Shanghai (April 2023)