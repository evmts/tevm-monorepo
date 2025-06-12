# Implement ECRECOVER Precompile

<<<<<<< HEAD
You are implementing the ECRECOVER precompile (address 0x01) for the Tevm EVM written in Zig. Your goal is to recover signer addresses from ECDSA signatures using elliptic curve cryptography, following Ethereum specifications and maintaining compatibility with all existing implementations.

=======
<review>
**Implementation Status: NOT IMPLEMENTED ❌**

**Critical Importance:**
- 🔴 **FUNDAMENTAL**: ECRECOVER is the foundation of ALL Ethereum transaction verification
- 🔴 **HIGH PRIORITY**: One of the most essential precompiles - required for basic Ethereum operations
- 🔴 **SECURITY CRITICAL**: Any bugs compromise entire blockchain security

**Current Status:**
- ❌ No implementation in src/evm/precompiles/ 
- ❌ precompiles.zig:106 returns `ExecutionFailed` for address 0x01
- ❌ estimate_gas() returns `NotImplemented` for ECRECOVER
- ❌ No signature recovery functionality available

**Impact on Tevm:**
- 🔥 **TRANSACTION VERIFICATION**: Cannot verify transaction signatures  
- 🔥 **SMART CONTRACTS**: Contracts using ecrecover() will fail
- 🔥 **ETHEREUM COMPATIBILITY**: Missing fundamental Ethereum capability
- 🔥 **USEABILITY**: Significantly limits practical Ethereum testing

**Implementation Requirements:**
- ✅ Use libsecp256k1 (NOT custom crypto implementation)
- ✅ 128-byte input: hash(32) + v(32) + r(32) + s(32) - big-endian
- ✅ 32-byte output: recovered address (20 bytes zero-padded)
- ✅ 3000 gas fixed cost
- ✅ Malleability check: s ≤ secp256k1n/2 (EIP-2)
- ✅ Handle edge cases: invalid v, point at infinity, zero values

**Test Requirements:**
- Valid signatures from known private keys
- Invalid signatures (wrong v, high s values)
- Edge cases (zero hash, malformed input)
- Ethereum mainnet compatibility vectors

**Priority: HIGH - Essential for Ethereum compatibility**
</review>

You are implementing the ECRECOVER precompile (address 0x01) for the Tevm EVM written in Zig. Your goal is to recover signer addresses from ECDSA signatures using elliptic curve cryptography, following Ethereum specifications and maintaining compatibility with all existing implementations.

>>>>>>> origin/main
## Development Workflow
- **Branch**: `feat_implement_ecrecover_precompile` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_ecrecover_precompile feat_implement_ecrecover_precompile`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format

## Context
The ECRECOVER precompile is fundamental for Ethereum's signature verification system. It recovers the signer's address from an ECDSA signature using elliptic curve cryptography, enabling authentication of transactions and messages.

## ELI5

Think of ECRECOVER as a forensic handwriting expert for the digital world. When someone signs a transaction in Ethereum, it's like signing a document with a very special pen that creates a unique mathematical signature. ECRECOVER is the expert who can look at that signature and tell you exactly who signed it.

Here's how it works:
1. **You sign a transaction** with your private key (like signing with your unique fingerprint)
2. **The signature gets attached** to the transaction (like a stamp on a document)
3. **ECRECOVER examines the signature** and the original message
4. **It reveals your public address** (like identifying your fingerprint from a database)

This is absolutely critical because:
- **Authentication**: It proves that transactions actually came from the claimed sender
- **Security**: Nobody can forge signatures without your private key
- **Trust**: The entire Ethereum network relies on this to verify every transaction

The mathematical process is like:
- Taking a signature puzzle (the ECDSA signature)
- Using cryptographic math to "reverse-engineer" who could have created that exact signature
- Outputting the Ethereum address of the signer

The "enhanced" version includes optimizations for:
- **Performance**: Faster signature verification using better algorithms
- **Security**: Additional validation to prevent edge-case attacks
- **Error handling**: Better detection of invalid or malicious signatures

Without ECRECOVER, Ethereum couldn't verify that transactions are legitimate - it's like the foundation that all blockchain security is built on.

## 🚨 CRITICAL SECURITY WARNING: DO NOT IMPLEMENT CUSTOM CRYPTO

**❌ NEVER IMPLEMENT CRYPTOGRAPHIC ALGORITHMS FROM SCRATCH**

**🔴 MAXIMUM SECURITY ALERT**: ECRECOVER is the foundation of all Ethereum security. Any bugs here compromise the entire blockchain.

This prompt involves cryptographic operations. Follow these security principles:

### ✅ **DO THIS:**
- **Use libsecp256k1** - The only acceptable library for secp256k1 operations
- **Import proven implementations** from well-audited libraries (libsecp256k1)
- **Follow reference implementations** from go-ethereum, revm, evmone exactly
- **Use official test vectors** from Bitcoin and Ethereum test suites
- **Implement constant-time algorithms** to prevent timing attacks
- **Validate all signature components** (r, s, v) rigorously

### ❌ **NEVER DO THIS:**
- Write your own ECDSA signature verification or elliptic curve operations
- Implement secp256k1 curve arithmetic "from scratch" or "for learning"
- Modify cryptographic algorithms or add "optimizations"
- Copy-paste crypto code from tutorials or unofficial sources
- Implement crypto without extensive peer review and testing
- Use variable-time algorithms that leak private key information

### 🎯 **Implementation Strategy:**
1. **ONLY choice**: Use libsecp256k1 C library with Zig bindings
2. **Fallback**: Use proven WASM secp256k1 library (noble-secp256k1)
3. **Never**: Write custom secp256k1 or ECDSA implementations

**Remember**: ECRECOVER bugs can compromise every Ethereum transaction. Private keys could be leaked, funds stolen, and the entire network's security undermined. This is not negotiable - only use libsecp256k1.

## Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000001`
- **Gas Cost**: 3000 (fixed cost)
- **Input**: 128 bytes (hash, v, r, s)
- **Output**: 20 bytes (recovered address) or empty on failure
- **Available**: All hardforks (Frontier onwards)
- **Function**: ECDSA public key recovery from signature

### Input Format (128 bytes)
```
- hash (32 bytes): Hash of the message that was signed
- v (32 bytes): Recovery ID (27 or 28, padded with zeros)
- r (32 bytes): ECDSA signature r component
- s (32 bytes): ECDSA signature s component
```

### Output Format
- **Success**: 20-byte Ethereum address (left-padded to 32 bytes)
- **Failure**: Empty output (0 bytes)

### Validation Rules
- r and s must be in range [1, secp256k1_order)
- v must be exactly 27 or 28 (after adjustment)
- All zero padding bytes in v parameter must be zero
- Public key recovery must succeed
- Derived address must be valid

## Reference Implementations

### evmone Implementation
File: Search for `ecrecover` in evmone precompiles for gas costs and validation

### revm Implementation
File: Search for `ecrecover` in revm for modern implementation patterns

### geth

<explanation>
The go-ethereum implementation shows the complete ECRECOVER pattern: fixed gas cost (3000), input padding to 128 bytes, parameter extraction and validation, signature component reordering, and public key recovery with address derivation. Key details include v value adjustment (subtract 27), signature validation, and Keccak256 hashing of the recovered public key.
</explanation>

**Gas Constant** - `/go-ethereum/params/protocol_params.go` (line 140):
```go
EcrecoverGas        uint64 = 3000 // Elliptic curve sender recovery gas price
```

**Full Implementation** - `/go-ethereum/core/vm/contracts.go` (lines 264-301):
```go
// ecrecover implemented as a native contract.
type ecrecover struct{}

func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	const ecRecoverInputLength = 128

	input = common.RightPadBytes(input, ecRecoverInputLength)
	// "input" is (hash, v, r, s), each 32 bytes
	// but for ecrecover we want (r, s, v)

	r := new(big.Int).SetBytes(input[64:96])
	s := new(big.Int).SetBytes(input[96:128])
	v := input[63] - 27

	// tighter sig s values input homestead only apply to tx sigs
	if !allZero(input[32:63]) || !crypto.ValidateSignatureValues(v, r, s, false) {
		return nil, nil
	}
	// We must make sure not to modify the 'input', so placing the 'v' along with
	// the signature needs to be done on a new allocation
	sig := make([]byte, 65)
	copy(sig, input[64:128])
	sig[64] = v
	// v needs to be at the end for libsecp256k1
	pubKey, err := crypto.Ecrecover(input[:32], sig)
	// make sure the public key is a valid one
	if err != nil {
		return nil, nil
	}

	// the first byte of pubkey is bitcoin heritage
	return common.LeftPadBytes(crypto.Keccak256(pubKey[1:])[12:], 32), nil
}
```

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
    
    // v must be exactly 27 or 28 (EIP-155 format NOT supported in precompile)
    const recovery_id = extract_recovery_id(v);
    if (recovery_id == 255) return false; // Invalid v value
    
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
const U256 = @import("../Types/U256.zig").U256;
const B256 = @import("../Types/B256.zig").B256;

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
    // ECRECOVER precompile only accepts v values of 27 or 28
    // EIP-155 handling is NOT supported in this precompile
    if (v == 27) return 0;
    if (v == 28) return 1;
    
    // Invalid v value - return invalid marker
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


## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions
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

## Reference Implementations

### revm

<explanation>
Revm provides a sophisticated ECRECOVER implementation with multiple backend support. Key features:

1. **Multiple Backends**: Supports secp256k1, k256, and libsecp256k1 libraries via features
2. **Input Validation**: Proper validation of v parameter (must be 27 or 28)
3. **Signature Normalization**: Handles signature normalization and recovery ID adjustment
4. **Gas Accounting**: Fixed 3000 gas cost regardless of success/failure
5. **Error Handling**: Returns empty output on any error, never panics

The implementation shows excellent patterns for crypto library integration and robust error handling.
</explanation>

<filename>revm/crates/precompile/src/secp256k1.rs</filename>
<line start="28" end="55">
```rust
/// `ecrecover` precompile function. Read more about input and output format in [this module docs](self).
pub fn ec_recover_run(input: &[u8], gas_limit: u64) -> PrecompileResult {
    const ECRECOVER_BASE: u64 = 3_000;

    if ECRECOVER_BASE > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }

    let input = right_pad::<128>(input);

    // `v` must be a 32-byte big-endian integer equal to 27 or 28.
    if !(input[32..63].iter().all(|&b| b == 0) && matches!(input[63], 27 | 28)) {
        return Ok(PrecompileOutput::new(ECRECOVER_BASE, Bytes::new()));
    }

    let msg = <&B256>::try_from(&input[0..32]).unwrap();
    let recid = input[63] - 27;
    let sig = <&B512>::try_from(&input[64..128]).unwrap();

    let res = ecrecover(sig, recid, msg);

    let out = res.map(|o| o.to_vec().into()).unwrap_or_default();
    Ok(PrecompileOutput::new(ECRECOVER_BASE, out))
}
```
</line>

<filename>revm/crates/precompile/src/secp256k1/k256.rs</filename>
<line start="5" end="31">
```rust
/// Recover the public key from a signature and a message.
///
/// This function is using the `k256` crate.
pub fn ecrecover(sig: &B512, mut recid: u8, msg: &B256) -> Result<B256, Error> {
    // parse signature
    let mut sig = Signature::from_slice(sig.as_slice())?;

    // normalize signature and flip recovery id if needed.
    if let Some(sig_normalized) = sig.normalize_s() {
        sig = sig_normalized;
        recid ^= 1;
    }
    let recid = RecoveryId::from_byte(recid).expect("recovery ID is valid");

    // recover key
    let recovered_key = VerifyingKey::recover_from_prehash(&msg[..], &sig, recid)?;
    // hash it
    let mut hash = keccak256(
        &recovered_key
            .to_encoded_point(/* compress = */ false)
            .as_bytes()[1..],
    );

    // truncate to 20 bytes
    hash[..12].fill(0);
    Ok(hash)
}
```
</line>

## EVMONE Context

<evmone>
<file path="evmone/lib/evmone/state/precompiles.cpp">
```cpp
PrecompileAnalysis ecrecover_analyze(bytes_view /*input*/, evmc_revision /*rev*/) noexcept
{
    return {3000, 32};
}

ExecutionResult ecrecover_execute(const uint8_t* input, size_t input_size, uint8_t* output,
    [[maybe_unused]] size_t output_size) noexcept
{
    assert(output_size >= 32);

    uint8_t input_buffer[128]{};
    if (input_size != 0)
        std::memcpy(input_buffer, input, std::min(input_size, std::size(input_buffer)));

    ethash::hash256 h{};
    std::memcpy(h.bytes, input_buffer, sizeof(h));

    const auto v = intx::be::unsafe::load<intx::uint256>(input_buffer + 32);
    if (v != 27 && v != 28)
        return {EVMC_SUCCESS, 0};
    const bool parity = v == 28;

    const auto r = intx::be::unsafe::load<intx::uint256>(input_buffer + 64);
    const auto s = intx::be::unsafe::load<intx::uint256>(input_buffer + 96);

    const auto res = evmmax::secp256k1::ecrecover(h, r, s, parity);
    if (res)
    {
        std::memset(output, 0, 12);
        std::memcpy(output + 12, res->bytes, 20);
        return {EVMC_SUCCESS, 32};
    }
    else
        return {EVMC_SUCCESS, 0};
}
```
</file>
<file path="evmone/lib/evmone_precompiles/secp256k1.cpp">
```cpp
std::optional<Point> secp256k1_ecdsa_recover(
    const ethash::hash256& e, const uint256& r, const uint256& s, bool v) noexcept
{
    // Follows
    // https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm#Public_key_recovery

    // 1. Validate r and s are within [1, n-1].
    if (r == 0 || r >= Order || s == 0 || s >= Order)
        return std::nullopt;

    // 3. Hash of the message is already calculated in e.
    // 4. Convert hash e to z field element by doing z = e % n.
    //    https://www.rfc-editor.org/rfc/rfc6979#section-2.3.2
    //    We can do this by n - e because n > 2^255.
    static_assert(Order > 1_u256 << 255);
    auto z = intx::be::load<uint256>(e.bytes);
    if (z >= Order)
        z -= Order;


    const ModArith<uint256> n{Order};

    // 5. Calculate u1 and u2.
    const auto r_n = n.to_mont(r);
    const auto r_inv = n.inv(r_n);

    const auto z_mont = n.to_mont(z);
    const auto z_neg = n.sub(0, z_mont);
    const auto u1_mont = n.mul(z_neg, r_inv);
    const auto u1 = n.from_mont(u1_mont);

    const auto s_mont = n.to_mont(s);
    const auto u2_mont = n.mul(s_mont, r_inv);
    const auto u2 = n.from_mont(u2_mont);

    // 2. Calculate y coordinate of R from r and v.
    const auto r_mont = Fp.to_mont(r);
    const auto y_mont = calculate_y(Fp, r_mont, v);
    if (!y_mont.has_value())
        return std::nullopt;
    const auto y = Fp.from_mont(*y_mont);

    // 6. Calculate public key point Q.
    const auto R = Point{Fp.to_mont(r), Fp.to_mont(y)};
    const auto pG = Point{Fp.to_mont(G.x), Fp.to_mont(G.y)};
    const auto T1 = ecc::mul(Fp, pG, u1, B3);
    const auto T2 = ecc::mul(Fp, R, u2, B3);
    const auto pQ = ecc::add(Fp, T1, T2, B3);

    const auto Q = ecc::to_affine(Fp, pQ);

    // Any other validity check needed?
    if (Q.is_inf())
        return std::nullopt;

    return Q;
}

std::optional<evmc::address> ecrecover(
    const ethash::hash256& e, const uint256& r, const uint256& s, bool v) noexcept
{
    const auto point = secp256k1_ecdsa_recover(e, r, s, v);
    if (!point.has_value())
        return std::nullopt;

    return to_address(*point);
}
```
</file>
<file path="evmone/lib/evmone/state/precompiles.cpp">
```cpp
struct PrecompileTraits
{
    decltype(identity_analyze)* analyze = nullptr;
    decltype(identity_execute)* execute = nullptr;
};

inline constexpr std::array<PrecompileTraits, NumPrecompiles> traits{{
    {},  // undefined for 0
    {ecrecover_analyze, ecrecover_execute},
    {sha256_analyze, sha256_execute},
    {ripemd160_analyze, ripemd160_execute},
    // ... other precompiles
}};

evmc::Result call_precompile(evmc_revision rev, const evmc_message& msg) noexcept
{
    assert(msg.gas >= 0);

    const auto id = msg.code_address.bytes[19];
    const auto [analyze, execute] = traits[id];

    const bytes_view input{msg.input_data, msg.input_size};
    const auto [gas_cost, max_output_size] = analyze(input, rev);
    const auto gas_left = msg.gas - gas_cost;
    if (gas_left < 0)
        return evmc::Result{EVMC_OUT_OF_GAS};

    // Allocate buffer for the precompile's output and pass its ownership to evmc::Result.
    // TODO: This can be done more elegantly by providing constructor evmc::Result(std::unique_ptr).
    const auto output_data = new (std::nothrow) uint8_t[max_output_size];
    const auto [status_code, output_size] =
        execute(msg.input_data, msg.input_size, output_data, max_output_size);
    const evmc_result result{status_code, status_code == EVMC_SUCCESS ? gas_left : 0, 0,
        output_data, output_size,
        [](const evmc_result* res) noexcept { delete[] res->output_data; }};
    return evmc::Result{result};
}
```
</file>
</evmone>
## Prompt Corrections
The `evmone` implementation provides a more robust execution model than the one proposed in the original prompt.

1.  **Gas Handling**: The Zig `execute` function in the prompt takes `gas_limit` and checks `if (gas_cost > gas_limit)`. A better approach, as seen in `evmone`, is for the precompile dispatcher to calculate the cost, deduct it from the frame's available gas, and then call the precompile's `execute` function. The `execute` function itself shouldn't handle gas checks; it should only perform the core logic. This separates concerns and centralizes gas accounting.

