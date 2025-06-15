# Implement RIPEMD160 Precompile

## Implementation Status: ✅ COMPLETED

**PR Information:**
- **Merged PR**: [#1840 - ✨ feat: implement RIPEMD160 precompile (address 0x03)](https://github.com/evmts/tevm-monorepo/pull/1840)
- **Commit Hash**: `528d88fd6` - ✨ feat: implement RIPEMD160 precompile (address 0x03)
- **Merged**: June 12, 2025
- **Status**: ✅ Successfully implemented and merged

**Current Status:**
- ✅ ripemd160.zig exists in src/evm/precompiles/
- ✅ Complete RIPEMD160 hash implementation
- ✅ Variable input size support (unlimited)
- ✅ 32-byte output (20-byte RIPEMD160 hash + 12 zero bytes)
- ✅ Gas cost: 600 base + 120 per word (32 bytes)
- ✅ Proper Ethereum compatibility
- ✅ All tests passing

**Implementation Completed:**
- ✅ Created src/evm/precompiles/ripemd160.zig
- ✅ Used Zig's std.crypto.hash capabilities
- ✅ Handles empty input edge cases
- ✅ Comprehensive test coverage including specification test vectors

You are implementing RIPEMD160 Precompile for the Tevm EVM written in Zig. Your goal is to implement RIPEMD-160 cryptographic hash precompile following Ethereum specifications and maintaining compatibility with existing implementations.
## Development Workflow
- **Branch**: `feat_implement_ripemd` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_ripemd feat_implement_ripemd`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement the RIPEMD160 precompile (address 0x03) for Ethereum Virtual Machine compatibility. This precompile provides RIPEMD160 hashing functionality and is available from the Frontier hardfork. This implementation assumes the precompile infrastructure from IDENTITY and SHA256 already exists.

## File Structure

**Primary Files to Modify:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher

**Supporting Files:**
- `/src/evm/precompiles/precompile_addresses.zig` - Address constants
- `/src/evm/precompiles/precompile_gas.zig` - Gas calculation for precompiles
- `/src/evm/precompiles/precompile_result.zig` - Result types for precompile execution

**New Files to Create:**
- `/src/evm/precompiles/ripemd160.zig` - RIPEMD160 hash implementation

**Test Files:**
- `/test/evm/precompiles/` (directory) - Precompile test infrastructure
- `/test/evm/precompiles/ripemd160_test.zig` - RIPEMD160 specific tests

**Why These Files:**
- The main precompile dispatcher needs to route calls to the RIPEMD160 implementation
- Address constants define the precompile address (0x03)
- New implementation file handles RIPEMD160 cryptographic hash function
- Comprehensive tests ensure correctness against test vectors

## ELI5

RIPEMD160 is another cryptographic hash function, similar to SHA256 but older and producing a smaller 160-bit (20-byte) hash instead of 256 bits. Think of it as SHA256's smaller cousin - it still creates a unique digital fingerprint of data, but the fingerprint is shorter. While less common than SHA256, some legacy systems and Bitcoin-related applications still use RIPEMD160, so Ethereum provides this precompile for compatibility when smart contracts need to interact with such systems.

## 🚨 CRITICAL SECURITY WARNING: DO NOT IMPLEMENT CUSTOM CRYPTO

**❌ NEVER IMPLEMENT CRYPTOGRAPHIC ALGORITHMS FROM SCRATCH**

**⚠️ SECURITY NOTICE**: RIPEMD160 is a **LEGACY ALGORITHM** considered cryptographically weak compared to modern alternatives. While required for Ethereum compatibility, it should not be used in new protocols.

This prompt involves cryptographic operations. Follow these security principles:

### ✅ **DO THIS:**
- **Use established crypto libraries** (noble-hashes for RIPEMD160, libsecp256k1)
- **Import proven implementations** from well-audited libraries
- **Leverage existing WASM crypto libraries** when Zig stdlib lacks algorithms
- **Follow reference implementations** from go-ethereum, revm, evmone exactly
- **Use test vectors** from official specifications to verify correctness
- **Note algorithm weakness** - RIPEMD160 has known collision vulnerabilities

### ❌ **NEVER DO THIS:**
- Write your own hash functions, signature verification, or elliptic curve operations
- Implement cryptographic primitives "from scratch" or "for learning"
- Modify cryptographic algorithms or add "optimizations"
- Copy-paste crypto code from tutorials or unofficial sources
- Implement crypto without extensive peer review and testing
- Use RIPEMD160 in new protocols (only for Ethereum compatibility)

### 🎯 **Implementation Strategy:**
1. **First choice**: Use well-established WASM crypto libraries (noble-hashes)
2. **Second choice**: Bind to audited C libraries (OpenSSL, libgcrypt)
3. **Third choice**: Carefully verified Zig implementation based on reference
4. **Never**: Write custom cryptographic implementations

**Remember**: RIPEMD160 is a weak, legacy algorithm. Cryptographic bugs can lead to fund loss, private key exposure, and complete system compromise. Always use proven, audited implementations.

## Specification

### Basic Operation
- **Address**: `0x0000000000000000000000000000000000000003`
- **Gas Cost**: `600 + 120 * ceil(input_size / 32)`
- **Function**: Returns RIPEMD160 hash (20 bytes) of input data  
- **Available**: All hardforks (Frontier onwards)
- **Output**: Always 32 bytes (20-byte hash + 12 zero bytes padding)

## Reference Implementations

### evmone Implementation
File: `/Users/williamcory/tevm/main/evmone/test/state/precompiles.cpp:67-70`
```cpp
PrecompileAnalysis ripemd160_analyze(bytes_view input, evmc_revision /*rev*/) noexcept
{
    return {cost_per_input_word<600, 120>(input.size()), 32};
}
```

### RIPEMD160 Algorithm
RIPEMD160 is a cryptographic hash function that produces a 160-bit (20-byte) hash. Unlike SHA256, RIPEMD160 is not available in Zig's standard library, so we need to either:
1. Find a third-party Zig implementation
2. Implement RIPEMD160 ourselves
3. Use C library bindings

## Implementation Approach

### revm

<explanation>
Revm provides a RIPEMD160 precompile implementation using the ripemd crate. Key patterns:

1. **Linear Gas Calculation**: Uses the same `calc_linear_cost_u32()` helper with base 600 and word cost 120
2. **External Crypto Library**: Uses the ripemd crate's `Ripemd160` hasher for secure implementation
3. **Proper Output Formatting**: Important detail - RIPEMD160 produces 20 bytes but Ethereum requires 32 bytes with zero padding
4. **Memory Management**: Uses `finalize_into()` to write directly to the output buffer at the correct offset
5. **Error Handling**: Simple OutOfGas check followed by hash computation

The implementation shows the critical detail of left-padding the 20-byte hash to 32 bytes.
</explanation>

<filename>revm/crates/precompile/src/hash.rs</filename>
<line start="37" end="49">
```rust
pub fn ripemd160_run(input: &[u8], gas_limit: u64) -> PrecompileResult {
    let gas_used = calc_linear_cost_u32(input.len(), 600, 120);
    if gas_used > gas_limit {
        Err(PrecompileError::OutOfGas)
    } else {
        let mut hasher = ripemd::Ripemd160::new();
        hasher.update(input);

        let mut output = [0u8; 32];
        hasher.finalize_into((&mut output[12..]).into());
        Ok(PrecompileOutput::new(gas_used, output.to_vec().into()))
    }
}
```
</line>

### geth

<explanation>
The go-ethereum implementation demonstrates the RIPEMD160 precompile pattern: gas calculation (600 + 120 * words), using the golang.org/x/crypto/ripemd160 library for hashing, and importantly left-padding the 20-byte hash result to 32 bytes as per Ethereum specification.
</explanation>

**Gas Constants** - `/go-ethereum/params/protocol_params.go` (lines 143-144):
```go
Ripemd160BaseGas    uint64 = 600  // Base price for a RIPEMD160 operation
Ripemd160PerWordGas uint64 = 120  // Per-word price for a RIPEMD160 operation
```

**Precompile Implementation** - `/go-ethereum/core/vm/contracts.go` (lines 318-332):
```go
type ripemd160hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *ripemd160hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Ripemd160PerWordGas + params.Ripemd160BaseGas
}

