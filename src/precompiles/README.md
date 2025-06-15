# Ethereum Precompiles Implementation

This package provides Ethereum-compatible precompiled contracts using a hybrid approach that balances security, performance, and maintainability.

## 🎉 Implementation Complete!

All 12 Ethereum precompiled contracts (addresses 0x01-0x11) are now fully implemented:
- **2 Pure Zig implementations** for simple operations (SHA256, IDENTITY)
- **10 REVM-wrapped implementations** for complex cryptography (all others)
- **Full C FFI interface** for seamless integration with Zig
- **Comprehensive test coverage** for both implementation strategies

## Implementation Strategy

We use a **hybrid approach** for implementing Ethereum precompiles:

### 🦀 REVM-Wrapped (Security-Critical)
For complex cryptographic operations that require battle-tested implementations:
- **ECRECOVER (0x01)** - ECDSA signature recovery using REVM's audited secp256k1 implementation
- **MODEXP (0x05)** - Big integer modular exponentiation using Aurora Engine's optimized version
- **BN128 operations (0x06-0x08)** - Elliptic curve operations using Arkworks/substrate-bn
- **BLAKE2F (0x09)** - BLAKE2b compression function
- **KZG_POINT_EVALUATION (0x0A)** - KZG polynomial commitment verification
- **BLS12_381 operations (0x0B-0x11)** - BLS12-381 curve operations

### ⚡ Pure Zig (Simple & Fast)
For straightforward operations where Zig's standard library provides secure implementations:
- **SHA256 (0x02)** ✅ - Using `std.crypto.hash.sha2.Sha256`
- **RIPEMD160 (0x03)** - Using `std.crypto.hash.Ripemd160`  
- **IDENTITY (0x04)** - Simple data passthrough

## Structure

- `src/lib.rs` - Rust C interface wrapper around REVM precompiles
- `precompiles.zig` - Main Zig wrapper module with C bindings
- `sha256.zig` - Pure Zig SHA256 implementation ✅
- `identity.zig` - Pure Zig IDENTITY implementation ✅
- `ecrecover.zig` - ECRECOVER interface (delegates to REVM)
- Individual precompile modules for each implementation

## Detailed Implementation Analysis

### Pure Zig Implementations ⚡

#### SHA256 (0x02) ✅ Complete
- **Zig Standard Library**: `std.crypto.hash.sha2.Sha256` - Full implementation available
- **Decision**: Pure Zig implementation using standard library
- **Rationale**: Simple hash function, mature std lib implementation, no dependencies needed
- **Gas Cost**: `60 + 12 * ceil(input_len / 32)` (base + per-word)
- **Implementation**: Direct usage of `Sha256.hash(input, output, .{})`

#### IDENTITY (0x04) ✅ Complete
- **Zig Standard Library**: No crypto needed - simple data passthrough
- **Decision**: Pure Zig implementation (trivial)
- **Rationale**: Simplest possible precompile, just returns input data unchanged
- **Gas Cost**: `15 + 3 * ceil(input_len / 32)` (base + per-word)
- **Implementation**: Memory copy operation with gas accounting

#### RIPEMD160 (0x03) ✅ Complete  
- **Zig Standard Library**: ❌ NOT AVAILABLE - No `std.crypto.hash.Ripemd160`
- **Decision**: Use REVM wrapper instead of pure Zig
- **Rationale**: RIPEMD160 not in Zig std lib, would require external dependency or custom implementation
- **Alternative Considered**: Implementing from scratch, but security risk outweighs benefits
- **Gas Cost**: `600 + 120 * ceil(input_len / 32)` (base + per-word)

### REVM-Wrapped Implementations 🦀

