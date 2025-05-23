# Precompiled.zig - EVM Precompiled Contracts Implementation

This document describes the Tevm precompiled contracts implementation in `Precompiled.zig` and compares it with other major EVM implementations.

## Overview

Precompiled contracts are native implementations of computationally intensive operations that would be prohibitively expensive as EVM bytecode. They exist at fixed addresses (0x01-0x09 in the basic set) and provide:
- Cryptographic operations (ECRECOVER, SHA256, RIPEMD160)
- Mathematical operations (MODEXP)
- Elliptic curve operations (BN256 ADD/MUL/PAIRING)
- Hash functions (BLAKE2F)
- Data operations (IDENTITY)

## Implementation Details

### Core Structure

```zig
pub const PrecompiledContract = enum(u8) {
    ECRECOVER = 1,
    SHA256 = 2,
    RIPEMD160 = 3,
    IDENTITY = 4,
    MODEXP = 5,       // EIP-198
    BN256ADD = 6,     // EIP-196
    BN256MUL = 7,     // EIP-196
    BN256PAIRING = 8, // EIP-197
    BLAKE2F = 9,      // EIP-152
}
```

### Key Features

1. **Enum-Based Design**: Uses Zig enum for type-safe contract identification
2. **Address Detection**: Helper functions to identify precompiled addresses
3. **Gas Calculation**: Per-contract gas cost formulas
4. **Unified Interface**: Single execute function dispatching to implementations
5. **Memory Management**: Explicit allocator usage for output buffers

### Core Operations

#### Address Checking
```zig
pub fn isPrecompiled(addr: B256) bool {
    // Check bytes 0-30 are zero
    // Check byte 31 is 1-9
}

pub fn fromAddress(addr: B256) ?PrecompiledContract {
    // Convert address to enum if valid
}
```

#### Gas Calculation
```zig
pub fn gasCost(self: PrecompiledContract, input: []const u8) u64 {
    return switch (self) {
        .ECRECOVER => 3000,
        .SHA256 => 60 + 12 * ((input.len + 31) / 32),
        .RIPEMD160 => 600 + 120 * ((input.len + 31) / 32),
        .IDENTITY => 15 + 3 * ((input.len + 31) / 32),
        .MODEXP => modexpGasCost(input),
        .BN256ADD => 150,
        .BN256MUL => 6000,
        .BN256PAIRING => 45000 + 34000 * (input.len / 192),
        .BLAKE2F => 0, // Determined by round count
    };
}
```

#### Execution
```zig
pub fn execute(
    self: PrecompiledContract,
    input: []const u8,
    allocator: std.mem.Allocator
) !?[]const u8 {
    return switch (self) {
        .ECRECOVER => try ecRecover(input, allocator),
        .SHA256 => try sha256(input, allocator),
        // ... dispatch to each implementation
    };
}
```

### Contract Implementations

#### ECRECOVER (0x01)
- **Purpose**: Recover Ethereum address from signature
- **Input**: 128 bytes (hash + v + r + s)
- **Output**: 32 bytes (address padded to 32 bytes)
- **Gas**: 3000
- **Status**: Placeholder implementation

#### SHA256 (0x02)
- **Purpose**: SHA-256 hash function
- **Input**: Variable length
- **Output**: 32 bytes hash
- **Gas**: 60 + 12 * ceil(len/32)
- **Status**: Fully implemented using Zig crypto

#### RIPEMD160 (0x03)
- **Purpose**: RIPEMD-160 hash function
- **Input**: Variable length
- **Output**: 32 bytes (20-byte hash right-padded)
- **Gas**: 600 + 120 * ceil(len/32)
- **Status**: Placeholder (Zig std lacks RIPEMD-160)

#### IDENTITY (0x04)
- **Purpose**: Data copy operation
- **Input**: Variable length
- **Output**: Copy of input
- **Gas**: 15 + 3 * ceil(len/32)
- **Status**: Fully implemented

#### MODEXP (0x05)
- **Purpose**: Modular exponentiation
- **Input**: base_len + exp_len + mod_len + base + exp + mod
- **Output**: Result of (base^exp) % mod
- **Gas**: Complex formula based on input sizes
- **Status**: Placeholder with gas calculation

#### BN256 Operations (0x06-0x08)
- **BN256ADD**: Elliptic curve point addition
- **BN256MUL**: Elliptic curve scalar multiplication
- **BN256PAIRING**: Pairing check operation
- **Status**: All placeholder implementations

#### BLAKE2F (0x09)
- **Purpose**: BLAKE2b compression function
- **Input**: rounds + h + m + t + f
- **Output**: 64 bytes hash state
- **Gas**: Based on round count
- **Status**: Placeholder implementation