2.  **Return Type**: The Zig example returns `PrecompileError!PrecompileResult`, which mixes error and success types. The `evmone` `ecrecover_execute` returns a simple `ExecutionResult` struct containing a status code and output size. This is more idiomatic for a VM, as the main execution loop can then handle different statuses (success, failure, out-of-gas) based on the single return object, simplifying the control flow.

3.  **Parameter `v` Handling**: The prompt implies that `v` can be `chain_id * 2 + 35/36`. The core ECRECOVER precompile only accepts `v` as `27` or `28`. The EIP-155 logic for handling chain IDs is applied at the transaction validation level *before* the precompile is ever called. The precompile itself has a very simple validation `if (v != 27 && v != 28) return {EVMC_SUCCESS, 0};`. The provided Zig logic is too complex for the precompile and belongs at a higher layer.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/secp256k1.rs">
```rust
//! `ecrecover` precompile.
//!
//! ...
//! Input format:
//! [32 bytes for message][64 bytes for signature][1 byte for recovery id]
//!
//! Output format:
//! [32 bytes for recovered address]

// ...

use crate::{
    utilities::right_pad, PrecompileError, PrecompileOutput, PrecompileResult,
    PrecompileWithAddress,
};
use primitives::{alloy_primitives::B512, Bytes, B256};

/// `ecrecover` precompile, containing address and function to run.
pub const ECRECOVER: PrecompileWithAddress =
    PrecompileWithAddress(crate::u64_to_address(1), ec_recover_run);

/// `ecrecover` precompile function. Read more about input and output format in [this module docs](self).
pub fn ec_recover_run(input: &[u8], gas_limit: u64) -> PrecompileResult {
    const ECRECOVER_BASE: u64 = 3_000;

    if ECRECOVER_BASE > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }

    let input = right_pad::<128>(input);

    // `v` must be a 32-byte big-endian integer equal to 27 or 28.
    if !(input[32..63].iter().all(|&b| b == 0) && matches!(input[63], 27 | 28)) {
        return Ok(PrecompileOutput::new(ECRECOVER_BASE, Bytes::new()));
    }

    let msg = <&B256>::try_from(&input[0..32]).unwrap();
    let recid = input[63] - 27;
    let sig = <&B512>::try_from(&input[64..128]).unwrap();

    let res = ecrecover(sig, recid, msg);

    let out = res.map(|o| o.to_vec().into()).unwrap_or_default();
    Ok(PrecompileOutput::new(ECRECOVER_BASE, out))
}

// Select the correct implementation based on the enabled features.
cfg_if::cfg_if! {
    if #[cfg(feature = "secp256k1")] {
        pub use bitcoin_secp256k1::ecrecover;
    } else if #[cfg(feature = "libsecp256k1")] {
        pub use parity_libsecp256k1::ecrecover;
    } else {
        pub use k256::ecrecover;
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/secp256k1/k256.rs">
```rust
//! k256 implementation of `ecrecover`. More about it in [`crate::secp256k1`].
use k256::ecdsa::{Error, RecoveryId, Signature, VerifyingKey};
use primitives::{alloy_primitives::B512, keccak256, B256};

/// Recover the public key from a signature and a message.
///
/// This function is using the `k256` crate.
pub fn ecrecover(sig: &B512, mut recid: u8, msg: &B256) -> Result<B256, Error> {
    // parse signature
    let mut sig = Signature::from_slice(sig.as_slice())?;

    // normalize signature and flip recovery id if needed.
    if let Some(sig_normalized) = sig.normalize_s() {
        sig = sig_normalized;
        recid ^= 1;
    }
    let recid = RecoveryId::from_byte(recid).expect("recovery ID is valid");

    // recover key
    let recovered_key = VerifyingKey::recover_from_prehash(&msg[..], &sig, recid)?;
    // hash it
    let mut hash = keccak256(
        &recovered_key
            .to_encoded_point(/* compress = */ false)
            .as_bytes()[1..],
    );

    // truncate to 20 bytes
    hash[..12].fill(0);
    Ok(hash)
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
use primitives::{hardfork::SpecId, Address, HashMap, HashSet};
// ...

impl Precompiles {
    // ...
    /// Returns precompiles for Homestead spec.
    pub fn homestead() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Precompiles::default();
            precompiles.extend([
                secp256k1::ECRECOVER,
                hash::SHA256,
                hash::RIPEMD160,
                identity::FUN,
            ]);
            Box::new(precompiles)
        })
    }
    // ...
}
```
</file>
</revm>
## Prompt Corrections
The `revm` implementation highlights a critical detail that is often misunderstood and is inaccurate in the original prompt's "Implementation Requirements" section:

1.  **`v` Parameter Validation**: The ECRECOVER precompile at address `0x01` is very strict about the `v` parameter. It **only** accepts `27` or `28`. It does not handle EIP-155 formatted `v` values (`chain_id * 2 + 35/36`). The logic for handling EIP-155 is part of transaction-level signature validation, not the precompile itself.

    The `revm` code correctly enforces this:
    ```rust
    // `v` must be a 32-byte big-endian integer equal to 27 or 28.
    if !(input[32..63].iter().all(|&b| b == 0) && matches!(input[63], 27 | 28)) {
        return Ok(PrecompileOutput::new(ECRECOVER_BASE, Bytes::new()));
    }
    ```
    This snippet checks two things:
    - The most significant 31 bytes of the `v` parameter word must be zero.
    - The least significant byte must be exactly `27` or `28`.

    The `validate_signature_params` and `extract_recovery_id` functions in the original prompt are incorrect because they attempt to handle EIP-155, which is outside the scope of this precompile. The implementation should fail and return empty output for any `v` other than 27 or 28.

2.  **Signature Normalization**: The `k256.rs` backend shows that handling signature malleability (normalizing `s` to the lower half of the curve order) is a good practice. If the `s` value is normalized, the recovery ID (`recid`) must be flipped (`recid ^= 1`). This is a key detail for compatibility with libraries like `k256`.

3.  **Address Derivation**: The `k256.rs` backend also provides a clear example of deriving the Ethereum address from the recovered public key: `keccak256` of the uncompressed public key, skipping the first byte (`0x04`), and then taking the last 20 bytes of the resulting hash. The implementation detail of zeroing the first 12 bytes of the hash (`hash[..12].fill(0)`) is a direct way to achieve this.



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/homestead/vm/precompiled_contracts/ecrecover.py">
```python
"""
Ethereum Virtual Machine (EVM) ECRECOVER PRECOMPILED CONTRACT
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementation of the ECRECOVER precompiled contract.
"""
from ethereum_types.numeric import U256

from ethereum.crypto.elliptic_curve import SECP256K1N, secp256k1_recover
from ethereum.crypto.hash import Hash32, keccak256
from ethereum.exceptions import InvalidSignatureError
from ethereum.utils.byte import left_pad_zero_bytes

from ...vm import Evm
from ...vm.gas import GAS_ECRECOVER, charge_gas
from ...vm.memory import buffer_read


def ecrecover(evm: Evm) -> None:
    """
    Decrypts the address using elliptic curve DSA recovery mechanism and writes
    the address to output.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    data = evm.message.data

    # GAS
    charge_gas(evm, GAS_ECRECOVER)

    # OPERATION
    message_hash_bytes = buffer_read(data, U256(0), U256(32))
    message_hash = Hash32(message_hash_bytes)
    v = U256.from_be_bytes(buffer_read(data, U256(32), U256(32)))
    r = U256.from_be_bytes(buffer_read(data, U256(64), U256(32)))
    s = U256.from_be_bytes(buffer_read(data, U256(96), U256(32)))

    if v != U256(27) and v != U256(28):
        return
    if U256(0) >= r or r >= SECP256K1N:
        return
    if U256(0) >= s or s >= SECP256K1N:
        return

    try:
        public_key = secp256k1_recover(r, s, v - U256(27), message_hash)
    except InvalidSignatureError:
        # unable to extract public key
        return

    address = keccak256(public_key)[12:32]
    padded_address = left_pad_zero_bytes(address, 32)
    evm.output = padded_address
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/homestead/vm/precompiled_contracts/__init__.py">
```python
"""
Precompiled Contract Addresses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Addresses of precompiled contracts and mappings to their
implementations.
"""

from ...utils.hexadecimal import hex_to_address

__all__ = (
    "ECRECOVER_ADDRESS",
    "SHA256_ADDRESS",
    "RIPEMD160_ADDRESS",
    "IDENTITY_ADDRESS",
)

ECRECOVER_ADDRESS = hex_to_address("0x01")
SHA256_ADDRESS = hex_to_address("0x02")
RIPEMD160_ADDRESS = hex_to_address("0x03")
IDENTITY_ADDRESS = hex_to_address("0x04")
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/homestead/vm/gas.py">
```python
"""
Ethereum Virtual Machine (EVM) Gas
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