func (c *ripemd160hash) Run(input []byte) ([]byte, error) {
	ripemd := ripemd160.New()
	ripemd.Write(input)
	return common.LeftPadBytes(ripemd.Sum(nil), 32), nil
}
```

**Import Declaration** - `/go-ethereum/core/vm/contracts.go` (line 39):
```go
"golang.org/x/crypto/ripemd160"
```

### Option 1: Third-Party Zig Implementation
Search for existing Zig RIPEMD160 implementations or crypto libraries that include it.

### Option 2: C Library Integration
Use existing C RIPEMD160 implementation and bind to Zig:
```zig
// Example C binding approach
extern "c" fn ripemd160_hash(input: [*]const u8, input_len: usize, output: [*]u8) void;

pub fn ripemd160(input: []const u8) [20]u8 {
    var output: [20]u8 = undefined;
    ripemd160_hash(input.ptr, input.len, &output);
    return output;
}
```

### Option 3: Pure Zig Implementation
Implement RIPEMD160 in Zig following the specification. This is more work but provides full control and no external dependencies.

## Implementation Requirements

### Core Functionality
1. **Gas Calculation**: `600 + 120 * ceil(input_size / 32)`
2. **Hash Computation**: RIPEMD160 of input data
3. **Output Format**: 32 bytes (20-byte hash + 12 zero bytes)
4. **Error Handling**: OutOfGas if gas limit exceeded
5. **Performance**: Efficient implementation suitable for EVM context

### Output Padding
```zig
// RIPEMD160 returns 20 bytes, but Ethereum expects 32 bytes with zero padding
pub fn format_output(hash: [20]u8, output: []u8) void {
    // Zero out the output buffer
    @memset(output[0..32], 0);
    // Copy the 20-byte hash to the left side
    @memcpy(output[0..20], &hash);
    // Bytes 20-31 remain zero (padding)
}
```

## Implementation Tasks

### Task 1: Research RIPEMD160 Implementation
- Search for existing Zig RIPEMD160 implementations
- Evaluate C library binding options
- Decide on implementation approach (pure Zig vs C bindings)

### Task 2: Add RIPEMD160 Gas Constants
File: `/src/evm/constants/gas_constants.zig`
```zig
// RIPEMD160 precompile gas costs
pub const RIPEMD160_BASE_COST: u64 = 600;
pub const RIPEMD160_WORD_COST: u64 = 120;
```

### Task 3: Implement RIPEMD160 Precompile
File: `/src/evm/precompiles/ripemd160.zig`
```zig
const std = @import("std");
const gas_constants = @import("../constants/gas_constants.zig");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileError = @import("precompile_result.zig").PrecompileError;

pub fn calculate_gas(input_size: usize) u64 {
    const word_count = (input_size + 31) / 32;
    return gas_constants.RIPEMD160_BASE_COST + gas_constants.RIPEMD160_WORD_COST * @as(u64, @intCast(word_count));
}

pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    const gas_cost = calculate_gas(input.len);
    if (gas_cost > gas_limit) return PrecompileError.OutOfGas;
    if (output.len < 32) return PrecompileError.InvalidOutput;
    
    // Compute RIPEMD160 hash (20 bytes)
    const hash = ripemd160_hash(input);
    
    // Format as 32 bytes with zero padding
    @memset(output[0..32], 0);
    @memcpy(output[0..20], &hash);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
}

// TODO: Implement or import RIPEMD160 function
fn ripemd160_hash(input: []const u8) [20]u8 {
    // Implementation depends on chosen approach
    @compileError("RIPEMD160 implementation needed");
}
```

### Task 4: RIPEMD160 Algorithm Implementation
Choose and implement one of these approaches:

#### Approach A: Pure Zig Implementation
```zig
// Implement RIPEMD160 according to specification
const RIPEMD160 = struct {
    // State variables
    h: [5]u32,
    
    pub fn init() RIPEMD160 {
        return RIPEMD160{
            .h = [5]u32{ 0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0 },
        };
    }
    
    pub fn update(self: *RIPEMD160, data: []const u8) void {
        // Process input data in 64-byte blocks
        // Implementation details...
    }
    
    pub fn final(self: *RIPEMD160) [20]u8 {
        // Finalize hash and return result
        // Implementation details...
    }
};
```

#### Approach B: C Library Binding
```zig
// Use existing C RIPEMD160 implementation
const c = @cImport({
    @cInclude("ripemd160.h");
});

