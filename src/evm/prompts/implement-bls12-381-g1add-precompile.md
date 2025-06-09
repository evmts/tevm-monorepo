# Implement BLS12-381 G1ADD Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_bls12_381_g1add_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_bls12_381_g1add_precompile feat_implement_bls12_381_g1add_precompile`
3. **Work in isolation**: `cd g/feat_implement_bls12_381_g1add_precompile`
4. **Commit message**: `✨ feat: implement BLS12-381 G1 point addition precompile`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement BLS12-381 G1 point addition precompile for EIP-2537 support. This precompile enables efficient elliptic curve operations on the BLS12-381 curve.

## Implementation Requirements

### Core Functionality
1. **G1 Point Addition**: BLS12-381 elliptic curve point addition
2. **Input Validation**: Validate points are on correct curve
3. **Gas Calculation**: Appropriate gas costs and metering
4. **Error Handling**: Handle invalid points and edge cases
5. **Performance**: Optimized for BLS12-381 curve parameters

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test against EIP-2537 vectors** - Essential for specification compliance
3. **Implement BLS12-381 field arithmetic** - Requires 381-bit prime field
4. **Handle point at infinity** - Proper identity element handling
5. **Validate all inputs thoroughly** - Invalid points can cause undefined behavior
6. **Optimize for performance** - Used in BLS signature verification

## References

- [EIP-2537: Precompile for BLS12-381 curve operations](https://eips.ethereum.org/EIPS/eip-2537)
- [BLS12-381 Curve Specification](https://datatracker.ietf.org/doc/draft-irtf-cfrg-bls-signature/)
- [BLS12-381 Implementation Guide](https://hackmd.io/@benjaminion/bls12-381)