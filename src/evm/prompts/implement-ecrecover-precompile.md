# Implement ECRECOVER Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_ecrecover_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_ecrecover_precompile feat_implement_ecrecover_precompile`
3. **Work in isolation**: `cd g/feat_implement_ecrecover_precompile`
4. **Commit message**: `✨ feat: implement ECRECOVER precompile for signature recovery`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the ECRECOVER precompile (address 0x01) for Ethereum Virtual Machine compatibility. This precompile recovers the signer's address from an ECDSA signature using elliptic curve cryptography. This is fundamental for Ethereum's signature verification system.

## Ethereum Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000001`
- **Gas Cost**: `3000` (fixed cost)
- **Input**: 128 bytes (hash, v, r, s)
- **Output**: 20 bytes (recovered address) or empty on failure
- **Available**: All hardforks (Frontier onwards)

### Input Format
```
Input (128 bytes total):
- hash (32 bytes): Hash of the message that was signed
- v (32 bytes): Recovery ID (27 or 28, or chain_id * 2 + 35/36 for EIP-155)
- r (32 bytes): ECDSA signature r component
- s (32 bytes): ECDSA signature s component
```

### Output Format
- **Success**: 20-byte Ethereum address (left-padded to 32 bytes)
- **Failure**: Empty output (0 bytes)

## Reference Implementations

### evmone Implementation
File: Search for `ecrecover` in evmone precompiles for gas costs and validation

### revm Implementation
File: Search for `ecrecover` in revm for modern implementation patterns

### secp256k1 Library
Zig doesn't have a built-in secp256k1 implementation, so we'll need to either:
1. Use a C library binding (libsecp256k1)
2. Implement secp256k1 in pure Zig
3. Use WebAssembly crypto APIs for browser contexts

## Implementation Requirements

### Core Functionality
1. **Signature Validation**: Verify r, s values are in valid range
2. **Recovery ID Processing**: Handle both legacy (27/28) and EIP-155 v values
3. **Point Recovery**: Recover public key from signature components
4. **Address Derivation**: Convert public key to Ethereum address
5. **Error Handling**: Return empty output on any validation failure

### Signature Validation Rules
```zig
// ECDSA signature parameter validation
fn validate_signature_params(v: u256, r: u256, s: u256) bool {
    // r and s must be in range [1, secp256k1_order)
    const SECP256K1_ORDER = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;
    
    // r must be non-zero and less than curve order
    if (r == 0 or r >= SECP256K1_ORDER) return false;
    
    // s must be non-zero and less than curve order
    if (s == 0 or s >= SECP256K1_ORDER) return false;
    
    // v must be 27, 28, or EIP-155 format
    const recovery_id = extract_recovery_id(v);
    if (recovery_id != 0 and recovery_id != 1) return false;
    
    return true;
}
```

## Implementation Tasks

### Task 1: Add ECRECOVER Gas Constants
File: `/src/evm/constants/gas_constants.zig`
```zig
// ECRECOVER precompile gas cost
pub const ECRECOVER_COST: u64 = 3000;
```