fn ripemd160_hash(input: []const u8) [20]u8 {
    var output: [20]u8 = undefined;
    c.ripemd160(input.ptr, input.len, &output);
    return output;
}
```

### Task 5: Update Precompile Dispatcher
File: `/src/evm/precompiles/precompiles.zig`
Add RIPEMD160 to the precompile address mapping and execution dispatch.

### Task 6: Update Precompile Addresses
File: `/src/evm/precompiles/precompile_addresses.zig`
```zig
pub const RIPEMD160_ADDRESS: u8 = 0x03;
```

### Task 7: Comprehensive Testing
File: `/test/evm/precompiles/ripemd160_test.zig`

## Testing Requirements

### Test Cases
1. **Empty Input**: Hash of empty data
2. **Standard Test Vectors**: Use known RIPEMD160 test vectors
3. **Gas Calculation**: Verify gas costs for various input sizes
4. **Gas Limit**: Test OutOfGas scenarios
5. **Output Format**: Verify 32-byte output with correct padding
6. **Integration**: Test via CALL/STATICCALL opcodes
7. **Performance**: Benchmark against reference implementations

### Known Test Vectors
```zig
test "ripemd160 known vectors" {
    // Empty string
    // RIPEMD160("") = 9c1185a5c5e9fc54612808977ee8f548b2258d31
    
    // "abc"
    // RIPEMD160("abc") = 8eb208f7e05d987a9b044a8e98c6b087f15a0bfc
    
    // "message digest"
    // RIPEMD160("message digest") = 5d0689ef49d2fae572b881b123a85ffa21595f36
    
    // Test these known vectors
}
```

## Performance Considerations

### Implementation Choice Impact
- **Pure Zig**: Full control, no dependencies, but requires implementing complex algorithm
- **C Bindings**: Proven implementation, potential performance benefits, but adds dependency
- **Bundle Size**: Pure Zig likely smaller for WASM, C bindings may increase size

### Memory Efficiency
```zig
// Efficient streaming approach for large inputs
pub fn execute_streaming(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    const gas_cost = calculate_gas(input.len);
    if (gas_cost > gas_limit) return PrecompileError.OutOfGas;
    
    var hasher = RIPEMD160.init();
    
    // Process input in chunks to minimize memory usage
    const chunk_size = 8192;
    var offset: usize = 0;
    while (offset < input.len) {
        const end = @min(offset + chunk_size, input.len);
        hasher.update(input[offset..end]);
        offset = end;
    }
    
    const hash = hasher.final();
    format_output(hash, output);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
}
```

## Build System Integration

### C Library Dependencies (if using C bindings)
Update `/build.zig`:
```zig
// If using C RIPEMD160 implementation
exe.linkLibC();
exe.addIncludePath("lib/ripemd160/include");
exe.addCSourceFile("lib/ripemd160/ripemd160.c", &[_][]const u8{"-std=c99"});
```

### Pure Zig Approach
No build system changes needed - pure Zig implementation.

## Security Considerations

### Cryptographic Correctness
- **Test against known vectors**: Ensure implementation matches specification
- **Constant-time execution**: Implement to resist timing attacks
- **Memory safety**: Leverage Zig's memory safety features
- **No custom optimizations**: Follow established algorithm exactly

### Input Validation
```zig
// Validate input size for gas calculation overflow
if (input.len > std.math.maxInt(u32) / gas_constants.RIPEMD160_WORD_COST) {
    return PrecompileError.InputTooLarge;
}

// Ensure output buffer is adequate
if (output.len < 32) return PrecompileError.InvalidOutput;
```

## Success Criteria

1. **Ethereum Compatibility**: Passes all Ethereum Foundation RIPEMD160 precompile tests
2. **Gas Accuracy**: Exact gas costs match specification (600 + 120 * words)
3. **Hash Correctness**: Output matches standard RIPEMD160 implementations
4. **Output Format**: Correct 32-byte format with zero padding
5. **Integration**: Works seamlessly with existing CALL opcodes
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

## Implementation Approach Decision
Before starting implementation, decide:
1. **Pure Zig vs C bindings** - Based on bundle size impact and complexity
2. **Third-party library** - If available, evaluate quality and maintenance
3. **Performance vs size trade-offs** - Optimize for Tevm's specific use case

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/precompiles/ripemd160_test.zig`)
```zig
// Test basic RIPEMD160 functionality
test "ripemd160 basic functionality with known vectors"
test "ripemd160 handles edge cases correctly"
test "ripemd160 validates input format"
test "ripemd160 produces correct output format"
```

#### 2. **Input Validation Tests**
```zig
test "ripemd160 handles various input lengths"
test "ripemd160 validates input parameters"
test "ripemd160 rejects invalid inputs gracefully"
test "ripemd160 handles empty input"
```

#### 3. **Gas Calculation Tests**
```zig
test "ripemd160 gas cost calculation accuracy"
test "ripemd160 gas cost edge cases"
test "ripemd160 gas overflow protection"
test "ripemd160 gas deduction in EVM context"
```

#### 4. **Specification Compliance Tests**
```zig
test "ripemd160 matches specification test vectors"
test "ripemd160 matches reference implementation output"
test "ripemd160 hardfork availability requirements"
test "ripemd160 address registration correct"
```

#### 5. **Performance Tests**
```zig
test "ripemd160 performance with large inputs"
test "ripemd160 memory efficiency"
test "ripemd160 WASM bundle size impact"
test "ripemd160 benchmark against reference implementations"
```

#### 6. **Error Handling Tests**
```zig
test "ripemd160 error propagation"
test "ripemd160 proper error types returned"
test "ripemd160 handles corrupted input gracefully"
test "ripemd160 never panics on malformed input"
```

#### 7. **Integration Tests**
```zig
test "ripemd160 precompile registration"
test "ripemd160 called from EVM execution"
test "ripemd160 gas deduction in EVM context"
test "ripemd160 hardfork availability"
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
test "ripemd160 basic functionality" {
    // This test MUST fail initially
    const input = test_vectors.valid_input;
    const expected = test_vectors.expected_output;
    
    const result = ripemd160.run(input);
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

- [RIPEMD160 Specification](https://homes.esat.kuleuven.be/~bosselae/ripemd160.html)
- [RIPEMD160 Test Vectors](https://homes.esat.kuleuven.be/~bosselae/ripemd160/pdf/AB-9601/AB-9601.pdf)
- [Ethereum Yellow Paper - Precompiles](https://ethereum.github.io/yellowpaper/paper.pdf)
- [C RIPEMD160 Reference Implementation](https://github.com/bitcoin-core/secp256k1/blob/master/src/hash_impl.h)

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles.cpp">
```cpp
PrecompileAnalysis ripemd160_analyze(bytes_view input, evmc_revision /*rev*/) noexcept
{
    return {cost_per_input_word<600, 120>(input.size()), 32};
}

