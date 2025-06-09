# Implement IDENTITY Precompile Infrastructure for Tevm EVM

**BEING WORKED ON** - Started by Claude on 2025-01-08

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_identity_precompile_infrastructure` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_identity_precompile_infrastructure feat_implement_identity_precompile_infrastructure`
3. **Work in isolation**: `cd g/feat_implement_identity_precompile_infrastructure`
4. **Commit message**: `✨ feat: implement IDENTITY precompile infrastructure`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

This is the first precompile implementation in the Tevm EVM Zig codebase, so we need to establish the foundational architecture that will support all future precompiles (ecrecover, SHA256, RIPEMD160, etc.). The implementation should follow Ethereum specification exactly and serve as a template for future precompiles.

## Reference Implementations

### evmone Reference
File: `/Users/williamcory/tevm/main/evmone/test/state/precompiles.hpp:18`
- IDENTITY precompile enum at address 0x04

File: `/Users/williamcory/tevm/main/evmone/test/state/precompiles.cpp:72-75`
```cpp
PrecompileAnalysis identity_analyze(bytes_view input, evmc_revision /*rev*/) noexcept
{
    return {cost_per_input_word<15, 3>(input.size()), input.size()};
}
```

File: `/Users/williamcory/tevm/main/evmone/test/state/precompiles.cpp:473-479`
```cpp
ExecutionResult identity_execute(const uint8_t* input, size_t input_size, uint8_t* output,
    [[maybe_unused]] size_t output_size) noexcept
{
    assert(output_size >= input_size);
    std::copy_n(input, input_size, output);
    return {EVMC_SUCCESS, input_size};
}
```

### revm Reference
File: `/Users/williamcory/tevm/main/revm/crates/precompile/src/identity.rs:7-8`
```rust
pub const FUN: PrecompileWithAddress =
    PrecompileWithAddress(crate::u64_to_address(4), identity_run);
```

File: `/Users/williamcory/tevm/main/revm/crates/precompile/src/identity.rs:11-13`
```rust
pub const IDENTITY_BASE: u64 = 15;
pub const IDENTITY_PER_WORD: u64 = 3;
```

File: `/Users/williamcory/tevm/main/revm/crates/precompile/src/identity.rs:20-29`
```rust
pub fn identity_run(input: &[u8], gas_limit: u64) -> PrecompileResult {
    let gas_used = calc_linear_cost_u32(input.len(), IDENTITY_BASE, IDENTITY_PER_WORD);
    if gas_used > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }
    Ok(PrecompileOutput::new(gas_used, Bytes::copy_from_slice(input)))
}
```

## Ethereum Specification

- Address: 0x0000000000000000000000000000000000000004
- Gas cost: 15 + 3 * ceil(input_size / 32)
- Function: Returns input data unchanged (identity function)
- Available: All hardforks (Frontier onwards)
- Edge cases: Empty input returns empty output with 15 gas cost

## Architecture Requirements

### Foundational Structure
Create a modular precompile system that:
1. Supports address-based dispatch (0x01-0x0A currently, expandable to 0xFF)
2. Separates gas calculation from execution for optimization
3. Provides consistent error handling across all precompiles
4. Integrates cleanly with existing CALL/STATICCALL/DELEGATECALL opcodes
5. Follows existing Zig style conventions (snake_case functions, PascalCase types)

### Integration Points
- Modify `/Users/williamcory/tevm/main/src/evm/vm.zig:360` call_contract method to detect and dispatch to precompiles
- Integrate with `/Users/williamcory/tevm/main/src/evm/execution/system.zig` CALL opcodes (lines 189+)
- Add gas constants to `/Users/williamcory/tevm/main/src/evm/constants/gas_constants.zig`
- Update `/Users/williamcory/tevm/main/build.zig` to include new precompile module

## Implementation Tasks

