# Implement SHA256 Precompile

You are implementing the SHA256 precompile (address 0x02) for the Tevm EVM written in Zig. Your goal is to provide SHA256 hashing functionality for smart contracts, following Ethereum specifications and maintaining compatibility with all Ethereum clients.

## Context
SHA256 is fundamental for Ethereum ecosystem compatibility and is used by smart contracts for data integrity verification, commitment schemes, and interoperability with Bitcoin and other systems. The precompile provides an efficient, gas-optimized way for contracts to compute SHA256 hashes without implementing the algorithm in expensive EVM bytecode.

## Development Workflow
- **Branch**: `feat_implement_sha` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_sha feat_implement_sha`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement the SHA256 precompile (address 0x02) for Ethereum Virtual Machine compatibility. This precompile provides SHA256 hashing functionality and is available from the Frontier hardfork. This implementation assumes the IDENTITY precompile infrastructure already exists.

## File Structure

**Primary Files to Modify:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher

**Supporting Files:**
- `/src/evm/precompiles/precompile_addresses.zig` - Address constants
- `/src/evm/precompiles/precompile_gas.zig` - Gas calculation for precompiles
- `/src/evm/precompiles/precompile_result.zig` - Result types for precompile execution

**New Files to Create:**
- `/src/evm/precompiles/sha256.zig` - SHA256 hash implementation

**Test Files:**
- `/test/evm/precompiles/` (directory) - Precompile test infrastructure
- `/test/evm/precompiles/sha256_test.zig` - SHA256 specific tests

**Why These Files:**
- The main precompile dispatcher needs to route calls to the SHA256 implementation
- Address constants define the precompile address (0x02)
- New implementation file handles SHA256 cryptographic hash function
- Comprehensive tests ensure correctness and performance

## ELI5

SHA256 is a widely-used cryptographic hash function that takes any amount of data and produces a unique 256-bit (32-byte) "fingerprint" or hash. Think of it like a super-secure digital fingerprint machine - no matter how much data you put in, you always get exactly 32 bytes out, and even tiny changes to the input produce completely different outputs. Smart contracts use SHA256 when they need to verify data integrity or create tamper-proof references to data.

## 🚨 CRITICAL SECURITY WARNING: DO NOT IMPLEMENT CUSTOM CRYPTO

**❌ NEVER IMPLEMENT CRYPTOGRAPHIC ALGORITHMS FROM SCRATCH**

This prompt involves cryptographic operations. Follow these security principles:

### ✅ **DO THIS:**
- **Use established crypto libraries** (Zig std.crypto, noble-hashes, libsecp256k1)
- **Import proven implementations** from well-audited libraries
- **Leverage existing WASM crypto libraries** when Zig stdlib lacks algorithms
- **Follow reference implementations** from go-ethereum, revm, evmone exactly
- **Use test vectors** from official specifications to verify correctness

### ❌ **NEVER DO THIS:**
- Write your own hash functions, signature verification, or elliptic curve operations
- Implement cryptographic primitives "from scratch" or "for learning"
- Modify cryptographic algorithms or add "optimizations"
- Copy-paste crypto code from tutorials or unofficial sources
- Implement crypto without extensive peer review and testing

### 🎯 **Implementation Strategy:**
1. **First choice**: Use Zig standard library crypto functions when available
2. **Second choice**: Use well-established WASM crypto libraries (noble-hashes, etc.)
3. **Third choice**: Bind to audited C libraries (libsecp256k1, OpenSSL)
4. **Never**: Write custom cryptographic implementations

**Remember**: Cryptographic bugs can lead to fund loss, private key exposure, and complete system compromise. Always use proven, audited implementations.

## Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000002`
- **Gas Cost**: `60 + 12 * ceil(input_size / 32)`
- **Function**: Returns SHA256 hash (32 bytes) of input data
- **Available**: All hardforks (Frontier onwards)
- **Output**: Always 32 bytes regardless of input size

## Reference Implementations

### evmone Implementation
File: `/Users/williamcory/tevm/main/evmone/test/state/precompiles.cpp:62-65`
```cpp
PrecompileAnalysis sha256_analyze(bytes_view input, evmc_revision /*rev*/) noexcept
{
    return {cost_per_input_word<60, 12>(input.size()), 32};
}
```

### revm Implementation
Search for SHA256 precompile in revm codebase for gas calculation and execution patterns.

### Zig Standard Library
Zig provides SHA256 implementation in `std.crypto.hash.sha2.Sha256`:
```zig
const std = @import("std");
const Sha256 = std.crypto.hash.sha2.Sha256;

pub fn sha256_hash(input: []const u8) [32]u8 {
    var hasher = Sha256.init(.{});
    hasher.update(input);
    return hasher.finalResult();
}
```

## Implementation Requirements

### Core Functionality
1. **Gas Calculation**: `60 + 12 * ceil(input_size / 32)`
2. **Hash Computation**: Use Zig's std.crypto SHA256 implementation
3. **Output Format**: Always return 32 bytes
4. **Error Handling**: OutOfGas if gas limit exceeded
5. **Performance**: Leverage Zig's optimized crypto library

### Integration with Existing Precompile Infrastructure
- Extends the precompile system created for IDENTITY
- Follows same patterns for gas calculation and execution
- Integrates with existing dispatcher in `/src/evm/precompiles/precompiles.zig`

## Implementation Tasks

