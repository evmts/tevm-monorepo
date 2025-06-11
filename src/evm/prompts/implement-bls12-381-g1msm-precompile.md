# Implement BLS12-381 G1MSM Precompile

## Git Workflow Instructions

### Branch Setup
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

Think of this as having many points on a curved surface (G1 points) and you want to "scale" each point by different amounts (like stretching or shrinking), then combine all the scaled results together. Multi-scalar multiplication (MSM) is like having a super-efficient calculator that can do "5×Point1 + 3×Point2 + 8×Point3 + ..." all in one go, rather than doing each multiplication and addition step by step. This is incredibly useful for things like verifying multiple BLS signatures at once or processing zero-knowledge proofs that involve many G1 operations. Instead of making hundreds of separate function calls, you can batch everything into one MSM operation, which is much faster and cheaper. It's like the difference between making 100 individual purchases versus buying everything in one shopping cart - much more efficient!

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

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Use established BLS libraries** - Don't implement curve math from scratch
3. **Validate all inputs thoroughly** - Invalid inputs must be rejected
4. **Test with EIP test vectors** - Use official EIP-2537 test cases
5. **Handle large inputs gracefully** - Prevent DoS via large MSM operations