ExecutionResult ripemd160_execute(const uint8_t* input, size_t input_size, uint8_t* output,
    [[maybe_unused]] size_t output_size) noexcept
{
    assert(output_size >= 32);
    output = std::fill_n(output, 12, std::uint8_t{0});
    crypto::ripemd160(reinterpret_cast<std::byte*>(output),
        reinterpret_cast<const std::byte*>(input), input_size);
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
    {expmod_analyze, expmod_execute},
    {ecadd_analyze, ecadd_execute},
    {ecmul_analyze, ecmul_execute},
    {ecpairing_analyze, ecpairing_execute},
    {blake2bf_analyze, blake2bf_execute},
    {point_evaluation_analyze, point_evaluation_execute},
    {bls12_g1add_analyze, bls12_g1add_execute},
    {bls12_g1msm_analyze, bls12_g1msm_execute},
    {bls12_g2add_analyze, bls12_g2add_execute},
    {bls12_g2msm_analyze, bls12_g2msm_execute},
    {bls12_pairing_check_analyze, bls12_pairing_check_execute},
    {bls12_map_fp_to_g1_analyze, bls12_map_fp_to_g1_execute},
    {bls12_map_fp2_to_g2_analyze, bls12_map_fp2_to_g2_execute},
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

    // Allocate buffer for the precompile's output and pass its ownership to evmc::Result.
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
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone_precompiles/ripemd160.cpp">
```cpp
void ripemd160(std::byte hash[RIPEMD160_HASH_SIZE], const std::byte* data, size_t size) noexcept
{
    static constexpr size_t BLOCK_SIZE = B * sizeof(uint32_t);
    State h{0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0};

    const auto tail_size = size % BLOCK_SIZE;
    for (const auto tail_begin = &data[size - tail_size]; data != tail_begin; data += BLOCK_SIZE)
        compress(h, data);

    {
        std::array<std::byte, BLOCK_SIZE> padding_block{};
        const auto padded_tail_end = std::copy_n(data, tail_size, padding_block.data());
        *padded_tail_end = std::byte{0x80};  // The padding bit placed just after the input bytes.

        // Store the input length in bits in the last two words of the padded block.
        const auto length_in_bits = uint64_t{size} * 8;
        const auto length_begin = &padding_block[BLOCK_SIZE - sizeof(length_in_bits)];
        if (padded_tail_end >= length_begin)  // If not enough space, create one more block.
        {
            compress(h, padding_block.data());
            padding_block = {};
        }
        store_le(length_begin, length_in_bits);
        compress(h, padding_block.data());
    }

    for (const auto e : h)
        hash = store_le(hash, e);
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/unittests/precompiles_ripemd160_test.cpp">
```cpp
TEST(ripemd160, test_vectors)
{
    // Some test vectors from https://homes.esat.kuleuven.be/~bosselae/ripemd160.html.

    const std::pair<std::string_view, std::string_view> test_cases[] = {
        {"abc", "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc"},
        {"message digest", "5d0689ef49d2fae572b881b123a85ffa21595f36"},
        {"abcdefghijklmnopqrstuvwxyz", "f71c27109c692c1b56bbdceb5b9d2865b3708dbc"},
        {"abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq",
            "12a053384a9c0c88e405a06c27dcf49ada62eb2b"},
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            "b0e20b6e3116640286ed3a87a5713079b21f5189"},
        {"12345678901234567890123456789012345678901234567890123456789012345678901234567890",
            "9b752e45573d4b39f4dbd3323cab82bf63326bfb"},
        {"The quick brown fox jumps over the lazy dog", "37f332f68db77bd9d7edd4969571ad671cf9dd3b"},
    };

    for (const auto& [input, hash_hex] : test_cases)
    {
        std::byte hash[20];
        ripemd160(hash, reinterpret_cast<const std::byte*>(input.data()), input.size());
        EXPECT_EQ(hex({hash, std::size(hash)}), hash_hex);
    }
}
```
</file>
</evmone>
## Prompt Corrections
The original prompt contains a small error in the "Output Padding" Zig example. The Ethereum specification requires the 20-byte hash to be **left-padded** with 12 zero bytes to fill a 32-byte word. This means the hash bytes should be at the *end* of the 32-byte buffer.

The provided example incorrectly right-pads the hash (placing it at the beginning).

**Incorrect Zig Example from Prompt:**
```zig
// Writes hash to bytes [0..20], which is right-padding
@memcpy(output[0..20], &hash);
```

**Corrected Zig Implementation:**
This version correctly writes the 20-byte hash to the *end* of the 32-byte output buffer, which is consistent with the `evmone`, `geth`, and `revm` reference implementations.
```zig
// RIPEMD160 returns 20 bytes, but Ethereum expects 32 bytes with left padding
pub fn format_output(hash: [20]u8, output: []u8) void {
    // Zero out the entire 32-byte output buffer
    @memset(output[0..32], 0);

    // Copy the 20-byte hash to the end of the buffer (bytes 12-31)
    @memcpy(output[12..32], &hash);
}
```

This corrected approach should be used in the implementation.



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

/// RIPEMD-160 precompile
pub const RIPEMD160: PrecompileWithAddress =
    PrecompileWithAddress(crate::u64_to_address(3), ripemd160_run);

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

/// Computes the RIPEMD-160 hash of the input data
///
/// This function follows specifications defined in the following references:
/// - [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
/// - [Solidity Documentation on Mathematical and Cryptographic Functions](https://docs.soliditylang.org/en/develop/units-and-global-variables.html#mathematical-and-cryptographic-functions)
/// - [Address 03](https://etherscan.io/address/0000000000000000000000000000000000000003)
pub fn ripemd160_run(input: &[u8], gas_limit: u64) -> PrecompileResult {
    let gas_used = calc_linear_cost_u32(input.len(), 600, 120);
    if gas_used > gas_limit {
        Err(PrecompileError::OutOfGas)
    } else {
        let mut hasher = ripemd::Ripemd160::new();
        hasher.update(input);

        let mut output = [0u8; 32];
        hasher.finalize_into((&mut output[12..]).into());
        Ok(PrecompileOutput::new(gas_used, output.to_vec().into()))
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
//! # revm-precompile
//!
//! Implementations of EVM precompiled contracts.

// ...

use core::hash::Hash;
use once_cell::race::OnceBox;
use primitives::{hardfork::SpecId, Address, HashMap, HashSet};
use std::{boxed::Box, vec::Vec};

/// Calculate the linear cost of a precompile.
pub fn calc_linear_cost_u32(len: usize, base: u64, word: u64) -> u64 {
    (len as u64).div_ceil(32) * word + base
}

/// Precompiles contain map of precompile addresses to functions and HashSet of precompile addresses.
#[derive(Clone, Default, Debug)]
pub struct Precompiles {
    /// Precompiles
    inner: HashMap<Address, PrecompileFn>,
    /// Addresses of precompile
    addresses: HashSet<Address>,
}

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
    
    // ...
}

/// Precompile with address and function.
#[derive(Clone, Debug)]
pub struct PrecompileWithAddress(pub Address, pub PrecompileFn);

// ...

/// Const function for making an address by concatenating the bytes from two given numbers.
///
/// Note that 32 + 128 = 160 = 20 bytes (the length of an address).
///
/// This function is used as a convenience for specifying the addresses of the various precompiles.
#[inline]
pub const fn u64_to_address(x: u64) -> Address {
    let x = x.to_be_bytes();
    Address::new([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, x[0], x[1], x[2], x[3], x[4], x[5], x[6], x[7],
    ])
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/interface.rs">
```rust
//! Interface for the precompiles. It contains the precompile result type,
//! the precompile output type, and the precompile error type.
use core::fmt;
use primitives::Bytes;
use std::string::String;

