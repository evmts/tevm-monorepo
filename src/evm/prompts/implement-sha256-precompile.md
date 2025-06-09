# Implement SHA256 Precompile

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_sha256_precompile` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_sha256_precompile feat_implement_sha256_precompile`
3. **Work in isolation**: `cd g/feat_implement_sha256_precompile`
4. **Commit message**: `✨ feat: implement SHA256 precompile`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement the SHA256 precompile (address 0x02) for Ethereum Virtual Machine compatibility. This precompile provides SHA256 hashing functionality and is available from the Frontier hardfork. This implementation assumes the IDENTITY precompile infrastructure already exists.

## Ethereum Specification

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

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Use Zig standard library crypto** - Don't implement SHA256 from scratch
3. **Verify against RFC test vectors** - Ensure hash correctness
4. **Test gas calculation precisely** - Must match Ethereum specification exactly
5. **Handle large inputs** - Test up to reasonable gas limit boundaries
6. **Maintain constant-time execution** - Use secure crypto implementation

## Security Considerations

### Crypto Implementation
- **Use std.crypto.hash.sha2.Sha256**: Battle-tested implementation
- **Constant-time execution**: Resistant to timing attacks
- **Memory safety**: Zig's memory safety prevents buffer overflows
- **No custom crypto**: Don't implement SHA256 manually

### Input Validation
```zig
// Validate input size doesn't cause integer overflow
if (input.len > std.math.maxInt(u32)) return PrecompileError.InputTooLarge;

// Ensure output buffer is adequate
if (output.len < 32) return PrecompileError.InvalidOutput;
```

## References

- [SHA256 Specification (FIPS 180-4)](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf)
- [Zig Crypto Documentation](https://ziglang.org/documentation/master/std/#std;crypto)
- [Ethereum Yellow Paper - Precompiles](https://ethereum.github.io/yellowpaper/paper.pdf)
- [RFC 6234 - SHA-2 Test Vectors](https://tools.ietf.org/rfc/rfc6234.txt)