# Implement BLAKE2F Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_blake2f_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_blake2f_precompile feat_implement_blake2f_precompile`
3. **Work in isolation**: `cd g/feat_implement_blake2f_precompile`
4. **Commit message**: `✨ feat: implement BLAKE2F precompile`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the BLAKE2F precompile (address 0x09) for Ethereum Virtual Machine compatibility. This precompile provides the BLAKE2b compression function and is available from the Istanbul hardfork.

## Ethereum Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000009`
- **Gas Cost**: Dynamic based on number of rounds
- **Function**: BLAKE2b compression function (F function)
- **Available**: Istanbul hardfork onwards
- **Input**: 213 bytes (rounds + h + m + t + f)
- **Output**: 64 bytes (new hash state)

## Implementation Requirements

### Core Functionality
1. **Compression Function**: BLAKE2b F function implementation
2. **Input Validation**: Validate rounds count and input format
3. **Gas Calculation**: 1 gas per round
4. **Endianness Handling**: Proper little-endian/big-endian conversion
5. **Performance**: Optimized for multiple rounds

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test against EIP-152 vectors** - Ensure exact specification compliance
3. **Handle large round counts** - Test with maximum u32 values
4. **Optimize for performance** - This can be compute-intensive
5. **Validate inputs thoroughly** - Prevent malformed input issues
6. **Use proven algorithms** - Follow BLAKE2b specification exactly

## References

- [EIP-152: Add BLAKE2 compression function F precompile](https://eips.ethereum.org/EIPS/eip-152)
- [RFC 7693: The BLAKE2 Cryptographic Hash and Message Authentication Code (MAC)](https://tools.ietf.org/rfc/rfc7693.txt)
- [BLAKE2 Official Website](https://www.blake2.net/)
- [BLAKE2b Implementation Guide](https://github.com/BLAKE2/BLAKE2/blob/master/ref/blake2b-ref.c)