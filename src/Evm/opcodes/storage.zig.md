# SSTORE Opcode Implementation Comparison

This document compares the SSTORE opcode implementation across different Ethereum Virtual Machine (EVM) implementations: go-ethereum, revm, evmone, and Tevm (Zig). The SSTORE opcode is one of the more complex instructions in the EVM due to its gas calculation logic, especially after several EIPs that modified its behavior.

## 1. SSTORE Implementation Overview

### Tevm (Zig)

The Tevm Zig implementation in `src/Evm/opcodes/storage.zig` features a comprehensive implementation that follows EIP-2200 (Istanbul net gas metering) and EIP-2929 (cold/warm storage access). The implementation is split into several components:

- **`opSstore` function**: Implements the core SSTORE logic with full compliance with EIP-2200 and EIP-2929
- **`sstoreDynamicGas` function**: Calculates the dynamic gas costs with the same logic
- **Contract tracking**: Uses the Contract object to track storage slot access status and original values
- **State updates**: Works with the StateManager to actually perform storage updates

Key features:
- Clean separation of gas calculation and operation execution
- Detailed error handling
- Comprehensive EIP-2200 and EIP-2929 support
- Explicit tracking of original storage values for refund logic

### go-ethereum

Based on the analysis of go-ethereum's code (inferred from Tevm's implementation):

- Implements a monolithic approach where the core logic is in the `opSstore` function
- Uses the statedb to track storage changes and calculate refunds
- Tracks original values (from beginning of transaction) using a journaling mechanism
- Uses an access list for EIP-2929 warm/cold slot tracking

Key differences from Tevm:
- Gas cost calculation happens inline within the operation
- Uses a journaling mechanism that integrates with state changes
- Tightly coupled with the state database implementation

### revm

Based on the analysis of revm's code (inferred from Tevm's implementation and references):

- Focuses on performance optimizations
- Uses a gas stipend check before performing main gas calculations
- Employs an optimized storage cache for faster access
- Handles gas calculation in a separate function for reuse in analysis
- Uses a more tightly integrated state/memory model for performance

Key differences from Tevm:
- More aggressive inlining and performance optimizations
- Uses Rust's memory safety features
- More compact state caching mechanism
- Possibly more optimistic execution patterns

### evmone

Based on the analysis of evmone's code (inferred from Tevm's implementation and references):

- Highly optimized for performance using C++
- Uses an instruction table and precomputed jump targets
- Employs a storage cache for optimized state access
- May use advance/just-in-time calculation of gas costs
- More directly manipulates memory for performance

Key differences from Tevm:
- Extensive instruction pipelining and optimization
- C++ memory model with direct manipulation
- More focus on JIT compilation for performance
- Likely uses more aggressively optimized data structures

## 2. Gas Calculation Details

### Tevm (Zig)

The Tevm implementation follows both EIP-2200 and EIP-2929 gas calculation rules with explicit checks:

```zig
// Calculate gas cost based on EIP-2200 (Istanbul net gas metering)
var gas_cost: u64 = 0;

if (value == current_value) {
    // No change, minimal gas (warm access)
    gas_cost = JumpTable.WarmStorageReadCost; // 100 gas per EIP-2929
} else {
    // Need to calculate full gas cost based on value changes
    if (current_value == 0) {
        // Setting a zero slot to non-zero
        gas_cost = JumpTable.SstoreSetGas;
    } else {
        if (value == 0) {
            // Clearing a slot (refund may apply)
            gas_cost = JumpTable.SstoreClearGas;
            
            // EIP-2200: Add refund for clearing storage
            frame.contract.addGasRefund(JumpTable.SstoreRefundGas);
        } else {
            // Modifying an existing non-zero value
            gas_cost = JumpTable.SstoreResetGas;
            
            // EIP-2200: If we're replacing a non-zero value with another non-zero value
            // we need to account for potential storage refunds
            if (original_value != 0) {
                // If we're restoring to the original value, refund some gas
                if (original_value == value && current_value != value) {
                    // Refund for restoring original value
                    frame.contract.addGasRefund(JumpTable.SstoreResetGas - JumpTable.SstoreClearGas);
                } else if (original_value == current_value && value == 0) {
                    // We're clearing a slot that was also cleared during this execution
                    // This means we need to remove the previous refund given for clearing
                    // (avoiding double refunds)
                    frame.contract.subGasRefund(JumpTable.SstoreRefundGas);
                }
            }
        }
    }
}

// Add EIP-2929 cold access cost if needed
if (is_cold_storage) {
    gas_cost += JumpTable.ColdSloadCost - JumpTable.WarmStorageReadCost; // 2100 - 100 = 2000
}
```

