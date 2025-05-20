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

- **Status**: Partially implemented in SSTORE
- **Description**: Redefines gas metering for SSTORE operation to account for storage slot value changes
- **What's done**: Basic implementation for the storage slot value change gas calculations
- **TODO**:
  - Complete gas refund handling 
  - Add proper original value tracking 
  - Add comprehensive tests for various state transition scenarios

## High Priority

### EIP-3529: Reduction in gas refunds

- **Status**: Not implemented
- **Description**: Reduces the gas refund for SELFDESTRUCT and SSTORE operations
- **Complexity**: Low
- **Implementation**: Adjust gas refund calculations in the SSTORE and SELFDESTRUCT operations

### EIP-3198: BASEFEE opcode

- **Status**: Not implemented
- **Description**: Adds a new opcode to access the block's base fee
- **Complexity**: Low
- **Implementation**: Add a new opcode that pushes the current block's base fee onto the stack

### EIP-1559: Fee market change

- **Status**: Not implemented
- **Description**: Introduces a base fee per block and fee burning mechanism
- **Complexity**: Medium
- **Implementation**: Update block processing to include base fee calculation and burning mechanism

### EIP-4895: Beacon chain withdrawals

- **Status**: Not implemented
- **Description**: Adds support for withdrawals from the beacon chain to the execution layer
- **Complexity**: Medium
- **Implementation**: Add new transaction type and processing logic for withdrawals

## Medium Priority

### EIP-3651: Warm COINBASE

- **Status**: Not implemented
- **Description**: Makes the COINBASE address warm for EIP-2929 access
- **Complexity**: Low
- **Implementation**: Mark the COINBASE address as warm at the beginning of the transaction

### EIP-4844: Shard Blob Transactions

- **Status**: Not implemented
- **Description**: Introduces a new transaction type that includes a blob of data
- **Complexity**: High
- **Implementation**: Add new transaction type, pricing rules, and processing logic

### EIP-3860: Limit and meter initcode

- **Status**: Not implemented
- **Description**: Limits the maximum size of initcode and adds gas cost per byte
- **Complexity**: Low
- **Implementation**: Add size check and adjust gas calculation for contract creation

### Shanghai Hard Fork Opcodes

- **Status**: Not implemented
- **Description**: PUSH0 opcode introduced in Shanghai
- **Complexity**: Low
- **Implementation**: Add new opcode that pushes a zero onto the stack

### Cancun Hard Fork Opcodes

- **Status**: Not implemented
- **Description**: TLOAD, TSTORE (transient storage), MCOPY (memory copy), and BLOBHASH, BLOBBASEFEE opcodes
- **Complexity**: Medium
- **Implementation**: Add new opcodes and related infrastructure

## Implementation Order

1. ✅ Complete EIP-2929 implementation (gas pricing) - Implemented for SLOAD, SSTORE, BALANCE, EXTCODESIZE, EXTCODECOPY, EXTCODEHASH
2. Complete EIP-2200 implementation (proper refund tracking)
3. Implement EIP-3651 (Warm COINBASE)
4. Implement EIP-3529 (Gas refund reduction)
5. Implement EIP-3198 (BASEFEE opcode)
6. Implement Shanghai opcodes (PUSH0)
7. Implement Cancun opcodes (TLOAD, TSTORE, MCOPY, etc.) - TLOAD and TSTORE support partially added
8. Implement EIP-4844 (Shard Blob Transactions) - Basic opcodes (BLOBHASH, BLOBBASEFEE) support partially added

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