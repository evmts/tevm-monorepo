# Implement BLS12-381 MAP_FP_TO_G1 Precompile

You are implementing BLS12-381 MAP_FP_TO_G1 Precompile for the Tevm EVM written in Zig. Your goal is to [specific objective] following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_bls` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_bls feat_implement_bls`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format

## Branch Setup
1. **Create branch**: `feat_implement_bls12_381_map_fp_to_g1_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_bls12_381_map_fp_to_g1_precompile feat_implement_bls12_381_map_fp_to_g1_precompile`
3. **Work in isolation**: `cd g/feat_implement_bls12_381_map_fp_to_g1_precompile`
4. **Commit message**: Use the following XML format:

```
✨ feat: brief description of the change

<summary>
<what>
- Bullet point summary of what was changed
- Key implementation details and files modified
</what>

<why>
- Motivation and reasoning behind the changes
- Problem being solved or feature being added
</why>

<how>
- Technical approach and implementation strategy
- Important design decisions or trade-offs made
</how>
</summary>

<prompt>
Condensed version of the original prompt that includes:
- The core request or task
- Essential context needed to re-execute
- Replace large code blocks with <github>url</github> or <docs>description</docs>
- Remove redundant examples but keep key technical details
- Ensure someone could understand and repeat the task from this prompt alone
</prompt>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the BLS12-381 MAP_FP_TO_G1 precompile (address 0x10) as defined in EIP-2537. This precompile maps a field element to a point on the G1 curve using a deterministic hash-to-curve algorithm, essential for hash-to-curve operations in BLS signature schemes.

## ELI5

Imagine you have a random number and you want to convert it into a valid point on the BLS12-381 curve - like turning a random coordinate into a valid location on a specific curved road. The MAP_FP_TO_G1 precompile does exactly this: it takes a field element (a special kind of number that fits within the BLS12-381 system) and deterministically maps it to a G1 point on the curve. This is essential for "hash-to-curve" operations, where you need to convert hash values or other data into valid curve points. Think of it like having a GPS that can take any random coordinate and snap it to the nearest valid road - but in this case, the "road" is the mathematical curve. This operation is used in advanced signature schemes and cryptographic protocols where you need to convert arbitrary data into curve points for further processing.

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

## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions

## Success Criteria
✅ All tests pass with `zig build test-all`
✅ Implementation matches Ethereum specification exactly
✅ Input validation handles all edge cases
✅ Output format matches reference implementations
✅ Performance meets or exceeds benchmarks
✅ Gas costs are calculated correctly