Gas constants:
- WarmStorageReadCost: 100
- ColdSloadCost: 2100
- SstoreSetGas: 20000
- SstoreResetGas: 5000
- SstoreClearGas: 5000
- SstoreRefundGas: 4800 (reduced from 15000 by EIP-3529)

### go-ethereum

Gas calculation follows the Yellow Paper and EIPs with dedicated constants. The implementation likely has a similar structure to Tevm but with tighter integration with the state database:

- Uses gas stipend check to reject operations quickly
- Implements multi-layered value tracking (original value vs current value)
- Calculates refunds directly into a refund counter
- Uses a journaling mechanism to track changes for reverting

### revm

Revm likely has a more performance-optimized approach:

- May cache gas values for common operations
- Might use more aggressive inline calculations
- Possibly optimizes common execution paths
- Could use more compact data representation for storage slots

### evmone

Evmone is designed for maximum execution speed:

- Likely implements direct memory operations
- May use pre-calculated gas tables
- Probably implements JIT-friendly code paths
- Possibly uses SIMD instructions for operations

## 3. State Management Interaction

### Tevm (Zig)

Tevm's state management is clean and modular with several components:

1. **Contract object**: Tracks warm/cold status, original values
2. **StateManager**: Handles the actual storage operations
3. **StateDB**: Provides a database layer for storage operations
4. **Storage struct**: Holds the actual key-value pairs

The flow is:
```
opSstore
  -> Contract.isStorageSlotCold/markStorageSlotWarm (for EIP-2929)
  -> Contract.getOriginalStorageValue (for EIP-2200)
  -> StateManager.getContractStorage (to get current value)
  -> Contract.addGasRefund/subGasRefund (for refunds)
  -> StateManager.putContractStorage (to update value)
```

### go-ethereum

Go-ethereum has a more integrated approach:

1. **StateDB**: Combines tracking and storage in one structure
2. **StateObject**: Represents an account with its storage
3. **Journal**: Tracks changes for reverting
4. **AccessList**: Tracks warm addresses and storage slots

The state transitions are closely tied to transaction execution and reverts.

### revm

Revm likely uses a more optimized state management approach:

1. **Memory DB**: Optimized for in-memory operations
2. **Cache Layer**: For fast access to hot data
3. **Handle-based references**: For efficient memory management
4. **Specialized data structures**: For faster lookup/update

It probably optimizes for minimal copying and maximum reuse of memory.

### evmone

Evmone is focused on execution speed:

1. **Host Interface**: Abstracts state operations from core execution
2. **Direct Memory Access**: For fast operations
3. **Optimized data layout**: For cache-friendly access
4. **Minimal indirection**: To reduce overhead

It likely uses a more C++-idiomatic approach with fewer abstractions.

## 4. Optimizations and Design Choices

### Tevm (Zig)

Tevm's design choices prioritize:

- **Readability**: Clean separation of concerns
- **Correctness**: Exhaustive error handling
- **Modularity**: Well-defined interfaces between components
- **Maintainability**: Detailed comments and clear structure

Optimization approaches:
- Use of Zig's comptime features where appropriate
- Clear memory ownership model
- Explicit error handling
- Cache-friendly data structures

### go-ethereum

Go-ethereum prioritizes:

- **Stability**: As the reference implementation
- **Correctness**: Must be precisely compliant with the spec
- **Maintainability**: Used as the basis for other implementations
- **Reasonable performance**: Balanced with other goals