## Comparison with Other Implementations

### Architecture Comparison

| Implementation | Design Pattern | Contract Discovery | Gas Model | Memory Management |
|----------------|----------------|-------------------|-----------|-------------------|
| Tevm (Zig) | Enum dispatch | Address validation | Switch expression | Explicit allocator |
| go-ethereum | Interface polymorphism | Map lookup | Method calls | GC managed |
| revm (Rust) | Trait objects | HashMap | Associated functions | Ownership model |
| evmone (C++) | Function pointers | Array index | Inline calculation | Manual |

### Key Differences

#### 1. Contract Organization

**Tevm**:
- Single enum with all contracts
- Centralized dispatch logic
- Clear gas cost mapping

**go-ethereum**:
- Separate struct per contract
- Interface-based polymorphism
- Dynamic registry by hardfork

**revm**:
- Trait-based design
- Modular organization
- Builder pattern for sets

**evmone**:
- Function pointer array
- Static dispatch table
- Minimal abstraction

#### 2. Error Handling

**Tevm**:
- Error union returns (`!?[]const u8`)
- Explicit error propagation
- Clear failure modes

**go-ethereum**:
- Multiple return values with error
- Panic/recover for gas
- nil returns for failures

**revm**:
- Result<T, E> types
- Custom error enums
- ? operator propagation

**evmone**:
- EVMC status codes
- Early returns
- Minimal error context

#### 3. Memory Management

**Tevm**:
- Explicit allocator parameter
- Caller owns returned memory
- Clear allocation patterns

**go-ethereum**:
- Garbage collected
- Hidden allocations
- Slice returns

**revm**:
- Vec<u8> for outputs
- Move semantics
- No manual memory management

**evmone**:
- Custom allocation helpers
- Raw pointer management
- Performance-focused

### Performance Characteristics

**Tevm Approach**:
- Clean enum dispatch
- Some overhead from allocations
- Room for optimization

**Optimization Opportunities**:
1. **Cryptographic Libraries**: Integrate optimized implementations
2. **Memory Pooling**: Reuse common buffer sizes
3. **Inline Dispatch**: Reduce function call overhead
4. **SIMD Operations**: For applicable algorithms

## Implementation Status

### Completed
- ✅ SHA256: Full implementation using Zig std
- ✅ IDENTITY: Simple memory copy
- ✅ Gas calculations for all contracts
- ✅ Address validation logic

### Placeholders
- ⚠️ ECRECOVER: Needs secp256k1 implementation
- ⚠️ RIPEMD160: Requires external library
- ⚠️ MODEXP: Complex big integer math
- ⚠️ BN256 operations: Elliptic curve math
- ⚠️ BLAKE2F: Compression function

## Testing Approach

The implementation includes:
- Unit tests for address detection
- Gas calculation verification
- Input/output validation
- Error condition testing

Example test:
```zig
test "isPrecompiled identifies valid addresses" {
    const valid_addr = B256{ .bytes = [_]u8{0} ** 31 ++ [_]u8{1} };
    try testing.expect(PrecompiledContract.isPrecompiled(valid_addr));
    
    const invalid_addr = B256{ .bytes = [_]u8{0} ** 31 ++ [_]u8{10} };
    try testing.expect(!PrecompiledContract.isPrecompiled(invalid_addr));
}
```

## Future Enhancements

1. **Complete Implementations**:
   - Integrate secp256k1 for ECRECOVER
   - Add RIPEMD-160 support
   - Implement big integer operations
   - Add elliptic curve libraries

2. **Performance Optimizations**:
   - Assembly implementations for hot paths
   - SIMD acceleration where applicable
   - Memory pool for common sizes
   - Batch operation support

3. **Extended Contracts**:
   - BLS12-381 curve operations (Prague)
   - KZG point evaluation (Cancun)
   - Additional cryptographic primitives

4. **Integration Improvements**:
   - Better error context
   - Gas metering integration
   - Execution tracing support

## Conclusion

The Tevm precompiled contracts implementation provides a clean, enum-based foundation for EVM precompiles. While several contracts are placeholders pending cryptographic library integration, the architecture is sound:

**Strengths**:
- **Type Safety**: Enum prevents invalid contract references
- **Clear Structure**: Centralized dispatch and gas calculation
- **Explicit Memory**: Clear ownership and allocation patterns
- **Extensible**: Easy to add new contracts

**Current Limitations**:
- Missing cryptographic implementations
- No hardfork-based activation
- Basic error reporting

The implementation serves as a solid base for both educational purposes and future production use, with clear paths for completing the cryptographic operations and optimizing performance.