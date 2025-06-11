# Implement Dynamic Gas Edge Cases

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_dynamic_gas_edge_cases` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_dynamic_gas_edge_cases feat_implement_dynamic_gas_edge_cases`
3. **Work in isolation**: `cd g/feat_implement_dynamic_gas_edge_cases`
4. **Commit message**: Use the following XML format:

```
✨ feat: brief description of the change

<summary>
<what>
- Bullet point summary of what was changed
- Key implementation details and files modified
</what>

<why>
- Motivation and reasoning behind the changes
- Problem being solved or feature being added
</why>

<how>
- Technical approach and implementation strategy
- Important design decisions or trade-offs made
</how>
</summary>

<prompt>
Condensed version of the original prompt that includes:
- The core request or task
- Essential context needed to re-execute
- Replace large code blocks with <github>url</github> or <docs>description</docs>
- Remove redundant examples but keep key technical details
- Ensure someone could understand and repeat the task from this prompt alone
</prompt>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement comprehensive handling of dynamic gas edge cases, particularly complex memory growth scenarios that can occur with irregular memory access patterns, large copy operations, and edge cases in gas calculation that can lead to integer overflow, underflow, or unexpected behavior.

## Relevant Implementation Files

**Primary Files to Modify:**
- `/src/evm/constants/gas_constants.zig` - Gas calculation utilities
- `/src/evm/execution/memory.zig` - Memory expansion gas costs
- `/src/evm/execution/storage.zig` - Storage operation gas costs

**Supporting Files:**
- `/src/evm/frame.zig` - Gas tracking across operations
- `/src/evm/vm.zig` - Main execution loop gas validation
- `/src/evm/memory_size.zig` - Memory size calculations

**Test Files:**
- `/test/evm/gas/gas_accounting_test.zig` - Comprehensive gas tests
- `/test/evm/opcodes/memory_test.zig` - Memory gas cost tests
- `/test/evm/opcodes/storage_test.zig` - Storage gas cost tests

**Why These Files:**
- Gas constants handle complex calculations that can overflow in edge cases
- Memory and storage execution files implement dynamic gas costs
- Frame management tracks gas consumption across operations
- VM validates total gas usage and prevents overflows
- Tests ensure edge cases are properly handled

## ELI5

Imagine gas costs like a restaurant bill that changes based on how much food you order and where you sit. Sometimes customers try to game the system with unusual orders that could make the billing system crash or charge wrong amounts. This implementation is like having smart waiters who catch these edge cases - if someone tries to order "infinite breadsticks" or sit at "table negative-5", the system gracefully handles it instead of breaking.

## Dynamic Gas Edge Cases

### Memory Growth Edge Cases

#### 1. Non-Sequential Memory Access
```zig
// Pattern: Accessing memory at large offset without intermediate access
// Example: MSTORE at offset 0x1000000 when current memory is only 64 bytes
// Challenge: Sudden large memory expansion cost
```

#### 2. Integer Overflow in Memory Calculations
```zig
// Pattern: Memory operations with parameters that cause overflow
// Example: CALLDATACOPY with offset=MAX_U256-1, size=10
// Challenge: offset + size wraps around to small number
```

#### 3. Memory Copy Edge Cases
```zig
// Pattern: Copy operations with overlapping or boundary conditions
// Example: CODECOPY from offset > code_size
// Example: MCOPY with overlapping source and destination
```

#### 4. Quadratic Memory Cost Overflow
```zig
// Pattern: Memory size causing quadratic cost to overflow u64
// Example: Memory expansion to size where cost^2 / 512 > MAX_U64
```

### Call Operation Edge Cases

#### 1. Gas Parameter Overflow
```zig
// Pattern: CALL with gas parameter larger than available
// Example: CALL with gas=MAX_U256 but only 1000 gas available
```

#### 2. Recursive Call Depth with Gas
```zig
// Pattern: Deep call chains with complex gas forwarding
// Example: 1024 calls each forwarding gas with 63/64 rule
```

#### 3. Value Transfer Edge Cases
```zig
// Pattern: Value transfers with edge case amounts
// Example: Transfer of MAX_U256 or transfer causing recipient overflow
```

## Implementation Requirements

### Core Functionality
1. **Overflow Protection**: Prevent integer overflow in all gas calculations
2. **Memory Bounds Checking**: Validate memory access parameters before calculation
3. **Gas Limit Enforcement**: Ensure operations respect block gas limit
4. **Error Recovery**: Graceful handling of edge cases without panics
5. **Specification Compliance**: Match Ethereum reference implementation behavior

### Edge Case Categories
```zig
pub const EdgeCaseCategory = enum {
    MemoryOverflow,        // Memory size calculations overflow
    ParameterOverflow,     // Operation parameters overflow
    GasCalculationError,   // Gas calculation edge cases
    StateOverflow,         // State changes cause overflow
    CallDepthLimit,        // Call depth edge cases
    AccessOutOfBounds,     // Memory/storage access beyond bounds
};

