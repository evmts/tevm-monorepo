# Implement KZG Point Evaluation Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_kzg_point_evaluation_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_kzg_point_evaluation_precompile feat_implement_kzg_point_evaluation_precompile`
3. **Work in isolation**: `cd g/feat_implement_kzg_point_evaluation_precompile`
4. **Commit message**: `✨ feat: implement KZG point evaluation precompile`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the KZG Point Evaluation precompile (address 0x0A) for Ethereum Virtual Machine compatibility. This precompile is critical for EIP-4844 blob verification and enables efficient polynomial commitment verification.

## Ethereum Specification

### Basic Operation
- **Address**: `0x000000000000000000000000000000000000000A`
- **Gas Cost**: 50,000 static gas cost
- **Function**: Verifies KZG polynomial commitment proof
- **Available**: Cancun hardfork onwards (EIP-4844)
- **Input**: 192 bytes (commitment + z + y + proof)
- **Output**: 32 bytes (verification result: 1 for success, 0 for failure)

## Implementation Requirements

### Core Functionality
1. **KZG Verification**: Polynomial commitment proof verification
2. **BLS12-381 Operations**: Uses BLS12-381 curve for commitments
3. **Input Validation**: Validate all curve points and field elements
4. **Gas Calculation**: Static 50,000 gas cost
5. **Trusted Setup**: Uses ceremony-generated setup parameters

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test against EIP-4844 vectors** - Essential for blob transaction support
3. **Implement BLS12-381 operations** - Requires complex elliptic curve math
4. **Use trusted setup parameters** - Must match official ceremony output
5. **Validate all inputs thoroughly** - Invalid points can cause undefined behavior
6. **Optimize for performance** - This is used in every blob transaction

## References

- [EIP-4844: Shard Blob Transactions](https://eips.ethereum.org/EIPS/eip-4844)
- [KZG Polynomial Commitments](https://dankradfeist.de/ethereum/2020/06/16/kate-polynomial-commitments.html)
- [BLS12-381 Curve Specification](https://datatracker.ietf.org/doc/draft-irtf-cfrg-bls-signature/)
- [Trusted Setup Ceremony](https://ceremony.ethereum.org/)