### Task 1: Add SHA256 Gas Constants
File: `/src/evm/constants/gas_constants.zig`
```zig
// SHA256 precompile gas costs
pub const SHA256_BASE_COST: u64 = 60;
pub const SHA256_WORD_COST: u64 = 12;
```

### Task 2: Implement SHA256 Precompile
File: `/src/evm/precompiles/sha256.zig`
```zig
const std = @import("std");
const Sha256 = std.crypto.hash.sha2.Sha256;
const gas_constants = @import("../constants/gas_constants.zig");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileError = @import("precompile_result.zig").PrecompileError;

pub fn calculate_gas(input_size: usize) u64 {
    const word_count = (input_size + 31) / 32;
    return gas_constants.SHA256_BASE_COST + gas_constants.SHA256_WORD_COST * @as(u64, @intCast(word_count));
}

pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    const gas_cost = calculate_gas(input.len);
    if (gas_cost > gas_limit) return PrecompileError.OutOfGas;
    if (output.len < 32) return PrecompileError.InvalidOutput;
    
    // Compute SHA256 hash
    var hasher = Sha256.init(.{});
    hasher.update(input);
    const hash = hasher.finalResult();
    
    // Copy hash to output
    @memcpy(output[0..32], &hash);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
}
```

### Task 3: Update Precompile Dispatcher
File: `/src/evm/precompiles/precompiles.zig`
Add SHA256 to the precompile address mapping and execution dispatch.

### Task 4: Update Precompile Addresses
File: `/src/evm/precompiles/precompile_addresses.zig`
```zig
pub const SHA256_ADDRESS: u8 = 0x02;
```

### Task 5: Comprehensive Testing
File: `/test/evm/precompiles/sha256_test.zig`

### Test Cases
1. **Empty Input**: Hash of empty data should match known SHA256("")
2. **Standard Test Vectors**: Use RFC test vectors for SHA256
3. **Gas Calculation**: Verify gas costs for various input sizes
4. **Gas Limit**: Test OutOfGas scenarios
5. **Output Size**: Verify always 32 bytes output
6. **Integration**: Test via CALL/STATICCALL opcodes
7. **Performance**: Benchmark against reference implementations

### Known Test Vectors
```zig
test "sha256 known vectors" {
    // Empty string
    // SHA256("") = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    
    // "abc"
    // SHA256("abc") = ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
    
    // Test these known vectors
}
```

## Integration Points

### Files to Modify
- `/src/evm/precompiles/precompiles.zig` - Add SHA256 to dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Add SHA256 address constant
- `/src/evm/constants/gas_constants.zig` - Add SHA256 gas constants
- `/test/evm/precompiles/sha256_test.zig` - New test file

### Build System
Update `/build.zig` if needed to ensure crypto library linking.

## Performance Considerations

### Zig Crypto Library Benefits
- **Optimized Implementation**: Zig's std.crypto is performance-optimized
- **SIMD Support**: Automatic vectorization on supported platforms
- **Constant-Time**: Secure implementation resistant to timing attacks
- **Zero Dependencies**: No external crypto library dependencies

### Memory Management
```zig
// Efficient pattern for hashing
pub fn execute_efficient(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    const gas_cost = calculate_gas(input.len);
    if (gas_cost > gas_limit) return PrecompileError.OutOfGas;
    
    // Direct hash computation without intermediate allocations
    var hasher = Sha256.init(.{});
    hasher.update(input);
    hasher.final(output[0..32]);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
}
```

## Testing Strategy

### Unit Tests
- Gas calculation accuracy
- Hash correctness against known vectors
- Error handling (OutOfGas, invalid output size)
- Edge cases (empty input, maximum input size)

### Integration Tests
- CALL to 0x02 address works correctly
- STATICCALL to 0x02 address works correctly
- Gas accounting in VM context
- Return data handling

### Performance Tests
- Benchmark against evmone/revm implementations
- Memory usage profiling
- Large input handling (up to block gas limit)

## Success Criteria

