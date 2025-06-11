# Implement BLS12-381 PAIRING Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_bls12_381_pairing_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_bls12_381_pairing_precompile feat_implement_bls12_381_pairing_precompile`
3. **Work in isolation**: `cd g/feat_implement_bls12_381_pairing_precompile`
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

Implement the BLS12-381 pairing check precompile (address 0x0F) as defined in EIP-2537. This precompile performs bilinear pairing operations between G1 and G2 points, which is fundamental for BLS signature verification and other advanced cryptographic protocols.

## ELI5

Imagine you have two different types of puzzle pieces - red pieces (G1 points) and blue pieces (G2 points). A pairing is like checking if a red piece and blue piece fit together perfectly. The pairing precompile takes multiple pairs of these puzzle pieces and checks if ALL the red-blue combinations fit together in a specific mathematical way. This is the heart of BLS signature verification: you pair a signature (G1 point) with a public key (G2 point) and some message data, then check if everything "fits" correctly. It's like having a master key that can verify multiple locks at once. The pairing operation is extremely complex mathematically (involving something called bilinear maps), but the precompile makes it affordable to run on Ethereum, enabling things like efficient multi-signature schemes and zero-knowledge proofs.

## EIP-2537 Specification

### Basic Operation
- **Address**: `0x000000000000000000000000000000000000000F`
- **Gas Cost**: Variable based on number of pairs
- **Input**: Multiple (G1, G2) point pairs for pairing check
- **Output**: 32 bytes (boolean result: all-zeros for false, 0x01 for true)
- **Available**: Post-EIP-2537 hardforks

### Input Format
```
Input format (variable length):
- Each pair: 128 bytes (G1 point) + 256 bytes (G2 point) = 384 bytes
- Total input must be multiple of 384 bytes
- Minimum: 0 bytes (empty input returns true)
- Maximum: Implementation dependent

Pairing Check: e(P1, Q1) * e(P2, Q2) * ... * e(Pn, Qn) == 1
```

### Gas Calculation
```
base_cost = 65000
per_pair_cost = 43000
total_cost = base_cost + (num_pairs * per_pair_cost)
```

## Implementation Requirements

### Core Functionality
1. **Input Validation**: Verify G1 and G2 points are valid and on curve
2. **Pairing Computation**: Efficient bilinear pairing implementation
3. **Final Exponentiation**: Complete pairing with final exponentiation
4. **Product Calculation**: Compute product of all pairings
5. **Boolean Output**: Return true if product equals identity, false otherwise

### Files to Create/Modify
- `/src/evm/precompiles/bls12_381_pairing.zig` - New PAIRING implementation
- `/src/evm/crypto/bls12_381.zig` - BLS12-381 pairing operations (extend)
- `/src/evm/precompiles/precompiles.zig` - Add PAIRING to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add PAIRING address
- `/src/evm/constants/gas_constants.zig` - Add PAIRING gas costs
- `/test/evm/precompiles/bls12_381_pairing_test.zig` - Comprehensive tests

## Success Criteria

1. **EIP-2537 Compliance**: Fully implements EIP-2537 PAIRING specification
2. **Point Validation**: Correctly validates G1 and G2 points
3. **Pairing Correctness**: Produces correct pairing check results
4. **Gas Accuracy**: Implements correct gas pricing for pairing operations
5. **Edge Cases**: Handles empty input and identity elements correctly
6. **Integration**: Works with existing precompile infrastructure

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Use established BLS libraries** - Pairing is extremely complex to implement
3. **Validate all points thoroughly** - Both G1 and G2 points must be valid
4. **Test with EIP test vectors** - Use official EIP-2537 test cases
5. **Handle empty input correctly** - Empty input should return true