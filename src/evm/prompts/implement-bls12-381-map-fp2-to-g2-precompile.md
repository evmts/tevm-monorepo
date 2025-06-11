# Implement BLS12-381 MAP_FP2_TO_G2 Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_bls12_381_map_fp2_to_g2_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_bls12_381_map_fp2_to_g2_precompile feat_implement_bls12_381_map_fp2_to_g2_precompile`
3. **Work in isolation**: `cd g/feat_implement_bls12_381_map_fp2_to_g2_precompile`
4. **Commit message**: `✨ feat: implement BLS12-381 map field point to G2 precompile`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the BLS12-381 MAP_FP2_TO_G2 precompile (address 0x11) as defined in EIP-2537. This precompile maps an extension field element (Fp2) to a point on the G2 curve using a deterministic hash-to-curve algorithm, essential for hash-to-curve operations on G2 in BLS signature schemes.

## EIP-2537 Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000011`
- **Gas Cost**: 110000 (fixed cost)
- **Input**: 128 bytes (field element in Fp2)
- **Output**: 256 bytes (G2 point)
- **Available**: Post-EIP-2537 hardforks

### Input Format
```
Input (128 bytes):
- Fp2 element: c0 (64 bytes) + c1 (64 bytes), big-endian
- c0: Real part of the field element
- c1: Imaginary part of the field element

Requirements:
- Both c0 and c1 must be valid Fp elements (< BLS12-381 prime modulus)
- Invalid field elements should cause the operation to fail
```

### Output Format
```
Output (256 bytes):
- G2 point in uncompressed format
- x_c0 (64 bytes): Real part of x coordinate
- x_c1 (64 bytes): Imaginary part of x coordinate
- y_c0 (64 bytes): Real part of y coordinate
- y_c1 (64 bytes): Imaginary part of y coordinate
```

## Implementation Requirements

### Core Functionality
1. **Field Validation**: Verify input is valid Fp2 element
2. **Hash-to-Curve**: Implement deterministic map from Fp2 to G2
3. **Point Validation**: Ensure output point is on curve and in subgroup
4. **Deterministic Mapping**: Same input always produces same output
5. **Error Handling**: Reject invalid field elements

### Files to Create/Modify
- `/src/evm/precompiles/bls12_381_map_fp2_to_g2.zig` - New MAP_FP2_TO_G2 implementation
- `/src/evm/crypto/bls12_381.zig` - Hash-to-curve operations for G2 (extend)
- `/src/evm/precompiles/precompiles.zig` - Add MAP_FP2_TO_G2 to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add MAP_FP2_TO_G2 address
- `/src/evm/constants/gas_constants.zig` - Add MAP_FP2_TO_G2 gas cost
- `/test/evm/precompiles/bls12_381_map_fp2_to_g2_test.zig` - Comprehensive tests

## Success Criteria

1. **EIP-2537 Compliance**: Fully implements EIP-2537 MAP_FP2_TO_G2 specification
2. **Field Validation**: Correctly validates Fp2 field elements
3. **Mapping Correctness**: Produces valid G2 points from Fp2 elements
4. **Deterministic**: Same input always produces same output
5. **Gas Accuracy**: Consumes exactly 110000 gas per operation
6. **Integration**: Works with existing precompile infrastructure

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Use established hash-to-curve libraries** - Very complex algorithm for G2
3. **Validate Fp2 elements** - Both components must be valid Fp elements
4. **Test with EIP test vectors** - Use official EIP-2537 test cases
5. **Ensure deterministic behavior** - Critical for consensus compatibility