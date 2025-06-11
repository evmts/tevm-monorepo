# Implement BLS12-381 G1MSM Precompile

You are implementing BLS12-381 G1MSM Precompile for the Tevm EVM written in Zig. Your goal is to [specific objective] following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_bls` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_bls feat_implement_bls`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format

## Branch Setup
1. **Create branch**: `feat_implement_bls12_381_g1msm_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_bls12_381_g1msm_precompile feat_implement_bls12_381_g1msm_precompile`
3. **Work in isolation**: `cd g/feat_implement_bls12_381_g1msm_precompile`
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

Implement the BLS12-381 G1 multi-scalar multiplication precompile (address 0x0C) as defined in EIP-2537. This precompile performs efficient multi-scalar multiplication operations on the G1 group of the BLS12-381 elliptic curve, essential for BLS signature verification and other cryptographic protocols.

## ELI5

Imagine you're at a farmer's market and need to calculate the total cost of buying different quantities of various items. Multi-scalar multiplication is like having a super-fast calculator that can multiply many different numbers by many different amounts all at once, instead of doing each calculation one by one.

In the BLS12-381 G1 context, we're working with points on a special mathematical curve. Instead of regular numbers, we're multiplying curve points by scalar values (regular numbers). The "multi" part means we can do many of these multiplications simultaneously and then add all the results together in one efficient operation.

This enhanced version includes cutting-edge optimizations like:
- **Smart batching**: Grouping similar calculations to process them more efficiently
- **Windowing techniques**: Pre-calculating common values to speed up repeated operations
- **Parallel processing**: Using multiple CPU cores simultaneously
- **Algorithm selection**: Automatically choosing the fastest method based on input characteristics

Why is this important? Zero-knowledge proofs and advanced cryptographic systems need to perform thousands of these operations. Having them optimized means applications like private transactions, identity verification, and scalability solutions can run much faster and cost less gas.

## EIP-2537 Specification

### Basic Operation
- **Address**: `0x000000000000000000000000000000000000000C`
- **Gas Cost**: Variable based on input size and complexity
- **Input**: Multiple (scalar, point) pairs for multi-scalar multiplication
- **Output**: Single G1 point result
- **Available**: Post-EIP-2537 hardforks

### Input Format
```
Input format (variable length):
- Each pair: 32 bytes (scalar) + 128 bytes (G1 point) = 160 bytes
- Total input must be multiple of 160 bytes
- Minimum: 160 bytes (1 pair)
- Maximum: Implementation dependent
```

### Gas Calculation
```
base_cost = 12275
per_pair_cost = 15900
total_cost = base_cost + (num_pairs * per_pair_cost)
```

## Implementation Requirements

### Core Functionality
1. **Input Validation**: Verify G1 point validity and scalar range
2. **Multi-Scalar Multiplication**: Efficient MSM algorithm implementation
3. **Gas Calculation**: Accurate cost based on input size
4. **Point Serialization**: Proper BLS12-381 G1 point encoding/decoding
5. **Error Handling**: Handle invalid points and out-of-gas conditions

### Files to Create/Modify
- `/src/evm/precompiles/bls12_381_g1msm.zig` - New G1MSM implementation
- `/src/evm/crypto/bls12_381.zig` - BLS12-381 curve operations
- `/src/evm/precompiles/precompiles.zig` - Add G1MSM to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add G1MSM address
- `/src/evm/constants/gas_constants.zig` - Add G1MSM gas costs
- `/test/evm/precompiles/bls12_381_g1msm_test.zig` - Comprehensive tests

## Success Criteria

1. **EIP-2537 Compliance**: Fully implements EIP-2537 G1MSM specification
2. **Point Validation**: Correctly validates G1 points and rejects invalid inputs
3. **MSM Correctness**: Produces correct multi-scalar multiplication results
4. **Gas Accuracy**: Implements correct gas pricing model
5. **Performance**: Efficient implementation suitable for production use
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

