# Precompiled Contracts Implementation

This directory contains the implementation of the Ethereum Virtual Machine (EVM) precompiled contracts in Zig. Precompiled contracts are special contracts that exist at predefined addresses and implement computationally intensive cryptographic operations in a gas-efficient manner.

## Overview

Precompiled contracts allow the Ethereum protocol to provide optimized implementations of cryptographic algorithms and other complex operations that would be either prohibitively expensive or impossible to implement in EVM bytecode. These contracts are called like any other contract but execute native code for better performance.

## Architecture

The precompile implementation provides:

1. A registry system for registering precompiled contracts at specific addresses
2. The contract implementations themselves
3. Gas cost calculation for each operation
4. Hardfork-specific precompiled contract activation

Each precompiled contract must implement the `PrecompiledContract` interface, which consists of:

- `requiredGas`: Function to calculate required gas for a given input
- `run`: Function to execute the contract's logic on the input

## Precompiled Contracts By Hardfork

### Homestead (4 contracts)

- **0x01**: `ECRecover` - Recovers the public key from a signed message
- **0x02**: `SHA256Hash` - Computes the SHA-256 hash of input data
- **0x03**: `RIPEMD160Hash` - Computes the RIPEMD-160 hash of input data
- **0x04**: `DataCopy` - Identity function (returns input as output)

### Byzantium (8 contracts)

Includes all Homestead contracts, plus:

- **0x05**: `BigModExp` - Modular exponentiation for large numbers
- **0x06**: `Bn256Add` - Addition on the BN256 elliptic curve (alt_bn128)
- **0x07**: `Bn256ScalarMul` - Scalar multiplication on BN256 curve
- **0x08**: `Bn256Pairing` - Pairing check on BN256 curve

### Istanbul (9 contracts)

Includes all Byzantium contracts (with optimized gas costs for BN256 operations), plus:

- **0x09**: `Blake2F` - Compression function F from the BLAKE2b algorithm

### Berlin (9 contracts)

Same as Istanbul, but with:
- Updated `BigModExp` to use EIP-2565 gas cost formula

### Cancun (10 contracts)

Includes all Berlin contracts, plus:

- **0x0a**: `PointEvaluation` - KZG commitment verification for EIP-4844 blobs

### Prague (17 contracts, proposed)

Includes all Cancun contracts, plus:

- **0x0b**: `BLS12_381_G1Add` - Addition on BLS12-381 G1 curve
- **0x0c**: `BLS12_381_G1MultiExp` - Multi-exponentiation on BLS12-381 G1
- **0x0d**: `BLS12_381_G2Add` - Addition on BLS12-381 G2 curve
- **0x0e**: `BLS12_381_G2MultiExp` - Multi-exponentiation on BLS12-381 G2
- **0x0f**: `BLS12_381_Pairing` - Pairing check on BLS12-381 curve
- **0x10**: `BLS12_381_MapG1` - Map field element to BLS12-381 G1 point
- **0x11**: `BLS12_381_MapG2` - Map field element to BLS12-381 G2 point

## File Organization

- **[Precompiles.zig](./Precompiles.zig)**: Main registry and interface for precompiled contracts
- **[common.zig](./common.zig)**: Common utilities and types (e.g., Identity contract)
- **[crypto.zig](./crypto.zig)**: Cryptographic precompiled contracts (e.g., ECRecover, SHA256, etc.)
- **[math.zig](./math.zig)**: Mathematical precompiled contracts (e.g., BigModExp)
- **[bls12_381.zig](./bls12_381.zig)**: BLS12-381 curve operations (EIP-2537)
- **[kzg.zig](./kzg.zig)**: KZG commitment verification for blob transactions (EIP-4844)
- **[params.zig](./params.zig)**: Gas cost parameters for precompiled contracts

## Implementation Details

### Gas Calculation

Each precompiled contract defines a `requiredGas` function that calculates the gas required based on the input data. The gas calculation follows the Ethereum Yellow Paper and relevant EIPs.

For example, from `bls12_381.zig`:

```zig
fn g1AddRequiredGas(input: []const u8) u64 {
    _ = input;
    return params.Bls12381G1AddGas;
}
```

### Contract Execution

The `run` function performs the actual contract logic. It takes the input data and allocator, and returns the output or an error.

```zig
fn g1AddRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // Validate input
    if (input.len != 256) {
        return BLS12381InvalidInputLengthError;
    }
    
    // Validate both points
    try validateG1Point(input[0..128]);
    try validateG1Point(input[128..256]);
    
    // Perform operation
    // ...
    
    return result;
}
```

### Hardfork-Specific Activation

The `activePrecompiledContracts` function returns the appropriate set of precompiled contracts based on the current chain rules:

```zig
pub fn activePrecompiledContracts(allocator: std.mem.Allocator, rules: ChainRules) !PrecompiledContracts {
    if (rules.IsVerkle) {
        return try berlinContracts(allocator);
    } else if (rules.IsPrague) {
        return try pragueContracts(allocator);
    } else if (rules.IsCancun) {
        return try cancunContracts(allocator);
    }
    // ...
}
```

## Testing

Each precompiled contract includes tests to verify:

1. Gas calculation
2. Input validation
3. Execution results

For example, the BLS12-381 precompiled contracts include tests like:

```zig
test "BLS12-381 G1 addition gas cost" {
    const input = [_]u8{0} ** 256;
    const gas = g1AddRequiredGas(&input);
    try std.testing.expectEqual(params.Bls12381G1AddGas, gas);
}
```

## Gas Costs

Gas costs are defined in `params.zig` and follow the Ethereum specifications. For example:

- **ECRecover**: 3,000 gas
- **Pairing Check**: Base fee of 45,000 gas plus 34,000 gas per pair
- **BLS12-381 G1 Addition**: 500 gas

## Future Extensions

The precompile implementation is designed to be extensible for future Ethereum hardforks. New precompiled contracts can be added by:

1. Implementing the contract logic in an appropriate module
2. Adding gas cost parameters in `params.zig`
3. Registering the contract in a new hardfork-specific function in `Precompiles.zig`