pub const EdgeCaseHandler = struct {
    pub fn handle_memory_overflow(
        offset: u64,
        size: u64,
        current_memory_size: u32
    ) EdgeCaseResult {
        // Check for addition overflow
        const end_offset = offset +| size; // Saturating add
        if (end_offset < offset) {
            return EdgeCaseResult.parameter_overflow;
        }
        
        // Check against maximum memory limit
        if (end_offset > MAX_MEMORY_SIZE) {
            return EdgeCaseResult.memory_too_large;
        }
        
        // Check for gas calculation overflow
        const required_memory_size = @as(u32, @intCast(@min(end_offset, MAX_MEMORY_SIZE)));
        const gas_cost = calculate_memory_expansion_gas_safe(current_memory_size, required_memory_size);
        
        return EdgeCaseResult{ .success = gas_cost };
    }
};
```

## Implementation Tasks

### Task 1: Safe Memory Gas Calculation
File: `/src/evm/gas/safe_gas_calculator.zig`
```zig
const std = @import("std");
const gas_constants = @import("../constants/gas_constants.zig");

pub const GasCalculationError = error{
    MemoryOverflow,
    ParameterOverflow,
    GasOverflow,
    InvalidOperation,
};

pub const SafeGasResult = union(enum) {
    success: u64,
    overflow: void,
    too_large: void,
    invalid: void,
};

// Safe memory cost calculation with overflow protection
pub fn calculate_memory_cost_safe(memory_size: u64) SafeGasResult {
    // Check for zero size
    if (memory_size == 0) return SafeGasResult{ .success = 0 };
    
    // Check against maximum memory size
    if (memory_size > gas_constants.MAX_MEMORY_SIZE) {
        return SafeGasResult.too_large;
    }
    
    // Calculate memory size in words (round up)
    const memory_size_words = (memory_size + 31) / 32;
    
    // Check for overflow in word calculation
    if (memory_size_words > std.math.maxInt(u32)) {
        return SafeGasResult.overflow;
    }
    
    const memory_size_words_u64 = @as(u64, memory_size_words);
    
    // Calculate linear cost with overflow check
    const linear_cost = std.math.mul(u64, memory_size_words_u64, gas_constants.MEMORY_GAS_LINEAR) catch {
        return SafeGasResult.overflow;
    };
    
    // Calculate quadratic cost with overflow check
    const memory_squared = std.math.mul(u64, memory_size_words_u64, memory_size_words_u64) catch {
        return SafeGasResult.overflow;
    };
    
    const quadratic_cost = memory_squared / gas_constants.MEMORY_GAS_QUADRATIC;
    
    // Add linear and quadratic costs with overflow check
    const total_cost = std.math.add(u64, linear_cost, quadratic_cost) catch {
        return SafeGasResult.overflow;
    };
    
    return SafeGasResult{ .success = total_cost };
}

// Safe memory expansion gas calculation
pub fn calculate_memory_expansion_gas_safe(old_size: u32, new_size: u32) SafeGasResult {
    if (new_size <= old_size) {
        return SafeGasResult{ .success = 0 };
    }
    
    const old_cost = switch (calculate_memory_cost_safe(old_size)) {
        .success => |cost| cost,
        else => return SafeGasResult.overflow,
    };
    
    const new_cost = switch (calculate_memory_cost_safe(new_size)) {
        .success => |cost| cost,
        else => return SafeGasResult.overflow,
    };
    
    // Calculate expansion cost with overflow check
    if (new_cost < old_cost) {
        return SafeGasResult.invalid; // Should never happen
    }
    
    return SafeGasResult{ .success = new_cost - old_cost };
}