#### ECRECOVER (0x01) ✅ Complete
- **Zig Standard Library**: `std.crypto.sign.ecdsa.EcdsaSecp256k1Sha256` - Signing/verification only, NO recovery
- **Decision**: Use REVM wrapper for battle-tested implementation  
- **Rationale**: ECDSA public key recovery is complex, security-critical, and not available in Zig std lib
- **REVM Backend**: Uses Bitcoin Core's `libsecp256k1` (C) or RustCrypto's `k256` (pure Rust)
- **Gas Cost**: Fixed 3000 gas
- **Alternative Considered**: Third-party `zig-eth-secp256k1` library, but REVM more established

#### MODEXP (0x05) ✅ Complete
- **Zig Standard Library**: Basic big integer operations exist but no optimized modular exponentiation
- **Decision**: Use REVM wrapper with Aurora Engine's implementation
- **Rationale**: Complex mathematical operation requiring optimization for large numbers
- **REVM Backend**: Aurora Engine's highly optimized `aurora-engine-modexp` crate
- **Gas Cost**: Complex formula based on base/exponent/modulus sizes (EIP-2565)

#### BN128/BN254 Operations (0x06-0x08) ✅ Complete
- **Zig Standard Library**: ❌ NO elliptic curve support for BN128/BN254
- **Decision**: Use REVM wrapper with Arkworks or substrate-bn
- **Rationale**: Complex elliptic curve math, ZK-proof verification, not in std lib
- **REVM Backend**: Arkworks `ark-bn254` (default) or Parity's `substrate-bn`
- **Gas Costs**: Fork-dependent (cheaper after Istanbul)
  - **ECADD (0x06)**: 150 gas (Istanbul) vs 500 gas (Byzantium)
  - **ECMUL (0x07)**: 6000 gas (Istanbul) vs 40000 gas (Byzantium)  
  - **ECPAIRING (0x08)**: 45000 + 34000*pairs (Istanbul) vs 100000 + 80000*pairs (Byzantium)

#### BLAKE2F (0x09) ✅ Complete
- **Zig Standard Library**: `std.crypto.hash.blake2` exists but NOT the specific "F" compression function
- **Decision**: Use REVM wrapper for EIP-152 compliance
- **Rationale**: Requires specific BLAKE2b F compression function, not general BLAKE2 hashing
- **REVM Backend**: Specialized BLAKE2b F implementation
- **Gas Cost**: 1 gas per round (rounds specified in input)

#### KZG Point Evaluation (0x0A) ✅ Complete  
- **Zig Standard Library**: ❌ NO KZG polynomial commitment support
- **Decision**: Use REVM wrapper with Ethereum Foundation's c-kzg
- **Rationale**: Highly specialized cryptography for proto-danksharding, not in std lib
- **REVM Backend**: Ethereum Foundation's `c-kzg-4844` library (C) or `kzg-rs` (pure Rust)
- **Gas Cost**: Fixed 50000 gas

#### BLS12-381 Operations (0x0B-0x11) ✅ Complete
- **Zig Standard Library**: ❌ NO BLS12-381 curve support  
- **Decision**: Use REVM wrapper with BLST or Arkworks
- **Rationale**: Advanced elliptic curve operations, not available in std lib
- **REVM Backend**: BLST library (C, highly optimized) or Arkworks `ark-bls12-381` (pure Rust)
- **Note**: EIP-2537 not adopted on Ethereum mainnet, but supported for completeness

## Implementation Status Summary

| Address | Name | Implementation | Status | Zig Std Lib Available | Decision Driver |
|---------|------|----------------|--------|----------------------|-----------------|
| 0x01 | ECRECOVER | REVM | ✅ Complete | ❌ No recovery | Security + Complexity |
| 0x02 | SHA256 | Pure Zig | ✅ Complete | ✅ `hash.sha2.Sha256` | Simple + Available |
| 0x03 | RIPEMD160 | REVM | ✅ Complete | ❌ No RIPEMD160 | Not in std lib |
| 0x04 | IDENTITY | Pure Zig | ✅ Complete | ✅ Trivial copy | Simplest possible |
| 0x05 | MODEXP | REVM | ✅ Complete | ❌ No optimized modexp | Complexity + Performance |
| 0x06 | ECADD | REVM | ✅ Complete | ❌ No BN128 | Not in std lib |
| 0x07 | ECMUL | REVM | ✅ Complete | ❌ No BN128 | Not in std lib |
| 0x08 | ECPAIRING | REVM | ✅ Complete | ❌ No BN128 | Not in std lib |
| 0x09 | BLAKE2F | REVM | ✅ Complete | ❌ No "F" function | Specialized function |
| 0x0A | KZG_POINT_EVALUATION | REVM | ✅ Complete | ❌ No KZG | Not in std lib |
| 0x0B-0x11 | BLS12_381_* | REVM | ✅ Complete | ❌ No BLS12-381 | Not in std lib |

