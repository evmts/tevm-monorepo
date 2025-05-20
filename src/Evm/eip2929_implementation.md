# EIP-2929 Implementation Summary

## Overview

[EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) increases gas costs for state access operations to prevent denial-of-service attacks through underpriced operations. It introduces the concept of "warm" and "cold" accesses, where the first access to a storage slot or account costs more (cold access), and subsequent accesses in the same transaction cost less (warm access).

## Implementation Details

### Gas Constants

Added the following gas constants to JumpTable.zig:
- `ColdSloadCost: u64 = 2100` - Cost for first-time SLOAD access
- `ColdAccountAccessCost: u64 = 2600` - Cost for first-time account access
- `WarmStorageReadCost: u64 = 100` - Cost for subsequent accesses

### Contract State Tracking

Enhanced the Contract structure in Contract.zig to track:
1. Storage slot access status with `storage_access: ?std.AutoHashMap(u256, bool)`
2. Account access status with `is_cold: bool`

Added methods to maintain this state:
- `markStorageSlotWarm(slot: u256)` - Marks a storage slot as accessed
- `isStorageSlotCold(slot: u256)` - Checks if a slot has not been accessed
- `markAccountWarm()` - Marks the current contract account as accessed
- `isAccountCold()` - Checks if the account has not been accessed

### Updated Opcodes

Modified the following opcodes to implement warm/cold access pricing:

1. Storage Operations:
   - **SLOAD**: Now charges 2100 gas for cold access, 100 for warm
   - **SSTORE**: Incorporates EIP-2929 costs on top of EIP-2200 logic

2. Account Access Operations:
   - **BALANCE**: Now charges 2600 gas for cold access, 100 for warm
   - **EXTCODESIZE**: Now charges 2600 gas for cold access, 100 for warm
   - **EXTCODECOPY**: Adds cold access cost (2500 gas extra) when needed
   - **EXTCODEHASH**: Now charges 2600 gas for cold access, 100 for warm

### Dynamic Gas Functions

Added specialized dynamic gas calculation functions for each operation:
- `sloadDynamicGas` - For SLOAD operation
- `sstoreDynamicGas` - For SSTORE operation 
- `balanceDynamicGas` - For BALANCE operation
- `extcodesizeDynamicGas` - For EXTCODESIZE operation
- `extcodecopyDynamicGas` - For EXTCODECOPY operation
- `extcodehashDynamicGas` - For EXTCODEHASH operation

### Testing

Created comprehensive tests in `eip2929.test.zig` to verify:
1. Storage slot tracking functionality
2. Account access tracking functionality
3. Gas cost differences between cold and warm SLOAD operations
4. Gas cost differences between cold and warm EXTCODEHASH operations

## Status and Next Steps

### Completed
- Basic EIP-2929 tracking infrastructure
- Warm/cold storage slot access for SLOAD/SSTORE
- Warm/cold account access for BALANCE, EXTCODEHASH, EXTCODESIZE, EXTCODECOPY
- Updated gas calculation taking warm/cold status into account
- Tests for key functionality

### TODO
- Add warm access presets for precompiled contract addresses (e.g., those at 0x1-0x9)
- Implement warm/cold gas cost tracking for other call operations (CALL, CALLCODE, DELEGATECALL, STATICCALL)
- Additional tests for edge cases and integration with other EIPs

## References
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929)
- Gas constants derived from Revm and Geth implementations