// Safe parameter validation for memory operations
pub fn validate_memory_access_safe(offset: u64, size: u64) SafeGasResult {
    // Check for overflow in offset + size
    const end_offset = std.math.add(u64, offset, size) catch {
        return SafeGasResult.overflow;
    };
    
    // Check against maximum memory size
    if (end_offset > gas_constants.MAX_MEMORY_SIZE) {
        return SafeGasResult.too_large;
    }
    
    return SafeGasResult{ .success = end_offset };
}

// Safe call gas calculation
pub fn calculate_call_gas_safe(
    available_gas: u64,
    gas_parameter: u64,
    base_cost: u64
) SafeGasResult {
    // Check if we have enough gas for base cost
    if (available_gas < base_cost) {
        return SafeGasResult{ .success = 0 };
    }
    
    const remaining_gas = available_gas - base_cost;
    
    // Calculate 63/64 rule with overflow protection
    const retained_gas = remaining_gas / 64;
    const max_forwardable = remaining_gas - retained_gas;
    
    // Determine gas to forward
    const gas_to_forward = if (gas_parameter == 0) {
        max_forwardable
    } else {
        @min(gas_parameter, max_forwardable)
    };
    
    return SafeGasResult{ .success = gas_to_forward };
}
```

### Task 2: Edge Case Detection and Handling
File: `/src/evm/validation/edge_case_detector.zig`
```zig
const std = @import("std");
const SafeGasResult = @import("../gas/safe_gas_calculator.zig").SafeGasResult;

pub const EdgeCaseType = enum {
    NormalOperation,
    MemoryOverflow,
    ParameterOverflow,
    GasOverflow,
    InvalidAccess,
    StateOverflow,
};

pub const EdgeCaseDetector = struct {
    pub fn detect_memory_edge_case(offset: u64, size: u64, current_size: u32) EdgeCaseType {
        // Check for parameter overflow
        const end_offset = offset +| size; // Saturating add
        if (end_offset < offset) {
            return EdgeCaseType.ParameterOverflow;
        }
        
        // Check for extremely large memory access
        if (end_offset > 1024 * 1024 * 1024) { // 1GB limit
            return EdgeCaseType.MemoryOverflow;
        }
        
        // Check for suspicious access patterns
        if (size > 1024 * 1024 and offset > current_size + 1024 * 1024) {
            return EdgeCaseType.InvalidAccess; // Large copy to distant location
        }
        
        return EdgeCaseType.NormalOperation;
    }
    
    pub fn detect_call_edge_case(
        gas_parameter: u64,
        available_gas: u64,
        value: u256,
        call_depth: u32
    ) EdgeCaseType {
        // Check for gas parameter overflow relative to available
        if (gas_parameter > available_gas * 1000) {
            return EdgeCaseType.ParameterOverflow;
        }
        
        // Check for excessive call depth
        if (call_depth >= 1020) { // Close to 1024 limit
            return EdgeCaseType.StateOverflow;
        }
        
        // Check for value overflow edge cases
        if (value > 0) {
            // Check for near-maximum value transfers
            const max_reasonable_value = (@as(u256, 1) << 128); // 2^128 Wei
            if (value > max_reasonable_value) {
                return EdgeCaseType.StateOverflow;
            }
        }
        
        return EdgeCaseType.NormalOperation;
    }
    
    pub fn detect_copy_edge_case(
        dest_offset: u64,
        src_offset: u64,
        size: u64,
        src_size: u64
    ) EdgeCaseType {
        // Check for parameter overflow
        if (src_offset +| size < src_offset or dest_offset +| size < dest_offset) {
            return EdgeCaseType.ParameterOverflow;
        }
        
        // Check for out-of-bounds source access
        if (src_offset > src_size) {
            return EdgeCaseType.InvalidAccess;
        }
        
        // Check for extremely large copy operations
        if (size > 32 * 1024 * 1024) { // 32MB limit
            return EdgeCaseType.MemoryOverflow;
        }
        
        return EdgeCaseType.NormalOperation;
    }
};
```

### Task 3: Update Memory Operations with Edge Case Handling
File: `/src/evm/execution/memory.zig` (modify existing)
```zig
const safe_gas_calculator = @import("../gas/safe_gas_calculator.zig");
const EdgeCaseDetector = @import("../validation/edge_case_detector.zig").EdgeCaseDetector;