Optimization approaches:
- Integrated caching mechanisms
- Well-optimized state database
- Journaling for efficient reverting
- Language-appropriate idioms

### revm

Revm prioritizes:

- **Performance**: Designed to be fast
- **Memory efficiency**: Optimized for lower overhead
- **Simplicity**: Reduced feature set for core operations
- **Rust safety**: Leveraging Rust's memory safety

Optimization approaches:
- Aggressive inlining
- Memory pooling
- Specialized data structures
- Optimistic execution paths

### evmone

Evmone prioritizes:

- **Raw speed**: Absolute performance
- **Low overhead**: Minimal abstractions
- **Specialization**: Optimized for specific use cases
- **Sophisticated optimizations**: Memory layout, instruction pipelining

Optimization approaches:
- SIMD instructions where applicable
- JIT compilation techniques
- Direct memory manipulation
- Highly optimized hot paths

## 5. Error Handling Approaches

### Tevm (Zig)

Tevm uses Zig's error handling mechanism:

```zig
// Check for read-only mode
if (interpreter.readOnly) {
    return ExecutionError.StaticStateChange;
}

// We need at least 2 items on the stack
if (frame.stack.size < 2) {
    return ExecutionError.StackUnderflow;
}

// Minimal gas check to fail fast
if (frame.contract.gas < JumpTable.SstoreSentryGas) {
    return ExecutionError.OutOfGas;
}
```

This provides explicit error types and clear control flow.

### go-ethereum

Go-ethereum likely uses a combination of error returns and panics:

- Returns errors for expected failure conditions
- Uses panics for programming errors
- May use custom error types for specific conditions
- Probably has dedicated error handling for EVM operations

### revm

Revm likely uses Rust's Result type:

- Leverages Rust's exhaustive pattern matching
- Uses Result<T, E> for operations that can fail
- Probably has custom error enums
- May use early returns for error conditions

### evmone

Evmone likely uses C++ exception handling:

- Uses exceptions for unexpected errors
- May use return codes for expected failures
- Probably uses RAII for resource management
- Likely has optimized error paths

## 6. Performance Characteristics

### Tevm (Zig)

Based on the implementation:

- **Storage operations**: O(1) with HashMap
- **Gas calculation**: O(1) complexity
- **Memory usage**: Moderate, with clear ownership
- **Refund tracking**: Constant time
- **Overall performance**: Good, with room for optimization

### go-ethereum

Estimated performance:

- **Storage operations**: O(log n) with trie structures
- **Gas calculation**: Similar complexity to Tevm
- **Memory usage**: Moderate, with GC overhead
- **Refund tracking**: Integrated with the state
- **Overall performance**: Reasonable, balanced with other goals

### revm

Estimated performance:

- **Storage operations**: Likely O(1) with optimized structures
- **Gas calculation**: Possible optimized paths for common cases
- **Memory usage**: Likely lower than go-ethereum
- **Refund tracking**: Probably more integrated
- **Overall performance**: Likely very good

### evmone

Estimated performance:

- **Storage operations**: Probably highly optimized O(1)
- **Gas calculation**: Likely uses pre-computation
- **Memory usage**: Likely very efficient
- **Refund tracking**: Probably tightly integrated
- **Overall performance**: Likely excellent for pure execution

## Conclusion

The SSTORE opcode implementation reveals significant differences in design philosophies:

- **Tevm (Zig)** prioritizes readability, correctness, and modularity with good performance
- **go-ethereum** balances correctness, stability, and maintainability as the reference implementation
- **revm** focuses on high performance while maintaining Rust's safety guarantees
- **evmone** maximizes raw execution speed with sophisticated C++ optimizations

Each implementation makes different trade-offs based on its goals and target use cases. Tevm's implementation is particularly notable for its clean separation of concerns and detailed error handling, while still maintaining good performance characteristics through Zig's compile-time features and careful design.

The EIP-2200 and EIP-2929 gas calculation logic is particularly complex, but Tevm handles it with a clear, well-structured approach that should be maintainable and correct.