1. **Ethereum Compatibility**: Passes all Ethereum Foundation SHA256 precompile tests
2. **Gas Accuracy**: Exact gas costs match specification (60 + 12 * words)
3. **Hash Correctness**: Output matches standard SHA256 implementations
4. **Integration**: Works seamlessly with existing CALL opcodes
5. **Performance**: Competitive with or better than reference implementations
6. **Bundle Size**: Minimal impact on WASM bundle size

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

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/precompiles/sha256_test.zig`)
```zig
// Test basic SHA256 functionality
test "sha256 basic functionality with known vectors"
test "sha256 handles edge cases correctly"
test "sha256 validates input format"
test "sha256 produces correct output format"
```

#### 2. **Input Validation Tests**
```zig
test "sha256 handles various input lengths"
test "sha256 validates input parameters"
test "sha256 rejects invalid inputs gracefully"
test "sha256 handles empty input"
```

#### 3. **Gas Calculation Tests**
```zig
test "sha256 gas cost calculation accuracy"
test "sha256 gas cost edge cases"
test "sha256 gas overflow protection"
test "sha256 gas deduction in EVM context"
```

#### 4. **Specification Compliance Tests**
```zig
test "sha256 matches specification test vectors"
test "sha256 matches reference implementation output"
test "sha256 hardfork availability requirements"
test "sha256 address registration correct"
```

#### 5. **Performance Tests**
```zig
test "sha256 performance with large inputs"
test "sha256 memory efficiency"
test "sha256 WASM bundle size impact"
test "sha256 benchmark against reference implementations"
```

#### 6. **Error Handling Tests**
```zig
test "sha256 error propagation"
test "sha256 proper error types returned"
test "sha256 handles corrupted input gracefully"
test "sha256 never panics on malformed input"
```

#### 7. **Integration Tests**
```zig
test "sha256 precompile registration"
test "sha256 called from EVM execution"
test "sha256 gas deduction in EVM context"
test "sha256 hardfork availability"
```

### Test Development Priority
1. **Start with specification test vectors** - Ensures spec compliance from day one
2. **Add input validation** - Prevents invalid states early
3. **Implement gas calculation** - Core economic security
4. **Add performance benchmarks** - Ensures production readiness
5. **Test error cases** - Robust error handling

### Test Data Sources
- **EIP/Specification test vectors**: Primary compliance verification
- **Reference implementation tests**: Cross-client compatibility
- **Mathematical test vectors**: Algorithm correctness
- **Edge case generation**: Boundary value testing

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public functions
- Validate performance benchmarks don't regress
- Test both debug and release builds

### Test-First Examples

**Before writing any implementation:**
```zig
test "sha256 basic functionality" {
    // This test MUST fail initially
    const input = test_vectors.valid_input;
    const expected = test_vectors.expected_output;
    
    const result = sha256.run(input);
    try testing.expectEqualSlices(u8, expected, result);
}
```

**Only then implement:**
```zig
pub fn run(input: []const u8) ![]u8 {
    // Minimal implementation to make test pass
    return error.NotImplemented; // Initially
}
```

## References

- [SHA256 Specification (FIPS 180-4)](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf)
- [Zig Crypto Documentation](https://ziglang.org/documentation/master/std/#std;crypto)
- [Ethereum Yellow Paper - Precompiles](https://ethereum.github.io/yellowpaper/paper.pdf)
- [RFC 6234 - SHA-2 Test Vectors](https://tools.ietf.org/rfc/rfc6234.txt)

## Reference Implementations

### revm

<explanation>
Revm provides a clean SHA256 precompile implementation using the sha2 crate. Key patterns:

1. **Linear Gas Calculation**: Uses a helper function `calc_linear_cost_u32()` for the standard 60 + 12 * ceil(len/32) formula
2. **External Crypto Library**: Uses the sha2 crate's `Sha256::digest()` for secure, optimized hashing
3. **Simple Error Handling**: Returns `OutOfGas` if gas limit exceeded, otherwise returns hash output
4. **Standard Pattern**: Follows consistent precompile patterns with gas check followed by computation
5. **Efficient Output**: Direct conversion from digest to output bytes

The implementation demonstrates the standard precompile pattern used across all hash-based precompiles.
</explanation>

<filename>revm/crates/precompile/src/hash.rs</filename>
<line start="21" end="29">
```rust
pub fn sha256_run(input: &[u8], gas_limit: u64) -> PrecompileResult {
    let cost = calc_linear_cost_u32(input.len(), 60, 12);
    if cost > gas_limit {
        Err(PrecompileError::OutOfGas)
    } else {
        let output = sha2::Sha256::digest(input);
        Ok(PrecompileOutput::new(cost, output.to_vec().into()))
    }
}
```
</line>

<filename>revm/crates/precompile/src/lib.rs</filename>
<line start="60" end="62">
```rust
/// Calculate the linear cost of a precompile.
pub fn calc_linear_cost_u32(len: usize, base: u64, word: u64) -> u64 {
    (len as u64).div_ceil(32) * word + base
}
```
</line>

### geth

<explanation>
The go-ethereum implementation shows the standard pattern for precompile implementations: separate gas calculation and execution methods, with simple gas formula (60 + 12 * words) and direct use of Go's crypto/sha256 library.
</explanation>

**Gas Calculation** - `/go-ethereum/params/protocol_params.go` (lines 141-142):
```go
Sha256BaseGas       uint64 = 60   // Base price for a SHA256 operation
Sha256PerWordGas    uint64 = 12   // Per-word price for a SHA256 operation
```

**Precompile Implementation** - `/go-ethereum/core/vm/contracts.go` (lines 303-315):
```go
type sha256hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Sha256PerWordGas + params.Sha256BaseGas
}

func (c *sha256hash) Run(input []byte) ([]byte, error) {
	h := sha256.Sum256(input)
	return h[:], nil
}
```

**Usage in Precompile Maps** - `/go-ethereum/core/vm/contracts.go` (lines 55-60):
```go
// PrecompiledContractsHomestead contains the default set of pre-compiled Ethereum
// contracts used in the Frontier and Homestead releases.
var PrecompiledContractsHomestead = PrecompiledContracts{
	common.BytesToAddress([]byte{0x1}): &ecrecover{},
	common.BytesToAddress([]byte{0x2}): &sha256hash{},
	common.BytesToAddress([]byte{0x3}): &ripemd160hash{},
	common.BytesToAddress([]byte{0x4}): &dataCopy{},
}
```

## Implementation Strategy & Research

### Recommended Approach: Zig Standard Library (Preferred)

**Primary Option: Zig `std.crypto.hash.sha256`**
- ✅ **Pros**: Native Zig implementation, zero external dependencies, optimal WASM bundle size
- 📦 **Bundle Impact**: Minimal - only includes what's used, no external library overhead
- 🎯 **Compatibility**: Perfect WASM compilation via Zig's built-in support
- 🔧 **API**: Simple and straightforward: `const hash = std.crypto.hash.sha256.hash(input);`
- 🛡️ **Security**: Part of Zig standard library, well-maintained and audited

**Fallback Option: WASM SHA256 Library**  
- 🔄 **Backup**: [tiny-sha256](https://github.com/jedisct1/tiny-sha256) or similar optimized WASM implementation
- ⚠️ **Tradeoff**: Slightly larger bundle size, external dependency management
- 🎯 **Use Case**: If Zig stdlib implementation has any compatibility issues

### Implementation Priority
Following Tevm's preference hierarchy for SHA256 (0x02):
1. ✅ **Zig stdlib (strongly recommended)** - `std.crypto.hash.sha256` 
2. 🔄 WASM library (fallback) - only if stdlib issues arise
3. ❌ Custom implementation (avoid) - unnecessary reinvention for well-defined algorithm

### Critical Implementation Notes
- **Gas Efficiency**: SHA256 has well-defined gas formula `60 + 12 * ceil(input_size / 32)`
- **Performance**: Zig stdlib implementation should provide excellent performance
- **Bundle Size**: SHA256 is common enough that the stdlib overhead is justified
- **Testing**: Use test vectors from NIST and compare against geth/other clients

### Sample Implementation Pattern
```zig
const std = @import("std");