// Update MLOAD with comprehensive edge case handling
pub fn execute_mload(vm: *Vm, frame: *Frame) !ExecutionResult {
    const offset = frame.stack.pop_unsafe();
    
    // Detect edge cases
    const edge_case = EdgeCaseDetector.detect_memory_edge_case(offset, 32, frame.memory.size());
    
    switch (edge_case) {
        .ParameterOverflow => return ExecutionError.ParameterOverflow,
        .MemoryOverflow => return ExecutionError.MemoryTooLarge,
        .InvalidAccess => return ExecutionError.InvalidMemoryAccess,
        .NormalOperation => {},
        else => return ExecutionError.InvalidOperation,
    }
    
    // Safe memory expansion calculation
    const expansion_result = safe_gas_calculator.validate_memory_access_safe(offset, 32);
    const required_size = switch (expansion_result) {
        .success => |size| @as(u32, @intCast(size)),
        .overflow => return ExecutionError.ParameterOverflow,
        .too_large => return ExecutionError.MemoryTooLarge,
        .invalid => return ExecutionError.InvalidMemoryAccess,
    };
    
    // Calculate gas cost safely
    const gas_result = safe_gas_calculator.calculate_memory_expansion_gas_safe(
        frame.memory.size(),
        required_size
    );
    
    const gas_cost = switch (gas_result) {
        .success => |cost| cost,
        .overflow => return ExecutionError.GasOverflow,
        .too_large => return ExecutionError.MemoryTooLarge,
        .invalid => return ExecutionError.InvalidOperation,
    };
    
    // Check gas availability
    if (frame.gas_remaining < gas_cost + gas_constants.MLOAD_COST) {
        return ExecutionError.OutOfGas;
    }
    
    // Consume gas and expand memory
    frame.gas_remaining -= gas_cost + gas_constants.MLOAD_COST;
    try frame.memory.expand(required_size);
    
    // Load value from memory
    const value = frame.memory.load_word(offset);
    frame.stack.push_unsafe(value);
    
    return ExecutionResult.continue_execution;
}

