# Implement OP Stack Precompiles

You are implementing OP Stack Precompiles for the Tevm EVM written in Zig. Your goal is to implement Optimism Stack precompiles and functionality following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_op_stack_precompiles` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_op_stack_precompiles feat_implement_op_stack_precompiles`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement OP Stack specific precompiles, particularly P256VERIFY (RIP-7212) for SECP256R1 signature verification. This precompile enables efficient verification of SECP256R1 (P-256) signatures, which is widely used in modern cryptographic applications and WebAuthn.

## ELI5

Precompiles are like special built-in calculators for complex math operations. The OP Stack chains (like Optimism and Base) added a new calculator called P256VERIFY that's really good at checking if digital signatures are genuine. It's like having a specialized document authentication machine that can quickly verify if someone's digital signature on a document is real, which is especially useful for modern web authentication systems.

## RIP-7212 Specification

### P256VERIFY Precompile
- **Address**: `0x0000000000000000000000000000000000000100` (256 in decimal)
- **Gas Cost**: 3450 (fixed cost)
- **Input**: 160 bytes (hash + r + s + x + y)
- **Output**: 32 bytes (0x01 for valid, 0x00 for invalid)
- **Available**: OP Stack chains only

### Input Format
```
Input (160 bytes total):
- hash (32 bytes): Hash of the message that was signed
- r (32 bytes): ECDSA signature r component
- s (32 bytes): ECDSA signature s component
- x (32 bytes): Public key x coordinate
- y (32 bytes): Public key y coordinate
```

### Output Format
- **Valid signature**: 32 bytes with value 0x01 (padded with leading zeros)
- **Invalid signature**: 32 bytes with value 0x00 (all zeros)

## Implementation Requirements

### Core Functionality
1. **Input Validation**: Verify signature parameters and public key validity
2. **SECP256R1 Operations**: Implement P-256 elliptic curve operations
3. **Signature Verification**: Verify ECDSA signatures on SECP256R1 curve
4. **Public Key Validation**: Ensure public key is on curve and valid
5. **Error Handling**: Return 0x00 for any validation failure

### Files to Create/Modify
- `/src/evm/precompiles/p256verify.zig` - New P256VERIFY implementation
- `/src/evm/crypto/secp256r1.zig` - SECP256R1 curve operations
- `/src/evm/precompiles/precompiles.zig` - Add P256VERIFY to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add P256VERIFY address
- `/src/evm/constants/gas_constants.zig` - Add P256VERIFY gas cost
- `/test/evm/precompiles/p256verify_test.zig` - Comprehensive tests

### Chain-Specific Activation
```zig
// Only activate on OP Stack chains
pub fn is_p256verify_available(chain_id: u64) bool {
    return switch (chain_id) {
        10, 420, 11155420 => true, // Optimism, Optimism Goerli, Optimism Sepolia
        8453, 84531, 84532 => true, // Base, Base Goerli, Base Sepolia
        // Add other OP Stack chain IDs as needed
        else => false,
    };
}
```

## Success Criteria

1. **RIP-7212 Compliance**: Fully implements RIP-7212 P256VERIFY specification
2. **Signature Verification**: Correctly verifies SECP256R1 ECDSA signatures
3. **Input Validation**: Properly validates signature parameters and public keys
4. **Gas Accuracy**: Consumes exactly 3450 gas per operation
5. **Chain Activation**: Only available on OP Stack chains
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

