# Implement BLS12-381 G2ADD Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_bls12_381_g2add_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_bls12_381_g2add_precompile feat_implement_bls12_381_g2add_precompile`
3. **Work in isolation**: `cd g/feat_implement_bls12_381_g2add_precompile`
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

Implement the BLS12-381 G2 addition precompile (address 0x0D) as defined in EIP-2537. This precompile performs point addition operations on the G2 group of the BLS12-381 elliptic curve, which operates over an extension field and is essential for BLS signature verification.

## ELI5

Think of G2 points as special mathematical objects that live in a more complex space than regular G1 points - like the difference between working with regular numbers versus complex numbers (a + bi). G2 addition is like having two locations on a curved surface in this complex space and finding a third location that represents their "sum." This is crucial for BLS signatures because G2 points are where the public keys live, while G1 points are where signatures live. When you want to verify multiple signatures together (like combining votes from multiple validators), you need to do math with these G2 points. The precompile makes this operation fast and cheap, which is essential for things like Ethereum's proof-of-stake consensus where thousands of validator signatures need to be processed efficiently.

## EIP-2537 Specification

### Basic Operation
- **Address**: `0x000000000000000000000000000000000000000D`
- **Gas Cost**: 800 (fixed cost)
- **Input**: 512 bytes (two G2 points, 256 bytes each)
- **Output**: 256 bytes (single G2 point result)
- **Available**: Post-EIP-2537 hardforks

### Input Format
```
Input (512 bytes total):
- Point A (256 bytes): G2 point in uncompressed format
- Point B (256 bytes): G2 point in uncompressed format

G2 Point Format (256 bytes):
- x_c0 (64 bytes): Real part of x coordinate
- x_c1 (64 bytes): Imaginary part of x coordinate  
- y_c0 (64 bytes): Real part of y coordinate
- y_c1 (64 bytes): Imaginary part of y coordinate
```

### Output Format
- **Success**: 256-byte G2 point (A + B)
- **Failure**: Empty output on invalid input

## Implementation Requirements

### Core Functionality
1. **Input Validation**: Verify G2 points are on curve and in valid subgroup
2. **Point Addition**: Perform elliptic curve addition in G2
3. **Point Serialization**: Handle G2 point encoding/decoding
4. **Infinity Handling**: Proper handling of point at infinity
5. **Error Handling**: Reject invalid points and malformed input

### Files to Create/Modify
- `/src/evm/precompiles/bls12_381_g2add.zig` - New G2ADD implementation
- `/src/evm/crypto/bls12_381.zig` - BLS12-381 curve operations (if not exists)
- `/src/evm/precompiles/precompiles.zig` - Add G2ADD to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add G2ADD address
- `/src/evm/constants/gas_constants.zig` - Add G2ADD gas cost
- `/test/evm/precompiles/bls12_381_g2add_test.zig` - Comprehensive tests

## Success Criteria

1. **EIP-2537 Compliance**: Fully implements EIP-2537 G2ADD specification
2. **Point Validation**: Correctly validates G2 points and subgroup membership
3. **Addition Correctness**: Produces correct G2 point addition results
4. **Gas Accuracy**: Consumes exactly 800 gas per operation
5. **Edge Cases**: Handles infinity points and identity operations correctly
6. **Integration**: Works with existing precompile infrastructure

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Use established BLS libraries** - Don't implement field arithmetic from scratch
3. **Validate subgroup membership** - Points must be in correct subgroup
4. **Test with EIP test vectors** - Use official EIP-2537 test cases
5. **Handle field elements correctly** - Proper Fp2 arithmetic implementation