/// A precompile operation result type
///
/// Returns either `Ok((gas_used, return_bytes))` or `Err(error)`.
pub type PrecompileResult = Result<PrecompileOutput, PrecompileError>;

/// Precompile execution output
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct PrecompileOutput {
    /// Gas used by the precompile
    pub gas_used: u64,
    /// Output bytes
    pub bytes: Bytes,
}

impl PrecompileOutput {
    /// Returns new precompile output with the given gas used and output bytes.
    pub fn new(gas_used: u64, bytes: Bytes) -> Self {
        Self { gas_used, bytes }
    }
}

/// Precompile function type. Takes input and gas limit and returns precompile result.
pub type PrecompileFn = fn(&[u8], u64) -> PrecompileResult;

/// Precompile error type.
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub enum PrecompileError {
    /// out of gas is the main error. Others are here just for completeness
    OutOfGas,
    /// Blake2 errors
    Blake2WrongLength,
    /// Blake2 wrong final indicator flag
    Blake2WrongFinalIndicatorFlag,
    /// Modexp errors
    ModexpExpOverflow,
    /// Modexp base overflow
    ModexpBaseOverflow,
    /// Modexp mod overflow
    ModexpModOverflow,
    /// Modexp limit all input sizes.
    ModexpEip7823LimitSize,
    /// Bn128 errors
    Bn128FieldPointNotAMember,
    /// Bn128 affine g failed to create
    Bn128AffineGFailedToCreate,
    /// Bn128 pair length
    Bn128PairLength,
    // Blob errors
    /// The input length is not exactly 192 bytes
    BlobInvalidInputLength,
    /// The commitment does not match the versioned hash
    BlobMismatchedVersion,
    /// The proof verification failed
    BlobVerifyKzgProofFailed,
    /// Fatal error with a custom error message
    Fatal(String),
    /// Catch-all variant for other errors
    Other(String),
}
```
</file>
</revm>



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/frontier/vm/precompiled_contracts/ripemd160.py">
```python
"""
Ethereum Virtual Machine (EVM) RIPEMD160 PRECOMPILED CONTRACT
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementation of the `RIPEMD160` precompiled contract.
"""
import hashlib

from ethereum_types.numeric import Uint

from ethereum.utils.byte import left_pad_zero_bytes
from ethereum.utils.numeric import ceil32

from ...vm import Evm
from ...vm.gas import GAS_RIPEMD160, GAS_RIPEMD160_WORD, charge_gas


def ripemd160(evm: Evm) -> None:
    """
    Writes the ripemd160 hash to output.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    data = evm.message.data

    # GAS
    word_count = ceil32(Uint(len(data))) // Uint(32)
    charge_gas(evm, GAS_RIPEMD160 + GAS_RIPEMD160_WORD * word_count)

    # OPERATION
    hash_bytes = hashlib.new("ripemd160", data).digest()
    padded_hash = left_pad_zero_bytes(hash_bytes, 32)
    evm.output = padded_hash
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/frontier/vm/gas.py">
```python
# ... (other gas constants)
GAS_RIPEMD160 = Uint(600)
GAS_RIPEMD160_WORD = Uint(120)
# ... (other gas constants)
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
## Prompt Corrections
The `Output Padding` and `Task 3` sections in the original prompt contain an incorrect implementation for padding the RIPEMD160 hash. The hash should be **right-aligned** in the 32-byte output buffer, meaning the first 12 bytes are zero padding. The provided Zig snippets incorrectly copy the hash to the beginning of the buffer.

**Corrected Zig Implementation for Output Padding:**
```zig
pub fn format_output(hash: [20]u8, output: []u8) void {
    // Ensure the output buffer is at least 32 bytes.
    // The first 12 bytes are zero padding.
    @memset(output[0..12], 0); 
    // The last 20 bytes are the hash result.
    @memcpy(output[12..32], &hash);
}

pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    const gas_cost = calculate_gas(input.len);
    if (gas_cost > gas_limit) return PrecompileError.OutOfGas;
    if (output.len < 32) return PrecompileError.InvalidOutput;
    
    // Compute RIPEMD160 hash (20 bytes)
    const hash = ripemd160_hash(input);
    
    // Format as 32 bytes with right-aligned hash (left-padded with zeros)
    @memset(output[0..12], 0);
    @memcpy(output[12..32], &hash);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = 32 };
}
```

This correction aligns with the `revm` reference implementation (`hasher.finalize_into((&mut output[12..]).into())`) and the `geth` reference (`common.LeftPadBytes`), which effectively right-aligns the hash.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/ripemd160.py">
```python
"""
Ethereum Virtual Machine (EVM) RIPEMD160 PRECOMPILED CONTRACT
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementation of the `RIPEMD160` precompiled contract.
"""
import hashlib

from ethereum_types.numeric import Uint

from ethereum.utils.byte import left_pad_zero_bytes
from ethereum.utils.numeric import ceil32

from ...vm import Evm
from ...vm.gas import GAS_RIPEMD160, GAS_RIPEMD160_WORD, charge_gas


def ripemd160(evm: Evm) -> None:
    """
    Writes the ripemd160 hash to output.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    data = evm.message.data

    # GAS
    word_count = ceil32(Uint(len(data))) // Uint(32)
    charge_gas(evm, GAS_RIPEMD160 + GAS_RIPEMD160_WORD * word_count)

    # OPERATION
    hash_bytes = hashlib.new("ripemd160", data).digest()
    padded_hash = left_pad_zero_bytes(hash_bytes, 32)
    evm.output = padded_hash
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/gas.py">
```python
# ... other gas constants
GAS_ECRECOVER = Uint(3000)
GAS_SHA256 = Uint(60)
GAS_SHA256_WORD = Uint(12)
GAS_RIPEMD160 = Uint(600)
GAS_RIPEMD160_WORD = Uint(120)
GAS_IDENTITY = Uint(15)
GAS_IDENTITY_WORD = Uint(3)
# ... other gas constants
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/__init__.py">
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
    # ... other addresses
)

ECRECOVER_ADDRESS = hex_to_address("0x01")
SHA256_ADDRESS = hex_to_address("0x02")
RIPEMD160_ADDRESS = hex_to_address("0x03")
IDENTITY_ADDRESS = hex_to_address("0x04")
# ... other addresses
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/mapping.py">
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
    # ... other addresses
    ECRECOVER_ADDRESS,
    IDENTITY_ADDRESS,
    MODEXP_ADDRESS,
    RIPEMD160_ADDRESS,
    SHA256_ADDRESS,
)
# ... other imports
from .ecrecover import ecrecover
from .identity import identity
from .modexp import modexp
from .ripemd160 import ripemd160
from .sha256 import sha256

PRE_COMPILED_CONTRACTS: Dict[Address, Callable] = {
    ECRECOVER_ADDRESS: ecrecover,
    SHA256_ADDRESS: sha256,
    RIPEMD160_ADDRESS: ripemd160,
    IDENTITY_ADDRESS: identity,
    # ... other mappings
}
```
</file>
</execution-specs>
## Prompt Corrections
The original prompt's Zig example for `format_output` is incorrect. It performs right-padding (placing the hash at the beginning of the 32-byte buffer), but the Ethereum specification and all reference implementations (`geth`, `revm`, `execution-specs`) require **left-padding**. The 20-byte hash should be placed at the *end* of the 32-byte buffer, with the first 12 bytes being zeros.

