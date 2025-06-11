# Implement BLS12-381 MAP_FP_TO_G1 Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_bls12_381_map_fp_to_g1_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_bls12_381_map_fp_to_g1_precompile feat_implement_bls12_381_map_fp_to_g1_precompile`
3. **Work in isolation**: `cd g/feat_implement_bls12_381_map_fp_to_g1_precompile`
4. **Commit message**: `✨ feat: implement BLS12-381 map field point to G1 precompile`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the BLS12-381 MAP_FP_TO_G1 precompile (address 0x10) as defined in EIP-2537. This precompile maps a field element to a point on the G1 curve using a deterministic hash-to-curve algorithm, essential for hash-to-curve operations in BLS signature schemes.

## EIP-2537 Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000010`
- **Gas Cost**: 5500 (fixed cost)
- **Input**: 64 bytes (field element in Fp)
- **Output**: 128 bytes (G1 point)
- **Available**: Post-EIP-2537 hardforks

### Input Format
```
Input (64 bytes):
- Field element in Fp (64 bytes, big-endian)

Requirements:
- Input must be a valid field element (< BLS12-381 prime modulus)
- Invalid field elements should cause the operation to fail
```

### Output Format
```
Output (128 bytes):
- G1 point in uncompressed format
- x coordinate (64 bytes)
- y coordinate (64 bytes)
```

## Implementation Requirements

### Core Functionality
1. **Field Validation**: Verify input is valid Fp element
2. **Hash-to-Curve**: Implement deterministic map from Fp to G1
3. **Point Validation**: Ensure output point is on curve and in subgroup
4. **Deterministic Mapping**: Same input always produces same output
5. **Error Handling**: Reject invalid field elements

### Files to Create/Modify
- `/src/evm/precompiles/bls12_381_map_fp_to_g1.zig` - New MAP_FP_TO_G1 implementation
- `/src/evm/crypto/bls12_381.zig` - Hash-to-curve operations (extend)
- `/src/evm/precompiles/precompiles.zig` - Add MAP_FP_TO_G1 to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add MAP_FP_TO_G1 address
- `/src/evm/constants/gas_constants.zig` - Add MAP_FP_TO_G1 gas cost
- `/test/evm/precompiles/bls12_381_map_fp_to_g1_test.zig` - Comprehensive tests

## Success Criteria

1. **EIP-2537 Compliance**: Fully implements EIP-2537 MAP_FP_TO_G1 specification
2. **Field Validation**: Correctly validates Fp field elements
3. **Mapping Correctness**: Produces valid G1 points from field elements
4. **Deterministic**: Same input always produces same output
5. **Gas Accuracy**: Consumes exactly 5500 gas per operation
6. **Integration**: Works with existing precompile infrastructure

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Use established hash-to-curve libraries** - Complex algorithm to implement
3. **Validate field elements** - Input must be valid Fp element
4. **Test with EIP test vectors** - Use official EIP-2537 test cases
5. **Ensure deterministic behavior** - Critical for consensus compatibility