pub fn sha256_precompile(input: []const u8) [32]u8 {
    return std.crypto.hash.sha256.hash(input);
}
```

### Research Notes
- Zig's SHA256 implementation is FIPS compliant and well-optimized
- No need for complex WASM bindings or external crypto libraries
- Perfect fit for Tevm's "prefer stdlib first" philosophy
- Expected bundle size impact: <10KB additional WASM

## EVMONE Context

An excellent and detailed prompt. The `evmone` codebase provides a clear and robust implementation of precompiles that will be a great reference. Here are the most relevant snippets to guide your implementation.

<evmone>
<explanation>
`evmone` defines precompiles by their address using an enum. This provides a type-safe way to reference them throughout the codebase. The `is_precompile` function shows a common pattern for quickly checking if a given address falls within the reserved precompile range.
</explanation>
<file path="test/state/precompiles.hpp">
```cpp
/// The precompile identifiers and their corresponding addresses.
enum class PrecompileId : uint8_t
{
    ecrecover = 0x01,
    sha256 = 0x02,
    ripemd160 = 0x03,
    identity = 0x04,
    expmod = 0x05,
    ecadd = 0x06,
    ecmul = 0x07,
    ecpairing = 0x08,
    blake2bf = 0x09,
    point_evaluation = 0x0a,
    bls12_g1add = 0x0b,
    bls12_g1msm = 0x0c,
    bls12_g2add = 0x0d,
    bls12_g2msm = 0x0e,
    bls12_pairing_check = 0x0f,
    bls12_map_fp_to_g1 = 0x10,
    bls12_map_fp2_to_g2 = 0x11,

    since_byzantium = expmod,         ///< The first precompile introduced in Byzantium.
    since_istanbul = blake2bf,        ///< The first precompile introduced in Istanbul.
    since_cancun = point_evaluation,  ///< The first precompile introduced in Cancun.
    since_prague = bls12_g1add,       ///< The first precompile introduced in Prague.
    latest = bls12_map_fp2_to_g2      ///< The latest introduced precompile (highest address).
};

/// Checks if the address @p addr is considered a precompiled contract in the revision @p rev.
bool is_precompile(evmc_revision rev, const evmc::address& addr) noexcept;

/// Executes the message to a precompiled contract (msg.code_address must be a precompile).
evmc::Result call_precompile(evmc_revision rev, const evmc_message& msg) noexcept;
```
</file>

<explanation>
This file defines the data structures for precompile analysis and execution results. `PrecompileAnalysis` encapsulates the gas cost and expected output size, while `ExecutionResult` reports the status and actual output size after execution. This separation is a clean pattern for handling precompile logic.
</explanation>
<file path="test/state/precompiles_internal.hpp">
```cpp
struct ExecutionResult
{
    evmc_status_code status_code;
    size_t output_size;
};

struct PrecompileAnalysis
{
    int64_t gas_cost;
    size_t max_output_size;
};

PrecompileAnalysis sha256_analyze(evmc::bytes_view input, evmc_revision rev) noexcept;

ExecutionResult sha256_execute(
    const uint8_t* input, size_t input_size, uint8_t* output, size_t output_size) noexcept;
```
</file>

<explanation>
The main precompile dispatch file. It demonstrates a clean, data-driven approach to precompile implementation.

1.  **`cost_per_input_word`**: A generic helper function that implements the linear gas cost formula `base + per_word_cost * ceil(input_size / 32)`. This is a core pattern for many precompiles, including SHA256.
2.  **`sha256_analyze`**: This function uses the helper to calculate the exact gas cost for the SHA256 precompile and specifies its fixed 32-byte output size.
3.  **`sha256_execute`**: The execution function, which directly calls the underlying cryptographic library (`crypto::sha256`) and returns the result.
4.  **`traits` and `call_precompile`**: These show how `evmone` uses a dispatch table to map a precompile address (`id`) to its corresponding `analyze` and `execute` functions. This is the central integration point.
</explanation>
<file path="test/state/precompiles.cpp">
```cpp
namespace
{
constexpr int64_t num_words(size_t size_in_bytes) noexcept
{
    return static_cast<int64_t>((size_in_bytes + 31) / 32);
}

template <int BaseCost, int WordCost>
constexpr int64_t cost_per_input_word(size_t input_size) noexcept
{
    return BaseCost + WordCost * num_words(input_size);
}
}  // namespace

