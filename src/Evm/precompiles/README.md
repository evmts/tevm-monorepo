# Precompiles Directory

This directory contains an alternative implementation of Ethereum's precompiled contracts. While the primary implementation is in the `/src/Evm/precompile` directory, this implementation provides a simpler, enum-based approach.

## Overview

Precompiled contracts are special contracts in Ethereum that execute natively (not as EVM bytecode). They are accessed at specific addresses (1-9) and provide optimized implementations of cryptographic and mathematical operations.

## Implementation Approach

The implementation in this directory follows an enum-based approach where each precompiled contract is represented as a variant in the `PrecompiledContract` enum:

```zig
pub const PrecompiledContract = enum(u8) {
    ECRECOVER = 1,
    SHA256 = 2,
    RIPEMD160 = 3,
    IDENTITY = 4,
    MODEXP = 5,
    BN256ADD = 6,
    BN256MUL = 7,
    BN256PAIRING = 8,
    BLAKE2F = 9,
    
    // Methods for gas calculation and execution
    pub fn gasCost(self: PrecompiledContract, input: []const u8) u64 { ... }
    pub fn execute(self: PrecompiledContract, input: []const u8, allocator: std.mem.Allocator) ExecutionError![]const u8 { ... }
}
```

## Files

- **[Precompiled.zig](./Precompiled.zig)**: Contains the main `PrecompiledContract` enum implementation with methods for gas calculation and execution.
- **[Contract.zig](./Contract.zig)**: Provides a wrapper that represents a specific precompiled contract instance.
- **[Precompiled.test.zig](./Precompiled.test.zig)**: Contains tests for the precompiled contract implementation.
- **[Precompiled.zig.md](./Precompiled.zig.md)**: Provides detailed documentation comparing different precompiled contract implementations.

## Contract Wrapper

The `Contract` struct in `Contract.zig` provides a convenient wrapper around a precompiled contract:

```zig
pub const Contract = struct {
    address: B256,
    contract_type: Precompiled,
    allocator: std.mem.Allocator,
    
    pub fn run(self: *const Contract, input: []const u8) ExecutionError![]const u8 { ... }
    pub fn gasCost(self: *const Contract, input: []const u8) u64 { ... }
}
```

## Execution Model

The execution flow of a precompiled contract follows these steps:

1. A contract address is checked to determine if it corresponds to a precompiled contract.
2. If it is a precompiled contract, the appropriate implementation is selected from the enum.
3. Gas cost is calculated based on the input data.
4. If enough gas is available, the contract logic executes natively.
5. The result is returned to the caller.

## Implemented Contracts

The implementation includes all standard Ethereum precompiled contracts:

1. **ECRECOVER (0x01)**: Elliptic curve signature recovery
2. **SHA256 (0x02)**: SHA-256 hash function
3. **RIPEMD160 (0x03)**: RIPEMD-160 hash function
4. **IDENTITY (0x04)**: Returns the input data unchanged
5. **MODEXP (0x05)**: Modular exponentiation (EIP-198)
6. **BN256ADD (0x06)**: Addition on BN256 elliptic curve (EIP-196)
7. **BN256MUL (0x07)**: Scalar multiplication on BN256 curve (EIP-196)
8. **BN256PAIRING (0x08)**: Pairing check on BN256 curve (EIP-197)
9. **BLAKE2F (0x09)**: BLAKE2 compression function (EIP-152)

## Gas Calculation

Gas costs are implemented according to the Ethereum protocol specifications:

- **ECRECOVER**: Fixed cost of 3,000 gas
- **SHA256**: 60 + 12 * (len + 31) / 32 gas
- **RIPEMD160**: 600 + 120 * (len + 31) / 32 gas
- **IDENTITY**: 15 + 3 * (len + 31) / 32 gas
- **MODEXP**: Complex formula based on input size and values
- **BN256ADD**: 150 gas (post-Istanbul)
- **BN256MUL**: 6,000 gas (post-Istanbul)
- **BN256PAIRING**: 45,000 + 34,000 * pairs gas (post-Istanbul)
- **BLAKE2F**: Based on round count

## Implementation Notes

Some implementations are simplified placeholders:

- **ECRECOVER**: Returns zeros (placeholder)
- **RIPEMD160**: Returns a dummy value (placeholder)
- **BN256 operations**: Return zeros (placeholder)
- **BLAKE2F**: Returns zeros (placeholder)

These would need to be replaced with full implementations in a production environment, likely using specialized cryptographic libraries.

## Comparison Document

The included [Precompiled.zig.md](./Precompiled.zig.md) document provides a detailed comparison of precompiled contract implementations across four different Ethereum clients:

1. Tevm (Zig)
2. go-ethereum (Go)
3. revm (Rust)
4. evmone (C++)

This document is valuable for understanding different implementation approaches and trade-offs in precompiled contract design.