### Incorrect Prompt Example:
```zig
// This is RIGHT padding, not LEFT padding
@memcpy(output[0..20], &hash); 
```

### Correct Implementation:
The hash should be copied to the last 20 bytes of the 32-byte output buffer.
```zig
// Correct LEFT padding
@memset(output[0..32], 0);
@memcpy(output[12..32], &hash);
```
The `ripemd160` function from `execution-specs` confirms this with `padded_hash = left_pad_zero_bytes(hash_bytes, 32)`. The `revm` reference implementation also correctly shows this pattern: `hasher.finalize_into((&mut output[12..]).into());`.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
import (
	"hash"

	"golang.org/x/crypto/ripemd160"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

// PrecompiledContractsBerlin contains the precompiled contracts starting from the
// Berlin hard fork.
var PrecompiledContractsBerlin = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &identity{},
	common.BytesToAddress([]byte{5}): &modexp{},
	common.BytesToAddress([]byte{6}): &ecAdd{},
	common.BytesToAddress([]byte{7}): &ecMul{},
	common.BytesToAddress([]byte{8}): &ecPairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// ripemd160hash implements the RIPEMD160 hash contract.
type ripemd160hash struct{}

// newRipemd160 returns a new instance of the ripemd160 hash.
func newRipemd160() hash.Hash {
	return ripemd160.New()
}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *ripemd160hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Ripemd160PerWordGas + params.Ripemd160BaseGas
}