EVM gas constants and calculators.
"""
# ...
GAS_ECRECOVER = Uint(3000)
# ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/crypto/elliptic_curve.py">
```python
"""
Elliptic Curves
^^^^^^^^^^^^^^^
"""

import coincurve
from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256

from ethereum.exceptions import InvalidSignatureError

from .hash import Hash32

SECP256K1B = U256(7)
SECP256K1P = U256(
    0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
)
SECP256K1N = U256(
    0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
)


def secp256k1_recover(r: U256, s: U256, v: U256, msg_hash: Hash32) -> Bytes:
    """
    Recovers the public key from a given signature.

    Parameters
    ----------
    r :
        TODO
    s :
        TODO
    v :
        TODO
    msg_hash :
        Hash of the message being recovered.

    Returns
    -------
    public_key : `ethereum.base_types.Bytes`
        Recovered public key.
    """
    is_square = pow(
        pow(r, U256(3), SECP256K1P) + SECP256K1B,
        (SECP256K1P - U256(1)) // U256(2),
        SECP256K1P,
    )

    if is_square != 1:
        raise InvalidSignatureError(
            "r is not the x-coordinate of a point on the secp256k1 curve"
        )

    r_bytes = r.to_be_bytes32()
    s_bytes = s.to_be_bytes32()

    signature = bytearray([0] * 65)
    signature[32 - len(r_bytes) : 32] = r_bytes
    signature[64 - len(s_bytes) : 64] = s_bytes
    signature[64] = v

    # If the recovery algorithm returns the point at infinity,
    # the signature is considered invalid
    # the below function will raise a ValueError.
    try:
        public_key = coincurve.PublicKey.from_signature_and_message(
            bytes(signature), msg_hash, hasher=None
        )
    except ValueError as e:
        raise InvalidSignatureError from e

    public_key = public_key.format(compressed=False)[1:]
    return public_key
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/homestead/vm/memory.py">
```python
def buffer_read(buffer: Bytes, start_position: U256, size: U256) -> Bytes:
    """
    Read bytes from a buffer. Padding with zeros if necessary.

    Parameters
    ----------
    buffer :
        Memory contents of the EVM.
    start_position :
        Starting pointer to the memory.
    size :
        Size of the data that needs to be read from `start_position`.

    Returns
    -------
    data_bytes :
        Data read from memory.
    """
    return right_pad_zero_bytes(
        buffer[start_position : Uint(start_position) + Uint(size)], size
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/utils/byte.py">
```python
def left_pad_zero_bytes(
    value: Bytes, size: Union[int, FixedUnsigned, Uint]
) -> Bytes:
    """
    Left pad zeroes to `value` if its length is less than the given `size`.

    Parameters
    ----------
    value :
        The byte string that needs to be padded.
    size :
        The number of bytes that need that need to be padded.

    Returns
    -------
    left_padded_value: `ethereum.base_types.Bytes`
        left padded byte string of given `size`.
    """
    return value.rjust(int(size), b"\x00")
```
</file>
</execution-specs>
<prompt-corrections>
- **Correction on `v` parameter handling**: The prompt mentions that the `v` parameter can be in the EIP-155 format (`chain_id * 2 + 35/36`). While this is true for transactions, the `ECRECOVER` precompile itself, as defined in the specification, only handles `v` values of 27 or 28. Any EIP-155 processing must happen at a higher level before calling the precompile, which then receives a normalized `v`. The `ecrecover.py` implementation correctly shows this by only checking for `v` being 27 or 28 and then normalizing it to a recovery ID of 0 or 1.
- **Note on `s` value validation**: The `homestead` fork introduced a check that `s` must be in the lower half of the curve order (`s <= SECP256K1N // 2`) for *transaction signatures*. However, this check is not applied within the `ECRECOVER` precompile itself, which accepts any valid `s` up to the curve order `SECP256K1N`. The provided `geth` reference also reflects this distinction.
</prompt-corrections>

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/precompiled_contracts/ecrecover.py">
```python
"""
Ethereum Virtual Machine (EVM) ECRECOVER PRECOMPILED CONTRACT
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementation of the ECRECOVER precompiled contract.
"""
from ethereum_types.numeric import U256

from ethereum.crypto.elliptic_curve import SECP256K1N, secp256k1_recover
from ethereum.crypto.hash import Hash32, keccak256
from ethereum.exceptions import InvalidSignatureError
from ethereum.utils.byte import left_pad_zero_bytes

from ...vm import Evm
from ...vm.gas import GAS_ECRECOVER, charge_gas
from ...vm.memory import buffer_read


def ecrecover(evm: Evm) -> None:
    """
    Decrypts the address using elliptic curve DSA recovery mechanism and writes
    the address to output.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    data = evm.message.data

    # GAS
    charge_gas(evm, GAS_ECRECOVER)

    # OPERATION
    message_hash_bytes = buffer_read(data, U256(0), U256(32))
    message_hash = Hash32(message_hash_bytes)
    v = U256.from_be_bytes(buffer_read(data, U256(32), U256(32)))
    r = U256.from_be_bytes(buffer_read(data, U256(64), U256(32)))
    s = U256.from_be_bytes(buffer_read(data, U256(96), U256(32)))

    if v != U256(27) and v != U256(28):
        return
    if U256(0) >= r or r >= SECP256K1N:
        return
    if U256(0) >= s or s >= SECP256K1N:
        return

    try:
        public_key = secp256k1_recover(r, s, v - U256(27), message_hash)
    except InvalidSignatureError:
        # unable to extract public key
        return

    address = keccak256(public_key)[12:32]
    padded_address = left_pad_zero_bytes(address, 32)
    evm.output = padded_address
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/gas.py">
```python
# ... (other gas constants)
GAS_ECRECOVER = Uint(3000)
# ... (other gas constants)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/precompiled_contracts/__init__.py">
```python
from ...utils.hexadecimal import hex_to_address

__all__ = (
    "ECRECOVER_ADDRESS",
    "SHA256_ADDRESS",
    "RIPEMD160_ADDRESS",
    "IDENTITY_ADDRESS",
    "MODEXP_ADDRESS",
    "ALT_BN128_ADD_ADDRESS",
    "ALT_BN128_MUL_ADDRESS",
    "ALT_BN128_PAIRING_CHECK_ADDRESS",
    "BLAKE2F_ADDRESS",
)

ECRECOVER_ADDRESS = hex_to_address("0x01")
SHA256_ADDRESS = hex_to_address("0x02")
RIPEMD160_ADDRESS = hex_to_address("0x03")
IDENTITY_ADDRESS = hex_to_address("0x04")
MODEXP_ADDRESS = hex_to_address("0x05")
ALT_BN128_ADD_ADDRESS = hex_to_address("0x06")
ALT_BN128_MUL_ADDRESS = hex_to_address("0x07")
ALT_BN128_PAIRING_CHECK_ADDRESS = hex_to_address("0x08")
BLAKE2F_ADDRESS = hex_to_address("0x09")
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/crypto/elliptic_curve.py">
```python
# The order of the secp256k1 curve
SECP256K1N = 115792089237316195423570985008687907852837564279074904382605163141518161494337  # noqa: E501

def secp256k1_recover(
    r: U256, s: U256, v: U256, message_hash: Hash32
) -> Bytes:
# ... implementation ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/memory.py">
```python
def buffer_read(buffer: Bytes, start_position: U256, size: U256) -> Bytes:
    """
    Read bytes from a buffer. Padding with zeros if necessary.

    Parameters
    ----------
    buffer :
        Memory contents of the EVM.
    start_position :
        Starting pointer to the memory.
    size :
        Size of the data that needs to be read from `start_position`.

    Returns
    -------
    data_bytes :
        Data read from memory.
    """
    return right_pad_zero_bytes(
        buffer[start_position : Uint(start_position) + Uint(size)], size
    )