PrecompileAnalysis sha256_analyze(bytes_view input, evmc_revision /*rev*/) noexcept
{
    return {cost_per_input_word<60, 12>(input.size()), 32};
}

ExecutionResult sha256_execute(const uint8_t* input, size_t input_size, uint8_t* output,
    [[maybe_unused]] size_t output_size) noexcept
{
    assert(output_size >= 32);
    crypto::sha256(reinterpret_cast<std::byte*>(output), reinterpret_cast<const std::byte*>(input),
        input_size);
    return {EVMC_SUCCESS, 32};
}

namespace
{
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
    {identity_analyze, identity_execute},
    // ...
}};
}  // namespace

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

    // ... execution logic ...
    const auto [status_code, output_size] =
        execute(msg.input_data, msg.input_size, output_data, max_output_size);
    // ... result handling ...
}
```
</file>

<explanation>
This header file defines the interface to the underlying SHA256 crypto implementation. It confirms the expected hash size and function signature that the `sha256_execute` precompile function calls. This is useful for ensuring the Zig implementation matches the required interface.
</explanation>
<file path="lib/evmone_precompiles/sha256.hpp">
```cpp
#pragma once
#include <cstddef>

namespace evmone::crypto
{
/// The size (32 bytes) of the SHA256 message digest.
static constexpr std::size_t SHA256_HASH_SIZE = 256 / 8;

/// Computes the SHA256 hash function.
///
/// @param[out] hash  The result message digest is written to the provided memory.
/// @param      data  The input data.
/// @param      size  The size of the input data.
void sha256(std::byte hash[SHA256_HASH_SIZE], const std::byte* data, size_t size);
}  // namespace evmone::crypto
```
</file>
</evmone>

## Prompt Corrections
The file path provided in the original prompt (`/Users/williamcory/tevm/main/evmone/test/state/precompiles.cpp:62-65`) is a local file path. I have provided snippets from the `evmone` codebase with relative paths, which are more generally useful as a reference. The core logic referenced is correct and included above.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/hash.rs">
```rust
//! Hash precompiles, it contains SHA-256 and RIPEMD-160 hash precompiles
//! More details in [`sha256_run`] and [`ripemd160_run`]
use super::calc_linear_cost_u32;
use crate::{PrecompileError, PrecompileOutput, PrecompileResult, PrecompileWithAddress};
use sha2::Digest;

/// SHA-256 precompile
pub const SHA256: PrecompileWithAddress =
    PrecompileWithAddress(crate::u64_to_address(2), sha256_run);

