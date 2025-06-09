# Implement RIPEMD160 Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_ripemd160_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_ripemd160_precompile feat_implement_ripemd160_precompile`
3. **Work in isolation**: `cd g/feat_implement_ripemd160_precompile`
4. **Commit message**: `✨ feat: implement RIPEMD160 precompile`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the RIPEMD160 precompile (address 0x03) for Ethereum Virtual Machine compatibility. This precompile provides RIPEMD160 hashing functionality and is available from the Frontier hardfork. This implementation assumes the precompile infrastructure from IDENTITY and SHA256 already exists.

## Ethereum Specification

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

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Verify against RIPEMD160 test vectors** - Ensure hash correctness
3. **Test output padding** - Must be exactly 32 bytes with correct zero padding
4. **Choose implementation approach wisely** - Consider bundle size and performance
5. **Handle large inputs** - Test up to reasonable gas limit boundaries
6. **Security review** - RIPEMD160 implementation must be cryptographically sound

## Decision Points

### Implementation Approach Decision
Before starting implementation, decide:
1. **Pure Zig vs C bindings** - Based on bundle size impact and complexity
2. **Third-party library** - If available, evaluate quality and maintenance
3. **Performance vs size trade-offs** - Optimize for Tevm's specific use case

## References

- [RIPEMD160 Specification](https://homes.esat.kuleuven.be/~bosselae/ripemd160.html)
- [RIPEMD160 Test Vectors](https://homes.esat.kuleuven.be/~bosselae/ripemd160/pdf/AB-9601/AB-9601.pdf)
- [Ethereum Yellow Paper - Precompiles](https://ethereum.github.io/yellowpaper/paper.pdf)
- [C RIPEMD160 Reference Implementation](https://github.com/bitcoin-core/secp256k1/blob/master/src/hash_impl.h)