### Task 1: Create Precompile Infrastructure
Create directory structure:
```
/src/evm/precompiles/
├── precompiles.zig          // Main dispatcher
├── identity.zig             // IDENTITY implementation  
├── precompile_addresses.zig // Address constants
├── precompile_result.zig    // Result/error types
└── precompile_gas.zig       // Gas calculation utilities
```

### Task 2: Implement Identity Precompile
File: `/src/evm/precompiles/identity.zig`
- Implement gas calculation: 15 + 3 * word_count
- Implement execution: copy input to output
- Handle edge cases: empty input, gas limit exceeded
- Include comprehensive JSDoc-style documentation
- Follow unsafe/safe pattern if applicable for performance

### Task 3: Create Dispatcher
File: `/src/evm/precompiles/precompiles.zig`
- Create address-to-precompile mapping
- Implement is_precompile(address) -> bool function
- Implement execute_precompile(address, input, gas_limit) -> Result
- Support hardfork-based availability

### Task 4: Integrate VM Calls
Modify `/src/evm/vm.zig` call_contract method:
- Add precompile address detection
- Route precompile calls to dispatcher
- Maintain existing behavior for contract calls
- Preserve gas accounting and return data handling

### Task 5: Add Constants
File: `/src/evm/constants/gas_constants.zig`
```zig
// IDENTITY precompile gas costs
pub const IDENTITY_BASE_COST: u64 = 15;
pub const IDENTITY_WORD_COST: u64 = 3;
```

### Task 6: Update Build System
File: `/build.zig`
- Add precompiles module creation
- Link to main EVM module via addImport("precompiles", precompiles_mod)
- Ensure proper dependency resolution

### Task 7: Comprehensive Testing
Create `/test/evm/precompiles/identity_test.zig`:
- Test gas calculation accuracy vs Ethereum specification
- Test execution with various input sizes (0, 1, 31, 32, 33, 64, 1024 bytes)
- Test gas limit exceeded scenarios
- Test integration with CALL/STATICCALL opcodes
- Test hardfork compatibility
- Performance benchmarks vs reference implementations

## Design Patterns

### Gas Calculation Pattern
```zig
pub fn calculate_gas(input_size: usize) u64 {
    const word_count = (input_size + 31) / 32;
    return IDENTITY_BASE_COST + IDENTITY_WORD_COST * @as(u64, @intCast(word_count));
}
```

### Execution Pattern
```zig
pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileResult {
    const gas_cost = calculate_gas(input.len);
    if (gas_cost > gas_limit) return PrecompileError.OutOfGas;
    
    // Copy input to output (identity function)
    @memcpy(output[0..input.len], input);
    
    return PrecompileResult{ .gas_used = gas_cost, .output_size = input.len };
}
```

### Address Checking Pattern
```zig
pub fn is_precompile(address: Address.Address) bool {
    const addr_bytes = address.toBytes();
    // Check if address is 0x00...0001 through 0x00...000A (or higher for future precompiles)
    if (!std.mem.eql(u8, addr_bytes[0..19], &[_]u8{0} ** 19)) return false;
    const last_byte = addr_bytes[19];
    return last_byte >= 1 and last_byte <= 10; // Update for new precompiles
}
```

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes** - This is non-negotiable
2. **Follow existing Zig style conventions** - snake_case functions, no inline keywords
3. **Maintain gas accounting precision** - Must match Ethereum specification exactly
4. **Preserve existing CALL behavior** - No breaking changes to contract calls
5. **Include comprehensive error handling** - OutOfGas, InvalidInput, etc.
6. **Document architectural decisions** - This is the template for 15+ future precompiles
7. **Test edge cases thoroughly** - Empty inputs, maximum gas limits, hardfork compatibility

## Success Criteria

- IDENTITY precompile passes all Ethereum Foundation test vectors
- Integration tests show CALL/STATICCALL to 0x04 works correctly
- Gas consumption matches evmone/revm implementations exactly
- Architecture supports easy addition of ecrecover, SHA256, etc.
- No performance regression in existing EVM operations
- Bundle size impact is minimal (important for WASM)