// Update MCOPY with edge case handling
pub fn execute_mcopy(vm: *Vm, frame: *Frame) !ExecutionResult {
    const dest_offset = frame.stack.pop_unsafe();
    const src_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();
    
    // Detect copy-specific edge cases
    const edge_case = EdgeCaseDetector.detect_copy_edge_case(
        dest_offset,
        src_offset,
        size,
        frame.memory.size()
    );
    
    switch (edge_case) {
        .ParameterOverflow => return ExecutionError.ParameterOverflow,
        .MemoryOverflow => return ExecutionError.MemoryTooLarge,
        .InvalidAccess => return ExecutionError.InvalidMemoryAccess,
        .NormalOperation => {},
        else => return ExecutionError.InvalidOperation,
    }
    
    // Validate both source and destination access
    const src_validation = safe_gas_calculator.validate_memory_access_safe(src_offset, size);
    const dest_validation = safe_gas_calculator.validate_memory_access_safe(dest_offset, size);
    
    const src_end = switch (src_validation) {
        .success => |end| end,
        else => return ExecutionError.InvalidMemoryAccess,
    };
    
    const dest_end = switch (dest_validation) {
        .success => |end| end,
        else => return ExecutionError.InvalidMemoryAccess,
    };
    
    // Calculate required memory size
    const required_size = @as(u32, @intCast(@max(src_end, dest_end)));
    
    // Calculate memory expansion gas
    const expansion_gas = switch (safe_gas_calculator.calculate_memory_expansion_gas_safe(
        frame.memory.size(),
        required_size
    )) {
        .success => |cost| cost,
        else => return ExecutionError.MemoryTooLarge,
    };
    
    // Calculate copy gas (3 gas per word)
    const words = (size + 31) / 32;
    const copy_gas = std.math.mul(u64, words, gas_constants.COPY_GAS_PER_WORD) catch {
        return ExecutionError.GasOverflow;
    };
    
    const total_gas = std.math.add(u64, expansion_gas, copy_gas) catch {
        return ExecutionError.GasOverflow;
    };
    
    // Check gas availability
    if (frame.gas_remaining < total_gas) {
        return ExecutionError.OutOfGas;
    }
    
    // Consume gas and expand memory
    frame.gas_remaining -= total_gas;
    try frame.memory.expand(required_size);
    
    // Perform the copy operation
    frame.memory.copy(dest_offset, src_offset, size);
    
    return ExecutionResult.continue_execution;
}
```

### Task 4: Update Call Operations with Edge Case Handling
File: `/src/evm/execution/system.zig` (modify existing)
```zig
// Update CALL with comprehensive edge case handling
pub fn execute_call(vm: *Vm, frame: *Frame) !ExecutionResult {
    const gas_limit = frame.stack.pop_unsafe();
    const target_address = frame.stack.pop_unsafe();
    const value = frame.stack.pop_unsafe();
    const input_offset = frame.stack.pop_unsafe();
    const input_size = frame.stack.pop_unsafe();
    const output_offset = frame.stack.pop_unsafe();
    const output_size = frame.stack.pop_unsafe();
    
    // Detect call edge cases
    const edge_case = EdgeCaseDetector.detect_call_edge_case(
        gas_limit,
        frame.gas_remaining,
        value,
        vm.call_depth
    );
    
    switch (edge_case) {
        .ParameterOverflow => {
            frame.stack.push_unsafe(0); // Call failed
            return ExecutionResult.continue_execution;
        },
        .StateOverflow => {
            frame.stack.push_unsafe(0); // Call failed
            return ExecutionResult.continue_execution;
        },
        .NormalOperation => {},
        else => {
            frame.stack.push_unsafe(0); // Call failed
            return ExecutionResult.continue_execution;
        },
    }
    
    // Validate memory access for input and output
    const input_validation = safe_gas_calculator.validate_memory_access_safe(input_offset, input_size);
    const output_validation = safe_gas_calculator.validate_memory_access_safe(output_offset, output_size);
    
    switch (input_validation) {
        .success => {},
        else => {
            frame.stack.push_unsafe(0); // Call failed
            return ExecutionResult.continue_execution;
        },
    }
    
    switch (output_validation) {
        .success => {},
        else => {
            frame.stack.push_unsafe(0); // Call failed
            return ExecutionResult.continue_execution;
        },
    }
    
    // Continue with normal call logic...
    // (Implementation continues with existing call logic but using safe calculations)
    
    return ExecutionResult.continue_execution;
}
```

### Task 5: Add Edge Case Constants and Limits
File: `/src/evm/constants/gas_constants.zig` (modify existing)
```zig
// Maximum limits to prevent edge cases
pub const MAX_MEMORY_SIZE: u64 = 1024 * 1024 * 1024; // 1GB
pub const MAX_COPY_SIZE: u64 = 32 * 1024 * 1024; // 32MB
pub const MAX_REASONABLE_VALUE: u256 = (@as(u256, 1) << 128); // 2^128 Wei

// Edge case detection thresholds
pub const LARGE_MEMORY_THRESHOLD: u64 = 1024 * 1024; // 1MB
pub const SUSPICIOUS_OFFSET_THRESHOLD: u64 = 1024 * 1024; // 1MB

// Gas overflow protection
pub const MAX_SAFE_GAS_CALCULATION: u64 = std.math.maxInt(u64) / 1000;
```

### Task 6: Comprehensive Testing
File: `/test/evm/gas/dynamic_gas_edge_cases_test.zig`

## Testing Requirements

### Test Cases
```zig
const std = @import("std");
const testing = std.testing;
const safe_gas_calculator = @import("../../../src/evm/gas/safe_gas_calculator.zig");
const EdgeCaseDetector = @import("../../../src/evm/validation/edge_case_detector.zig").EdgeCaseDetector;

test "memory overflow detection" {
    // Test offset + size overflow
    const result = safe_gas_calculator.validate_memory_access_safe(
        std.math.maxInt(u64) - 10,
        20
    );
    
    try testing.expect(result == .overflow);
}

test "memory cost overflow protection" {
    // Test memory size that would cause quadratic cost overflow
    const large_size = 1024 * 1024 * 1024; // 1GB
    const result = safe_gas_calculator.calculate_memory_cost_safe(large_size);
    
    // Should either succeed with valid cost or detect overflow
    switch (result) {
        .success => |cost| try testing.expect(cost > 0),
        .overflow => {}, // Expected for very large sizes
        .too_large => {}, // Also acceptable
        else => try testing.expect(false), // Unexpected result
    }
}