### Task 2: Implement ECRECOVER Precompile
File: `/src/evm/precompiles/ecrecover.zig`
```zig
const std = @import("std");
const gas_constants = @import("../constants/gas_constants.zig");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;
const B256 = @import("../Types/B256.ts").B256;

// secp256k1 curve order
const SECP256K1_ORDER: u256 = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;

pub fn calculate_gas(input_size: usize) u64 {
    // ECRECOVER has fixed gas cost regardless of input size
    _ = input_size;
    return gas_constants.ECRECOVER_COST;
}

pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    const gas_cost = calculate_gas(input.len);
    if (gas_cost > gas_limit) return PrecompileError.OutOfGas;
    
    // Ensure we have exactly 128 bytes of input
    if (input.len != 128) {
        // Invalid input size - return empty output
        return PrecompileResult{ .gas_used = gas_cost, .output_size = 0 };
    }
    
    // Parse input components
    const hash = input[0..32];
    const v_bytes = input[32..64];
    const r_bytes = input[64..96];
    const s_bytes = input[96..128];
    
    // Convert to u256 values
    const v = U256.from_bytes(v_bytes);
    const r = U256.from_bytes(r_bytes);
    const s = U256.from_bytes(s_bytes);
    
    // Validate signature parameters
    if (!validate_signature_params(v, r, s)) {
        return PrecompileResult{ .gas_used = gas_cost, .output_size = 0 };
    }
    
    // Extract recovery ID from v value
    const recovery_id = extract_recovery_id(v);
    
    // Recover public key from signature
    const public_key = recover_public_key(hash, recovery_id, r, s) catch {
        return PrecompileResult{ .gas_used = gas_cost, .output_size = 0 };
    };
    
    // Derive Ethereum address from public key
    const address = derive_address_from_pubkey(public_key);
    
    // Write address to output (left-padded to 32 bytes)
    if (output.len < 32) return PrecompileError.InvalidOutput;
    
    // Clear output buffer
    @memset(output[0..32], 0);
    
    // Copy address to last 20 bytes
    @memcpy(output[12..32], &address.bytes);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
}

fn validate_signature_params(v: u256, r: u256, s: u256) bool {
    // r must be in range [1, secp256k1_order)
    if (r == 0 or r >= SECP256K1_ORDER) return false;
    
    // s must be in range [1, secp256k1_order)
    if (s == 0 or s >= SECP256K1_ORDER) return false;
    
    // v validation happens in extract_recovery_id
    const recovery_id = extract_recovery_id(v);
    if (recovery_id > 1) return false;
    
    return true;
}

fn extract_recovery_id(v: u256) u8 {
    // Handle legacy format (27, 28)
    if (v == 27) return 0;
    if (v == 28) return 1;
    
    // Handle EIP-155 format (chain_id * 2 + 35/36)
    if (v >= 35) {
        const adjusted = v - 35;
        const recovery_id = @as(u8, @intCast(adjusted % 2));
        return recovery_id;
    }
    
    // Invalid v value
    return 255; // Invalid marker
}

fn recover_public_key(hash: []const u8, recovery_id: u8, r: u256, s: u256) ![]const u8 {
    // This is a placeholder - actual implementation depends on crypto library choice
    // Options:
    // 1. Link to libsecp256k1 C library
    // 2. Implement pure Zig secp256k1
    // 3. Use WebAssembly crypto APIs
    
    // For now, return placeholder implementation
    // TODO: Implement actual ECDSA recovery
    _ = hash;
    _ = recovery_id;
    _ = r;
    _ = s;
    
    return error.NotImplemented;
}

fn derive_address_from_pubkey(public_key: []const u8) Address {
    // Ethereum address = last 20 bytes of keccak256(public_key[1..])
    // (Skip the first byte which is the compression flag)
    
    const Keccak256 = std.crypto.hash.sha3.Keccak256;
    var hasher = Keccak256.init(.{});
    
    // Use uncompressed public key without the 0x04 prefix
    hasher.update(public_key[1..]);
    const hash = hasher.finalResult();
    
    // Take last 20 bytes as address
    var address: Address = undefined;
    @memcpy(&address.bytes, hash[12..32]);
    
    return address;
}
```

### Task 3: Crypto Library Integration
File: `/src/evm/crypto/secp256k1.zig`
```zig
// This file will contain the secp256k1 implementation
// Options for implementation:

// Option 1: C library binding
const c = @cImport({
    @cInclude("secp256k1.h");
    @cInclude("secp256k1_recovery.h");
});

pub fn recover_public_key_c(hash: []const u8, recovery_id: u8, r: []const u8, s: []const u8) ![]const u8 {
    // Use libsecp256k1 for recovery
    // This requires linking against libsecp256k1
}

// Option 2: Pure Zig implementation (more complex but self-contained)
pub fn recover_public_key_zig(hash: []const u8, recovery_id: u8, r: []const u8, s: []const u8) ![]const u8 {
    // Implement ECDSA recovery in pure Zig
    // This would be a significant undertaking
}

// Option 3: WebAssembly crypto APIs (for browser deployment)
pub fn recover_public_key_wasm(hash: []const u8, recovery_id: u8, r: []const u8, s: []const u8) ![]const u8 {
    // Use browser's crypto APIs via WASM imports
}
```

### Task 4: Update Precompile Dispatcher
File: `/src/evm/precompiles/precompiles.zig` (modify existing)
Add ECRECOVER to the precompile address mapping and execution dispatch.

### Task 5: Update Precompile Addresses
File: `/src/evm/precompiles/precompile_addresses.zig` (modify existing)
```zig
pub const ECRECOVER_ADDRESS: u8 = 0x01;
```

### Task 6: Comprehensive Testing
File: `/test/evm/precompiles/ecrecover_test.zig`

### Test Cases
```zig
test "ecrecover known test vectors" {
    // Test vector from Ethereum test suite
    const hash = "0x456e9aea5e197a1f1af7a3e85a3212fa4049a3ba34c2289b4c860fc0b0c64ef3";
    const v: u8 = 28;
    const r = "0x9242685bf161793cc25603c231bc2f568eb630ea16aa137d2664ac8038825608";
    const s = "0x4f8ae3bd7535248d0bd448298cc2e2071e56992d0774dc340c368ae950852ada";
    
    // Expected recovered address
    const expected = "0x7156526fbd7a3c72969b54f64e42c10fbb768c8a";
    
    // Test the recovery
    // ... implement test
}

test "ecrecover invalid signature parameters" {
    // Test with r = 0 (should fail)
    // Test with s = 0 (should fail)
    // Test with s > secp256k1_order (should fail)
    // Test with invalid v values
}

test "ecrecover EIP-155 signatures" {
    // Test signatures with EIP-155 v values
    // v = chain_id * 2 + 35/36
}

test "ecrecover gas consumption" {
    // Verify exact gas cost of 3000
}

test "ecrecover integration via CALL" {
    // Test calling ECRECOVER via CALL opcode
    // Verify proper return data handling
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/precompiles/ecrecover.zig` - New ECRECOVER implementation
- `/src/evm/crypto/secp256k1.zig` - New crypto library interface
- `/src/evm/precompiles/precompiles.zig` - Add ECRECOVER to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add ECRECOVER address
- `/src/evm/constants/gas_constants.zig` - Add ECRECOVER gas cost
- `/test/evm/precompiles/ecrecover_test.zig` - Comprehensive tests

