# Implement BLS12-381 G2MSM Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_bls12_381_g2msm_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_bls12_381_g2msm_precompile feat_implement_bls12_381_g2msm_precompile`
3. **Work in isolation**: `cd g/feat_implement_bls12_381_g2msm_precompile`
4. **Commit message**: `✨ feat: implement BLS12-381 G2 multi-scalar multiplication precompile`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the BLS12-381 G2 multi-scalar multiplication precompile (address 0x0E) as defined in EIP-2537. This precompile performs efficient multi-scalar multiplication operations on the G2 group of the BLS12-381 elliptic curve, operating over the extension field Fp2.

## EIP-2537 Specification

### Basic Operation
- **Address**: `0x000000000000000000000000000000000000000E`
- **Gas Cost**: Variable based on input size and complexity
- **Input**: Multiple (scalar, G2 point) pairs for multi-scalar multiplication
- **Output**: Single G2 point result
- **Available**: Post-EIP-2537 hardforks

### Input Format
```
Input format (variable length):
- Each pair: 32 bytes (scalar) + 256 bytes (G2 point) = 288 bytes
- Total input must be multiple of 288 bytes
- Minimum: 288 bytes (1 pair)
- Maximum: Implementation dependent

G2 Point Format (256 bytes):
- x_c0 (64 bytes): Real part of x coordinate
- x_c1 (64 bytes): Imaginary part of x coordinate
- y_c0 (64 bytes): Real part of y coordinate
- y_c1 (64 bytes): Imaginary part of y coordinate
```

### Gas Calculation
```
base_cost = 55000
per_pair_cost = 32000
total_cost = base_cost + (num_pairs * per_pair_cost)
```

## Implementation Requirements

### Core Functionality
1. **Input Validation**: Verify G2 points are on curve and scalars are valid
2. **Multi-Scalar Multiplication**: Efficient MSM algorithm for G2 points
3. **Gas Calculation**: Accurate cost based on number of pairs
4. **Point Serialization**: Proper G2 point encoding/decoding over Fp2
5. **Error Handling**: Handle invalid points and out-of-gas conditions

### Files to Create/Modify
- `/src/evm/precompiles/bls12_381_g2msm.zig` - New G2MSM implementation
- `/src/evm/crypto/bls12_381.zig` - BLS12-381 curve operations (extend)
- `/src/evm/precompiles/precompiles.zig` - Add G2MSM to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add G2MSM address
- `/src/evm/constants/gas_constants.zig` - Add G2MSM gas costs
- `/test/evm/precompiles/bls12_381_g2msm_test.zig` - Comprehensive tests

## Success Criteria

1. **EIP-2537 Compliance**: Fully implements EIP-2537 G2MSM specification
2. **Point Validation**: Correctly validates G2 points and subgroup membership
3. **MSM Correctness**: Produces correct multi-scalar multiplication results
4. **Gas Accuracy**: Implements correct gas pricing model for G2 operations
5. **Performance**: Efficient implementation suitable for production use
6. **Integration**: Works with existing precompile infrastructure

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Use established BLS libraries** - Don't implement Fp2 arithmetic from scratch
3. **Validate subgroup membership** - G2 points must be in correct subgroup
4. **Test with EIP test vectors** - Use official EIP-2537 test cases
5. **Handle large inputs gracefully** - Prevent DoS via large G2 MSM operations