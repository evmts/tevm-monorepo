# Implement OP Stack Precompiles

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_op_stack_precompiles` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_op_stack_precompiles feat_implement_op_stack_precompiles`
3. **Work in isolation**: `cd g/feat_implement_op_stack_precompiles`
4. **Commit message**: `✨ feat: implement OP Stack P256VERIFY precompile for SECP256R1 signature verification`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement OP Stack specific precompiles, particularly P256VERIFY (RIP-7212) for SECP256R1 signature verification. This precompile enables efficient verification of SECP256R1 (P-256) signatures, which is widely used in modern cryptographic applications and WebAuthn.

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

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Use established P-256 libraries** - Don't implement curve from scratch
3. **Validate all inputs thoroughly** - Invalid inputs must return 0x00
4. **Test with RIP test vectors** - Use official RIP-7212 test cases
5. **Respect chain activation** - Only activate on appropriate chains