# EIP-2200 and EIP-3529 Implementation Summary

## EIP-2200: Structured Definitions for Gas Metering

### Overview

[EIP-2200](https://eips.ethereum.org/EIPS/eip-2200) redefines the gas costs for SSTORE operations to account for the changes in storage values, introducing net gas metering. It replaces the original gas cost mechanism with one that takes into account the original value (value before the transaction), current value (value before the SSTORE), and new value (value after the SSTORE).

### Implementation Details

1. **Original Value Tracking**
   - Added `original_storage: ?std.AutoHashMap(u256, u256)` field to Contract struct.
   - Implemented `trackOriginalStorageValue` and `getOriginalStorageValue` methods to manage original values.

2. **Gas Refund Handling**
   - The SSTORE operation now accounts for all the state transition cases:
     - Setting from zero to non-zero: 20,000 gas
     - Modifying an existing value: 5,000 gas
     - Setting to zero (clearing): 5,000 gas + 4,800 refund
     - Resetting to the original value: 5,000 gas + conditional refund

3. **Testing**
   - Created comprehensive tests in `eip2200.test.zig` that verify:
     - Original value tracking works correctly
     - Gas costs and refunds are applied correctly for different state transitions
     - Edge cases like restoring to original values are handled properly

## EIP-3529: Reduction in Gas Refunds

### Overview

[EIP-3529](https://eips.ethereum.org/EIPS/eip-3529) reduces the gas refunds provided by the EVM, primarily for SSTORE (clearing storage) and SELFDESTRUCT operations. This was introduced to mitigate the "gas token" phenomenon where contracts are deployed and destroyed solely to get gas refunds.

### Implementation Details

1. **Updated Gas Constants**
   - Modified `SstoreRefundGas` from 15,000 to 4,800 gas (for clearing storage slots).
   - Added `MaxRefundQuotient: u64 = 5` constant (changing max refund from 50% to 20% of gas used).

2. **Test Verification**
   - Updated tests to verify the new refund values are applied correctly.
   - Added explicit checks that refunds match the new EIP-3529 values.

## Verification

The implementation ensures that:

1. Storage operations correctly track the original values of accessed slots.
2. Gas costs and refunds are calculated according to EIP-2200's rules.
3. Gas refunds are limited according to EIP-3529's reduced values.
4. Special cases like restoring slots to their original values are handled properly.

## Future Considerations

- The SELFDESTRUCT operation should have its refund removed entirely per EIP-3529, but this is not yet fully implemented.
- Applying the `MaxRefundQuotient` limit should be handled at the transaction execution level, which may require additional changes outside the scope of the current implementation.

## References

- [EIP-2200](https://eips.ethereum.org/EIPS/eip-2200) - Structured Definitions for Gas Metering
- [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529) - Reduction in Refunds