```
</file>
</execution-specs>
## Prompt Corrections
The `execution-specs` confirm that the ECRECOVER precompile itself does not handle EIP-155 `v` values (e.g., `chain_id * 2 + 35`). It only accepts `v` values of 27 or 28. The calling contract is responsible for normalizing any other `v` format into 27 or 28 before calling the precompile. The provided Zig code snippet that handles EIP-155 logic is therefore more relevant for transaction signature validation than for the direct implementation of this precompile.

The `ecrecover` implementation in the specs shows the core logic clearly:
1.  **Fixed Gas:** `charge_gas(evm, GAS_ECRECOVER)` where `GAS_ECRECOVER` is 3000.
2.  **Input Parsing:** `buffer_read` is used to read 32-byte chunks for `hash`, `v`, `r`, and `s`. This function correctly handles padding for inputs smaller than 128 bytes.
3.  **Validation:** It strictly checks `if v != U256(27) and v != U256(28): return` and also validates `r` and `s` against the curve order `SECP256K1N`. Any failure results in an early `return` with no output.
4.  **Recovery:** It calls `secp256k1_recover` with `v - 27` as the recovery ID.
5.  **Output Generation:** On success, it computes `keccak256(public_key)`, takes the last 20 bytes as the address, and pads it to a 32-byte word.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// EcrecoverGas is the gas price for the ecrecover precompile.
const EcrecoverGas uint64 = 3000
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// ecrecover implemented as a native contract.
type ecrecover struct{}

var allzeros = make([]byte, 31)

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	const ecRecoverInputLength = 128

	input = common.RightPadBytes(input, ecRecoverInputLength)
	// "input" is (hash, v, r, s), each 32 bytes
	// but for ecrecover we want (r, s, v)

	// parse the arguments
	r := new(big.Int).SetBytes(input[64:96])
	s := new(big.Int).SetBytes(input[96:128])

	// V needs to be either 27 or 28, otherwise we return an empty array
	// and Solidity will consider this a failed signature validation.
	v, err := vm.Int256(common.BytesToHash(input[32:64]).Big())
	if err != nil {
		return nil, nil // Invalid v, return nil
	}
	if !v.IsUint64() || (v.Uint64() != 27 && v.Uint64() != 28) {
		return nil, nil // Invalid v, return nil
	}

	// tighter sig s values input homestead only apply to tx sigs
	if !crypto.ValidateSignatureValues(v.Byte(0)-27, r, s, false) {
		return nil, nil
	}
	// We must make sure not to modify the 'input', so placing the 'v' along with
	// the signature needs to be done on a new allocation
	sig := make([]byte, crypto.SignatureLength)
	copy(sig[32-len(r.Bytes()):32], r.Bytes())
	copy(sig[64-len(s.Bytes()):64], s.Bytes())
	sig[64] = v.Byte(0) - 27

	// v needs to be at the end for libsecp256k1
	pubKey, err := crypto.Ecrecover(input[:32], sig)
	// make sure the public key is a valid one
	if err != nil {
		return nil, nil
	}
	// the first byte of pubkey is bitcoin heritage
	return common.LeftPadBytes(crypto.Keccak256(pubKey[1:])[12:], 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/crypto.go">
```go
// ValidateSignatureValues verifies whether the signature values are valid with
// the given chain rules. The v value is assumed to be either 0 or 1.
func ValidateSignatureValues(v byte, r, s *big.Int, homestead bool) bool {
	if r.Cmp(common.Big1) < 0 || s.Cmp(common.Big1) < 0 {
		return false
	}
	// reject upper range of s values (ECDSA malleability)
	// see discussion in secp256k1/libsecp256k1/include/secp256k1.h
	if homestead && s.Cmp(secp256k1halfN) > 0 {
		return false
	}
	// Frontier: allow s to be in full N range
	return r.Cmp(secp256k1N) < 0 && s.Cmp(secp256k1N) < 0 && (v == 0 || v == 1)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/signature_cgo.go">
```go
// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	return secp256k1.RecoverPubkey(hash, sig)
}
```
</file>
</go-ethereum>
<prompt-corrections>
The go-ethereum implementation of ECRECOVER has been updated since the version shown in the original prompt. The most notable change is how it validates the `v` parameter. Instead of using a local `allZero` helper, it now performs a full 256-bit integer conversion and validation to ensure `v` is either 27 or 28. This is more robust against malformed inputs where `v` might have non-zero bytes outside the last byte.

```go
// Modern v parameter validation
v, err := vm.Int256(common.BytesToHash(input[32:64]).Big())
if err != nil {
    return nil, nil // Invalid v, return nil
}
if !v.IsUint64() || (v.Uint64() != 27 && v.Uint64() != 28) {
    return nil, nil // Invalid v, return nil
}
```

This is a more secure and explicit way to handle the 32-byte `v` input field. The provided snippets reflect this modern approach.
</prompt-corrections>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/params/protocol_params.go#L140-L140">
```go
	EcrecoverGas        uint64 = 3000 // Elliptic curve sender recovery gas price
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/contracts.go#L264-L301">
```go
// ecrecover implemented as a native contract.
type ecrecover struct{}

func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	const ecRecoverInputLength = 128

	input = common.RightPadBytes(input, ecRecoverInputLength)
	// "input" is (hash, v, r, s), each 32 bytes
	// but for ecrecover we want (r, s, v)

	r := new(big.Int).SetBytes(input[64:96])
	s := new(big.Int).SetBytes(input[96:128])
	v := input[63] - 27

	// tighter sig s values input homestead only apply to tx sigs
	if !allZero(input[32:63]) || !crypto.ValidateSignatureValues(v, r, s, false) {
		return nil, nil
	}
	// We must make sure not to modify the 'input', so placing the 'v' along with
	// the signature needs to be done on a new allocation
	sig := make([]byte, 65)
	copy(sig, input[64:128])
	sig[64] = v
	// v needs to be at the end for libsecp256k1
	pubKey, err := crypto.Ecrecover(input[:32], sig)
	// make sure the public key is a valid one
	if err != nil {
		return nil, nil
	}

	// the first byte of pubkey is bitcoin heritage
	return common.LeftPadBytes(crypto.Keccak256(pubKey[1:])[12:], 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/crypto/signature_cgo.go#L123-L141">
```go
// ValidateSignatureValues verifies whether the signature values are valid according
// to the EIP2 rules. The v value is assumed to be either 0 or 1.
func ValidateSignatureValues(v byte, r, s *big.Int, homestead bool) bool {
	if r.Cmp(common.Big1) < 0 || s.Cmp(common.Big1) < 0 {
		return false
	}
	// Reject upper range of s values (ECDSA malleability)
	// See EIP-2: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2.md
	if homestead && s.Cmp(secp256k1.S256().HalfN) > 0 {
		return false
	}
	// EIP-2028: allow s to be up to N-1
	return r.Cmp(secp256k1.S256().N) < 0 && s.Cmp(secp256k1.S256().N) < 0 && (v == 0 || v == 1)
}

// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	return secp256k1.RecoverPubkey(hash, sig)
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// EcrecoverGas is the gas price for the ecrecover precompile.
//
// Note, this is a static gas cost, not dependent on the input size.
EcrecoverGas        uint64 = 3000
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// ecrecover implemented as a native contract.
type ecrecover struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size is capped
// by the caller.
func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	const ecRecoverInputLength = 128

	input = common.RightPadBytes(input, ecRecoverInputLength)
	// "input" is (hash, v, r, s), each 32 bytes
	// but for ecrecover we want (r, s, v)

	r := new(big.Int).SetBytes(input[64:96])
	s := new(big.Int).SetBytes(input[96:128])
	v := input[63] - 27

	// tighter sig s values input homestead only apply to tx sigs
	if !allZero(input[32:63]) || !crypto.ValidateSignatureValues(v, r, s, false) {
		return nil, nil
	}
	// We must make sure not to modify the 'input', so placing the 'v' along with
	// the signature needs to be done on a new allocation
	sig := make([]byte, 65)
	copy(sig, input[64:128])
	sig[64] = v
	// v needs to be at the end for libsecp256k1
	pubKey, err := crypto.Ecrecover(input[:32], sig)
	// make sure the public key is a valid one
	if err != nil {
		return nil, nil
	}

	// the first byte of pubkey is bitcoin heritage
	return common.LeftPadBytes(crypto.Keccak256(pubKey[1:])[12:], 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/signature.go">
```go
// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	return secp256k1.Ecrecover(hash, sig)
}

// ValidateSignatureValues verifies whether the signature values are valid according
// to the EIP-2 rules. The v value is assumed to be either 0 or 1.
func ValidateSignatureValues(v byte, r, s *big.Int, homestead bool) bool {
	if r.Cmp(common.Big1) < 0 || s.Cmp(common.Big1) < 0 {
		return false
	}
	// reject upper range of s value (EIP-2)
	if homestead && s.Cmp(secp256k1.S2) >= 0 {
		return false
	}
	// EIP-2098: disallow malleability
	// s must be less than or equal to secp256k1n/2
	// s may be equal to secp256k1n/2 for some signers, but Geth has never produced such signatures
	if s.Cmp(secp256k1.N_HALF) > 0 {
		return false
	}
	// r and s must be less than the order of the group
	if r.Cmp(secp256k1.N) >= 0 || s.Cmp(secp256k1.N) >= 0 {
		return false
	}
	if v != 0 && v != 1 {
		return false
	}
	return true
}

// PubkeyToAddress returns the Ethereum address of a public key.
func PubkeyToAddress(p ecdsa.PublicKey) common.Address {
	return common.BytesToAddress(Keccak256(p.X.Bytes(), p.Y.Bytes())[12:])
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt's Zig implementation for `validate_signature_params` and `extract_recovery_id` implies that the precompile should handle EIP-155 `v` values (e.g., `chain_id * 2 + 35`).

However, the `ecrecover` precompile at address `0x01` operates on raw signatures and only accepts `v` values of `27` or `28`. The `geth` and `revm` implementations confirm this by checking that the `v` parameter is one of these two values and then normalizing it to a recovery ID of `0` or `1`.

A key validation step missed in the original prompt but present in `geth` and `revm` is that the 32-byte `v` input must have its first 31 bytes as zero.

**Correction:** The implementation should validate that the `v` parameter is either 27 or 28 (represented as the last byte of a 32-byte word, with the preceding 31 bytes being zero) and should not attempt to parse EIP-155 formatted `v` values. The recovery ID `v` should be normalized to `0` or `1` by subtracting 27 before being passed to the underlying crypto library.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// ecrecover implemented as a native contract.
type ecrecover struct{}

func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	const ecRecoverInputLength = 128

	input = common.RightPadBytes(input, ecRecoverInputLength)
	// "input" is (hash, v, r, s), each 32 bytes
	// but for ecrecover we want (r, s, v)

	r := new(big.Int).SetBytes(input[64:96])
	s := new(big.Int).SetBytes(input[96:128])
	v := input[63] - 27

	// tighter sig s values input homestead only apply to tx sigs
	if !allZero(input[32:63]) || !crypto.ValidateSignatureValues(v, r, s, false) {
		return nil, nil
	}
	// We must make sure not to modify the 'input', so placing the 'v' along with
	// the signature needs to be done on a new allocation
	sig := make([]byte, 65)
	copy(sig, input[64:128])
	sig[64] = v
	// v needs to be at the end for libsecp256k1
	pubKey, err := crypto.Ecrecover(input[:32], sig)
	// make sure the public key is a valid one
	if err != nil {
		return nil, nil
	}

	// the first byte of pubkey is bitcoin heritage
	return common.LeftPadBytes(crypto.Keccak256(pubKey[1:])[12:], 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// EcrecoverGas is the gas price for the ecrecover precompile.
const EcrecoverGas uint64 = 3000
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/signature.go">
```go
// ValidateSignatureValues verifies whether the signature values are valid according
// to the EIP2 rules. The signature is valid if the V value is either 0 or 1, and
// the S value is less than half of the curve order.
func ValidateSignatureValues(v byte, r, s *big.Int, homestead bool) bool {
	// Reject lazy messages with invalid recovery id
	if v > 1 {
		return false
	}
	// Reject signatures with nil values
	if r == nil || s == nil {
		return false
	}
	// Ensure signature values are valid [1, N-1]
	var N = secp256k1.S256().N
	if r.Cmp(common.Big1) < 0 || s.Cmp(common.Big1) < 0 || r.Cmp(N) >= 0 || s.Cmp(N) >= 0 {
		return false
	}
	// Homestead enforces low S values, specifically s must be below HALF_N.
	// See EIP-2 for details: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2.md
	if homestead && s.Cmp(secp256k1.S256().HalfN) > 0 {
		return false
	}
	return true
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/secp256k1/secp256.go">
```go
// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	return secp256k1.Ecrecover(hash, sig)
}
```
</file>
</go-ethereum>
## Prompt Corrections
The `go-ethereum` implementation of the `ECRECOVER` precompile in `contracts.go` shows a simplified `v` value handling: `v := input[63] - 27`. This only considers legacy `v` values of 27 or 28, resulting in a recovery ID of 0 or 1.

The prompt's "Implementation Requirements" section correctly mentions handling EIP-155 `v` values (e.g., `chain_id * 2 + 35/36`). While this is best practice for a general signature recovery function, it's worth noting that within the specific context of the precompile call, the `v` value is often simplified before reaching this point. The geth implementation is a valid and correct interpretation of the ECRECOVER precompile specification, even without full EIP-155 logic inside the `Run` function itself.

Additionally, the `homestead` parameter in `crypto.ValidateSignatureValues` is set to `false`. This means the check for a "low S" value (a transaction malleability protection introduced in Homestead) is explicitly **not** performed by the precompile, which is a subtle but important detail. The prompt implementation should also follow this.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// EcrecoverGas is the gas price for the ecrecover precompile.
EcrecoverGas uint64 = 3000
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// ecrecover implemented as a native contract.
type ecrecover struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	const ecRecoverInputLength = 128

	input = common.RightPadBytes(input, ecRecoverInputLength)
	// "input" is (hash, v, r, s), each 32 bytes
	// but for ecrecover we want (r, s, v)

	r := new(big.Int).SetBytes(input[64:96])
	s := new(big.Int).SetBytes(input[96:128])
	v := input[63] - 27

	// tighter sig s values input homestead only apply to tx sigs
	if !allZero(input[32:63]) || !crypto.ValidateSignatureValues(v, r, s, false) {
		return nil, nil
	}
	// We must make sure not to modify the 'input', so placing the 'v' along with
	// the signature needs to be done on a new allocation
	sig := make([]byte, 65)
	copy(sig, input[64:128])
	sig[64] = v
	// v needs to be at the end for libsecp256k1
	pubKey, err := crypto.Ecrecover(input[:32], sig)
	// make sure the public key is a valid one
	if err != nil {
		return nil, nil
	}

	// the first byte of pubkey is bitcoin heritage
	return common.LeftPadBytes(crypto.Keccak256(pubKey[1:])[12:], 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/signature.go">
```go
// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	return secp256k1.Ecrecover(hash, sig)
}

// ValidateSignatureValues verifies whether the signature values are valid according
// to the EIP-2 rules. The v value is assumed to be either 0 or 1.
func ValidateSignatureValues(v byte, r, s *big.Int, homestead bool) bool {
	// Reject nil values. This is not required by EIP-2, but lots of software
	// including geth have done this.
	if r == nil || s == nil {
		return false
	}
	// Reject values outside the secp256k1 curve range.
	if r.Sign() <= 0 || s.Sign() <= 0 {
		return false
	}
	if r.Cmp(secp256k1N) >= 0 || s.Cmp(secp256k1N) >= 0 {
		return false
	}
	// EIP-2 requirement: S must be in the lower half of the curve order.
	if homestead && s.Cmp(secp256k1halfN) > 0 {
		return false
	}
	return true
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/crypto.go">
```go
// Keccak256 calculates and returns the Keccak256 hash of the input data.
func Keccak256(data ...[]byte) []byte {
	b := make([]byte, 32)
	d := sha3.NewLegacyKeccak256()
	for _, l := range data {
		d.Write(l)
	}
	d.Read(b)
	return b
}

// PubkeyToAddress returns the Ethereum address of a public key.
func PubkeyToAddress(p ecdsa.PublicKey) common.Address {
	return common.BytesToAddress(Keccak256(p.X.Bytes(), p.Y.Bytes())[12:])
}
```
</file>
</go-ethereum>
## Prompt Corrections

The explanation for `geth` in the original prompt is accurate. Here are some extra details that clarify the implementation choices based on the go-ethereum code:

1.  **Input Padding**: The use of `common.RightPadBytes(input, 128)` ensures that the input is always treated as 128 bytes, even if the caller provides fewer. This prevents out-of-bounds errors when slicing. Any missing bytes are padded with zeros.

2.  **`v` Parameter Validation**: The `ecrecover` precompile code in `contracts.go` adjusts `v` by subtracting 27, expecting the result to be 0 or 1. The subsequent call to `crypto.Ecrecover` (which wraps `secp256k1.Ecrecover`) implicitly handles this, as it will fail if the recovery ID is not 0 or 1. The code also checks that bytes 32 through 62 of the input are all zero (`!allZero(input[32:63])`), ensuring that the `v` parameter is not a value larger than 255.

3.  **Signature `s` Value Validation**: The `crypto.ValidateSignatureValues` function is called with `homestead=false`. This is a critical detail. When `homestead` is `true`, it enforces the EIP-2 rule that `s` must be in the lower half of the curve order to prevent signature malleability. By setting it to `false`, the `ECRECOVER` precompile allows signatures with `s` values in the upper half of the curve order, maintaining compatibility with pre-Homestead signatures.

4.  **Public Key to Address Conversion**: The `crypto.Keccak256(pubKey[1:])` call is the standard way to derive an address. `pubKey` is a 65-byte uncompressed public key `(0x04, X, Y)`. The first byte (`0x04`) is stripped before hashing, meaning only the 64-byte `(X, Y)` coordinate data is hashed. The final address is the last 20 bytes of the resulting Keccak256 hash.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas cost for pre-compiled contracts
const (
	EcrecoverGas        uint64 = 3000
	Sha256BaseGas       uint64 = 60
	Sha256PerWordGas    uint64 = 12
	Ripemd160BaseGas    uint64 = 600
	Ripemd160PerWordGas uint64 = 120
	IdentityBaseGas     uint64 = 15
	IdentityPerWordGas  uint64 = 3
	ModExpQuadCoeffDiv  uint64 = 20
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// ecrecover implemented as a native contract.
type ecrecover struct{}

func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	const ecRecoverInputLength = 128

	input = common.RightPadBytes(input, ecRecoverInputLength)
	// "input" is (hash, v, r, s), each 32 bytes
	// but for ecrecover we want (r, s, v)

	r := new(big.Int).SetBytes(input[64:96])
	s := new(big.Int).SetBytes(input[96:128])
	v := input[63] - 27

	// tighter sig s values input homestead only apply to tx sigs
	if !allZero(input[32:63]) || !crypto.ValidateSignatureValues(v, r, s, false) {
		return nil, nil
	}
	// We must make sure not to modify the 'input', so placing the 'v' along with
	// the signature needs to be done on a new allocation
	sig := make([]byte, 65)
	copy(sig, input[64:128])
	sig[64] = v
	// v needs to be at the end for libsecp256k1
	pubKey, err := crypto.Ecrecover(input[:32], sig)
	// make sure the public key is a valid one
	if err != nil {
		return nil, nil
	}

	// the first byte of pubkey is bitcoin heritage
	return common.LeftPadBytes(crypto.Keccak256(pubKey[1:])[12:], 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/signature.go">
```go
// ValidateSignatureValues verifies whether the signature values are valid according
// to the EIP-2 rules. The signature is valid if R and S are in the range [1, N-1]
// and V is 27 or 28. It also checks for "malleability" of S, if required.
func ValidateSignatureValues(v byte, r, s *big.Int, homestead bool) bool {
	if r.Cmp(common.Big1) < 0 || s.Cmp(common.Big1) < 0 {
		return false
	}
	// Reject upper range of s values (ECDSA malleability)
	// See EIP-2: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2.md
	if homestead && s.Cmp(secp256k1.S256().HalfN) > 0 {
		return false
	}
	// EIP-2098: disallow s > N-1
	// This is partly enforced by `new(big.Int).SetBytes()` always producing a positive number,
	// so we only need to check for s >= N.
	return r.Cmp(secp256k1.S256().N) < 0 && s.Cmp(secp256k1.S256().N) < 0 && (v == 0 || v == 1)
}

// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	return secp256k1.Ecrecover(hash, sig)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/secp256k1/secp256.go">
```go
// Ecrecover returns the uncompressed public key that created the given signature.
//
// The public key is 65 bytes long and starts with the constant 0x04.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	if len(sig) != 65 {
		return nil, fmt.Errorf("invalid signature length: got %d, want 65", len(sig))
	}
	var (
		ctx    = context()
		pubkey *C.secp256k1_pubkey
		recid  C.int
	)
	if C.secp256k1_pubkey_parse(ctx, &pubkey, &sig[0], 65) != 1 {
		// This will never happen with a public key constructed by this library.
		// It can only happen if the caller passes in an invalid public key.
	}

	// The recovery id is the last byte of the signature.
	if sig[64] >= 27 {
		sig[64] -= 27
	}
	recid = C.int(sig[64])

	r, s := &sig[0], &sig[32]
	var (
		rmsg   C.secp256k1_ecdsa_recoverable_signature
		rsig   C.secp256k1_ecdsa_signature
		pubkey C.secp256k1_pubkey
	)
	if C.secp256k1_ecdsa_recoverable_signature_parse_compact(ctx, &rmsg, r, recid, 0) == 0 {
		return nil, errors.New("invalid signature")
	}
	// secp256k1_ecdsa_recover wants a 'normal' signature, not a recoverable one.
	// We have to round-trip through `secp256k1_ecdsa_recoverable_signature_convert`
	// to get what we want.
	if C.secp256k1_ecdsa_recoverable_signature_convert(ctx, &rsig, &rmsg) == 0 {
		return nil, errors.New("failed to convert signature")
	}
	if C.secp256k1_ecdsa_recover(ctx, &pubkey, &rsig, (*C.uchar)(&hash[0])) == 0 {
		return nil, errors.New("failed to recover public key")
	}

	var (
		output    = make([]byte, 65)
		outputlen = C.size_t(65)
	)
	C.secp256k1_ec_pubkey_serialize(ctx, (*C.uchar)(&output[0]), &outputlen, &pubkey, C.SECP256K1_EC_UNCOMPRESSED)
	return output, nil
}
```
</file>
</go-ethereum>
<prompt_corrections>
- The `v` parameter validation in the original prompt's `validate_signature_params` function is slightly incorrect. It checks `if (recovery_id != 0 and recovery_id != 1)`, which is correct, but the go-ethereum implementation shows that a more robust check involves ensuring that any padding on the `v` value is all zeros (`!allZero(input[32:63])`) before checking the final byte. This prevents accepting `v` values like `0x0...011b` (i.e., 27 or 28 with leading non-zero bytes).
- The prompt correctly identifies `v` can be 27/28 for legacy or a larger value for EIP-155. The geth implementation simplifies this by always doing `v - 27` and then passing the result (0 or 1) to the crypto library. The `ValidateSignatureValues` function in geth confirms that `v` must be 0 or 1 after this subtraction, effectively covering both legacy and EIP-155 cases without needing to parse the chain ID from `v`. This is a simpler and more direct implementation pattern.
</prompt_corrections>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.5/params/protocol_params.go#L140">
```go
// EcrecoverGas is the gas price for the ecrecover precompiled contract.
const EcrecoverGas uint64 = 3000
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.5/core/vm/contracts.go#L264-L301">
```go
// ecrecover implemented as a native contract.
type ecrecover struct{}

func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	const ecRecoverInputLength = 128

	input = common.RightPadBytes(input, ecRecoverInputLength)
	// "input" is (hash, v, r, s), each 32 bytes
	// but for ecrecover we want (r, s, v)

	r := new(big.Int).SetBytes(input[64:96])
	s := new(big.Int).SetBytes(input[96:128])
	v := input[63] - 27

	// tighter sig s values input homestead only apply to tx sigs
	if !allZero(input[32:63]) || !crypto.ValidateSignatureValues(v, r, s, false) {
		return nil, nil
	}
	// We must make sure not to modify the 'input', so placing the 'v' along with
	// the signature needs to be done on a new allocation
	sig := make([]byte, 65)
	copy(sig, input[64:128])
	sig[64] = v
	// v needs to be at the end for libsecp256k1
	pubKey, err := crypto.Ecrecover(input[:32], sig)
	// make sure the public key is a valid one
	if err != nil {
		return nil, nil
	}

	// the first byte of pubkey is bitcoin heritage
	return common.LeftPadBytes(crypto.Keccak256(pubKey[1:])[12:], 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.5/crypto/signature.go#L210-L241">
```go
// ValidateSignatureValues verifies whether the signature values are valid according
// to the EIP2 rules. The v value is assumed to be either 0 or 1.
func ValidateSignatureValues(v byte, r, s *big.Int, homestead bool) bool {
	if r.Cmp(common.Big1) < 0 || s.Cmp(common.Big1) < 0 {
		return false
	}
	// Reject lazy S values in EIP-2 enabled chains
	if homestead && s.Cmp(secp256k1N.Half()) > 0 {
		return false
	}
	// P-256 modulus.
	return r.Cmp(secp256k1N.N) < 0 && s.Cmp(secp256k1N.N) < 0 && (v == 0 || v == 1)
}


// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	return secp256k1.RecoverPubkey(hash, sig)
}

// SigToPub returns the public key that created the given signature.
func SigToPub(hash, sig []byte) (*ecdsa.PublicKey, error) {
	// Convert to btcec input format with 'recovery id' v at the end.
	pub, err := Ecrecover(hash, sig)
	if err != nil {
		return nil, err
	}
	return UnmarshalPubkey(pub)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.5/crypto/crypto.go#L37-L44">
```go
// PubkeyToAddress returns the address of a public key.
func PubkeyToAddress(p ecdsa.PublicKey) common.Address {
	var a common.Address
	pubBytes := FromECDSAPub(&p)
	// ECDSA public key is 65 bytes, but the address is the last 20 bytes of its keccak hash.
	// The first byte of the pubkey is the format of the key.
	copy(a[...], Keccak256(pubBytes[1:])[12:])
	return a
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/params/protocol_params.go#L29">
```go
	// EcrecoverGas is the gas price for the ecrecover precompiled contract.
	EcrecoverGas uint64 = 3000
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/contracts.go#L264-L308">
```go
// ecrecover implemented as a native contract.
type ecrecover struct{}

func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	const ecRecoverInputLength = 128

	input = common.RightPadBytes(input, ecRecoverInputLength)
	// "input" is (hash, v, r, s), each 32 bytes
	// but for ecrecover we want (r, s, v)

	r := new(big.Int).SetBytes(input[64:96])
	s := new(big.Int).SetBytes(input[96:128])
	v := input[63] - 27

	// tighter sig s values input homestead only apply to tx sigs
	if !allZero(input[32:63]) || !crypto.ValidateSignatureValues(v, r, s, false) {
		return nil, nil
	}
	// We must make sure not to modify the 'input', so placing the 'v' along with
	// the signature needs to be done on a new allocation
	sig := make([]byte, 65)
	copy(sig, input[64:128])
	sig[64] = v
	// v needs to be at the end for libsecp256k1
	pubKey, err := crypto.Ecrecover(input[:32], sig)
	// make sure the public key is a valid one
	if err != nil {
		return nil, nil
	}

	// the first byte of pubkey is bitcoin heritage
	return common.LeftPadBytes(crypto.Keccak256(pubKey[1:])[12:], 32), nil
}

// allZero returns true if all bytes in b are zero.
func allZero(b []byte) bool {
	for _, byte := range b {
		if byte != 0 {
			return false
		}
	}
	return true
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/crypto/signature_cgo.go#L79-L93">
```go
// ValidateSignatureValues verifies that the signature values are valid according to
// the EIP2 rules, but does not verify the signature itself.
func ValidateSignatureValues(v byte, r, s *big.Int, homestead bool) bool {
	if r.Sign() <= 0 || s.Sign() <= 0 {
		return false
	}
	// Reject malleable signatures. This is a recent change introduced by EIP-2.
	// See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2.md
	if homestead && s.Cmp(secp256k1halfN) > 0 {
		return false
	}
	// secp256k1order is the order of the elliptic curve used in bitcoin's public-key
	// cryptography.
	// https://en.bitcoin.it/wiki/Secp256k1
	return r.Cmp(secp256k1N) < 0 && s.Cmp(secp256k1N) < 0 && (v == 0 || v == 1)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/crypto/secp256k1/secp256.go#L25-L27">
```go
var (
	// curve parameters
	secp256k1N, _  = new(big.Int).SetString("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141", 16)
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt's Zig implementation for `v` value validation is incorrect. The `ecrecover` precompile specification only accepts `v` values of 27 or 28, and does not support EIP-155 `v` values. Both the `go-ethereum` and `revm` reference implementations enforce this.

The `extract_recovery_id` and `validate_signature_params` functions in the prompt's Zig code should be corrected to disallow EIP-155 formats and only accept 27 or 28 for the `v` parameter.

**Incorrect Zig Implementation from Prompt:**
```zig
fn extract_recovery_id(v: u256) u8 {
    // ...
    // Handle EIP-155 format (chain_id * 2 + 35/36)
    if (v >= 35) { // THIS IS INCORRECT for the precompile
        // ...
    }
    //...
}
```

**Corrected Logic (based on go-ethereum and revm):**
The validation should check that the first 31 bytes of the `v` input are zero, and the last byte is either 27 or 28.

**Example of correct validation from `revm`:**
```rust
if !(input[32..63].iter().all(|&b| b == 0) && matches!(input[63], 27 | 28)) {
    return Ok(PrecompileOutput::new(ECRECOVER_BASE, Bytes::new()));
}
```

**Example from `go-ethereum`:**
```go
// v is extracted from the last byte
v := input[63] - 27

// The first 31 bytes of v are checked to be zero, and v is checked to be 0 or 1.
if !allZero(input[32:63]) || !crypto.ValidateSignatureValues(v, r, s, false) {
    return nil, nil
}
```

## Implementation Strategy & Research

### Recommended Approach: WASM-compatible secp256k1 Library

**Primary Option: bitcoin-core/secp256k1 (Recommended)**
- 🎯 **Library**: [bitcoin-core/secp256k1](https://github.com/bitcoin-core/secp256k1) compiled to WASM
- ✅ **Pros**: 
  - Battle-tested crypto implementation with extensive audit history
  - "Very efficient implementation" designed for embedded systems
  - Constant time, constant memory access operations (side-channel resistant)
  - No runtime dependencies
  - Includes "optional module for public key recovery" (perfect for ECRECOVER)
- ⚠️ **Tradeoffs**: Moderate bundle size increase, requires WASM compilation setup
- 📦 **Bundle Impact**: ~100-200KB additional WASM size (estimated, no runtime deps helps)
- 🔒 **Security Features**: Optional runtime blinding, no data-dependent branches, constant time operations
- 🎯 **Compatibility**: Designed to be "difficult to use insecurely", structured for review

**Fallback Option: Custom WASM Binding**  
- 🔄 **Backup**: Small custom WASM wrapper around minimal secp256k1 recovery functions
- ⚠️ **Tradeoff**: More development work, potential security risks with custom crypto
- 🎯 **Use Case**: If full secp256k1 library proves too large for bundle size targets

### Investigation Steps
1. **Setup WASM compilation**: Configure bitcoin-core/secp256k1 to compile to WASM target
2. **Enable recovery module**: Ensure the optional public key recovery module is enabled
3. **Bundle size analysis**: Measure actual WASM size impact (expect ~100-200KB)
4. **Security verification**: Leverage library's extensive testing infrastructure and security features
5. **Performance benchmarks**: Test constant-time operations in WASM environment
6. **Integration testing**: Verify proper error handling and edge case behavior

### Bundle Size Priority
Following Tevm's preference hierarchy for ECRECOVER (0x01):
1. ❌ Zig stdlib - No secp256k1 implementation available
2. ❌ Trivial implementation - ECDSA recovery is complex, security-critical
3. ❌ Native Zig crypto library - No mature options available
4. ✅ **WASM secp256k1 library (recommended)** - Mature, secure, WASM-compatible
5. 🔄 Custom minimal WASM wrapper (fallback) - Higher risk but potentially smaller

### Critical Implementation Notes
- **Security First**: ECRECOVER is fundamental to Ethereum security - prefer proven libraries
- **v Parameter**: Only accept 27/28, reject EIP-155 format (as shown in reference implementations)
- **Signature Validation**: Follow geth pattern - validate r,s in range, no homestead s-value restriction in precompile
- **Bundle Size vs Security**: Acceptable to have moderate bundle size increase for critical security functionality

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/precompiles/ecrecover_test.zig`)
```zig
// Test basic signature recovery
test "ecrecover basic signature recovery with known test vectors"
test "ecrecover handles empty output on invalid signature"
test "ecrecover recovery ID edge cases (0 and 1)"
test "ecrecover validates v parameter strictly (27/28 only)"
```

#### 2. **Input Validation Tests**
```zig
test "ecrecover rejects v != 27 and v != 28"
test "ecrecover rejects non-zero padding in v parameter"
test "ecrecover handles input length < 128 bytes (right-padded)"
test "ecrecover handles input length > 128 bytes (truncated)"
test "ecrecover validates r and s range [1, secp256k1_N-1]"
test "ecrecover rejects r=0 or s=0"
```

#### 3. **Gas Calculation Tests**
```zig
test "ecrecover fixed gas cost (3000) regardless of success"
test "ecrecover fixed gas cost (3000) regardless of failure"
test "ecrecover gas deduction in EVM context"
```

#### 4. **Signature Parameter Validation Tests**
```zig
test "ecrecover accepts maximum valid r value (secp256k1_N-1)"
test "ecrecover accepts maximum valid s value (secp256k1_N-1)"
test "ecrecover rejects r >= secp256k1_N"
test "ecrecover rejects s >= secp256k1_N"
test "ecrecover handles signature malleability (high s values)"
```

#### 5. **Ethereum Compatibility Tests**
```zig
test "ecrecover matches geth implementation on known vectors"
test "ecrecover matches execution-specs test vectors"
test "ecrecover handles legacy (pre-EIP155) signatures"
test "ecrecover address derivation matches reference"
```

#### 6. **Cryptographic Security Tests**
```zig
test "ecrecover constant-time execution (timing attack resistance)"
test "ecrecover handles edge cases in elliptic curve math"
test "ecrecover validates public key is on secp256k1 curve"
test "ecrecover handles point-at-infinity recovery attempts"
```

#### 7. **Error Handling Tests**
```zig
test "ecrecover returns empty output on any validation failure"
test "ecrecover handles corrupted signature gracefully"
test "ecrecover error propagation to EVM layer"
test "ecrecover never panics on malformed input"
```

#### 8. **Integration Tests**
```zig
test "ecrecover precompile registration at address 0x01"
test "ecrecover called from EVM execution context"
test "ecrecover gas accounting in transaction execution"
test "ecrecover hardfork availability (Frontier onwards)"
```

#### 9. **Performance & Security Tests**
```zig
test "ecrecover benchmark with realistic signature loads"
test "ecrecover memory safety with large inputs"
test "ecrecover WASM bundle size impact measurement"
test "ecrecover side-channel resistance validation"
```

### Test Development Priority
1. **Start with Ethereum test vectors** - Ensures spec compliance from day one
2. **Add input validation** - Critical for security and preventing exploits
3. **Test signature parameter validation** - Core cryptographic correctness
4. **Add performance benchmarks** - Ensures production readiness
5. **Test error cases and edge cases** - Robust error handling

### Test Data Sources
- **Ethereum test suite**: Official test vectors from ethereum/tests repository
- **Geth compatibility tests**: Cross-client compatibility verification
- **secp256k1 test vectors**: Cryptographic library test cases
- **Malformed input generation**: Fuzzing and boundary testing
- **Real transaction signatures**: Mainnet signature examples

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public functions
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify WASM compilation and execution

### Test-First Examples

**Before writing any implementation:**
```zig
test "ecrecover basic functionality" {
    // This test MUST fail initially
    const hash = test_vectors.ethereum_message_hash;
    const v: u8 = 28;
    const r = test_vectors.signature_r;
    const s = test_vectors.signature_s;
    const expected_address = test_vectors.expected_signer_address;
    
    const input = format_ecrecover_input(hash, v, r, s);
    const result = ecrecover.run(input);
    
    try testing.expectEqualSlices(u8, expected_address, result);
}
```

**Only then implement:**
```zig
pub fn run(input: []const u8) ![]u8 {
    // Minimal implementation to make test pass
    return error.NotImplemented; // Initially
}
```

### Critical Test Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test against known attack vectors** (malleability, timing)
- **Verify Ethereum compatibility** with real transaction data
- **Validate cryptographic correctness** with curve edge cases
- **Ensure constant-time execution** for security

