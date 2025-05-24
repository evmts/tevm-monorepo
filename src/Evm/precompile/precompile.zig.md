# precompile.zig - EVM Precompiled Contracts Implementation

This document describes the Tevm precompiled contracts implementation and tracks unimplemented features.

## Overview

Precompiled contracts are special contracts at addresses 0x01-0x11 that provide optimized implementations of cryptographic and utility functions. They are essential for EVM compatibility.

## File Structure

The precompile implementation is split across multiple files:
- `Precompiles.zig` - Main orchestration and hardfork logic
- `crypto.zig` - Cryptographic precompiles (ECRECOVER, SHA256, RIPEMD160, BN256, BLAKE2F)
- `bls12_381.zig` - BLS12-381 curve operations
- `math.zig` - ModExp operations
- `kzg.zig` - KZG point evaluation
- `common.zig` - Common types and identity function

## Implementation Status

### Fully Implemented
1. **0x02 - SHA256**: SHA256 hash function (uses `std.crypto.hash.sha2`)
2. **0x04 - IDENTITY**: Data copy (in `common.zig`)

### Partially Implemented (Gas calculation only)
All precompiles have gas calculation functions implemented, but most lack the actual cryptographic operations:

1. **0x01 - ECRECOVER**: Elliptic curve signature recovery
2. **0x03 - RIPEMD160**: RIPEMD-160 hash function
3. **0x05 - MODEXP**: Modular exponentiation
4. **0x06 - BN256ADD**: Alt_bn128 elliptic curve addition
5. **0x07 - BN256MUL**: Alt_bn128 scalar multiplication
6. **0x08 - BN256PAIRING**: Alt_bn128 pairing check
7. **0x09 - BLAKE2F**: BLAKE2 compression function
8. **0x0a - KZG_POINT_EVALUATION**: KZG point evaluation (EIP-4844)
9. **0x0b-0x11 - BLS12_381**: Various BLS12-381 operations

## Hardfork Activation

The implementation includes sophisticated hardfork-based activation:
- **Homestead**: Introduces basic precompiles (0x01-0x04)
- **Byzantium**: Adds ModExp and BN256 operations (0x05-0x08)
- **Istanbul**: Adds BLAKE2F (0x09)
- **Berlin**: Updates gas costs for existing precompiles
- **Cancun**: Adds KZG_POINT_EVALUATION (0x0a)
- **Prague**: Adds BLS12-381 operations (0x0b-0x11)

## Unimplemented Features

Based on code analysis with TODO comments:

### 1. crypto.zig - Core Cryptographic Functions

**ECRECOVER (0x01)**:
- TODO line 219: "Implement actual ECRECOVER using secp256k1"
- Missing: Actual signature recovery implementation
- Currently: Returns zero address for all inputs

**RIPEMD160 (0x03)**:
- TODO line 276: "Implement actual RIPEMD160"
- TODO line 291: "Replace with actual RIPEMD160 computation"
- Missing: Complete RIPEMD-160 hash implementation
- Currently: Placeholder implementation

**BN256 Operations (0x06-0x08)**:
- TODO line 311: "Implement BN256 elliptic curve operations"
- TODO line 329: "Implement BN256 scalar multiplication"
- TODO line 347: "Implement BN256 pairing check"
- Missing: All alt_bn128 curve operations
- Currently: Returns empty results

**BLAKE2F (0x09)**:
- TODO line 368: "Implement BLAKE2F compression function"
- Missing: BLAKE2F round function implementation
- Currently: Returns unmodified state

### 2. math.zig - Mathematical Operations

**MODEXP (0x05)**:
- TODO line 271: "TODO: Implement efficient modular exponentiation"
- Missing: Actual modular exponentiation algorithm
- Currently: Returns 1 for all inputs

### 3. kzg.zig - KZG Cryptography

**KZG_POINT_EVALUATION (0x0a)**:
- TODO line 65: "Implement actual KZG cryptography"
- Missing: Complete KZG implementation
- Required: Integration with c-kzg library or similar

### 4. bls12_381.zig - BLS12-381 Operations

**All BLS12-381 precompiles (0x0b-0x11)**:
- Multiple TODOs for field element validation
- Missing: All BLS12-381 curve operations
- Required: Integration with BLS12-381 library

## Comparison with REVM

REVM has complete implementations of all precompiles using:
- `k256` crate for ECRECOVER
- `sha2` crate for SHA256
- `ripemd` crate for RIPEMD160
- `bn` crate for alt_bn128 operations
- `blst` crate for BLS12-381
- `c-kzg` for KZG operations

## Performance Optimizations Needed

1. **Library Integration**: Need to integrate optimized crypto libraries
2. **Memory Management**: Current implementation allocates frequently
3. **Batch Operations**: Some precompiles could benefit from batching
4. **SIMD Usage**: Cryptographic operations could use SIMD instructions

## Security Considerations

1. **Input Validation**: All inputs must be validated before processing
2. **Timing Attacks**: Implementations must be constant-time where applicable
3. **Gas Metering**: Must charge gas before performing operations
4. **Error Handling**: Must handle malformed inputs gracefully

## Testing Infrastructure

The implementation includes:
- Test helpers for creating mock precompile environments
- Hardfork activation tests
- Gas calculation verification
- Placeholder for cryptographic operation tests

## Next Steps

1. **Priority 1**: Implement ECRECOVER for basic transaction verification
2. **Priority 2**: Implement BN256 operations for zero-knowledge proofs
3. **Priority 3**: Implement BLAKE2F for compatibility
4. **Priority 4**: Implement BLS12-381 for future Ethereum features

## Integration Points

The `runPrecompiledContract` function in `Precompiles.zig`:
1. Validates contract exists at given address
2. Checks if contract is active for current hardfork
3. Calculates required gas
4. Executes the precompile if sufficient gas
5. Returns result or error

This provides a clean interface for the EVM to call precompiled contracts.