### Build System Updates
File: `/build.zig` (if using C library)
```zig
// Add libsecp256k1 linking if using C implementation
exe.linkSystemLibrary("secp256k1");
exe.addIncludePath("/usr/local/include"); // Adjust path as needed
```

## Crypto Library Options

### Option 1: libsecp256k1 (Recommended)
- **Pros**: Battle-tested, high performance, well-audited
- **Cons**: External dependency, C FFI complexity
- **Implementation**: Use Zig's C interop

### Option 2: Pure Zig Implementation
- **Pros**: Self-contained, no external dependencies
- **Cons**: Complex to implement correctly, potential security issues
- **Implementation**: Implement elliptic curve operations from scratch

### Option 3: WebCrypto API (Browser)
- **Pros**: Leverages browser's optimized crypto
- **Cons**: Only works in browser/WASM context
- **Implementation**: WASM imports for crypto functions

### Option 4: Multiple Backend Support
```zig
pub const CryptoBackend = enum {
    LibSecp256k1,
    PureZig,
    WebCrypto,
};

pub fn recover_public_key(backend: CryptoBackend, hash: []const u8, recovery_id: u8, r: u256, s: u256) ![]const u8 {
    switch (backend) {
        .LibSecp256k1 => return recover_public_key_c(hash, recovery_id, r, s),
        .PureZig => return recover_public_key_zig(hash, recovery_id, r, s),
        .WebCrypto => return recover_public_key_wasm(hash, recovery_id, r, s),
    }
}
```

## Performance Considerations

### Signature Validation Optimization
```zig
// Pre-compute common validation values
const SECP256K1_ORDER_MINUS_1 = SECP256K1_ORDER - 1;

// Fast validation using bit operations where possible
fn fast_validate_range(value: u256, max: u256) bool {
    return value != 0 and value <= max;
}
```

### Memory Management
- **Zero Sensitive Data**: Clear signature components after use
- **Stack Allocation**: Use stack for temporary crypto operations
- **Constant Time**: Ensure operations are constant-time where possible

## Security Considerations

### Input Validation
```zig
// Comprehensive input validation
fn validate_ecrecover_input(input: []const u8) bool {
    // Must be exactly 128 bytes
    if (input.len != 128) return false;
    
    // Additional validation of parameter ranges
    // Check for known malicious inputs
    
    return true;
}
```

### Constant-Time Operations
- **Side-Channel Resistance**: Avoid timing attacks
- **Memory Access Patterns**: Consistent memory access
- **Branch Prediction**: Avoid data-dependent branches

### Error Handling
```zig
// Secure error handling - don't leak information
fn secure_ecrecover(input: []const u8, output: []u8) PrecompileError!PrecompileResult {
    // Always consume the same amount of gas regardless of failure reason
    const gas_cost = gas_constants.ECRECOVER_COST;
    
    // Validate and recover, but don't leak why it failed
    const success = validate_and_recover(input, output);
    
    return PrecompileResult{
        .gas_used = gas_cost,
        .output_size = if (success) 32 else 0,
    };
}
```

## Success Criteria

1. **Ethereum Compatibility**: Passes all Ethereum Foundation ECRECOVER tests
2. **Signature Recovery**: Correctly recovers addresses from valid signatures
3. **Input Validation**: Properly rejects invalid signature parameters
4. **EIP-155 Support**: Handles both legacy and EIP-155 signature formats
5. **Gas Accuracy**: Consumes exactly 3000 gas regardless of success/failure
6. **Security**: Resistant to timing attacks and other side-channel attacks

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Choose crypto library carefully** - Security is paramount
3. **Test with known vectors** - Use Ethereum test suite vectors
4. **Validate all inputs thoroughly** - Invalid inputs must return empty output
5. **Constant-time operations** - Avoid timing side-channels
6. **Handle EIP-155 correctly** - Support both legacy and modern signatures

## Complex Test Cases

### Edge Cases
```zig
test "ecrecover edge cases" {
    // Test with maximum valid r, s values
    // Test with minimum valid r, s values
    // Test boundary conditions around secp256k1 order
    // Test recovery ID edge cases
}
```

### Malformed Inputs
```zig
test "ecrecover malformed inputs" {
    // Test with wrong input lengths
    // Test with all-zero inputs
    // Test with all-max inputs
    // Test with known problematic signatures
}
```

## References

- [Ethereum Yellow Paper - Appendix F](https://ethereum.github.io/yellowpaper/paper.pdf)
- [libsecp256k1 Documentation](https://github.com/bitcoin-core/secp256k1)
- [EIP-155: Simple replay attack protection](https://eips.ethereum.org/EIPS/eip-155)
- [ECDSA Recovery Explanation](https://cryptobook.nakov.com/digital-signatures/ecdsa-sign-verify-messages)
- [Ethereum Test Vectors](https://github.com/ethereum/tests)