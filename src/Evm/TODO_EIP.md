# EVM Improvement Proposals (EIPs) TODO

This document outlines key EIPs that should be implemented in the Tevm Zig EVM to maintain compatibility with current Ethereum network standards. Based on our analysis of Revm and other implementations, the following EIPs are high priority for implementation:

## Implemented

### EIP-2929: Gas cost increases for state access opcodes

- **Status**: Implemented
- **Description**: Increases gas costs for SLOAD, *CALL, EXT*, and BALANCE opcodes to prevent DoS attacks
- **What's done**: 
  - Added warm/cold access tracking for storage slots and accounts
  - Implemented gas cost increases for cold accesses
  - Added cold/warm access for EXTCODEHASH, EXTCODESIZE, EXTCODECOPY, BALANCE
  - Updated gas tables with the new cold/warm access costs
- **TODO**: 
  - Add warm access presets for precompiled contract addresses
  - Implement cold/warm access for CALL, CALLCODE, DELEGATECALL, STATICCALL

### EIP-2200: Structured Definitions for Gas Metering

- **Status**: Implemented
- **Description**: Redefines gas metering for SSTORE operation to account for storage slot value changes
- **What's done**: 
  - Implementation for the storage slot value change gas calculations
  - Added proper original value tracking in Contract struct
  - Gas refund handling for different state transition cases
  - Added comprehensive tests for various state transition scenarios

### EIP-2537: BLS12-381 curve operations

- **Status**: Implemented
- **Description**: Adds precompiled contracts for BLS12-381 elliptic curve operations
- **What's done**: 
  - Added precompiled contracts for G1 addition, G1 multi-exponentiation
  - Added precompiled contracts for G2 addition, G2 multi-exponentiation
  - Added pairing check precompiled contract
  - Added field-to-point mapping for G1 and G2
  - Implemented correct gas cost calculations for all operations
  - Provided input validation and special case handling
- **TODO**: 
  - Integrate with a full BLS12-381 cryptographic library
  - Complete full point validation including subgroup checks
  - Add more comprehensive test vectors

## High Priority

### EIP-3529: Reduction in gas refunds

- **Status**: Implemented
- **Description**: Reduces the gas refund for SELFDESTRUCT and SSTORE operations
- **Complexity**: Low
- **Implementation**: 
  - Adjusted gas refund calculations in SSTORE operations (reduced from 15,000 to 4,800)
  - Added MaxRefundQuotient constant (changed from 2 to 5, limiting refunds to 20% of gas used)
  - Added tests verifying the reduced refund values

### EIP-3198: BASEFEE opcode

- **Status**: Implemented
- **Description**: Adds a new opcode to access the block's base fee
- **Complexity**: Low
- **Implementation**: Add a new opcode that pushes the current block's base fee onto the stack
- **What's done**: Added IsEIP3198 flag and updated BASEFEE opcode to check for this flag

### EIP-1559: Fee market change

- **Status**: Implemented
- **Description**: Introduces a base fee per block and fee burning mechanism
- **Complexity**: Medium
- **Implementation**: Update block processing to include base fee calculation and burning mechanism
- **What's done**: 
  - Added FeeMarket struct for EIP-1559 fee calculations
  - Implemented base fee adjustment algorithm based on block utilization
  - Added support for Type-2 (EIP-1559) transactions with max_fee_per_gas and max_priority_fee_per_gas
  - Implemented fee burning mechanism with only priority fees going to miners
  - Added comprehensive tests for base fee adjustment and transaction processing

### EIP-4895: Beacon chain withdrawals

- **Status**: Implemented
- **Description**: Adds support for withdrawals from the beacon chain to the execution layer
- **Complexity**: Medium
- **Implementation**: Add withdrawal processing logic for beacon chain withdrawals
- **What's done**: 
  - Created WithdrawalData structure with index, validatorIndex, address, and amount fields
  - Implemented Gwei to Wei conversion for withdrawal amounts
  - Added process to credit withdrawal amounts to recipient accounts
  - Added validation for chain rules and withdrawals root
  - Integrated withdrawal processing in the block execution flow
  - Added comprehensive test coverage for withdrawal processing

## Medium Priority

### EIP-3651: Warm COINBASE

- **Status**: Implemented
- **Description**: Makes the COINBASE address warm for EIP-2929 access
- **Complexity**: Low
- **Implementation**: Mark the COINBASE address as warm at the beginning of the transaction (first depth level)
- **What's done**: Added code to mark the COINBASE address as warm at transaction start time in the interpreter