/// Computes the SHA-256 hash of the input data
///
/// This function follows specifications defined in the following references:
/// - [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
/// - [Solidity Documentation on Mathematical and Cryptographic Functions](https://docs.soliditylang.org/en/develop/units-and-global-variables.html#mathematical-and-cryptographic-functions)
/// - [Address 0x02](https://etherscan.io/address/0000000000000000000000000000000000000002)
pub fn sha256_run(input: &[u8], gas_limit: u64) -> PrecompileResult {
    let cost = calc_linear_cost_u32(input.len(), 60, 12);
    if cost > gas_limit {
        Err(PrecompileError::OutOfGas)
    } else {
        let output = sha2::Sha256::digest(input);
        Ok(PrecompileOutput::new(cost, output.to_vec().into()))
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
/// Calculate the linear cost of a precompile.
pub fn calc_linear_cost_u32(len: usize, base: u64, word: u64) -> u64 {
    (len as u64).div_ceil(32) * word + base
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
impl Precompiles {
    /// Returns the precompiles for the given spec.
    pub fn new(spec: PrecompileSpecId) -> &'static Self {
        match spec {
            PrecompileSpecId::HOMESTEAD => Self::homestead(),
            PrecompileSpecId::BYZANTIUM => Self::byzantium(),
            PrecompileSpecId::ISTANBUL => Self::istanbul(),
            PrecompileSpecId::BERLIN => Self::berlin(),
            PrecompileSpecId::CANCUN => Self::cancun(),
            PrecompileSpecId::PRAGUE => Self::prague(),
            PrecompileSpecId::OSAKA => Self::osaka(),
        }
    }

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
}
```
</file>
</revm>



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/precompiled_contracts/sha256.py">
```python
"""
Ethereum Virtual Machine (EVM) SHA256 PRECOMPILED CONTRACT
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementation of the `SHA256` precompiled contract.
"""
import hashlib

from ethereum_types.numeric import Uint

from ethereum.utils.numeric import ceil32

from ...vm import Evm
from ...vm.gas import GAS_SHA256, GAS_SHA256_WORD, charge_gas


def sha256(evm: Evm) -> None:
    """
    Writes the sha256 hash to output.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    data = evm.message.data

    # GAS
    word_count = ceil32(Uint(len(data))) // Uint(32)
    charge_gas(evm, GAS_SHA256 + GAS_SHA256_WORD * word_count)

    # OPERATION
    evm.output = hashlib.sha256(data).digest()
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/gas.py">
```python
GAS_SHA256 = Uint(60)
GAS_SHA256_WORD = Uint(12)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/utils/numeric.py">
```python
def ceil32(value: Uint) -> Uint:
    """
    Converts a unsigned integer to the next closest multiple of 32.

    Parameters
    ----------
    value :
        The value whose ceil32 is to be calculated.

    Returns
    -------
    ceil32 : `ethereum.base_types.U256`
        The same value if it's a perfect multiple of 32
        else it returns the smallest multiple of 32
        that is greater than `value`.
    """
    ceiling = Uint(32)
    remainder = value % ceiling
    if remainder == Uint(0):
        return value
    else:
        return value + ceiling - remainder
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/precompiled_contracts/__init__.py">
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
    "MODEXP_ADDRESS",
    "ALT_BN128_ADD_ADDRESS",
    "ALT_BN128_MUL_ADDRESS",
    "ALT_BN128_PAIRING_CHECK_ADDRESS",
    "BLAKE2F_ADDRESS",
    "POINT_EVALUATION_ADDRESS",
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
POINT_EVALUATION_ADDRESS = hex_to_address("0x0a")
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/precompiled_contracts/mapping.py">
```python
"""
Precompiled Contract Addresses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Mapping of precompiled contracts their implementations.
"""
from typing import Callable, Dict

from ...fork_types import Address
from . import (
    ALT_BN128_ADD_ADDRESS,
    ALT_BN128_MUL_ADDRESS,
    ALT_BN128_PAIRING_CHECK_ADDRESS,
    BLAKE2F_ADDRESS,
    ECRECOVER_ADDRESS,
    IDENTITY_ADDRESS,
    MODEXP_ADDRESS,
    POINT_EVALUATION_ADDRESS,
    RIPEMD160_ADDRESS,
    SHA256_ADDRESS,
)
from .alt_bn128 import alt_bn128_add, alt_bn128_mul, alt_bn128_pairing_check
from .blake2f import blake2f
from .ecrecover import ecrecover
from .identity import identity
from .modexp import modexp
from .point_evaluation import point_evaluation
from .ripemd160 import ripemd160
from .sha256 import sha256

PRE_COMPILED_CONTRACTS: Dict[Address, Callable] = {
    ECRECOVER_ADDRESS: ecrecover,
    SHA256_ADDRESS: sha256,
    RIPEMD160_ADDRESS: ripemd160,
    IDENTITY_ADDRESS: identity,
    MODEXP_ADDRESS: modexp,
    ALT_BN128_ADD_ADDRESS: alt_bn128_add,
    ALT_BN128_MUL_ADDRESS: alt_bn128_mul,
    ALT_BN128_PAIRING_CHECK_ADDRESS: alt_bn128_pairing_check,
    BLAKE2F_ADDRESS: blake2f,
    POINT_EVALUATION_ADDRESS: point_evaluation,
}
```
</file>
</execution-specs>

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/frontier/vm/precompiled_contracts/sha256.py">
```python
"""
Ethereum Virtual Machine (EVM) SHA256 PRECOMPILED CONTRACT
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementation of the `SHA256` precompiled contract.
"""
import hashlib

from ethereum_types.numeric import Uint

from ethereum.utils.numeric import ceil32

from ...vm import Evm
from ...vm.gas import GAS_SHA256, GAS_SHA256_WORD, charge_gas


def sha256(evm: Evm) -> None:
    """
    Writes the sha256 hash to output.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    data = evm.message.data

    # GAS
    word_count = ceil32(Uint(len(data))) // Uint(32)
    charge_gas(evm, GAS_SHA256 + GAS_SHA256_WORD * word_count)

    # OPERATION
    evm.output = hashlib.sha256(data).digest()
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/frontier/vm/gas.py">
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
from dataclasses import dataclass
from typing import List, Tuple

from ethereum_types.numeric import U256, Uint

from ethereum.trace import GasAndRefund, evm_trace
from ethereum.utils.numeric import ceil32

from ..fork_types import Address
from ..state import State, account_exists
from . import Evm
from .exceptions import OutOfGasError

# ... (other gas constants)

GAS_ECRECOVER = Uint(3000)
GAS_SHA256 = Uint(60)
GAS_SHA256_WORD = Uint(12)
GAS_RIPEMD160 = Uint(600)
GAS_RIPEMD160_WORD = Uint(120)
GAS_IDENTITY = Uint(15)
GAS_IDENTITY_WORD = Uint(3)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/frontier/vm/precompiled_contracts/__init__.py">
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/frontier/vm/precompiled_contracts/mapping.py">
```python
"""
Precompiled Contract Addresses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Mapping of precompiled contracts their implementations.
"""
from typing import Callable, Dict

from ...fork_types import Address
from . import (
    ECRECOVER_ADDRESS,
    IDENTITY_ADDRESS,
    RIPEMD160_ADDRESS,
    SHA256_ADDRESS,
)
from .ecrecover import ecrecover
from .identity import identity
from .ripemd160 import ripemd160
from .sha256 import sha256

PRE_COMPILED_CONTRACTS: Dict[Address, Callable] = {
    ECRECOVER_ADDRESS: ecrecover,
    SHA256_ADDRESS: sha256,
    RIPEMD160_ADDRESS: ripemd160,
    IDENTITY_ADDRESS: identity,
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/frontier/vm/interpreter.py">
```python
def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: `ethereum.vm.EVM`
        Items containing execution specific objects
    """
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        pc=Uint(0),
        stack=[],
        memory=bytearray(),
        code=code,
        gas_left=message.gas,
        valid_jump_destinations=valid_jump_destinations,
        logs=(),
        refund_counter=0,
        running=True,
        message=message,
        output=b"",
        accounts_to_delete=set(),
        error=None,
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            evm_trace(evm, PrecompileStart(evm.message.code_address))
            PRE_COMPILED_CONTRACTS[evm.message.code_address](evm)
            evm_trace(evm, PrecompileEnd())
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            evm_trace(evm, OpEnd())

        evm_trace(evm, EvmStop(Ops.STOP))

    except ExceptionalHalt as error:
        evm_trace(evm, OpException(error))
        evm.gas_left = Uint(0)
        evm.error = error
    return evm
```
</file>
</execution-specs>



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
The `sha256hash` struct implements the `PrecompiledContract` interface, providing the core logic for the precompile. The `RequiredGas` function calculates the gas cost based on the input data size, and the `Run` function performs the SHA-256 hashing using Go's standard crypto library.

The `PrecompiledContractsHomestead` map demonstrates how the precompile is registered to its designated address, `0x02`.

```go
// core/vm/contracts.go

// PrecompiledContract is the interface for a pre-compiled contract.
//
// Note: Precompiled contracts should not modify the state.
type PrecompiledContract interface {
	// RequiredGas returns the gas required to execute the pre-compiled contract.
	RequiredGas(input []byte) uint64
	// Run runs the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}

// sha256hash implements the SHA256 precompile contract.
type sha256hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Sha256PerWordGas + params.Sha256BaseGas
}

func (c *sha256hash) Run(input []byte) ([]byte, error) {
	h := sha256.Sum256(input)
	return h[:], nil
}

// PrecompiledContractsHomestead contains the default set of pre-compiled Ethereum
// contracts used in the Frontier and Homestead releases.
var PrecompiledContractsHomestead = PrecompiledContracts{
	common.BytesToAddress([]byte{0x1}): &ecrecover{},
	common.BytesToAddress([]byte{0x2}): &sha256hash{},
	common.BytesToAddress([]byte{0x3}): &ripemd160hash{},
	common.BytesToAddress([]byte{0x4}): &dataCopy{},
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
This snippet shows the gas cost parameters for the SHA-256 precompile, as defined in the Ethereum protocol specification. These constants are used in the `RequiredGas` calculation.

```go
// params/protocol_params.go

// Gas costs for pre-compiled contracts.
var (
	EcrecoverGas        uint64 = 3000
	Sha256BaseGas       uint64 = 60
	Sha256PerWordGas    uint64 = 12
	Ripemd160BaseGas    uint64 = 600
	Ripemd160PerWordGas uint64 = 120
	IdentityBaseGas     uint64 = 15
	IdentityPerWordGas  uint64 = 3
)
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// contracts.go

// PrecompiledContractsHomestead contains the default set of pre-compiled Ethereum
// contracts used in the Frontier and Homestead releases.
var PrecompiledContractsHomestead = PrecompiledContracts{
	common.BytesToAddress([]byte{0x1}): &ecrecover{},
	common.BytesToAddress([]byte{0x2}): &sha256hash{},
	common.BytesToAddress([]byte{0x3}): &ripemd160hash{},
	common.BytesToAddress([]byte{0x4}): &dataCopy{},
}

// sha256hash implements the SHA256 pre-compiled contract.
type sha256hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Sha256PerWordGas + params.Sha256BaseGas
}

func (c *sha256hash) Run(input []byte) ([]byte, error) {
	h := sha256.Sum256(input)
	return h[:], nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// protocol_params.go

const (
	// ... (other gas constants)

	// Sha256BaseGas is the base gas cost for a SHA256 operation.
	Sha256BaseGas uint64 = 60
	// Sha256PerWordGas is the per-word gas cost for a SHA256 operation.
	Sha256PerWordGas uint64 = 12

	// ... (other gas constants)
)
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContractsHomestead contains the default set of pre-compiled Ethereum
// contracts used in the Frontier and Homestead releases.
var PrecompiledContractsHomestead = PrecompiledContracts{
	common.BytesToAddress([]byte{0x1}): &ecrecover{},
	common.BytesToAddress([]byte{0x2}): &sha256hash{},
	common.BytesToAddress([]byte{0x3}): &ripemd160hash{},
	common.BytesToAddress([]byte{0x4}): &dataCopy{},
}

// ...

// sha256hash implements the SHA256 pre-compiled contract.
type sha256hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Sha256PerWordGas + params.Sha256BaseGas
}

func (c *sha256hash) Run(input []byte) ([]byte, error) {
	h := sha256.Sum256(input)
	return h[:], nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ...
	// Gas costs for precompiled contracts
	// ...
	Sha256BaseGas       uint64 = 60   // Base price for a SHA256 operation
	Sha256PerWordGas    uint64 = 12   // Per-word price for a SHA256 operation
	// ...
)
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContractsHomestead contains the default set of pre-compiled Ethereum
// contracts used in the Frontier and Homestead releases.
var PrecompiledContractsHomestead = PrecompiledContracts{
	common.BytesToAddress([]byte{0x1}): &ecrecover{},
	common.BytesToAddress([]byte{0x2}): &sha256hash{},
	common.BytesToAddress([]byte{0x3}): &ripemd160hash{},
	common.BytesToAddress([]byte{0x4}): &dataCopy{},
}

// SHA256 implemented as a native contract.
type sha256hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Sha256PerWordGas + params.Sha256BaseGas
}
func (c *sha256hash) Run(input []byte) ([]byte, error) {
	h := sha256.Sum256(input)
	return h[:], nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
	// Sha256BaseGas is the base gas cost for a SHA256 operation.
	Sha256BaseGas uint64 = 60
	// Sha256PerWordGas is the per-word gas cost for a SHA256 operation.
	Sha256PerWordGas uint64 = 12
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
<snippet>
// PrecompiledContract is the interface for a native contract.
//
// PrecompiledContracts do not require any overflow checking on their input gas,
// as the EVM execution environment will cap it at a reasonable value.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64 // RequiredGas returns the gas required to execute the pre-compiled contract.
	Run(input []byte) ([]byte, error) // Run executes the pre-compiled contract.
}
</snippet>
<snippet>
// PrecompiledContracts are the contracts which are implemented in Go rather than EVM bytecode.
var PrecompiledContracts = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}
</snippet>
<snippet>
// sha256hash implements the SHA256 pre-compiled contract.
type sha256hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Sha256PerWordGas + params.Sha256BaseGas
}

// Run computes the SHA256 hash of the input.
func (c *sha256hash) Run(input []byte) ([]byte, error) {
	h := sha256.Sum256(input)
	return h[:], nil
}
</snippet>
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
<snippet>
// Sha256BaseGas is the base gas cost for a SHA256 operation.
Sha256BaseGas uint64 = 60
// Sha256PerWordGas is the gas cost per word for a SHA256 operation.
Sha256PerWordGas uint64 = 12
</snippet>
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
<snippet>
// runPrecompiledContract runs the precompiled contract defined at the given address.
func (in *EVMInterpreter) runPrecompiledContract(p vm.PrecompiledContract, input []byte, gas uint64) (ret []byte, err error) {
	gasCost := p.RequiredGas(input)
	if !in.evm.CanUseGas(gasCost) {
		return nil, vm.ErrOutOfGas
	}
	// Note: gas cost is not deducted from 'gas' passed to precompile.
	in.evm.UseGas(gasCost)

	// We can't provide a stateful scope to precompiles, so we create a new one
	// and specifically disallow it from accessing the state database.
	precompileScope := &ScopeContext{
		Memory:   NewMemory(),
		Stack:    NewStack(),
		Contract: in.scope.Contract,
	}
	in.evm.depth++
	output, err := p.Run(input)
	in.evm.depth--

	// The `Run` method of precompiled contracts can return an error of any type, but it is
	// always wrapped into an `ErrPrecompile` when returned from the interpreter.
	if err != nil {
		return nil, new(ErrPrecompile).Wrap(err)
	}
	return output, nil
}
</snippet>
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
import (
	"crypto/sha256"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

// PrecompiledContractsHomestead contains the default set of pre-compiled Ethereum
// contracts used in the Frontier and Homestead releases.
//
// The order of the pre-compiled contracts is important and determines the gas
// cost of the CALL and DELEGATECALL opcodes.
var PrecompiledContractsHomestead = PrecompiledContracts{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
}

// sha256hash is the SHA256 hash function precompile.
type sha256hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Sha256PerWordGas + params.Sha256BaseGas
}

// Run computes the SHA256 hash of the input.
func (c *sha256hash) Run(input []byte) ([]byte, error) {
	h := sha256.Sum256(input)
	return h[:], nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Precompiled contract gas prices
const (
	EcrecoverGas        uint64 = 3000 // Elliptic curve sender recovery gas price
	Sha256BaseGas       uint64 = 60   // Base price for a SHA256 operation
	Sha256PerWordGas    uint64 = 12   // Per-word price for a SHA256 operation
	Ripemd160BaseGas    uint64 = 600  // Base price for a RIPEMD160 operation
	Ripemd160PerWordGas uint64 = 120  // Per-word price for a RIPEMD160 operation
	IdentityBaseGas     uint64 = 15   // Base price for a data copy operation
	IdentityPerWordGas  uint64 = 3    // Per-work price for a data copy operation
	// ...
)
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
This file contains the core implementation of the SHA256 precompile in go-ethereum.

- The `sha256hash` struct is a simple, stateless implementation of the precompile contract interface.
- `RequiredGas` provides the exact gas calculation formula, which is `60 + 12 * ceil(len(input)/32)`. This is a critical piece of the specification.
- `Run` shows the actual hashing logic using Go's standard crypto library, which is analogous to how the Zig implementation will use its standard library.
- The `PrecompiledContractsHomestead` map demonstrates how the precompile address (`0x2`) is registered and linked to its implementation.

```go
// contracts.go L303-L315
type sha256hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Sha256PerWordGas + params.Sha256BaseGas
}

func (c *sha256hash) Run(input []byte) ([]byte, error) {
	h := sha256.Sum256(input)
	return h[:], nil
}
```

```go
// contracts.go L55-L60
// PrecompiledContractsHomestead contains the default set of pre-compiled Ethereum
// contracts used in the Frontier and Homestead releases.
var PrecompiledContractsHomestead = PrecompiledContracts{
	common.BytesToAddress([]byte{0x1}): &ecrecover{},
	common.BytesToAddress([]byte{0x2}): &sha256hash{},
	common.BytesToAddress([]byte{0x3}): &ripemd160hash{},
	common.BytesToAddress([]byte{0x4}): &dataCopy{},
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
This file defines the gas cost parameters for various EVM operations, including the base and per-word costs for the SHA256 precompile. These constants are directly used in the `RequiredGas` calculation.

```go
// protocol_params.go L141-L142
Sha256BaseGas    uint64 = 60
Sha256PerWordGas uint64 = 12
```
</file>
</go-ethereum>