## Usage

```zig
const precompiles = @import("precompiles");

// Create precompiles instance for latest Ethereum hardfork
var precompiles_instance = try precompiles.Precompiles.create_latest(allocator);
defer precompiles_instance.deinit();

// Execute a precompile (example: SHA256)
const sha256_addr = try precompiles.Precompiles.get_address(.sha256);
const result = try precompiles_instance.run(sha256_addr, input_data, gas_limit);
defer result.deinit();

// Or use convenience functions for pure Zig implementations
const sha256_result = try precompiles.sha256(&precompiles_instance, input_data, gas_limit);
defer sha256_result.deinit();
```

## Pure Zig Implementation Details

### SHA256 (0x02) ✅ Complete
- **Implementation**: Uses `std.crypto.hash.sha2.Sha256` from Zig standard library
- **Gas cost**: `60 + 12 * ceil(input_len / 32)` (base + per-word)
- **Input**: Any length byte array
- **Output**: 32 bytes (SHA-256 hash)
- **Testing**: Comprehensive test suite with known test vectors
- **Performance**: Optimized pure Zig implementation

```zig
// Direct usage of pure Zig SHA256
const sha256_impl = @import("sha256.zig");
const result = try sha256_impl.sha256(input_data, allocator);
defer allocator.free(result);
```

### IDENTITY (0x04) ✅ Complete
- **Implementation**: Pure Zig memory copy operation
- **Gas cost**: `15 + 3 * ceil(input_len / 32)` (base + per-word)
- **Input**: Any length byte array
- **Output**: Exact copy of input data (same length)
- **Behavior**: Returns input data unchanged, serves as a no-op precompile
- **Use Case**: Used for copying data between contracts with predictable gas cost

```zig
// Direct usage of pure Zig IDENTITY
const identity_impl = @import("identity.zig");
const result = try identity_impl.identity(input_data, allocator);
defer allocator.free(result);
// result equals input_data
```

**Implementation Details:**
- Simple memory allocation and copy: `@memcpy(result, input)`
- Gas cost reflects memory copy overhead with per-word pricing
- Minimal gas cost (15 base) makes it cheapest precompile for data copying
- Available since Frontier hardfork (address 0x04)

## Why This Hybrid Approach?

1. **Security First**: Use REVM's battle-tested implementations for complex cryptography
2. **Performance**: Pure Zig for simple operations eliminates FFI overhead
3. **Bundle Size**: Reduce dependencies where Zig std lib suffices
4. **Maintainability**: Clear separation between complex and simple precompiles
5. **Auditability**: Easier to audit pure Zig implementations

## Testing

Each implementation includes comprehensive test suites:

```bash
# Test individual pure Zig implementations
zig test sha256.zig

# Test the complete precompiles wrapper
zig test precompiles.zig

# Test Rust REVM wrapper
cargo test
```

## Gas Cost Compatibility

All implementations strictly follow Ethereum gas cost formulas from the Yellow Paper:
- **SHA256**: 60 + 12 * ceil(input_len / 32)
- **RIPEMD160**: 600 + 120 * ceil(input_len / 32)  
- **IDENTITY**: 15 + 3 * ceil(input_len / 32)
- **ECRECOVER**: Fixed 3000 gas
- **Complex precompiles**: Fork-specific costs (e.g., BN128 cheaper after Istanbul)