### EIP-4844: Shard Blob Transactions

- **Status**: Implemented
- **Description**: Introduces a new transaction type that includes a blob of data
- **Complexity**: High
- **Implementation**: Add new opcodes, precompile, and related infrastructure
- **What's done**: 
  - Implemented BLOBHASH opcode (0x49) to access versioned hashes of blobs
  - Implemented BLOBBASEFEE opcode (0x4A) to get the current blob base fee
  - Added KZG Point Evaluation precompile for blob verification
  - Added IsEIP4844 flag in ChainRules struct
  - Added comprehensive tests for the new opcodes
  - Created detailed documentation on the EIP implementation
- **TODO**:
  - Support for the new blob transaction type (0x03)
  - Actual KZG cryptography implementation in the precompile
  - Blob data management and lifecycle

### EIP-3860: Limit and meter initcode

- **Status**: Not implemented
- **Description**: Limits the maximum size of initcode and adds gas cost per byte
- **Complexity**: Low
- **Implementation**: Add size check and adjust gas calculation for contract creation

### Shanghai Hard Fork Opcodes

- **Status**: Implemented
- **Description**: PUSH0 opcode introduced in Shanghai
- **Complexity**: Low
- **Implementation**: Add new opcode that pushes a zero onto the stack
- **What's done**: Added IsEIP3855 flag check in the PUSH0 opcode to ensure it's only enabled in Shanghai and later hardforks

### Cancun Hard Fork Opcodes

- **Status**: Implemented
- **Description**: TLOAD, TSTORE (transient storage), MCOPY (memory copy), and BLOBHASH, BLOBBASEFEE opcodes
- **Complexity**: Medium
- **Implementation**: Add new opcodes and related infrastructure
- **What's done**: 
  - Implemented MCOPY opcode (EIP-5656) with proper gas calculation and error handling
  - Implemented TLOAD and TSTORE opcodes (EIP-1153) with proper gas calculation and transient storage 
  - Implemented BLOBHASH and BLOBBASEFEE opcodes (EIP-4844) with proper flag checking

## Implementation Order

1. ✅ Complete EIP-2929 implementation (gas pricing) - Implemented for SLOAD, SSTORE, BALANCE, EXTCODESIZE, EXTCODECOPY, EXTCODEHASH
2. ✅ Complete EIP-2200 implementation (proper refund tracking)
3. ✅ Implement EIP-3529 (Gas refund reduction)
4. ✅ Implement EIP-3651 (Warm COINBASE)
5. ✅ Implement EIP-3198 (BASEFEE opcode)
6. ✅ Implement EIP-1559 (Fee market change) - Base fee calculation, Type-2 transactions, fee burning
7. ✅ Implement Shanghai opcodes (PUSH0)
8. ✅ Implement MCOPY opcode from Cancun (EIP-5656)
9. ✅ Implement Transient Storage opcodes from Cancun (TLOAD, TSTORE - EIP-1153)
10. ✅ Implement EIP-4844 (Shard Blob Transactions) - BLOBHASH and BLOBBASEFEE opcodes plus KZG precompile
11. ✅ Implement EIP-4895 (Beacon chain withdrawals) - Process beacon chain withdrawals in blocks
12. ✅ Implement EIP-2537 (BLS12-381 curve operations) - Precompiled contracts for BLS12-381 operations

## Test Cases

For all implementations, thorough test coverage should be added including:

1. Basic functionality tests
2. Edge case tests for gas calculations
3. Integration tests with other EIPs
4. Compatibility tests with reference implementations
5. Specific test vectors from the Ethereum test suite

### Integration with JSON Test Vectors

The existing json_tests.zig infrastructure should be expanded to include test vectors for:

1. Gas calculations under various EIPs
2. State transitions involving interactions between multiple EIPs
3. Full contract execution testing 
4. Transaction processing tests

## Inspector Support

Based on Revm's implementation, we should also add an Inspector/Tracer system similar to what exists in Revm and geth. This would:

1. Allow hooking into execution steps
2. Provide debugging capabilities
3. Enable custom gas accounting
4. Support custom state analysis tools

For the Inspector system:
- Add execution step hooks
- Add pre/post call hooks
- Add logging hooks
- Support state inspection during execution