func (c *ripemd160hash) Run(input []byte) ([]byte, error) {
	ripemd := newRipemd160()
	ripemd.Write(input)
	return common.LeftPadBytes(ripemd.Sum(nil), 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// Ripemd160BaseGas is the base price for a RIPEMD160 operation.
	Ripemd160BaseGas uint64 = 600
	// Ripemd160PerWordGas is the per-word price for a RIPEMD160 operation.
	Ripemd160PerWordGas uint64 = 120
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/common/bytes.go">
```go
// LeftPadBytes zero-pads a byte slice to the given length. The result is a new
// byte slice.
func LeftPadBytes(slice []byte, l int) []byte {
	if l <= len(slice) {
		return slice
	}
	padded := make([]byte, l)
	copy(padded[l-len(slice):], slice)
	return padded
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt's Zig `format_output` function example is incorrect. It right-pads the hash, while the Ethereum specification and reference implementations require **left-padding**. The 20-byte hash should be at the end of the 32-byte output buffer, with 12 zero-bytes at the beginning.

**Corrected Zig Implementation:**
```zig
// RIPEMD160 returns 20 bytes, but Ethereum requires a 32-byte output.
// The 20-byte hash is right-aligned (left-padded with 12 zero bytes).
pub fn format_output(hash: [20]u8, output: []u8) void {
    // Zero out the first 12 bytes
    @memset(output[0..12], 0);
    // Copy the 20-byte hash to the end of the 32-byte buffer
    @memcpy(output[12..32], &hash);
}
```

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/contracts.go">
```go
// ripemd160hash implements the ripemd160 precompiled contract.
type ripemd160hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *ripemd160hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Ripemd160PerWordGas + params.Ripemd160BaseGas
}

func (c *ripemd160hash) Run(input []byte) ([]byte, error) {
	ripemd := ripemd160.New()
	ripemd.Write(input)
	return common.LeftPadBytes(ripemd.Sum(nil), 32), nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/params/protocol_params.go">
```go
const (
	// ...
	// Gas costs for pre-compiled contracts.
	Ripemd160BaseGas    uint64 = 600
	Ripemd160PerWordGas uint64 = 120
	// ...
)
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/common/bytes.go">
```go
// LeftPadBytes zero-pads a byte slice to a certain length.
func LeftPadBytes(slice []byte, l int) []byte {
	if l <= len(slice) {
		return slice
	}
	padded := make([]byte, l)
	copy(padded[l-len(slice):], slice)
	return padded
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/contracts.go">
```go
// PrecompiledContracts(Homestead/Byzantium/Istanbul/Berlin) is a map of addresses to PrecompiledContracts.
// This is the older version, without BLAKE2B and BLS precompiles.
var PrecompiledContractsHomestead = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
import (
	"hash"
	"math/big"

	"golang.org/x/crypto/ripemd160"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/params"
)
// ...
// ripemd160hash is the RIPEMD-160 hash function pre-compiled contract.
type ripemd160hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *ripemd160hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Ripemd160PerWordGas + params.Ripemd160BaseGas
}

func (c *ripemd160hash) Run(input []byte) ([]byte, error) {
	ripemd := ripemd160.New()
	ripemd.Write(input)
	return common.LeftPadBytes(ripemd.Sum(nil), 32), nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ...
	Ripemd160BaseGas    uint64 = 600  // Base price for a RIPEMD160 operation
	Ripemd160PerWordGas uint64 = 120  // Per-word price for a RIPEMD160 operation
	// ...
)
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompile.go">
```go
// PrecompiledContractsHomestead contains the default set of pre-compiled contracts
// for blocks after or including the Homestead hard fork.
var PrecompiledContractsHomestead = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/common/bytes.go">
```go
// LeftPadBytes zero-pads a byte slice to a certain length.
func LeftPadBytes(slice []byte, l int) []byte {
	if l <= len(slice) {
		return slice
	}
	padded := make([]byte, l)
	copy(padded[l-len(slice):], slice)
	return padded
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Ripemd160BaseGas is the base price for a RIPEMD160 operation.
Ripemd160BaseGas uint64 = 600
// Ripemd160PerWordGas is the per-word price for a RIPEMD160 operation.
Ripemd160PerWordGas uint64 = 120
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
import (
	"crypto/sha256"
	"encoding/binary"
	"errors"
	"fmt"
	"maps"
	"math"
	"math/big"

	"github.com/consensys/gnark-crypto/ecc"
	bls12381 "github.com/consensys/gnark-crypto/ecc/bls12-381"
	"github.com/consensys/gnark-crypto/ecc/bls12-381/fp"
	"github.com/consensys/gnark-crypto/ecc/bls12-381/fr"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/crypto/blake2b"
	"github.com/ethereum/go-ethereum/crypto/bn256"
	"github.com/ethereum/go-ethereum/crypto/kzg4844"
	"github.com/ethereum/go-ethereum/params"
	"golang.org/x/crypto/ripemd160"
)

// PrecompiledContractsHomestead contains the default set of pre-compiled Ethereum
// contracts used in the Frontier and Homestead releases.
var PrecompiledContractsHomestead = PrecompiledContracts{
	common.BytesToAddress([]byte{0x1}): &ecrecover{},
	common.BytesToAddress([]byte{0x2}): &sha256hash{},
	common.BytesToAddress([]byte{0x3}): &ripemd160hash{},
	common.BytesToAddress([]byte{0x4}): &dataCopy{},
}

// RunPrecompiledContract runs and evaluates the output of a precompiled contract.
// It returns
// - the returned bytes,
// - the _remaining_ gas,
// - any error that occurred
func RunPrecompiledContract(p PrecompiledContract, input []byte, suppliedGas uint64, logger *tracing.Hooks) (ret []byte, remainingGas uint64, err error) {
	gasCost := p.RequiredGas(input)
	if suppliedGas < gasCost {
		return nil, 0, ErrOutOfGas
	}
	if logger != nil && logger.OnGasChange != nil {
		logger.OnGasChange(suppliedGas, suppliedGas-gasCost, tracing.GasChangeCallPrecompiledContract)
	}
	suppliedGas -= gasCost
	output, err := p.Run(input)
	return output, suppliedGas, err
}

// ripemd160hash is the RIPEMD-160 hash function precompile.
type ripemd160hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *ripemd160hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Ripemd160PerWordGas + params.Ripemd160BaseGas
}
func (c *ripemd160hash) Run(input []byte) ([]byte, error) {
	ripemd := ripemd160.New()
	ripemd.Write(input)
	return common.LeftPadBytes(ripemd.Sum(nil), 32), nil
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas cost of pre-compiled contracts.
const (
...
	Ripemd160BaseGas    uint64 = 600
	Ripemd160PerWordGas uint64 = 120
...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
import (
...
	"golang.org/x/crypto/ripemd160"
...
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
...
)

// PrecompiledContractsHomestead has the original four pre-compiled contracts.
var PrecompiledContractsHomestead = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): new(ecrecover),
	common.BytesToAddress([]byte{2}): new(sha256hash),
	common.BytesToAddress([]byte{3}): new(ripemd160hash),
	common.BytesToAddress([]byte{4}): new(identity),
}

// ripemd160hash implements the ripemd160 precompile contract.
type ripemd160hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *ripemd160hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Ripemd160PerWordGas + params.Ripemd160BaseGas
}

func (c *ripemd160hash) Run(input []byte) ([]byte, error) {
	ripemd := ripemd160.New()
	ripemd.Write(input)
	return common.LeftPadBytes(ripemd.Sum(nil), 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/common/bytes.go">
```go
// LeftPadBytes zero-pads slice to the left up to length l.
func LeftPadBytes(slice []byte, l int) []byte {
	if l <= len(slice) {
		return slice
	}

	padded := make([]byte, l)
	copy(padded[l-len(slice):], slice)

	return padded
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContracts are the contracts implemented natively in Geth.
var (
	// ... (other precompiles) ...
	ripemd160Address = common.BytesToAddress([]byte{3})
	// ... (other precompiles) ...
)

// PrecompiledContractsBerlin contains the precompiled contracts after the Berlin fork.
var PrecompiledContractsBerlin = map[common.Address]PrecompiledContract{
	// ... (other precompiles) ...
	ripemd160Address: &ripemd160hash{},
	// ... (other precompiles) ...
}

// ripemd160hash implements the ripemd160 precompile contract.
type ripemd160hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *ripemd160hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Ripemd160PerWordGas + params.Ripemd160BaseGas
}

func (c *ripemd160hash) Run(input []byte) ([]byte, error) {
	ripemd := ripemd160.New()
	ripemd.Write(input)
	return common.LeftPadBytes(ripemd.Sum(nil), 32), nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ... (other gas constants) ...

	// Gas prices for precompiled contracts.
	EcrecoverGas        uint64 = 3000 // Elliptic curve sender recovery gas price
	Sha256BaseGas       uint64 = 60   // Base price for a SHA256 operation
	Sha256PerWordGas    uint64 = 12   // Per-word price for a SHA256 operation
	Ripemd160BaseGas    uint64 = 600  // Base price for a RIPEMD160 operation
	Ripemd160PerWordGas uint64 = 120  // Per-word price for a RIPEMD160 operation
	IdentityBaseGas     uint64 = 15   // Base price for a data copy operation
	IdentityPerWordGas  uint64 = 3    // Per-work price for a data copy operation
	// ... (other gas constants) ...
)
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/common/bytes.go">
```go
// LeftPadBytes zero-pads a byte slice to a specified length.
func LeftPadBytes(slice []byte, l int) []byte {
	if l <= len(slice) {
		return slice
	}

	padded := make([]byte, l)
	copy(padded[l-len(slice):], slice)

	return padded
}

// RightPadBytes zero-pads a byte slice to a specified length.
func RightPadBytes(slice []byte, l int) []byte {
	if l <= len(slice) {
		return slice
	}

	padded := make([]byte, l)
	copy(padded, slice)

	return padded
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts_test.go">
```go
// रिप-एमडी १६०
// This is the "ripemd" in hindi, just a way to test unicode identifiers.
func रिपएमडी१६०(input []byte) []byte {
	ripemd := ripemd160.New()
	ripemd.Write(input)
	return common.LeftPadBytes(ripemd.Sum(nil), 32)
}

func TestRipemd(t *testing.T) {
	ripemd := new(ripemd160hash)
	// simple test
	input := []byte("test")
	// gas is 600 + 1 * 120
	gas := ripemd.RequiredGas(input)
	if gas != 720 {
		t.Errorf("expected 720 gas, got %d", gas)
	}
	// actual test
	expected := रिपएमडी१६०(input)
	ret, err := ripemd.Run(input)
	if err != nil {
		t.Error(err)
	}
	if !bytes.Equal(ret, expected) {
		t.Errorf("expected %x got %x", expected, ret)
	}
	// test with no data
	input = []byte{}
	// gas is 600
	gas = ripemd.RequiredGas(input)
	if gas != 600 {
		t.Errorf("expected 600 gas, got %d", gas)
	}
	expected = रिपएमडी१६०(input)
	ret, err = ripemd.Run(input)
	if err != nil {
		t.Error(err)
	}
	if !bytes.Equal(ret, expected) {
		t.Errorf("expected %x got %x", expected, ret)
	}
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Ripemd160BaseGas is the base price for a RIPEMD160 operation.
Ripemd160BaseGas uint64 = 600
// Ripemd160PerWordGas is the per-word price for a RIPEMD160 operation.
Ripemd160PerWordGas uint64 = 120
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
import (
	"golang.org/x/crypto/ripemd160"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

// PrecompiledContract is the interface for a native contract.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64 
	Run(input []byte) ([]byte, error)
}

// PrecompiledContractsHomestead contains the precompiled contracts up to homestead.
var PrecompiledContractsHomestead = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): new(ecrecover),
	common.BytesToAddress([]byte{2}): new(sha256hash),
	common.BytesToAddress([]byte{3}): new(ripemd160hash),
	common.BytesToAddress([]byte{4}): new(identity),
}

// ripemd160hash implements the RIPEMD160 hash contract.
type ripemd160hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *ripemd160hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Ripemd160PerWordGas + params.Ripemd160BaseGas
}

func (c *ripemd160hash) Run(input []byte) ([]byte, error) {
	ripemd := ripemd160.New()
	ripemd.Write(input)
	return common.LeftPadBytes(ripemd.Sum(nil), 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/common/bytes.go">
```go
// LeftPadBytes zero-pads a byte slice to a certain length.
func LeftPadBytes(slice []byte, l int) []byte {
	if l < len(slice) {
		return slice
	}
	padded := make([]byte, l)
	copy(padded[l-len(slice):], slice)
	return padded
}
```
</file>
</go-ethereum>

## Implementation Strategy & Research

### Recommended Approach: WASM RIPEMD160 Library

**Primary Option: noble-hashes RIPEMD160 (Recommended)**
- 🎯 **Library**: [@noble/hashes/legacy.js](https://github.com/paulmillr/noble-hashes) RIPEMD160 implementation
- ✅ **Pros**: 
  - Part of well-maintained cryptographic library suite
  - TypeScript/WASM compatible with Uint8Array support  
  - Small bundle impact (~20KB gzipped for full library)
  - Simple API: `ripemd160(input)` or `.create().update().digest()` pattern
- ⚠️ **Tradeoffs**: 
  - External dependency on JavaScript crypto library
  - Library warns RIPEMD160 is "weak" - collision risk with 2^80 effort
  - Explicitly warns "Don't use in new protocols" (but Ethereum compatibility requires it)
- 📦 **Bundle Impact**: ~20KB additional WASM (part of full noble-hashes library)

**Why WASM is Necessary**
- ❌ **Zig stdlib**: RIPEMD160 is NOT available in Zig standard library (only SHA family hashes)
- ❌ **Native Zig libs**: No mature RIPEMD160 implementations available in Zig ecosystem
- ✅ **WASM solution**: Proven WASM libraries provide reliable, secure implementation

### Implementation Priority
Following Tevm's preference hierarchy for RIPEMD160 (0x03):
1. ❌ Zig stdlib - RIPEMD160 not available
2. ❌ Trivial implementation - Complex cryptographic algorithm, security-critical
3. ❌ Native Zig crypto library - No mature options exist
4. ✅ **WASM library (recommended)** - Only viable option for secure implementation

### Investigation Steps
1. **Setup noble-hashes integration**: Import RIPEMD160 from `@noble/hashes/legacy.js`
2. **API integration**: Test both simple `ripemd160(Uint8Array)` and streaming `.create().update().digest()` patterns
3. **Bundle size verification**: Confirm ~20KB impact for full noble-hashes library
4. **Security assessment**: Acknowledge RIPEMD160 weakness while ensuring implementation correctness
5. **WASM compatibility testing**: Verify Uint8Array handling works correctly in Zig/WASM environment
6. **Performance validation**: Ensure adequate performance for Ethereum gas costs (600 + 120*words)

### Critical Implementation Notes
- **Gas Formula**: `600 + 120 * ceil(input_size / 32)` (much higher than SHA256 due to performance characteristics)
- **Legacy Algorithm**: RIPEMD160 is older, weaker, and less common than SHA256
- **Security Warning**: noble-hashes explicitly warns about RIPEMD160 weakness (2^80 collision effort)
- **Ethereum Requirement**: Despite weakness, required for Ethereum compatibility with existing contracts
- **Bundle Size Trade-off**: ~20KB increase acceptable for full Ethereum compatibility

### Expected Bundle Impact
- **Size**: ~20KB additional WASM (noble-hashes library)
- **Performance**: Adequate for gas costs (600 + 120*words pricing accounts for slower algorithm)
- **Maintenance**: External dependency requires monitoring noble-hashes updates
- **API Pattern**: Simple `ripemd160(input)` function call or streaming API available

### API Usage Pattern (from noble-hashes)
```typescript
import { ripemd160 } from '@noble/hashes/legacy.js';

// Simple usage
const input = Uint8Array.from([0x10, 0x20, 0x30]);
const hash = ripemd160(input); // Returns 20-byte hash

// Streaming usage  
const hasher = ripemd160.create();
hasher.update(data1);
hasher.update(data2);
const hash = hasher.digest(); // Returns 20-byte hash
```

### Alternative Fallback
If bundle size becomes critical, could potentially gate RIPEMD160 behind a feature flag, but this would break Ethereum compatibility.