test "call gas parameter edge cases" {
    // Test call with gas parameter much larger than available
    const result = EdgeCaseDetector.detect_call_edge_case(
        std.math.maxInt(u64),
        1000,
        0,
        0
    );
    
    try testing.expectEqual(EdgeCaseType.ParameterOverflow, result);
}

test "copy operation edge cases" {
    // Test copy with overlapping regions and large size
    const result = EdgeCaseDetector.detect_copy_edge_case(
        100,                    // dest_offset
        50,                     // src_offset (overlapping)
        100 * 1024 * 1024,     // 100MB size
        1000                    // src_size
    );
    
    try testing.expectEqual(EdgeCaseType.MemoryOverflow, result);
}

test "memory expansion gas edge cases" {
    // Test expansion from small to very large memory
    const result = safe_gas_calculator.calculate_memory_expansion_gas_safe(
        64,                     // current: 64 bytes
        1024 * 1024 * 1024     // new: 1GB
    );
    
    // Should detect as too large or overflow
    try testing.expect(result != .success);
}

test "safe arithmetic operations" {
    // Test that safe operations don't panic on overflow
    const a = std.math.maxInt(u64) - 1;
    const b = 10;
    
    // This should not panic
    const result = std.math.add(u64, a, b);
    try testing.expectError(error.Overflow, result);
}

test "edge case recovery" {
    // Test that edge cases don't crash the VM
    var vm = try createTestVm();
    defer vm.deinit();
    
    // Try to execute MLOAD with maximum offset
    const frame = try vm.create_frame(test_context);
    frame.stack.push_unsafe(std.math.maxInt(u256));
    
    // Should return error, not crash
    const result = execute_mload(&vm, &frame);
    try testing.expectError(ExecutionError.ParameterOverflow, result);
}
```

### Stress Tests
```zig
test "memory stress test" {
    // Test rapid memory expansion and contraction
    // Test many small memory accesses vs few large accesses
    // Test memory access patterns that could cause performance issues
}

test "call depth stress test" {
    // Test deep call chains with edge case gas forwarding
    // Test recursive calls with diminishing gas
    // Test call depth limit enforcement
}

test "gas calculation stress test" {
    // Test gas calculations near overflow boundaries
    // Test combinations of operations that could cause overflow
    // Test performance with extreme parameter values
}
```

## Performance Considerations

### Overflow Detection Optimization
```zig
// Fast overflow detection using compiler intrinsics
fn fast_add_overflow_check(a: u64, b: u64) bool {
    return @addWithOverflow(a, b)[1] != 0;
}

// Branch-free overflow detection
fn branchless_overflow_check(a: u64, b: u64) bool {
    return a > std.math.maxInt(u64) - b;
}
```

### Edge Case Caching
```zig
// Cache results for common edge case patterns
pub const EdgeCaseCache = struct {
    const CACHE_SIZE = 256;
    
    memory_edge_cache: [CACHE_SIZE]?EdgeCaseType,
    
    pub fn check_memory_edge_cached(self: *EdgeCaseCache, offset: u64, size: u64) ?EdgeCaseType {
        const hash = (offset ^ size) % CACHE_SIZE;
        return self.memory_edge_cache[hash];
    }
};
```

## Success Criteria

1. **Robustness**: No panics or crashes on edge case inputs
2. **Specification Compliance**: Matches Ethereum reference behavior
3. **Gas Accuracy**: Correct gas costs even for edge cases
4. **Performance**: Minimal overhead for edge case detection
5. **Error Handling**: Graceful failure modes for invalid operations
6. **Test Coverage**: Comprehensive coverage of all identified edge cases

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test with extreme values** - Use maximum and minimum parameter values
3. **Verify overflow protection** - Ensure no integer overflow in any calculation
4. **Match reference behavior** - Test against Go-Ethereum for edge cases
5. **Performance validation** - Ensure edge case handling doesn't slow normal operations
6. **Comprehensive error handling** - Every edge case should have defined behavior

## References

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf) - Formal specification
- [Go-Ethereum Edge Case Handling](https://github.com/ethereum/go-ethereum/blob/master/core/vm/)
- [Integer Overflow Security](https://github.com/ethereum/solidity/security/advisories) - Common overflow patterns
- [EVM Test Vectors](https://github.com/ethereum/tests) - Edge case test cases