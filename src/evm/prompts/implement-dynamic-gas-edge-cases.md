# Implement Dynamic Gas Edge Cases

You are implementing Dynamic Gas Edge Cases for the Tevm EVM written in Zig. Your goal is to implement dynamic gas pricing for edge case scenarios following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_dynamic_gas_edge_cases` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_dynamic_gas_edge_cases feat_implement_dynamic_gas_edge_cases`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement comprehensive handling of dynamic gas edge cases, particularly complex memory growth scenarios that can occur with irregular memory access patterns, large copy operations, and edge cases in gas calculation that can lead to integer overflow, underflow, or unexpected behavior.

## ELI5

Think of dynamic gas edge cases like the weird scenarios that can happen when you're driving and suddenly encounter something unexpected - like a road that suddenly turns into a toll road with astronomical fees, or a bridge that charges based on the weight of your car in a way that could bankrupt you.

In the EVM, gas costs usually follow predictable patterns, but there are edge cases where:

**Memory Growth Surprises**: 
- It's like renting office space where the first 100 square feet cost $1 each, but suddenly jumping to 10,000 square feet costs $1000 per square foot
- Contracts might accidentally trigger huge memory allocations by accessing memory at very high offsets

**Integer Math Problems**:
- Like a calculator that gives wrong answers when the numbers get too big
- Gas calculations can overflow (numbers get too large) or underflow (go negative when they shouldn't)

**Complex Copy Operations**:
- Imagine trying to photocopy a book, but the copy machine charges differently based on how far apart the pages are
- Copying data between memory locations can have unexpected gas costs

The enhanced version includes smart handling for:
- **Predictive Analysis**: Detecting when operations might cause gas surprises before they happen
- **Safe Math**: Preventing integer overflow/underflow in gas calculations
- **Memory Optimization**: Smart strategies for handling large memory operations efficiently
- **Cost Modeling**: Better prediction of gas costs for complex operations

This is crucial because improper handling could allow attacks where someone makes a transaction that appears cheap but actually consumes enormous amounts of gas, potentially disrupting the network.

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

#### 1. **Unit Tests** (`/test/evm/gas/dynamic_gas_edge_cases_test.zig`)
```zig
// Test basic dynamic gas edge case functionality
test "dynamic_gas_edge_cases basic edge scenario handling with known cases"
test "dynamic_gas_edge_cases handles overflow conditions correctly"
test "dynamic_gas_edge_cases validates boundary gas calculations"
test "dynamic_gas_edge_cases produces expected edge case results"
```

#### 2. **Integration Tests**
```zig
test "dynamic_gas_edge_cases integrates with EVM gas system"
test "dynamic_gas_edge_cases works with existing opcode gas calculations"
test "dynamic_gas_edge_cases maintains hardfork compatibility"
test "dynamic_gas_edge_cases handles complex gas interaction scenarios"
```

#### 3. **Performance Tests**
```zig
test "dynamic_gas_edge_cases meets edge case handling speed targets"
test "dynamic_gas_edge_cases overhead measurement vs baseline"
test "dynamic_gas_edge_cases scalability under edge case frequency"
test "dynamic_gas_edge_cases benchmark complex edge case scenarios"
```

#### 4. **Error Handling Tests**
```zig
test "dynamic_gas_edge_cases proper edge case error handling"
test "dynamic_gas_edge_cases handles gas calculation failures gracefully"
test "dynamic_gas_edge_cases graceful degradation on overflow detection"
test "dynamic_gas_edge_cases recovery from edge case system errors"
```

#### 5. **Compliance Tests**
```zig
test "dynamic_gas_edge_cases EVM specification edge case compliance"
test "dynamic_gas_edge_cases cross-client edge case behavior consistency"
test "dynamic_gas_edge_cases hardfork edge case rule adherence"
test "dynamic_gas_edge_cases deterministic edge case handling"
```

#### 6. **Security Tests**
```zig
test "dynamic_gas_edge_cases handles malicious edge case exploitation safely"
test "dynamic_gas_edge_cases prevents gas manipulation via edge cases"
test "dynamic_gas_edge_cases validates edge case DoS prevention"
test "dynamic_gas_edge_cases maintains gas isolation in edge scenarios"
```

### Test Development Priority
1. **Core edge case functionality tests** - Ensure basic edge case detection and handling works
2. **Compliance tests** - Meet EVM specification edge case requirements
3. **Performance tests** - Achieve edge case handling efficiency targets
4. **Security tests** - Prevent edge case exploitation vulnerabilities
5. **Error handling tests** - Robust edge case failure management
6. **Boundary tests** - Handle extreme edge case conditions

### Test Data Sources
- **EVM specification**: Official edge case handling requirements
- **Reference implementations**: Cross-client edge case compatibility data
- **Performance baselines**: Edge case detection and handling speed measurements
- **Security test vectors**: Edge case exploitation prevention cases
- **Real-world scenarios**: Production edge case occurrence validation

### Continuous Testing
- Run `zig build test-all` after every code change
- Maintain 100% test coverage for public edge case handling APIs
- Validate edge case handling accuracy regression prevention
- Test debug and release builds with different edge case scenarios
- Verify cross-platform edge case behavior consistency

### Test-First Examples

**Before writing any implementation:**
```zig
test "dynamic_gas_edge_cases basic overflow detection" {
    // This test MUST fail initially
    const gas_limit: u64 = std.math.maxInt(u64);
    const additional_cost: u64 = 1000;
    
    const result = dynamic_gas_edge_cases.checkGasOverflow(gas_limit, additional_cost);
    try testing.expectError(GasError.Overflow, result);
}
```

**Only then implement:**
```zig
pub const dynamic_gas_edge_cases = struct {
    pub fn checkGasOverflow(current: u64, additional: u64) !GasCheckResult {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Notes
- **Never commit without passing tests** (`zig build test-all`)
- **Test all edge case combinations** - Especially for mathematical overflow scenarios
- **Verify EVM specification compliance** - Critical for protocol edge case correctness
- **Test edge case performance implications** - Especially for detection overhead
- **Validate edge case security properties** - Prevent exploitation via edge conditions

## References

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf) - Formal specification
- [Go-Ethereum Edge Case Handling](https://github.com/ethereum/go-ethereum/blob/master/core/vm/)
- [Integer Overflow Security](https://github.com/ethereum/solidity/security/advisories) - Common overflow patterns
- [EVM Test Vectors](https://github.com/ethereum/tests) - Edge case test cases

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions.hpp">
```cpp
/// The size of the EVM 256-bit word.
constexpr auto word_size = 32;

/// Returns number of words what would fit to provided number of bytes,
/// i.e. it rounds up the number bytes to number of words.
constexpr int64_t num_words(uint64_t size_in_bytes) noexcept
{
    return static_cast<int64_t>((size_in_bytes + (word_size - 1)) / word_size);
}

/// Computes gas cost of copying the given amount of bytes to/from EVM memory.
constexpr int64_t copy_cost(uint64_t size_in_bytes) noexcept
{
    constexpr auto WordCopyCost = 3;
    return num_words(size_in_bytes) * WordCopyCost;
}

/// Grows EVM memory and checks its cost.
///
/// This function should not be inlined because this may affect other inlining decisions:
/// - making check_memory() too costly to inline,
/// - making mload()/mstore()/mstore8() too costly to inline.
///
/// TODO: This function should be moved to Memory class.
[[gnu::noinline]] inline int64_t grow_memory(
    int64_t gas_left, Memory& memory, uint64_t new_size) noexcept
{
    // This implementation recomputes memory.size(). This value is already known to the caller
    // and can be passed as a parameter, but this make no difference to the performance.

    const auto new_words = num_words(new_size);
    const auto current_words = static_cast<int64_t>(memory.size() / word_size);
    const auto new_cost = 3 * new_words + new_words * new_words / 512;
    const auto current_cost = 3 * current_words + current_words * current_words / 512;
    const auto cost = new_cost - current_cost;

    gas_left -= cost;
    if (gas_left >= 0) [[likely]]
        memory.grow(static_cast<size_t>(new_words * word_size));
    return gas_left;
}

/// Check memory requirements of a reasonable size.
inline bool check_memory(
    int64_t& gas_left, Memory& memory, const uint256& offset, uint64_t size) noexcept
{
    // TODO: This should be done in intx.
    // There is "branchless" variant of this using | instead of ||, but benchmarks difference
    // is within noise. This should be decided when moving the implementation to intx.
    if (((offset[3] | offset[2] | offset[1]) != 0) || (offset[0] > max_buffer_size))
        return false;

    const auto new_size = static_cast<uint64_t>(offset) + size;
    if (new_size > memory.size())
        gas_left = grow_memory(gas_left, memory, new_size);

    return gas_left >= 0;  // Always true for no-grow case.
}

/// Check memory requirements for "copy" instructions.
inline bool check_memory(
    int64_t& gas_left, Memory& memory, const uint256& offset, const uint256& size) noexcept
{
    if (size == 0)  // Copy of size 0 is always valid (even if offset is huge).
        return true;

    // This check has 3 same word checks with the check above.
    // However, compilers do decent although not perfect job unifying common instructions.
    // TODO: This should be done in intx.
    if (((size[3] | size[2] | size[1]) != 0) || (size[0] > max_buffer_size))
        return false;

    return check_memory(gas_left, memory, offset, static_cast<uint64_t>(size));
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_calls.cpp">
```cpp
constexpr int64_t MIN_RETAINED_GAS = 5000;
constexpr int64_t MIN_CALLEE_GAS = 2300;
constexpr int64_t CALL_VALUE_COST = 9000;
constexpr int64_t ACCOUNT_CREATION_COST = 25000;

template <Opcode Op>
Result call_impl(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    static_assert(
        Op == OP_CALL || Op == OP_CALLCODE || Op == OP_DELEGATECALL || Op == OP_STATICCALL);

    const auto gas = stack.pop();
    const auto dst = intx::be::trunc<evmc::address>(stack.pop());
    const auto value = (Op == OP_STATICCALL || Op == OP_DELEGATECALL) ? 0 : stack.pop();
    const auto has_value = value != 0;
    const auto input_offset_u256 = stack.pop();
    const auto input_size_u256 = stack.pop();
    const auto output_offset_u256 = stack.pop();
    const auto output_size_u256 = stack.pop();

    stack.push(0);  // Assume failure.
    state.return_data.clear();

    if (state.rev >= EVMC_BERLIN && state.host.access_account(dst) == EVMC_ACCESS_COLD)
    {
        if ((gas_left -= instr::additional_cold_account_access_cost) < 0)
            return {EVMC_OUT_OF_GAS, gas_left};
    }

    // ... (target address resolution logic omitted for brevity)

    if (!check_memory(gas_left, state.memory, input_offset_u256, input_size_u256))
        return {EVMC_OUT_OF_GAS, gas_left};

    if (!check_memory(gas_left, state.memory, output_offset_u256, output_size_u256))
        return {EVMC_OUT_OF_GAS, gas_left};

    // ... (message setup logic omitted for brevity)

    evmc_message msg{.kind = to_call_kind(Op)};
    msg.flags = (Op == OP_STATICCALL) ? uint32_t{EVMC_STATIC} : state.msg->flags;
    // ...
    msg.depth = state.msg->depth + 1;
    // ...
    msg.value =
        (Op == OP_DELEGATECALL) ? state.msg->value : intx::be::store<evmc::uint256be>(value);

    // ...

    auto cost = has_value ? CALL_VALUE_COST : 0;

    if constexpr (Op == OP_CALL)
    {
        if (has_value && state.in_static_mode())
            return {EVMC_STATIC_MODE_VIOLATION, gas_left};

        if ((has_value || state.rev < EVMC_SPURIOUS_DRAGON) && !state.host.account_exists(dst))
            cost += ACCOUNT_CREATION_COST;
    }

    if ((gas_left -= cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};

    msg.gas = std::numeric_limits<int64_t>::max();
    if (gas < msg.gas)
        msg.gas = static_cast<int64_t>(gas);

    if (state.rev >= EVMC_TANGERINE_WHISTLE)  // TODO: Always true for STATICCALL.
        msg.gas = std::min(msg.gas, gas_left - gas_left / 64);
    else if (msg.gas > gas_left)
        return {EVMC_OUT_OF_GAS, gas_left};

    if (has_value)
    {
        msg.gas += 2300;  // Add stipend.
        gas_left += 2300;
    }

    if (state.msg->depth >= 1024)
        return {EVMC_SUCCESS, gas_left};  // "Light" failure.

    if (has_value && intx::be::load<uint256>(state.host.get_balance(state.msg->recipient)) < value)
        return {EVMC_SUCCESS, gas_left};  // "Light" failure.

    const auto result = state.host.call(msg);
    state.return_data.assign(result.output_data, result.output_size);
    stack.top() = result.status_code == EVMC_SUCCESS;

    if (const auto copy_size = std::min(output_size, result.output_size); copy_size > 0)
        std::memcpy(&state.memory[output_offset], result.output_data, copy_size);

    const auto gas_used = msg.gas - result.gas_left;
    gas_left -= gas_used;
    state.gas_refund += result.gas_refund;
    return {EVMC_SUCCESS, gas_left};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions.hpp">
```cpp
inline Result mcopy(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    const auto& dst_u256 = stack.pop();
    const auto& src_u256 = stack.pop();
    const auto& size_u256 = stack.pop();

    if (!check_memory(gas_left, state.memory, std::max(dst_u256, src_u256), size_u256))
        return {EVMC_OUT_OF_GAS, gas_left};

    const auto dst = static_cast<size_t>(dst_u256);
    const auto src = static_cast<size_t>(src_u256);
    const auto size = static_cast<size_t>(size_u256);

    if (const auto cost = copy_cost(size); (gas_left -= cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};

    if (size > 0)
        std::memmove(&state.memory[dst], &state.memory[src], size);

    return {EVMC_SUCCESS, gas_left};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_execution.cpp">
```cpp
/// Checks instruction requirements before execution.
///
/// This checks:
/// - if the instruction is defined
/// - if stack height requirements are fulfilled (stack overflow, stack underflow)
/// - charges the instruction base gas cost and checks is there is any gas left.
///
/// @tparam         Op            Instruction opcode.
/// @param          cost_table    Table of base gas costs.
/// @param [in,out] gas_left      Gas left.
/// @param          stack_top     Pointer to the stack top item.
/// @param          stack_bottom  Pointer to the stack bottom.
///                               The stack height is stack_top - stack_bottom.
/// @return  Status code with information which check has failed
///          or EVMC_SUCCESS if everything is fine.
template <Opcode Op>
inline evmc_status_code check_requirements(const CostTable& cost_table, int64_t& gas_left,
    const uint256* stack_top, const uint256* stack_bottom) noexcept
{
    static_assert(
        !instr::has_const_gas_cost(Op) || instr::gas_costs[EVMC_FRONTIER][Op] != instr::undefined,
        "undefined instructions must not be handled by check_requirements()");

    auto gas_cost = instr::gas_costs[EVMC_FRONTIER][Op];  // Init assuming const cost.
    if constexpr (!instr::has_const_gas_cost(Op))
    {
        gas_cost = cost_table[Op];  // If not, load the cost from the table.

        // Negative cost marks an undefined instruction.
        // This check must be first to produce correct error code.
        if (INTX_UNLIKELY(gas_cost < 0))
            return EVMC_UNDEFINED_INSTRUCTION;
    }

    // Check stack requirements first. This is order is not required,
    // but it is nicer because complete gas check may need to inspect operands.
    if constexpr (instr::traits[Op].stack_height_change > 0)
    {
        static_assert(instr::traits[Op].stack_height_change == 1,
            "unexpected instruction with multiple results");
        if (INTX_UNLIKELY(stack_top == stack_bottom + StackSpace::limit))
            return EVMC_STACK_OVERFLOW;
    }
    if constexpr (instr::traits[Op].stack_height_required > 0)
    {
        // Check stack underflow using pointer comparison <= (better optimization).
        static constexpr auto min_offset = instr::traits[Op].stack_height_required - 1;
        if (INTX_UNLIKELY(stack_top <= stack_bottom + min_offset))
            return EVMC_STACK_UNDERFLOW;
    }

    if (INTX_UNLIKELY((gas_left -= gas_cost) < 0))
        return EVMC_OUT_OF_GAS;

    return EVMC_SUCCESS;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/unittests/evm_memory_test.cpp">
```cpp
struct memory_access_opcode
{
    Opcode opcode;
    int memory_index_arg;
    int memory_size_arg;
};


static constexpr memory_access_opcode memory_access_opcodes[] = {
    {OP_KECCAK256, 0, 1},
    {OP_CALLDATACOPY, 0, 2},
    {OP_CODECOPY, 0, 2},
    {OP_MLOAD, 0, -1},
    {OP_MSTORE, 0, -1},
    {OP_MSTORE8, 0, -1},
    {OP_MCOPY, 0, 2},
    {OP_MCOPY, 1, 2},
    {OP_DATACOPY, 0, 2},
    {OP_EXTCODECOPY, 1, 3},
    {OP_RETURNDATACOPY, 0, 2},
    {OP_LOG0, 0, 1},
    {OP_LOG1, 0, 1},
    {OP_LOG2, 0, 1},
    {OP_LOG3, 0, 1},
    {OP_LOG4, 0, 1},
    {OP_RETURN, 0, 1},
    {OP_REVERT, 0, 1},
    {OP_CALL, 3, 4},
    {OP_CALL, 5, 6},
    {OP_CALLCODE, 3, 4},
    {OP_CALLCODE, 5, 6},
    {OP_DELEGATECALL, 2, 3},
    {OP_DELEGATECALL, 4, 5},
    {OP_STATICCALL, 2, 3},
    {OP_STATICCALL, 4, 5},
    {OP_CREATE, 1, 2},
    {OP_CREATE2, 1, 2},
};

struct
{
    uint256 index;
    uint256 size;
} static constexpr memory_access_test_cases[] = {
    {0, 0x100000000},
    {0, 0x10000000000000000_u256},
    {0, 0x100000000000000000000000000000000_u256},
    {0, 0x1000000000000000000000000000000000000000000000000_u256},
    {0, 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_u256},
    {0x80000000, 0x80000000},
    {0xffffffe0, 32},
    {0xffffffff, 1},
    {0x100000000, 0},
    {0x100000000, 1},
    {0x100000000, 0x100000000},
    {0xffffffffffffffc1, 32},
    {0xffffffffffffffc0, 32},
    {0xffffffffffffffdf, 32},
    {0xffffffffffffffe0, 32},
    {0xffffffffffffffff, 1},
    {0x80000000000000000000000000000000_u256, 1},
    {0x800000000000000000000000000000000000000000000000_u256, 1},
    {0x8000000000000000000000000000000000000000000000000000000000000000_u256, 1},
    {0x8000000000000000800000000000000080000000000000000000000000000000_u256, 1},
    {0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_u256, 1},
    {0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_u256,
        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_u256},
};
```
</file>
</evmone>

## Prompt Corrections
The original prompt provides a well-structured plan for implementing robust handling of dynamic gas edge cases. The `evmone` codebase offers excellent, battle-tested patterns for these scenarios.

One minor improvement to the proposed `safe_gas_calculator.zig` would be to adopt `evmone`'s more direct approach for calculating memory expansion costs.

Instead of calculating the total cost for the old size and new size and then subtracting them, `evmone` calculates the expansion cost directly in its `grow_memory` function. This avoids one of a potentially expensive quadratic calculation.

### `evmone` Direct Expansion Cost Calculation

This C++ snippet from `evmone/lib/evmone/instructions.hpp` shows how the cost is calculated based on the difference between the new and old memory sizes in words.

```cpp
[[gnu::noinline]] inline int64_t grow_memory(
    int64_t gas_left, Memory& memory, uint64_t new_size) noexcept
{
    // ...
    const auto new_words = num_words(new_size);
    const auto current_words = static_cast<int64_t>(memory.size() / word_size);

    // Calculate cost based on the quadratic formula for new and old sizes
    const auto new_cost = 3 * new_words + new_words * new_words / 512;
    const auto current_cost = 3 * current_words + current_words * current_words / 512;
    
    // The expansion cost is the difference
    const auto cost = new_cost - current_cost;

    gas_left -= cost;
    if (gas_left >= 0) [[likely]]
        memory.grow(static_cast<size_t>(new_words * word_size));
    return gas_left;
}
```

This approach is slightly more efficient as it combines the check and cost calculation, which could be reflected in the proposed `calculate_memory_expansion_gas_safe` function in Zig. The prompt's current approach is functionally correct but could be optimized.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas/calc.rs">
```rust
//! EVM gas calculation utilities.

/// `SSTORE` opcode refund calculation.
#[allow(clippy::collapsible_else_if)]
#[inline]
pub fn sstore_refund(spec_id: SpecId, vals: &SStoreResult) -> i64 {
    if spec_id.is_enabled_in(SpecId::ISTANBUL) {
        // EIP-3529: Reduction in refunds
        let sstore_clears_schedule = if spec_id.is_enabled_in(SpecId::LONDON) {
            (SSTORE_RESET - COLD_SLOAD_COST + ACCESS_LIST_STORAGE_KEY) as i64
        } else {
            REFUND_SSTORE_CLEARS
        };
        if vals.is_new_eq_present() {
            0
        } else {
            if vals.is_original_eq_present() && vals.is_new_zero() {
                sstore_clears_schedule
            } else {
                let mut refund = 0;

                if !vals.is_original_zero() {
                    if vals.is_present_zero() {
                        refund -= sstore_clears_schedule;
                    } else if vals.is_new_zero() {
                        refund += sstore_clears_schedule;
                    }
                }

                if vals.is_original_eq_new() {
                    let (gas_sstore_reset, gas_sload) = if spec_id.is_enabled_in(SpecId::BERLIN) {
                        (SSTORE_RESET - COLD_SLOAD_COST, WARM_STORAGE_READ_COST)
                    } else {
                        (SSTORE_RESET, sload_cost(spec_id, false))
                    };
                    if vals.is_original_zero() {
                        refund += (SSTORE_SET - gas_sload) as i64;
                    } else {
                        refund += (gas_sstore_reset - gas_sload) as i64;
                    }
                }

                refund
            }
        }
    } else {
        if !vals.is_present_zero() && vals.is_new_zero() {
            REFUND_SSTORE_CLEARS
        } else {
            0
        }
    }
}

/// `SSTORE` opcode cost calculation.
#[inline]
pub fn sstore_cost(spec_id: SpecId, vals: &SStoreResult, is_cold: bool) -> u64 {
    if spec_id.is_enabled_in(SpecId::BERLIN) {
        // Berlin specification logic
        let mut gas_cost = istanbul_sstore_cost::<WARM_STORAGE_READ_COST, WARM_SSTORE_RESET>(vals);

        if is_cold {
            gas_cost += COLD_SLOAD_COST;
        }
        gas_cost
    } else if spec_id.is_enabled_in(SpecId::ISTANBUL) {
        // Istanbul logic
        istanbul_sstore_cost::<ISTANBUL_SLOAD_GAS, SSTORE_RESET>(vals)
    } else {
        // Frontier logic
        frontier_sstore_cost(vals)
    }
}

/// EIP-2200: Structured Definitions for Net Gas Metering
#[inline]
fn istanbul_sstore_cost<const SLOAD_GAS: u64, const SSTORE_RESET_GAS: u64>(
    vals: &SStoreResult,
) -> u64 {
    if vals.is_new_eq_present() {
        SLOAD_GAS
    } else if vals.is_original_eq_present() && vals.is_original_zero() {
        SSTORE_SET
    } else if vals.is_original_eq_present() {
        SSTORE_RESET_GAS
    } else {
        SLOAD_GAS
    }
}

/// Calculate call gas cost for the call instruction.
///
/// There is three types of gas.
/// * Account access gas. after berlin it can be cold or warm.
/// * Transfer value gas. If value is transferred and balance of target account is updated.
/// * If account is not existing and needs to be created. After Spurious dragon
///   this is only accounted if value is transferred.
#[inline]
pub const fn call_cost(
    spec_id: SpecId,
    transfers_value: bool,
    account_load: StateLoad<AccountLoad>,
) -> u64 {
    let is_empty = account_load.data.is_empty;
    // Account access.
    let mut gas = if spec_id.is_enabled_in(SpecId::BERLIN) {
        warm_cold_cost_with_delegation(account_load)
    } else if spec_id.is_enabled_in(SpecId::TANGERINE) {
        // EIP-150: Gas cost changes for IO-heavy operations
        700
    } else {
        40
    };

    // Transfer value cost
    if transfers_value {
        gas += CALLVALUE;
    }

    // New account cost
    if is_empty {
        // EIP-161: State trie clearing (invariant-preserving alternative)
        if spec_id.is_enabled_in(SpecId::SPURIOUS_DRAGON) {
            // Account only if there is value transferred.
            if transfers_value {
                gas += NEWACCOUNT;
            }
        } else {
            gas += NEWACCOUNT;
        }
    }

    gas
}

/// Memory expansion cost calculation for a given number of words.
#[inline]
pub const fn memory_gas(num_words: usize) -> u64 {
    let num_words = num_words as u64;
    MEMORY
        .saturating_mul(num_words)
        .saturating_add(num_words.saturating_mul(num_words) / 512)
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas.rs">
```rust
//! EVM gas calculation utilities.

/// Represents the state of gas during execution.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Gas {
    /// The initial gas limit. This is constant throughout execution.
    limit: u64,
    /// The remaining gas.
    remaining: u64,
    /// Refunded gas. This is used only at the end of execution.
    refunded: i64,
    /// Memoisation of values for memory expansion cost.
    memory: MemoryGas,
}

impl Gas {
    /// Creates a new `Gas` struct with the given gas limit.
    #[inline]
    pub const fn new(limit: u64) -> Self {
        Self {
            limit,
            remaining: limit,
            refunded: 0,
            memory: MemoryGas::new(),
        }
    }

    /// Records an explicit cost.
    ///
    /// Returns `false` if the gas limit is exceeded.
    #[inline]
    #[must_use = "prefer using `gas!` instead to return an out-of-gas error on failure"]
    pub fn record_cost(&mut self, cost: u64) -> bool {
        if let Some(new_remaining) = self.remaining.checked_sub(cost) {
            self.remaining = new_remaining;
            return true;
        }
        false
    }

    /// Record memory expansion
    #[inline]
    #[must_use = "internally uses record_cost that flags out of gas error"]
    pub fn record_memory_expansion(&mut self, new_len: usize) -> MemoryExtensionResult {
        let Some(additional_cost) = self.memory.record_new_len(new_len) else {
            return MemoryExtensionResult::Same;
        };

        if !self.record_cost(additional_cost) {
            return MemoryExtensionResult::OutOfGas;
        }

        MemoryExtensionResult::Extended
    }
}

/// Utility struct that speeds up calculation of memory expansion
/// It contains the current memory length and its memory expansion cost.
///
/// It allows us to split gas accounting from memory structure.
#[derive(Clone, Copy, Default, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct MemoryGas {
    /// Current memory length
    pub words_num: usize,
    /// Current memory expansion cost
    pub expansion_cost: u64,
}

impl MemoryGas {
    #[inline]
    pub fn record_new_len(&mut self, new_num: usize) -> Option<u64> {
        if new_num <= self.words_num {
            return None;
        }
        self.words_num = new_num;
        let mut cost = crate::gas::calc::memory_gas(new_num);
        core::mem::swap(&mut self.expansion_cost, &mut cost);
        // Safe to subtract because we know that new_len > length
        // Notice the swap above.
        Some(self.expansion_cost - cost)
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/macros.rs">
```rust
//! Utility macros to help implementing opcode instruction functions.

/// Records a `gas` cost and fails the instruction if it would exceed the available gas.
#[macro_export]
macro_rules! gas {
    ($interpreter:expr, $gas:expr) => {
        $crate::gas!($interpreter, $gas, ())
    };
    ($interpreter:expr, $gas:expr, $ret:expr) => {
        if !$interpreter.control.gas_mut().record_cost($gas) {
            $interpreter
                .control
                .set_instruction_result($crate::InstructionResult::OutOfGas);
            return $ret;
        }
    };
}

/// Resizes the interpreterreter memory if necessary. Fails the instruction if the memory or gas limit
/// is exceeded.
#[macro_export]
macro_rules! resize_memory {
    ($interpreter:expr, $offset:expr, $len:expr) => {
        $crate::resize_memory!($interpreter, $offset, $len, ())
    };
    ($interpreter:expr, $offset:expr, $len:expr, $ret:expr) => {
        let words_num = $crate::interpreter::num_words($offset.saturating_add($len));
        match $interpreter
            .control
            .gas_mut()
            .record_memory_expansion(words_num)
        {
            $crate::gas::MemoryExtensionResult::Extended => {
                $interpreter.memory.resize(words_num * 32);
            }
            $crate::gas::MemoryExtensionResult::OutOfGas => {
                $interpreter
                    .control
                    .set_instruction_result($crate::InstructionResult::MemoryOOG);
                return $ret;
            }
            $crate::gas::MemoryExtensionResult::Same => (), // no action
        };
    };
}

/// Converts a `U256` value to a `usize`, failing the instruction if the value is too large.
#[macro_export]
macro_rules! as_usize_or_fail {
    ($interpreter:expr, $v:expr) => {
        $crate::as_usize_or_fail_ret!($interpreter, $v, ())
    };
    ($interpreter:expr, $v:expr, $reason:expr) => {
        $crate::as_usize_or_fail_ret!($interpreter, $v, $reason, ())
    };
}

/// Converts a `U256` value to a `usize` and returns `ret`,
/// failing the instruction if the value is too large.
#[macro_export]
macro_rules! as_usize_or_fail_ret {
    ($interpreter:expr, $v:expr, $ret:expr) => {
        $crate::as_usize_or_fail_ret!(
            $interpreter,
            $v,
            $crate::InstructionResult::InvalidOperandOOG,
            $ret
        )
    };

    ($interpreter:expr, $v:expr, $reason:expr, $ret:expr) => {
        match $v.as_limbs() {
            x => {
                if (x[0] > usize::MAX as u64) | (x[1] != 0) | (x[2] != 0) | (x[3] != 0) {
                    $interpreter.control.set_instruction_result($reason);
                    return $ret;
                }
                x[0] as usize
            }
        }
    };
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/memory.rs">
```rust
use crate::{
    gas,
    interpreter_types::{InterpreterTypes, LoopControl, MemoryTr, RuntimeFlag, StackTr},
};
use core::cmp::max;
use primitives::U256;

use crate::InstructionContext;

pub fn mload<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([], top, context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, top);
    resize_memory!(context.interpreter, offset, 32);
    *top =
        U256::try_from_be_slice(context.interpreter.memory.slice_len(offset, 32).as_ref()).unwrap()
}

pub fn mstore<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn!([offset, value], context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, offset);
    resize_memory!(context.interpreter, offset, 32);
    context
        .interpreter
        .memory
        .set(offset, &value.to_be_bytes::<32>());
}

pub fn mstore8<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn!([offset, value], context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, offset);
    resize_memory!(context.interpreter, offset, 1);
    context.interpreter.memory.set(offset, &[value.byte(0)]);
}


// EIP-5656: MCOPY - Memory copying instruction
pub fn mcopy<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CANCUN);
    popn!([dst, src, len], context.interpreter);

    // Into usize or fail
    let len = as_usize_or_fail!(context.interpreter, len);
    // Deduce gas
    gas_or_fail!(context.interpreter, gas::copy_cost_verylow(len));
    if len == 0 {
        return;
    }

    let dst = as_usize_or_fail!(context.interpreter, dst);
    let src = as_usize_or_fail!(context.interpreter, src);
    // Resize memory
    resize_memory!(context.interpreter, max(dst, src), len);
    // Copy memory in place
    context.interpreter.memory.copy(dst, src, len);
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/contract/call_helpers.rs">
```rust
use crate::{
    gas::{self, CALL_STIPEND},
    interpreter::Interpreter,
    interpreter_types::{InterpreterTypes, LoopControl, MemoryTr, RuntimeFlag, StackTr},
};
use context_interface::{context::StateLoad, journaled_state::AccountLoad};
use core::{cmp::min, ops::Range};
use primitives::{hardfork::SpecId::*, U256};

/// Resize memory and return range of memory.
/// If `len` is 0 dont touch memory and return `usize::MAX` as offset and 0 as length.
#[inline]
pub fn resize_memory(
    interpreter: &mut Interpreter<impl InterpreterTypes>,
    offset: U256,
    len: U256,
) -> Option<Range<usize>> {
    let len = as_usize_or_fail_ret!(interpreter, len, None);
    let offset = if len != 0 {
        let offset = as_usize_or_fail_ret!(interpreter, offset, None);
        resize_memory!(interpreter, offset, len, None);
        offset
    } else {
        usize::MAX //unrealistic value so we are sure it is not used
    };
    Some(offset..offset + len)
}

#[inline]
pub fn calc_call_gas(
    interpreter: &mut Interpreter<impl InterpreterTypes>,
    account_load: StateLoad<AccountLoad>,
    has_transfer: bool,
    local_gas_limit: u64,
) -> Option<u64> {
    let call_cost = gas::call_cost(
        interpreter.runtime_flag.spec_id(),
        has_transfer,
        account_load,
    );
    gas!(interpreter, call_cost, None);

    // EIP-150: Gas cost changes for IO-heavy operations
    let gas_limit = if interpreter.runtime_flag.spec_id().is_enabled_in(TANGERINE) {
        // Take l64 part of gas_limit
        min(
            interpreter.control.gas().remaining_63_of_64_parts(),
            local_gas_limit,
        )
    } else {
        local_gas_limit
    };

    Some(gas_limit)
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/contract.rs">
```rust
// ... imports ...
use crate::InstructionContext;

// ... other functions ...

pub fn call<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn!([local_gas_limit, to, value], context.interpreter);
    let to = to.into_address();
    // Max gas limit is not possible in real ethereum situation.
    let local_gas_limit = u64::try_from(local_gas_limit).unwrap_or(u64::MAX);

    let has_transfer = !value.is_zero();
    if context.interpreter.runtime_flag.is_static() && has_transfer {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::CallNotAllowedInsideStatic);
        return;
    }

    let Some((input, return_memory_offset)) = get_memory_input_and_out_ranges(context.interpreter)
    else {
        return;
    };

    let Some(account_load) = context.host.load_account_delegated(to) else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };

    let Some(mut gas_limit) = calc_call_gas(
        context.interpreter,
        account_load,
        has_transfer,
        local_gas_limit,
    ) else {
        return;
    };

    gas!(context.interpreter, gas_limit);

    // Add call stipend if there is value to be transferred.
    if has_transfer {
        gas_limit = gas_limit.saturating_add(gas::CALL_STIPEND);
    }

    // Call host to interact with target contract
    context.interpreter.control.set_next_action(
        InterpreterAction::NewFrame(FrameInput::Call(Box::new(CallInputs {
            input: CallInput::SharedBuffer(input),
            gas_limit,
            target_address: to,
            caller: context.interpreter.input.target_address(),
            bytecode_address: to,
            value: CallValue::Transfer(value),
            scheme: CallScheme::Call,
            is_static: context.interpreter.runtime_flag.is_static(),
            is_eof: false,
            return_memory_offset,
        }))),
        InstructionResult::CallOrCreate,
    );
}

// ... other call-like functions ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instruction_result.rs">
```rust
#[repr(u8)]
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum InstructionResult {
    // Success Codes
    #[default]
    /// Execution should continue to the next one.
    Continue = 0x00,
    /// Encountered a `STOP` opcode
    Stop,
    /// Return from the current call.
    Return,
    /// Self-destruct the current contract.
    SelfDestruct,
    /// Return a contract (used in contract creation).
    ReturnContract,

    // Revert Codes
    /// Revert the transaction.
    Revert = 0x10,
    /// Exceeded maximum call depth.
    CallTooDeep,
    /// Insufficient funds for transfer.
    OutOfFunds,
    // ... more revert codes

    // Action Codes
    /// Indicates a call or contract creation.
    CallOrCreate = 0x20,

    // Error Codes
    /// Out of gas error.
    OutOfGas = 0x50,
    /// Out of gas error encountered during memory expansion.
    MemoryOOG,
    /// The memory limit of the EVM has been exceeded.
    MemoryLimitOOG,
    /// Out of gas error encountered during the execution of a precompiled contract.
    PrecompileOOG,
    /// Out of gas error encountered while calling an invalid operand.
    InvalidOperandOOG,
    // ... more error codes
    /// Unknown or invalid opcode.
    OpcodeNotFound,
    /// Invalid `CALL` with value transfer in static context.
    CallNotAllowedInsideStatic,
    /// Invalid state modification in static call.
    StateChangeDuringStaticCall,
    /// An undefined bytecode value encountered during execution.
    InvalidFEOpcode,
    /// Invalid jump destination. Dynamic jumps points to invalid not jumpdest opcode.
    InvalidJump,
    /// The feature or opcode is not activated in this version of the EVM.
    NotActivated,
    /// Attempting to pop a value from an empty stack.
    StackUnderflow,
    /// Attempting to push a value onto a full stack.
    StackOverflow,
    /// Invalid memory or storage offset.
    OutOfOffset,
    /// Address collision during contract creation.
    CreateCollision,
    /// Payment amount overflow.
    OverflowPayment,
    /// Error in precompiled contract execution.
    PrecompileError,
    /// Nonce overflow.
    NonceOverflow,
    /// Exceeded contract size limit during creation.
    CreateContractSizeLimit,
    /// Created contract starts with invalid bytes (`0xEF`).
    CreateContractStartingWithEF,
    /// Exceeded init code size limit (EIP-3860:  Limit and meter initcode).
    CreateInitCodeSizeLimit,
    /// Fatal external error. Returned by database.
    FatalExternalError,
    // ... EOF-related errors
}
```
</file>
</revm>
## Prompt Corrections
The original prompt provides a good structure for implementing dynamic gas handling, but there are a few areas where `revm`'s design offers improvements or different approaches:

1.  **`EdgeCaseDetector` Abstraction**: The prompt suggests a dedicated `EdgeCaseDetector` struct. While this is a valid design, `revm` integrates these checks more directly into the instruction implementations and helper macros (`gas!`, `resize_memory!`, `as_usize_or_fail!`). This in-place validation is likely more performant as it avoids extra function call overhead and can be better optimized by the compiler. Instead of a separate detector, consider implementing these checks as inlined helper functions or macros within your EVM core loop.

2.  **Safe Gas Calculation**: The prompt outlines a `SafeGasCalculator` module. In `revm`, this logic is distributed:
    *   The core gas consumption logic is in the `Gas` struct (`record_cost`, `record_memory_expansion`).
    *   Specific gas *formulas* are in the `revm/crates/interpreter/src/gas/calc.rs` file (`memory_gas`, `call_cost`, etc.).
    *   Opcode implementations use the `gas!` macro for consumption.
    This separation of concerns is very effective. The `Gas` struct manages the state (remaining, spent), while `calc.rs` provides the pure calculation logic. This is a robust pattern to follow.

3.  **Error Handling**: The prompt uses a simple `EdgeCaseResult` enum. `revm` uses a more comprehensive `InstructionResult` enum which covers all possible EVM halt conditions (not just edge cases). This provides a single, unified way to handle all execution outcomes, from normal `STOP` to `OutOfGas` or `InvalidJump`. Adopting a similar unified result enum is highly recommended for clarity and spec-compliance.

4.  **`calculate_call_gas_safe` Logic**: The prompt's example for call gas calculation is simplified. The `revm` implementation (`calc_call_gas` in `call_helpers.rs`) is more complete, as it also accounts for:
    *   The cost of a value transfer (`CallValueCost`).
    *   The cost of creating a new account if the target doesn't exist (`NewAccountCost`).
    *   The cost of a "cold" account access vs. a "warm" one (EIP-2929).
    The provided `revm` snippet for `calc_call_gas` is a better reference for a spec-compliant implementation.

5.  **`MCOPY` Overlap**: The prompt correctly identifies overlapping memory in `MCOPY` as an edge case. The `revm` implementation in `instructions/memory.rs` delegates this to Rust's `copy_within`, which correctly handles overlapping regions. In a language without this built-in safe primitive, you would need to implement a check similar to `if dst > src ... copy_backwards else ... copy_forwards`.



## EXECUTION-SPECS Context

An excellent and detailed prompt. Here are the most relevant code snippets from `execution-specs` to guide the implementation of dynamic gas edge cases, focusing on the underlying logic for memory expansion, call gas calculations, and overflow protection.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/gas.py">
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
from ethereum.utils.numeric import ceil32, taylor_exponential

from ..blocks import Header
from ..transactions import BlobTransaction, Transaction
from . import Evm
from .exceptions import OutOfGasError

# ... (other gas constants)

GAS_MEMORY = Uint(3)
GAS_KECCAK256 = Uint(30)
GAS_KECCAK256_WORD = Uint(6)
GAS_COPY = Uint(3)

# ... (other gas constants)

@dataclass
class ExtendMemory:
    """
    Define the parameters for memory extension in opcodes

    `cost`: `ethereum.base_types.Uint`
        The gas required to perform the extension
    `expand_by`: `ethereum.base_types.Uint`
        The size by which the memory will be extended
    """

    cost: Uint
    expand_by: Uint


@dataclass
class MessageCallGas:
    """
    Define the gas cost and gas given to the sub-call for
    executing the call opcodes.

    `cost`: `ethereum.base_types.Uint`
        The gas required to execute the call opcode, excludes
        memory expansion costs.
    `sub_call`: `ethereum.base_types.Uint`
        The portion of gas available to sub-calls that is refundable
        if not consumed.
    """

    cost: Uint
    sub_call: Uint


def charge_gas(evm: Evm, amount: Uint) -> None:
    """
    Subtracts `amount` from `evm.gas_left`.

    Parameters
    ----------
    evm :
        The current EVM.
    amount :
        The amount of gas the current operation requires.

    """
    evm_trace(evm, GasAndRefund(int(amount)))

    if evm.gas_left < amount:
        raise OutOfGasError
    else:
        evm.gas_left -= amount


def calculate_memory_gas_cost(size_in_bytes: Uint) -> Uint:
    """
    Calculates the gas cost for allocating memory
    to the smallest multiple of 32 bytes,
    such that the allocated size is at least as big as the given size.

    Parameters
    ----------
    size_in_bytes :
        The size of the data in bytes.

    Returns
    -------
    total_gas_cost : `ethereum.base_types.Uint`
        The gas cost for storing data in memory.
    """
    size_in_words = ceil32(size_in_bytes) // Uint(32)
    linear_cost = size_in_words * GAS_MEMORY
    quadratic_cost = size_in_words**Uint(2) // Uint(512)
    total_gas_cost = linear_cost + quadratic_cost
    try:
        return total_gas_cost
    except ValueError:
        raise OutOfGasError


def calculate_gas_extend_memory(
    memory: bytearray, extensions: List[Tuple[U256, U256]]
) -> ExtendMemory:
    """
    Calculates the gas amount to extend memory

    Parameters
    ----------
    memory :
        Memory contents of the EVM.
    extensions:
        List of extensions to be made to the memory.
        Consists of a tuple of start position and size.

    Returns
    -------
    extend_memory: `ExtendMemory`
    """
    size_to_extend = Uint(0)
    to_be_paid = Uint(0)
    current_size = Uint(len(memory))
    for start_position, size in extensions:
        if size == 0:
            continue
        before_size = ceil32(current_size)
        after_size = ceil32(Uint(start_position) + Uint(size))
        if after_size <= before_size:
            continue

        size_to_extend += after_size - before_size
        already_paid = calculate_memory_gas_cost(before_size)
        total_cost = calculate_memory_gas_cost(after_size)
        to_be_paid += total_cost - already_paid

        current_size = after_size

    return ExtendMemory(to_be_paid, size_to_extend)


def calculate_message_call_gas(
    value: U256,
    gas: Uint,
    gas_left: Uint,
    memory_cost: Uint,
    extra_gas: Uint,
    call_stipend: Uint = GAS_CALL_STIPEND,
) -> MessageCallGas:
    """
    Calculates the MessageCallGas (cost and gas made available to the sub-call)
    for executing call Opcodes.

    Parameters
    ----------
    value:
        The amount of `ETH` that needs to be transferred.
    gas :
        The amount of gas provided to the message-call.
    gas_left :
        The amount of gas left in the current frame.
    memory_cost :
        The amount needed to extend the memory in the current frame.
    extra_gas :
        The amount of gas needed for transferring value + creating a new
        account inside a message call.
    call_stipend :
        The amount of stipend provided to a message call to execute code while
        transferring value(ETH).

    Returns
    -------
    message_call_gas: `MessageCallGas`
    """
    call_stipend = Uint(0) if value == 0 else call_stipend
    if gas_left < extra_gas + memory_cost:
        return MessageCallGas(gas + extra_gas, gas + call_stipend)

    gas = min(gas, max_message_call_gas(gas_left - memory_cost - extra_gas))

    return MessageCallGas(gas + extra_gas, gas + call_stipend)


def max_message_call_gas(gas: Uint) -> Uint:
    """
    Calculates the maximum gas that is allowed for making a message call

    Parameters
    ----------
    gas :
        The amount of gas provided to the message-call.

    Returns
    -------
    max_allowed_message_call_gas: `ethereum.base_types.Uint`
        The maximum gas allowed for making the message-call.
    """
    return gas - (gas // Uint(64))
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/system.py">
```python
def generic_call(
    evm: Evm,
    gas: Uint,
    value: U256,
    caller: Address,
    to: Address,
    code_address: Address,
    should_transfer_value: bool,
    is_staticcall: bool,
    memory_input_start_position: U256,
    memory_input_size: U256,
    memory_output_start_position: U256,
    memory_output_size: U256,
) -> None:
    """
    Perform the core logic of the `CALL*` family of opcodes.
    """
    from ...vm.interpreter import STACK_DEPTH_LIMIT, process_message

    evm.return_data = b""

    if evm.message.depth + Uint(1) > STACK_DEPTH_LIMIT:
        evm.gas_left += gas
        push(evm.stack, U256(0))
        return

    call_data = memory_read_bytes(
        evm.memory, memory_input_start_position, memory_input_size
    )
    code = get_account(evm.message.block_env.state, code_address).code
    child_message = Message(
        block_env=evm.message.block_env,
        tx_env=evm.message.tx_env,
        caller=caller,
        target=to,
        gas=gas,
        value=value,
        data=call_data,
        code=code,
        current_target=to,
        depth=evm.message.depth + Uint(1),
        code_address=code_address,
        should_transfer_value=should_transfer_value,
        is_static=True if is_staticcall else evm.message.is_static,
        accessed_addresses=evm.accessed_addresses.copy(),
        accessed_storage_keys=evm.accessed_storage_keys.copy(),
        parent_evm=evm,
    )
    child_evm = process_message(child_message)

    if child_evm.error:
        incorporate_child_on_error(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(0))
    else:
        incorporate_child_on_success(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(1))

    actual_output_size = min(memory_output_size, U256(len(child_evm.output)))
    memory_write(
        evm.memory,
        memory_output_start_position,
        child_evm.output[:actual_output_size],
    )


def call(evm: Evm) -> None:
    """
    Message-call into an account.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    # STACK
    gas = Uint(pop(evm.stack))
    to = to_address(pop(evm.stack))
    value = pop(evm.stack)
    memory_input_start_position = pop(evm.stack)
    memory_input_size = pop(evm.stack)
    memory_output_start_position = pop(evm.stack)
    memory_output_size = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory,
        [
            (memory_input_start_position, memory_input_size),
            (memory_output_start_position, memory_output_size),
        ],
    )

    if to in evm.accessed_addresses:
        access_gas_cost = GAS_WARM_ACCESS
    else:
        evm.accessed_addresses.add(to)
        access_gas_cost = GAS_COLD_ACCOUNT_ACCESS

    code_address = to

    create_gas_cost = (
        Uint(0)
        if is_account_alive(evm.message.block_env.state, to) or value == 0
        else GAS_NEW_ACCOUNT
    )
    transfer_gas_cost = Uint(0) if value == 0 else GAS_CALL_VALUE
    message_call_gas = calculate_message_call_gas(
        value,
        gas,
        Uint(evm.gas_left),
        extend_memory.cost,
        access_gas_cost + create_gas_cost + transfer_gas_cost,
    )
    charge_gas(evm, message_call_gas.cost + extend_memory.cost)
    if evm.message.is_static and value != U256(0):
        raise WriteInStaticContext
    evm.memory += b"\x00" * extend_memory.expand_by
    sender_balance = get_account(
        evm.message.block_env.state, evm.message.current_target
    ).balance
    if sender_balance < value:
        push(evm.stack, U256(0))
        evm.return_data = b""
        evm.gas_left += message_call_gas.sub_call
    else:
        generic_call(
            evm,
            message_call_gas.sub_call,
            value,
            evm.message.current_target,
            to,
            code_address,
            True,
            False,
            memory_input_start_position,
            memory_input_size,
            memory_output_start_position,
            memory_output_size,
        )

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/memory.py">
```python
"""
Ethereum Virtual Machine (EVM) Memory Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM Memory instructions.
"""
from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256, Uint

from .. import Evm
from ..gas import (
    GAS_BASE,
    GAS_COPY,
    GAS_VERY_LOW,
    calculate_gas_extend_memory,
    charge_gas,
)
from ..memory import memory_read_bytes, memory_write
from ..stack import pop, push


def mstore(evm: Evm) -> None:
    # ...
    # STACK
    start_position = pop(evm.stack)
    value = pop(evm.stack).to_be_bytes32()

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(len(value)))]
    )

    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    memory_write(evm.memory, start_position, value)
    # ...

def mload(evm: Evm) -> None:
    # ...
    # STACK
    start_position = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(32))]
    )
    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    value = U256.from_be_bytes(
        memory_read_bytes(evm.memory, start_position, U256(32))
    )
    push(evm.stack, value)
    # ...

def mcopy(evm: Evm) -> None:
    """
    Copy the bytes in memory from one location to another.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    destination = pop(evm.stack)
    source = pop(evm.stack)
    length = pop(evm.stack)

    # GAS
    words = ceil32(Uint(length)) // Uint(32)
    copy_gas_cost = GAS_COPY * words

    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(source, length), (destination, length)]
    )
    charge_gas(evm, GAS_VERY_LOW + copy_gas_cost + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    value = memory_read_bytes(evm.memory, source, length)
    memory_write(evm.memory, destination, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/interpreter.py">
```python
def process_create_message(message: Message) -> Evm:
    """
    Executes a call to create a smart contract.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: :py:class:`~ethereum.shanghai.vm.Evm`
        Items containing execution specific objects.
    """
    # ... (snapshot logic) ...

    # If the address where the account is being created has storage, it is
    # destroyed. This can only happen in the following highly unlikely
    # circumstances:
    # * The address created by a `CREATE` call collides with a subsequent
    #   `CREATE` or `CREATE2` call.
    # * The first `CREATE` happened before Spurious Dragon and left empty
    #   code.
    destroy_storage(state, message.current_target)

    # In the previously mentioned edge case the preexisting storage is ignored
    # for gas refund purposes. In order to do this we must track created
    # accounts.
    mark_account_created(state, message.current_target)

    increment_nonce(state, message.current_target)
    evm = process_message(message)
    if not evm.error:
        contract_code = evm.output
        contract_code_gas = Uint(len(contract_code)) * GAS_CODE_DEPOSIT
        try:
            if len(contract_code) > 0:
                if contract_code[0] == 0xEF:
                    raise InvalidContractPrefix
            charge_gas(evm, contract_code_gas)
            if len(contract_code) > MAX_CODE_SIZE:
                raise OutOfGasError
        except ExceptionalHalt as error:
            rollback_transaction(state)
            evm.gas_left = Uint(0)
            evm.output = b""
            evm.error = error
        else:
            set_code(state, message.current_target, contract_code)
            commit_transaction(state)
    else:
        rollback_transaction(state)
    return evm
```
</file>
</execution-specs>

## Prompt Corrections
The provided prompt is very well-structured. Here are a few minor clarifications based on the `execution-specs` that might be helpful:

1.  **Integer Overflow Handling**: The prompt suggests using Zig's `catch` for overflow. In the Python `execution-specs`, overflow is handled implicitly by using arbitrary-precision integers (`Uint`, `U256`). When implementing in Zig, the goal is to replicate the behavior of these unbounded integers safely. For gas calculations, which must fit in a `u64`, this means checking for overflow before performing additions or multiplications, as suggested. For stack values (`U256`), Zig's `u256` type already provides the correct wrapping arithmetic.

2.  **`KECCAK256` vs `SHA3`**: In some parts of the specs and tests, the `KECCAK256` opcode (0x20) is referred to as `SHA3`. The implementation should map opcode `0x20` to the Keccak-256 hashing function. The provided Zig code correctly uses `KECCAK256`.

3.  **Memory Expansion Cost**: The prompt's `calculate_memory_cost_safe` function calculates the *total* cost for a given memory size. The specs show that for operations like `MLOAD` or `CALLDATACOPY`, what's needed is the *additional* cost of expansion. The `calculate_gas_extend_memory` function is the most direct reference. It calculates the cost to grow memory *from* its current size *to* a new required size, which is the correct approach.

4.  **Call Gas (63/64 Rule)**: The `calculate_call_gas_safe` stub is a good start. The reference implementation in `ethereum.paris.vm.gas.calculate_message_call_gas` and `max_message_call_gas` shows the full logic, which includes not just the 63/64 rule but also the base cost, value transfer cost, and new account creation cost, all of which are deducted *before* calculating the amount to forward.

These points are minor and the provided prompt is an excellent guide. The `execution-specs` code will help fill in the precise details of these complex gas interactions.

---

An analysis of the execution-specs reveals the core logic for calculating dynamic gas costs, especially concerning memory expansion and call operations. The following snippets from the Python implementation provide a clear reference for handling the requested edge cases.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/gas.py">
```python
# ... (gas constants)

GAS_MEMORY = Uint(3)
GAS_KECCAK256 = Uint(30)
GAS_KECCAK256_WORD = Uint(6)
GAS_COPY = Uint(3)
# ... more gas constants

@dataclass
class ExtendMemory:
    """
    Define the parameters for memory extension in opcodes

    `cost`: `ethereum.base_types.Uint`
        The gas required to perform the extension
    `expand_by`: `ethereum.base_types.Uint`
        The size by which the memory will be extended
    """

    cost: Uint
    expand_by: Uint


@dataclass
class MessageCallGas:
    """
    Define the gas cost and gas given to the sub-call for
    executing the call opcodes.

    `cost`: `ethereum.base_types.Uint`
        The gas required to execute the call opcode, excludes
        memory expansion costs.
    `sub_call`: `ethereum.base_types.Uint`
        The portion of gas available to sub-calls that is refundable
        if not consumed.
    """

    cost: Uint
    sub_call: Uint


def charge_gas(evm: Evm, amount: Uint) -> None:
    """
    Subtracts `amount` from `evm.gas_left`.
    ...
    """
    if evm.gas_left < amount:
        raise OutOfGasError
    else:
        evm.gas_left -= amount


def calculate_memory_gas_cost(size_in_bytes: Uint) -> Uint:
    """
    Calculates the gas cost for allocating memory
    to the smallest multiple of 32 bytes,
    such that the allocated size is at least as big as the given size.
    """
    size_in_words = ceil32(size_in_bytes) // Uint(32)
    linear_cost = size_in_words * GAS_MEMORY
    quadratic_cost = size_in_words**Uint(2) // Uint(512)
    total_gas_cost = linear_cost + quadratic_cost
    try:
        return total_gas_cost
    except ValueError:
        raise OutOfGasError


def calculate_gas_extend_memory(
    memory: bytearray, extensions: List[Tuple[U256, U256]]
) -> ExtendMemory:
    """
    Calculates the gas amount to extend memory
    """
    size_to_extend = Uint(0)
    to_be_paid = Uint(0)
    current_size = Uint(len(memory))
    for start_position, size in extensions:
        if size == 0:
            continue
        before_size = ceil32(current_size)
        after_size = ceil32(Uint(start_position) + Uint(size))
        if after_size <= before_size:
            continue

        size_to_extend += after_size - before_size
        already_paid = calculate_memory_gas_cost(before_size)
        total_cost = calculate_memory_gas_cost(after_size)
        to_be_paid += total_cost - already_paid

        current_size = after_size

    return ExtendMemory(to_be_paid, size_to_extend)


def calculate_message_call_gas(
    value: U256,
    gas: Uint,
    gas_left: Uint,
    memory_cost: Uint,
    extra_gas: Uint,
    call_stipend: Uint = GAS_CALL_STIPEND,
) -> MessageCallGas:
    """
    Calculates the MessageCallGas (cost and gas made available to the sub-call)
    for executing call Opcodes.
    """
    call_stipend = Uint(0) if value == 0 else call_stipend
    if gas_left < extra_gas + memory_cost:
        return MessageCallGas(gas + extra_gas, gas + call_stipend)

    gas = min(gas, max_message_call_gas(gas_left - memory_cost - extra_gas))

    return MessageCallGas(gas + extra_gas, gas + call_stipend)


def max_message_call_gas(gas: Uint) -> Uint:
    """
    Calculates the maximum gas that is allowed for making a message call
    """
    return gas - (gas // Uint(64))
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/memory.py">
```python
def mload(evm: Evm) -> None:
    """
    Load word from memory.
    """
    # STACK
    start_position = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(32))]
    )
    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    value = U256.from_be_bytes(
        memory_read_bytes(evm.memory, start_position, U256(32))
    )
    push(evm.stack, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mcopy(evm: Evm) -> None:
    """
    Copy the bytes in memory from one location to another.
    """
    # STACK
    destination = pop(evm.stack)
    source = pop(evm.stack)
    length = pop(evm.stack)

    # GAS
    words = ceil32(Uint(length)) // Uint(32)
    copy_gas_cost = GAS_COPY * words

    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(source, length), (destination, length)]
    )
    charge_gas(evm, GAS_VERY_LOW + copy_gas_cost + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    value = memory_read_bytes(evm.memory, source, length)
    memory_write(evm.memory, destination, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/system.py">
```python
def generic_call(
    evm: Evm,
    gas: Uint,
    value: U256,
    caller: Address,
    to: Address,
    code_address: Address,
    should_transfer_value: bool,
    is_staticcall: bool,
    memory_input_start_position: U256,
    memory_input_size: U256,
    memory_output_start_position: U256,
    memory_output_size: U256,
) -> None:
    """
    Perform the core logic of the `CALL*` family of opcodes.
    """
    from ...vm.interpreter import STACK_DEPTH_LIMIT, process_message

    evm.return_data = b""

    if evm.message.depth + Uint(1) > STACK_DEPTH_LIMIT:
        evm.gas_left += gas
        push(evm.stack, U256(0))
        return

    call_data = memory_read_bytes(
        evm.memory, memory_input_start_position, memory_input_size
    )
    code = get_account(evm.message.block_env.state, code_address).code
    child_message = Message(
        # ...
        depth=evm.message.depth + Uint(1),
        # ...
    )
    # ...

def call(evm: Evm) -> None:
    """
    Message-call into an account.
    """
    # STACK
    gas = Uint(pop(evm.stack))
    to = to_address(pop(evm.stack))
    value = pop(evm.stack)
    memory_input_start_position = pop(evm.stack)
    memory_input_size = pop(evm.stack)
    memory_output_start_position = pop(evm.stack)
    memory_output_size = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory,
        [
            (memory_input_start_position, memory_input_size),
            (memory_output_start_position, memory_output_size),
        ],
    )

    if to in evm.accessed_addresses:
        access_gas_cost = GAS_WARM_ACCESS
    else:
        evm.accessed_addresses.add(to)
        access_gas_cost = GAS_COLD_ACCOUNT_ACCESS

    create_gas_cost = (
        Uint(0)
        if is_account_alive(evm.message.block_env.state, to) or value == 0
        else GAS_NEW_ACCOUNT
    )
    transfer_gas_cost = Uint(0) if value == 0 else GAS_CALL_VALUE
    message_call_gas = calculate_message_call_gas(
        value,
        gas,
        Uint(evm.gas_left),
        extend_memory.cost,
        access_gas_cost + create_gas_cost + transfer_gas_cost,
    )
    charge_gas(evm, message_call_gas.cost + extend_memory.cost)

    # ...
    sender_balance = get_account(
        evm.message.block_env.state, evm.message.current_target
    ).balance
    if sender_balance < value:
        push(evm.stack, U256(0))
        evm.return_data = b""
        evm.gas_left += message_call_gas.sub_call
    else:
        generic_call(
            evm,
            message_call_gas.sub_call,
            # ...
        )

    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/exceptions.py">
```python
class ExceptionalHalt(EthereumException):
    """
    Indicates that the EVM has experienced an exceptional halt. This causes
    execution to immediately end with all gas being consumed.
    """


class Revert(EthereumException):
    """
    Raised by the `REVERT` opcode.

    Unlike other EVM exceptions this does not result in the consumption of all
    gas.
    """

    pass


class StackUnderflowError(ExceptionalHalt):
    """
    Occurs when a pop is executed on an empty stack.
    """

    pass


class StackOverflowError(ExceptionalHalt):
    """
    Occurs when a push is executed on a stack at max capacity.
    """

    pass


class OutOfGasError(ExceptionalHalt):
    """
    Occurs when an operation costs more than the amount of gas left in the
    frame.
    """

    pass


class InvalidOpcode(ExceptionalHalt):
    """
    Raised when an invalid opcode is encountered.
    """
    # ...


class InvalidJumpDestError(ExceptionalHalt):
    """
    Occurs when the destination of a jump operation doesn't meet any of the
    following criteria:
    ...
    """


class StackDepthLimitError(ExceptionalHalt):
    """
    Raised when the message depth is greater than `1024`
    """

    pass


class WriteInStaticContext(ExceptionalHalt):
    """
    Raised when an attempt is made to modify the state while operating inside
    of a STATICCALL context.
    """

    pass


class OutOfBoundsRead(ExceptionalHalt):
    """
    Raised when an attempt was made to read data beyond the
    boundaries of the buffer.
    """

    pass
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/utils/numeric.py">
```python
def ceil32(value: Uint) -> Uint:
    """
    Rounds `value` up to the nearest multiple of 32.
    """
    if value == 0:
        return Uint(0)

    return ((value - 1) // 32 + 1) * 32
```
</file>
</execution-specs>

## Prompt Corrections
The original prompt provides a good structure for implementing dynamic gas handling, but referencing the `execution-specs` highlights a few areas for improvement and accuracy:

1.  **Memory Cost Calculation**: The prompt's `calculate_memory_cost_safe` function is good, but the core formula can be directly taken from `calculate_memory_gas_cost` in the specs:
    - `memory_size_words = (size_in_bytes + 31) // 32`
    - `linear_cost = memory_size_words * GAS_MEMORY` (where `GAS_MEMORY` is 3)
    - `quadratic_cost = memory_size_words**2 // 512`
    This direct formula is what needs to be implemented with overflow protection.

2.  **Memory Expansion Gas**: The prompt's `calculate_memory_expansion_gas_safe` calculates the delta between the cost of the old size and the new size. The spec function `calculate_gas_extend_memory` is more robust, as it can handle multiple memory access regions at once (like in `MCOPY`) and correctly calculates the new memory size by taking the maximum required boundary (`max(start + size)`). This is a more accurate model to follow.

3.  **Call Gas Calculation**: The prompt's `calculate_call_gas_safe` correctly implements the 63/64 rule, but it oversimplifies the total cost. The spec function `calculate_message_call_gas` provides a more complete picture. It shows that before applying the 63/64 rule, you must first deduct several other potential costs from `gas_left`:
    - The base `GAS_CALL` cost.
    - Cold account access cost (`GAS_COLD_ACCOUNT_ACCESS`).
    - Value transfer cost (`GAS_CALL_VALUE`).
    - New account creation cost (`GAS_NEW_ACCOUNT`).
    The 63/64 rule is then applied to the gas *remaining after* these costs have been accounted for.

4.  **Error Handling**: The prompt correctly identifies the need for graceful error handling. The `.../vm/exceptions.py` file provides a canonical list of EVM exceptions. Implementing these as distinct error types in Zig, rather than generic categories, will lead to a more compliant and debuggable VM. For example, `OutOfBoundsRead` is a specific error for `RETURNDATACOPY`, which is different from a general `InvalidMemoryAccess`.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.3/core/vm/gas.go">
```go
// gas.go contains the gas calculation functions for the EVM.

package vm

import (
	"math/big"

	"github.com/ethereum/go-ethereum/params"
)

// memoryGasCost calculates the quadratic gas cost for memory expansion.
//
// The cost is calculated as:
//   memory_cost = (memory_size_word^2) / 512 + 3 * memory_size_word
//
// Where memory_size_word is the number of 32-byte words required for the
// given memory size. This quadratic cost makes extremely large memory
// allocations prohibitively expensive, acting as a safeguard.
//
// Note: This function uses big.Int for intermediate calculations to prevent
// uint64 overflow, which is a critical edge case for large memory sizes.
func memoryGasCost(memSize, newSize uint64) (uint64, error) {
	if newSize == 0 {
		return 0, nil
	}
	// The maximum memory size is bounded by the word size of the machine,
	// and the gas limit of a block.
	//
	// The theoretical maximum memory size is 2^64-1 bytes, but it's not
	// reachable. The cost of memory expansion dominates and blocks have a
	// gas limit. A size of 2^32 bytes of memory would already cost ~30000 Peta gas.
	if newSize > memSize {
		// newMemSizeWords is the number of 32-byte words needed for newSize bytes of memory.
		newMemSizeWords := (newSize + 31) / 32
		newMemSizeWordsUint := new(big.Int).SetUint64(newMemSizeWords)

		// memGas is the linear cost of memory: 3 * newMemSizeWords
		memGas, overflow := new(big.Int).SetUint64(params.MemoryGas), newMemSizeWordsUint.TestBit(newMemSizeWordsUint.BitLen()-1)
		if !overflow {
			memGas.Mul(memGas, newMemSizeWordsUint)
		} else {
			// In case of overflow, use the max value.
			memGas.Set(maxOfUint256)
		}
		// quadGas is the quadratic cost of memory: newMemSizeWords^2 / 512
		quadGas := new(big.Int).Mul(newMemSizeWordsUint, newMemSizeWordsUint)
		quadGas.Div(quadGas, big512)

		// total cost is linear + quadratic.
		total, overflow := new(big.Int).Add(memGas, quadGas), memGas.TestBit(memGas.BitLen()-1)
		if !overflow && total.IsUint64() {
			return total.Uint64(), nil
		}
		return 0, errGasUintOverflow
	}
	return 0, nil
}

// callGas returns the gas required for calling a contract.
//
// This function calculates gas costs for CALL, DELEGATECALL, STATICCALL, and
// CALLCODE opcodes, including the 63/64 rule for gas forwarding from EIP-150.
//
// It handles edge cases like:
// - Gas parameter being larger than available gas.
// - Value transfers to non-existent accounts.
// - Gas stipend for value transfers.
func callGas(gasTable params.GasTable, availableGas, base, callCost uint64) (uint64, error) {
	if availableGas < base {
		return 0, errGasUintOverflow
	}
	// The available gas is the gas that is available to the _parent_ scope.
	// The cost of the call is deduced from this, and the rest is passed to the
	// child scope. It can be further capped by the 'gas' argument of the call.
	availableGas -= base
	gas := availableGas
	// EIP-150: max 63/64 of available gas can be passed on to the child.
	if callCost > 0 {
		gas = availableGas - availableGas/64
	}

	// cap the max gas that can be passed on by the caller
	if gas < callCost {
		return 0, errGasUintOverflow
	}
	if gas > callCost {
		gas = callCost
	}
	return gas, nil
}

// copyGas calculates the gas cost for copy operations like CODECOPY,
// CALLDATACOPY, and RETURNDATACOPY.
//
// cost = 3 * word_count + memory_expansion_cost
//
// This function demonstrates how dynamic gas is calculated based on the size
// of the data being copied, which is a common pattern.
func copyGas(size, memSize uint64) (uint64, error) {
	// wordGas is the linear cost for copying data, 3 gas per 32-byte word.
	wordGas, overflow := SafeMul(toWordSize(size), params.CopyGas)
	if overflow {
		return 0, errGasUintOverflow
	}
	// memGas is the quadratic cost for memory expansion.
	memGas, err := memoryGasCost(memSize, size)
	if err != nil {
		return 0, err
	}
	// The total cost is the sum of linear and quadratic costs.
	return SafeAdd(wordGas, memGas)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.3/params/protocol_params.go">
```go
// protocol_params.go contains the consensus parameters for the Ethereum mainnet.

package params

// Gas costs for memory operations, used in gas.go
const (
	MemoryGas      = 3    // Gas cost for each 32-byte word of memory access.
	QuadCoeffDiv   = 512  // Divisor for the quadratic memory cost calculation.
	MaxCodeSize    = 24576 // Maximum code size for a contract. EIP-170.
)

// Gas costs for different opcodes and operations
const (
	CallStipend              = 2300   // Free gas given to a CALL creating a new account for subsequent operations
	CallValueTransferGas     = 9000   // Paid for CALL when the value transfer is non-zero
	CallNewAccountGas        = 25000  // Paid for CALL when the recipient does not exist.
	DelegateCallGas          = 0      // Gas cost of a DELEGATECALL operation
	StaticCallGas            = 0      // Gas cost of a STATICCALL operation
	CopyGas                  = 3      // Gas cost per word for copy operations
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.3/core/vm/instructions.go">
```go
// instructions.go contains the implementations for nearly all EVM instructions.

// opCall is the internal implementation of the CALL opcode.
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	gas, addr, value, argsOffset, argsLength, retOffset, retLength := stack.pop7()
	if !gas.IsUint64() {
		return nil, ErrGasUintOverflow
	}
	
	// Ensure that the argument and return memory ranges are valid, and resize the memory if needed.
	// This is a critical step for handling memory growth.
	args, err := memory.GetPtr(argsOffset.Uint64(), argsLength.Uint64())
	if err != nil {
		return nil, err
	}
	ret, err := memory.GetPtr(retOffset.Uint64(), retLength.Uint64())
	if err != nil {
		return nil, err
	}
	
	// Don't allow passing value to precompiled contracts, except for the identity
	// contract, which is a special case.
	// This is also checked in the interpreter.
	if isPrecompiled(addr.Address()) && value.Sign() > 0 && !evm.ChainConfig().IsEIP158(evm.BlockNumber) {
		return nil, errCallToPrecompileWithValue
	}

	// Calculate gas cost of the call.
	var cost uint64
	if evm.Config.NoBaseFee {
		cost, err = callGas(evm.GasTable, contract.Gas, gas.Uint64(), value)
	} else {
		// After EIP-150, the available gas is passed to callGas instead of the stack gas.
		cost, err = callGas(evm.GasTable, contract.Gas, 0, value)
	}
	if err != nil {
		return nil, err
	}
	if err := contract.UseGas(cost); err != nil {
		return nil, err
	}
	
	// This is the actual gas available to the child execution.
	// The cost of the call has been deducted, and the 63/64 rule has been applied.
	gas.Sub(gas, new(uint256.Int).SetUint64(cost))

	// Execute the call.
	ret, returnGas, err := evm.Call(contract, addr.Address(), args, gas.Uint64(), value)
	if err != nil {
		// If the call failed, the remaining gas in the child context is still consumed.
		stack.push(zero)
		contract.Gas += returnGas
		return nil, nil // Return nil error, but indicate failure on stack
	}
	stack.push(one) // Push success to stack
	// Copy returned data to parent memory
	copy(ret, ret) 
	contract.Gas += returnGas
	return nil, nil
}

// opMStore is the MSTORE opcode implementation.
func opMStore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	offset, val := stack.pop2()
	
	// The `toUint64` check handles the case where the offset is larger than
	// what can be represented by a uint64, which is an integer overflow edge case.
	// Zig's safe casting or explicit checks can be used to replicate this.
	off, overflow := offset.Uint64WithOverflow()
	if overflow {
		return nil, errGasUintOverflow
	}
	
	// Resize memory to fit the new data. This is where memory expansion occurs.
	// The cost of this expansion is calculated and consumed.
	err := memory.Resize(off + 32)
	if err != nil {
		return nil, err
	}
	memory.Set32(off, val)
	return nil, nil
}

// opMCopy is the MCOPY opcode implementation (EIP-5656).
func opMCopy(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	var (
		dest   = stack.pop()
		src    = stack.pop()
		length = stack.pop()
	)
	
	// These checks are crucial for preventing integer overflows in memory calculations.
	// When offset + size wraps around, it can lead to vulnerabilities.
	destPtr, overflow := dest.Uint64WithOverflow()
	if overflow {
		return nil, errGasUintOverflow
	}
	srcPtr, overflow := src.Uint64WithOverflow()
	if overflow {
		return nil, errGasUintOverflow
	}
	lenVal, overflow := length.Uint64WithOverflow()
	if overflow {
		return nil, errGasUintOverflow
	}

	if lenVal > 0 {
		// memoryGasCost is called here to calculate the cost of potential memory expansion.
		// It correctly handles sudden large expansions.
		gas, err := memoryGasCost(memory.Len(), destPtr+lenVal)
		if err != nil {
			return nil, err
		}
		gas, err = Add(gas, memoryGasCost(memory.Len(), srcPtr+lenVal))
		if err != nil {
			return nil, err
		}
		
		// The copy fee is 3 gas per 32-byte word.
		copyGas, overflow := Mul(toWordSize(lenVal), params.CopyGas)
		if overflow {
			return nil, errGasUintOverflow
		}
		
		// Add copy fee and memory expansion cost.
		gas, err = Add(gas, copyGas)
		if err != nil {
			return nil, err
		}
		if err := contract.UseGas(gas); err != nil {
			return nil, err
		}
		
		// Ensure memory is large enough.
		memory.Resize(destPtr + lenVal)
		memory.Resize(srcPtr + lenVal)
		
		// Perform the copy operation.
		memory.Copy(destPtr, srcPtr, lenVal)
	}
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.3/core/vm/memory.go">
```go
// memory.go contains the Memory struct and related methods.

package vm

import (
	"errors"
	"fmt"
	"math"
)

// Memory is a simple memory model for the EVM.
type Memory struct {
	store []byte
	// lastGasCost is the gas cost of the last memory expansion.
	// It is used to avoid recalculating memory expansion costs when unnecessary.
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{store: make([]byte, 0, 1024)}
}

// Set sets offset to value.
func (m *Memory) Set(offset, size uint64, value []byte) {
	// ... (implementation details)
}

// Set32 sets the 32 bytes starting at offset to the given value.
// The value is interpreted as a big-endian 256-bit number.
func (m *Memory) Set32(offset uint64, val *uint256.Int) {
	// ... (implementation details)
}

// Resize resizes the memory to size.
// This is the core function that handles memory expansion. It is called by opcodes
// like MSTORE, MLOAD, and various COPY opcodes before they access memory.
// It also handles the gas cost calculation.
func (m *Memory) Resize(size uint64) error {
	if uint64(len(m.store)) >= size {
		return nil
	}
	// The cost of memory expansion is proportional to the square of the memory size.
	// This function calculates the cost difference between the current size and the new size.
	newGasCost, err := memoryGasCost(uint64(len(m.store)), size)
	if err != nil {
		return err
	}
	gasCost := newGasCost - m.lastGasCost
	m.lastGasCost = newGasCost

	// The actual memory expansion.
	if size > uint64(len(m.store)) {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
	return nil
}

// Get returns size bytes starting at offset.
func (m *Memory) Get(offset, size uint64) ([]byte, error) {
	// ... (implementation details)
}

// GetPtr returns a slice of the memory at the given offset and size.
// It is used by opcodes to get a pointer to memory for read/write operations.
func (m *Memory) GetPtr(offset, size uint64) ([]byte, error) {
	if size == 0 {
		return nil, nil
	}
	if offset > uint64(len(m.store)) {
		return nil, fmt.Errorf("invalid memory access: offset %d, size %d, memsize %d", offset, size, len(m.store))
	}
	if size > uint64(len(m.store))-offset {
		return nil, fmt.Errorf("invalid memory access: offset %d, size %d, memsize %d", offset, size, len(m.store))
	}
	return m.store[offset : offset+size], nil
}

// Len returns the length of the memory.
func (m *Memory) Len() uint64 {
	return uint64(len(m.store))
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.3/core/vm/stack.go">
```go
// stack.go contains the Stack struct and related methods for the EVM.

package vm

import (
	"fmt"
	"math/big"
)

// Stack is a simple stack model for the EVM.
type Stack struct {
	data []*big.Int
}

// NewStack returns a new stack with a maximum capacity of 1024.
func NewStack() *Stack {
	return &Stack{data: make([]*big.Int, 0, 1024)}
}

// push pushes a value onto the stack.
func (st *Stack) push(d *big.Int) {
	st.data = append(st.data, d)
}

// pop pops a value from the stack.
func (st *Stack) pop() *big.Int {
	if len(st.data) == 0 {
		panic("stack underflow")
	}
	val := st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return val
}

// pop7 pops seven values from the stack.
// This is relevant to the CALL opcode, which takes 7 arguments from the stack.
// The use of `pop` here shows the LIFO (Last-In, First-Out) order.
func (st *Stack) pop7() (*uint256.Int, *uint256.Int, *uint256.Int, *uint256.Int, *uint256.Int, *uint256.Int, *uint256.Int) {
	// ... (implementation details for popping 7 values)
}

// toUint64 is a utility function used in opcode implementations.
// It safely converts a big.Int from the stack to a uint64. If the number
// is too large, it returns `math.MaxUint64`, effectively capping the value.
// This is a key part of handling potential overflows when dealing with memory
// offsets and sizes.
func (d *big.Int) toUint64() uint64 {
	if d.BitLen() > 64 {
		return math.MaxUint64
	}
	return d.Uint64()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.3/core/vm/evm.go">
```go
// evm.go contains the EVM struct and related methods.

// EVM is the Ethereum Virtual Machine base object for the geth implementation.
type EVM struct {
	// Context provides information about the current blockchain and transaction.
	Context
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// depth is the current call stack depth.
	depth int
	// chain rules contains the chain configuration.
	chainRules params.Rules
	// chain configuration options
	chainConfig *params.ChainConfig
	// virtual machine configuration options.
	vmConfig Config
	// global gas pool for the transaction.
	gasPool *GasPool
	// memory is the memory model for the current execution context.
	Memory *Memory
	// stack is the stack for the current execution context.
	Stack *Stack
	// contract is the contract being executed.
	contract *Contract
	// ... other fields
}

// Call executes a message call to a contract.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// Fail if we're trying to execute above the call depth limit.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// ... (rest of the call implementation)
}
```
</file>
## Prompt Corrections
The original prompt contains several good ideas for a safe EVM implementation in Zig, but it's helpful to see how a mature implementation like Go-Ethereum handles these concepts.

1.  **`MAX_MEMORY_SIZE` Constant**: The prompt suggests a hard constant `MAX_MEMORY_SIZE`. In Go-Ethereum, there isn't a strict hard-coded limit. Instead, the quadratic memory expansion gas cost (`memoryGasCost` in `core/vm/gas.go`) makes it economically infeasible to allocate memory beyond a certain point (e.g., ~32MB would cost billions of gas, far exceeding any block gas limit). This is a more flexible and robust approach than a hard-coded limit.

2.  **Integer Overflow in Gas Calculations**: The prompt correctly identifies the risk of `uint64` overflow in quadratic memory cost calculations. Go-Ethereum solves this by performing the entire `memoryGasCost` calculation using `math/big.Int` types, which can handle arbitrarily large numbers. This completely prevents overflow during the calculation itself. The final result is only converted to `uint64` after checking if it's within the valid range.

3.  **Integer Overflow for Memory Parameters**: The prompt discusses `offset + size` overflowing. In Go-Ethereum, stack values are `*big.Int`. Opcode implementations convert these to `uint64` for memory addressing. The `toUint64()` or `Uint64WithOverflow()` methods on `*big.Int` are used, which effectively cap the values at `math.MaxUint64`. This is the primary overflow protection for memory access parameters. A direct `+` overflow isn't the main concern; it's about handling stack values that are too large for `uint64` addresses.

4.  **Safe Call Gas Calculation**: The prompt's `calculate_call_gas_safe` function is a good concept. Go-Ethereum's `callGas` function in `core/vm/gas.go` is the canonical implementation. It handles the `63/64` rule (EIP-150) by calculating `availableGas - availableGas/64` and then capping the forwarded gas with `min(requestedGas, maxForwardable)`. This is a critical detail to match reference behavior.

5.  **Error Recovery vs. Panics**: The prompt correctly emphasizes graceful error handling. Go-Ethereum returns `error` types for conditions like `errGasUintOverflow` or `ErrDepth`, which the EVM interpreter loop catches to halt execution without panicking the entire node. This is the standard practice and a good model to follow.

---

An analysis of the go-ethereum codebase reveals several key implementation patterns for handling dynamic gas edge cases, particularly around memory expansion and call operations. The following snippets are highly relevant to the prompt's requirements.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// gas.go contains the gas price calculations for the EVM.

// memoryGasCost calculates the quadratic gas cost for memory expansion.
// The cost is calculated as:
//   memory_cost = (memory_size_word^2) / 512 + 3 * memory_size_word
//
// To prevent overflow, this function uses `big.Int` for intermediate calculations.
// This is a direct parallel to the `calculate_memory_cost_safe` Zig function,
// showcasing a robust way to handle potential `u64` overflow in quadratic cost calculations.
func memoryGasCost(mem *Memory) (uint64, error) {
	// The maximum memory size is bounded by 2^64-1 bytes, which is `(2^64-1)/32` words.
	// We can safely use uint64 for the `newSizeWords`.
	newSizeWords := toWordSize(mem.Len())
	if newSizeWords == 0 {
		return 0, nil
	}
	// The cost of memory usage is memory_size_word * 3 + memory_size_word^2 / 512.
	// This formula is for the total memory cost, not the expansion cost.
	// The cost of memory expansion is the difference between the cost of the new size
	// and the cost of the old size.

	// The linear cost is memory_size_word * 3.
	// This can overflow uint64 if newSizeWords is near the max value of uint64,
	// but this is okay because the cost would be far greater than the gas limit
	// of a block.
	linearCost := newSizeWords * params.MemoryGas

	// The quadratic cost is memory_size_word^2 / 512.
	// This can overflow uint64.
	// To avoid overflow, we do the calculation using big.Int.
	// The result of the quadratic cost is also unlikely to fit in a uint64 if the
	// newSizeWords is very large, but this is okay because the cost would be far
	// greater than the gas limit of a block.
	words := new(big.Int).SetUint64(newSizeWords)
	quad := new(big.Int).Mul(words, words)
	quad.Div(quad, big512)

	// The total cost is linear_cost + quadratic_cost.
	// This can overflow uint64.
	// We check if the quadratic cost can fit in a uint64.
	if !quad.IsUint64() {
		return 0, ErrGasUintOverflow
	}
	quadCost := quad.Uint64()
	// We check if the total cost can fit in a uint64.
	totalCost := linearCost + quadCost
	if totalCost < linearCost {
		return 0, ErrGasUintOverflow
	}
	return totalCost, nil
}

// calcMemSize64 returns the required memory size and an error if it overflows.
// This function is crucial for safely calculating memory requirements for operations
// like MSTORE, MLOAD, and various COPY opcodes. It directly addresses the
// "Integer Overflow in Memory Calculations" edge case.
func calcMemSize64(off, size uint64) (uint64, error) {
	if size == 0 {
		return 0, nil
	}
	// The maximum offset is 2^64-1, so we can't overflow that.
	// The maximum size is 2^64-1, so we can't overflow that.
	// But offset + size can overflow.
	newSize := off + size
	if newSize < off {
		return 0, ErrGasUintOverflow
	}
	return newSize, nil
}

// allBut64 is the 63/64 rule for gas forwarding in call operations.
// This function is essential for implementing "Recursive Call Depth with Gas" scenarios.
func allBut64(gas uint64) uint64 {
	return gas - gas/64
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall implements the CALL opcode.
// It shows how gas parameters are handled, including capping the requested gas
// with the 63/64 rule and adding a stipend for value transfers.
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	gas, addr, value, inoffset, insize, retoffset, retsize := stack.Pop6()
	// ... (address conversion, balance checks) ...

	// Calculate the gas cost of the call.
	// The cost is the sum of the base fee, the access list cost, the value transfer cost,
	// and the memory expansion cost.
	var (
		gasCost        = params.CallGasFrontier
		valueTransfer  = !value.IsZero()
		isEip2929      = evm.chainRules.IsBerlin
		coldAccess     bool
	)
	if isEip2929 {
		// The cost of the call is the base fee, plus the access list cost, plus the
		// value transfer cost.
		// The access list cost is 0 if the address is warm, or ColdAccountAccessCost
		// if it's cold.
		// The value transfer cost is 9000 if the address is cold and the value is
		// non-zero, or 0 otherwise.
		// The new account cost is 25000 if the address is cold and non-existent, or
		// 0 otherwise.
		gasCost = params.CallGasEIP2929
		coldAccess, _ = evm.StateDB.HasGased(addr)
		if !coldAccess {
			gasCost += params.ColdAccountAccessCostEIP2929
			evm.StateDB.AddressInAccessList(addr)
		}
	}
	if valueTransfer {
		gasCost += params.CallValueTransferGas
		// Check for non-existence of the account and add the cost if needed.
		// This is only relevant post-SpuriousDragon.
		if !evm.StateDB.Exist(addr) {
			gasCost += params.CallNewAccountGas
		}
	}
	// Calculate memory expansion gas
	ret, err := memory.resize(retoffset.Uint64(), retsize.Uint64())
	if err != nil {
		return nil, err
	}
	if err := contract.UseGas(ret); err != nil {
		return nil, err
	}
	in, err := memory.resize(inoffset.Uint64(), insize.Uint64())
	if err != nil {
		return nil, err
	}
	if err := contract.UseGas(in); err != nil {
		return nil, err
	}

	// The amount of gas to pass to the callee is capped by the 63/64 rule.
	// The gas is also capped by the amount of gas remaining in the contract.
	var stipend uint64
	if valueTransfer {
		stipend = params.CallStipend
	}
	callGas := gas.Uint64()
	if !gas.IsUint64() {
		callGas = ^uint64(0)
	}

	// We need to check that we have enough gas to cover the cost of the call.
	// The gas is capped by the amount of gas remaining in the contract.
	availableGas := contract.Gas() - gasCost
	if availableGas < stipend {
		return nil, ErrInsufficientBalance
	}
	availableGas -= stipend

	// Cap the gas to pass to the callee.
	// The gas is capped by the amount of gas remaining in the contract.
	if callGas > availableGas {
		callGas = availableGas
	}

	// Run the call.
	ret, returnGas, err := evm.Call(contract, addr, memory.GetPtr(int(inoffset.Uint64()), int(insize.Uint64())), callGas, value)
	// ... (handle return data and push result to stack) ...
	return nil, nil
}


// opMcopy implements the MCOPY opcode (EIP-5656).
// This is a great example of handling multiple memory regions (source and destination)
// and calculating copy-specific gas costs. It also shows the use of mem.Copy, which
// correctly handles overlapping memory regions.
func opMcopy(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	var (
		dst    = stack.Pop()
		src    = stack.Pop()
		length = stack.Pop()
	)
	// Check for overflow.
	dstUint, overflow := dst.Uint64WithOverflow()
	if overflow {
		return nil, ErrGasUintOverflow
	}
	srcUint, overflow := src.Uint64WithOverflow()
	if overflow {
		return nil, ErrGasUintOverflow
	}
	lengthUint, overflow := length.Uint64WithOverflow()
	if overflow {
		return nil, ErrGasUintOverflow
	}
	// The gas cost for MCOPY is G_verylow + G_copy * ceil(size / 32).
	// The G_verylow is already paid.
	if err := contract.UseGas(GasCopiermcopy(lengthUint)); err != nil {
		return nil, err
	}
	// The memory expansion gas is paid for accessing the highest of the two memory regions
	// that are touched by the copy operation.
	var mSize uint64
	if lengthUint > 0 {
		mSize = dstUint + lengthUint
		if srcUint+lengthUint > mSize {
			mSize = srcUint + lengthUint
		}
	}
	if gas, err := memory.resize(mSize); err != nil {
		return nil, err
	} else if err := contract.UseGas(gas); err != nil {
		return nil, err
	}
	// Perform the copy.
	memory.Copy(dstUint, srcUint, lengthUint)
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// evm.go contains the core logic for the EVM.

// Call executes the contract associated with the destination address.
// It is the main hub for all message calls. It sets up a new EVM instance and runs
// the code of the destination address.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > 1024 {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to execute above the call depth limit
	if evm.Depth() > int(params.CallDepthLimit) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.Context.IsStatic && !value.IsZero() {
		return nil, gas, ErrWriteProtection
	}
	// Ensure the called account is not suicided
	if evm.StateDB.HasSuicided(addr) {
		return nil, gas, nil
	}
	// ... (balance transfer logic) ...
	evm.StateDB.Transfer(caller.Address(), addr, value)

	// Get the code of the destination address
	code := evm.StateDB.GetCode(addr)

	// If the destination address has no code, return successfully.
	if len(code) == 0 {
		return nil, gas, nil
	}
	// Create a new contract and execute the code.
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(&addr, crypto.Keccak256Hash(code), code)

	// Create a new EVM instance for the sub-call.
	// The new EVM instance will have its own stack and memory, but will share
	// the same state database.
	// The gas passed to the sub-call is capped by the 63/64 rule.
	ret, err = evm.interpreter.Run(contract, input, evm.Context.IsStatic)
	return ret, contract.Gas(), err
}

// Create creates a new contract using the data passed as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute above the limit
	if evm.Depth() > int(params.CallDepthLimit) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Ensure the nonce is correct and increment it for the created contract
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	// Determine the new contract address based on the sender and nonce
	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	
	// ... (check for address collision) ...

	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr)
	
	// Transfer value if any
	evm.StateDB.Transfer(caller.Address(), contractAddr, value)

	// Create a new contract and execute the code.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCallCode(&contractAddr, crypto.Keccak256Hash(code), code)
	
	// ... (EIP-3860 initcode size check) ...

	ret, err = evm.interpreter.Run(contract, nil, false)

	// Check whether the max code size has been exceeded, assign err if the case.
	if err == nil && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}

	// if the contract creation ran out of gas, contract code will be empty.
	// the contract address will be persisted, but the code hash will be empty.
	if err == ErrCodeStoreOutOfGas {
		evm.StateDB.SetCode(contractAddr, nil)
		err = nil
	} else if err == nil {
		createDataGas := uint64(len(ret)) * params.CreateDataGas
		if contract.UseGas(createDataGas) {
			evm.StateDB.SetCode(contractAddr, ret)
		} else {
			err = ErrCodeStoreOutOfGas
		}
	}
	// When contract creation fails, the money is returned, but the gas is consumed.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			contract.UseGas(contract.Gas())
		}
	}
	return ret, contractAddr, contract.Gas(), err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Copy implements the MCOPY opcode, which copies data from a source region
// to a destination region in memory.
// Go's `copy` built-in function handles overlapping slices correctly.
func (m *Memory) Copy(dst, src, size uint64) {
	if size == 0 {
		return
	}
	// Copy the data.
	// This will not panic, since we have already resized the memory.
	// Note that `copy` handles overlapping slices correctly.
	copy(m.store[dst:dst+size], m.store[src:src+size])
}

// resize calculates the new size of the memory and the gas cost for the expansion.
// The memory size is rounded up to the nearest multiple of 32.
func (m *Memory) resize(size uint64) (uint64, error) {
	if uint64(m.Len()) >= size {
		return 0, nil
	}
	// The cost of memory usage is memory_size_word * 3 + memory_size_word^2 / 512.
	// The cost of memory expansion is the difference between the cost of the new size
	// and the cost of the old size.
	// The new size is rounded up to the nearest multiple of 32.
	newSize := toWordSize(size) * 32
	// Check if the new size is too big.
	if newSize > m.maxSize {
		return 0, ErrMemoryLimit
	}
	// The cost of memory expansion.
	// We use big.Int to avoid overflow.
	// The result of the quadratic cost is also unlikely to fit in a uint64 if the
	// newSize is very large, but this is okay because the cost would be far
	// greater than the gas limit of a block.
	oldSizeWords := toWordSize(uint64(m.Len()))
	newSizeWords := toWordSize(newSize)

	// old gas cost
	oldGas, err := memoryGasCost(m)
	if err != nil {
		return 0, err
	}
	// new gas cost
	m.store = append(m.store, make([]byte, newSize-uint64(m.Len()))...)
	newGas, err := memoryGasCost(m)
	if err != nil {
		return 0, err
	}
	return newGas - oldGas, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt is excellent and very detailed. Here are a few minor corrections and suggestions based on go-ethereum's implementation patterns that could enhance the Zig EVM's robustness:

1.  **Memory Cost Calculation**: The prompt's `calculate_memory_cost_safe` function calculates the *total* cost for a given memory size. In go-ethereum, the *expansion* cost is what's charged. This is calculated as `cost(new_size) - cost(old_size)`. While your `calculate_memory_expansion_gas_safe` does this correctly, it's a subtle but important distinction in how the base cost function is used. The go-ethereum approach is slightly more direct.

2.  **Handling Quadratic Cost Overflow**: The prompt's Zig code for quadratic memory cost (`memory_squared / gas_constants.MEMORY_GAS_QUADRATIC`) uses a `u64` for `memory_squared`. For very large memory sizes (e.g., > 2^35 bytes), this intermediate multiplication can overflow `u64` even if the final cost would not. The go-ethereum `memoryGasCost` function in `core/vm/gas.go` mitigates this by promoting the intermediate calculation to a `*big.Int` to prevent overflow entirely. This is a very robust pattern to consider for the Zig implementation, perhaps using `u128` for the intermediate squaring.

3.  **Call Gas Stipend**: The prompt's `calculate_call_gas_safe` doesn't explicitly account for the 2300 gas stipend added for calls that transfer value. In go-ethereum, this stipend is added to the gas forwarded to the recipient, which can be important for ensuring the recipient has enough gas to execute, especially in low-gas scenarios. The logic in `opCall` shows how this is handled: the stipend is accounted for *after* the 63/64 rule has been applied to the `available_gas`.

4.  **MCOPY Overlapping Regions**: The prompt correctly identifies this as an edge case. Go-ethereum's `Memory.Copy` method in `core/vm/memory.go` uses the native Go `copy` function, which is specified to handle overlapping source and destination slices correctly (similar to `memmove`). For the Zig implementation, using `std.mem.copyForwards` or `std.mem.copyBackwards` based on whether `dest > src` would be the explicit and correct way to implement this behavior, which your `execute_mcopy` seems to miss.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// memoryGasCost calculates the memory expansion gas and can resize the memory.
// This function should be used for any opcode that can cause memory expansion.
func memoryGasCost(mem *Memory, offset, size *big.Int) (gas uint64, err error) {
	if !size.IsUint64() || size.Uint64() == 0 {
		return 0, nil
	}
	// The offset and size are checked against the max uint64.
	// This is since a new memory is allocated with the given size,
	// which can't be larger than the max of a uint64.
	off, siz := offset.Uint64(), size.Uint64()
	if !offset.IsUint64() || !size.IsUint64() {
		return 0, ErrMemoryLimit
	}
	// Calculate the new memory size required, check for overflow.
	newMemSize, overflow := math.SafeAdd(off, siz)
	if overflow {
		return 0, ErrMemoryLimit
	}
	// If the new memory size is within the existing memory, there's no cost.
	oldMemSize := mem.Size()
	if newMemSize <= oldMemSize {
		return 0, nil
	}
	// The cost of memory expansion is paid for the new words on a quadratic basis.
	// The memory cost is calculated on the word size.
	newWords := (newMemSize + 31) / 32
	oldWords := (oldMemSize + 31) / 32

	// This is the memory cost formula: C_mem = G_memory * a + a*a / 512
	// where a is the memory size in words.
	// newCost can be calculated via the following, but it's prone to overflow.
	// cost = (newWords*newWords - oldWords*oldWords)/512 + 3*(newWords-oldWords)
	//
	// To avoid overflow, we use the following instead:
	// cost = (newWords-oldWords) * (3 + (newWords+oldWords)/512)
	// The two formulas are equivalent.
	//
	// To avoid overflow on (newWords+oldWords), we can check
	// newWords < sqrt(max_uint - 3*512)
	newCost := newWords*newWords/params.MemoryGasQuadCoeffDiv + newWords*params.MemoryGas
	oldCost := oldWords*oldWords/params.MemoryGasQuadCoeffDiv + oldWords*params.MemoryGas

	// Check for overflow.
	if newCost < oldCost {
		return 0, ErrGasUintOverflow
	}
	if err := mem.Resize(newMemSize); err != nil {
		return 0, err
	}
	return newCost - oldCost, nil
}

// CapGas returns the capped gas limit for a call, ensuring that at least one
// 64th of the available gas is retained.
func CapGas(gas, availableGas uint64) uint64 {
	if availableGas < gas {
		return availableGas
	}
	// EIP-150: all but one 64th of the available gas can be passed on.
	availableGas = availableGas - availableGas/64
	if gas > availableGas {
		return availableGas
	}
	return gas
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents a simple memory model for the ethereum virtual machine.
type Memory struct {
	store    []byte
	lastGas  uint64
	memSize  uint64
	readonly bool
}
// ...
const (
	// MaxMemorySize is the maximum memory size in the EVM.
	// The size is limited to 4GB on 64-bit platforms, and a bit less
	// on 32-bit platforms.
	MaxMemorySize = 4 << 30
)
// ...
// Resize expands the memory to the given size.
func (m *Memory) Resize(size uint64) error {
	// This check is very important, it's to check both memory limit and
	// also for overflow for the new size.
	if size > m.memSize {
		// The maximum memory size is capped at 4GB.
		if size > MaxMemorySize {
			return ErrMemoryLimit
		}
		m.memSize = size
	}
	return nil
}
// ...
// Set sets a slice of memory to a given value. This method is used for
// CODECOPY, CALLDATACOPY, RETURNDATACOPY.
func (m *Memory) Set(dst, src, size uint64, data []byte) {
	if size == 0 {
		return
	}
	// If the source is out of bounds, it's a NOP and the destination
	// is filled with zeros.
	if src >= uint64(len(data)) {
		memclr(m.store[dst : dst+size])
		return
	}
	// If the copy is partial, zero the remaining part
	// of the memory.
	copySize := min(size, uint64(len(data))-src)
	copy(m.store[dst:dst+copySize], data[src:src+copySize])

	if size > copySize {
		memclr(m.store[dst+copySize : dst+size])
	}
}

// Copy copies a slice to the memory.
// This method will not resize the memory, and it is the caller's
// responsibility to ensure that the memory is large enough.
func (m *Memory) Copy(dst, src, size uint64) {
	if size == 0 {
		return
	}
	// Ensure memory is large enough for the copy operation
	// This should be done by the caller.
	if newSize, overflow := math.SafeAdd(dst, size); !overflow {
		m.resize(newSize)
	}
	if newSize, overflow := math.SafeAdd(src, size); !overflow {
		m.resize(newSize)
	}
	copy(m.store[dst:dst+size], m.store[src:src+size])
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// opCall is the CALL opcode.
func opCall(pc *uint64, i *EVMInterpreter, s *stack) error {
	// ... (stack pops) ...
	gas, to, value, in, insize, out, outsize := s.pop(), s.pop(), s.pop(), s.pop(), s.pop(), s.pop(), s.pop()

	// Memory expansion for call data and return data
	gas, err := i.memoryGasCost(in, insize)
	if err != nil {
		return err
	}
	// ...
	gas, err = i.memoryGasCost(out, outsize)
	// ...

	// The call gas is capped to the total gas limit.
	var gasLimit uint64
	if gas.IsUint64() {
		gasLimit = gas.Uint64()
	} else {
		gasLimit = i.evm.GasPool.Gas() // If gas is too big, it will be capped by remaining gas.
	}
	// ...
	// Apply 63/64 rule.
	availableGas -= totalGas
	gasLimit = min(gasLimit, availableGas-availableGas/64)

	// ...
	// Do the actual call
	ret, returnGas, err := i.evm.Call(i.contract, toAddr, inData, gasLimit, value)
	// ...
}

// opMcopy is the MCOPY opcode.
func opMcopy(pc *uint64, i *EVMInterpreter, s *stack) error {
	var (
		dest   = s.pop()
		src    = s.pop()
		length = s.pop()
	)
	// ...
	// Calculate the memory expansion gas, and expand the memory if needed.
	gas, err := i.memoryGasCost2(dest, src, length)
	if err != nil {
		return err
	}
	if err := i.contract.UseGas(gas); err != nil {
		return err
	}
	// ... (other gas costs) ...
	// The actual copy.
	// ...
	i.mem.Copy(dest.Uint64(), src.Uint64(), l)
	return nil
}

// memoryGasCost2 calculates the memory expansion gas for MCOPY and can
// resize the memory.
func (i *EVMInterpreter) memoryGasCost2(dest, src, size *big.Int) (uint64, error) {
	if !size.IsUint64() || size.Uint64() == 0 {
		return 0, nil
	}
	// ... (checks for size) ...
	s, _ := size.Uint64WithOverflow()
	var (
		d, _ = dest.Uint64WithOverflow()
		so, _ = src.Uint64WithOverflow()
	)
	// Calculate the new memory size required for the destination, check for overflow.
	newMemSize, overflow := math.SafeAdd(d, s)
	if overflow {
		return 0, ErrMemoryLimit
	}
	// Calculate the new memory size required for the source, check for overflow.
	newMemSize2, overflow := math.SafeAdd(so, s)
	if overflow {
		return 0, ErrMemoryLimit
	}
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the receipt of consensus data, which is returned by consensus engines.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer more than the available balance
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}
	// ... (call logic)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/common/math/safe_math.go">
```go
// SafeAdd returns the result of x+y and a boolean indicating whether an
// overflow occurred.
func SafeAdd(x, y uint64) (uint64, bool) {
	return x + y, x+y < x
}

// SafeMul returns the result of x*y and a boolean indicating whether an
// overflow occurred.
func SafeMul(x, y uint64) (uint64, bool) {
	if x == 0 || y == 0 {
		return 0, false
	}
	return x * y, y > math.MaxUint64/x
}
```
</file>

## Prompt Corrections
The original prompt provides a solid foundation for implementing EVM gas edge cases. The following points are suggestions for improvement based on the go-ethereum implementation:

1.  **Memory Size Calculation Overflow**: The prompt uses `(memory_size + 31) / 32` to get the word count. In go-ethereum, this is handled carefully to avoid intermediate overflows, especially when calculating the quadratic cost. The `gasMemory` function in `core/vm/gas_table.go` avoids calculating `newWords*newWords` directly for very large numbers if it risks overflow, instead relying on the `MaxMemorySize` check in `memory.go` to prevent such scenarios from being reachable. A robust implementation should consider that `memory_size_words * memory_size_words` can overflow `u64` before the division by 512.

2.  **`CALLDATACOPY` Overflow**: The prompt correctly identifies `offset + size` as a potential overflow point. In go-ethereum, this is handled by `math.SafeAdd(offset, size)`. The result of this safe addition is then used for both memory expansion and gas calculation, preventing the wrap-around bug. The key is to perform the safe addition *before* calculating memory expansion.

3.  **Call Gas Calculation**: The prompt's `calculate_call_gas_safe` is a good model, but go-ethereum's logic is slightly different and may be a better reference. The `opCall` function in `interpreter.go` first determines the gas requested (`gasLimit`), then calculates various costs (base, value transfer, etc.), and finally applies the `63/64` rule by calling `CapGas` on the *remaining* gas.
    *   **Geth's `CapGas` Logic**: `availableGas = availableGas - availableGas/64; min(requestedGas, availableGas)`. This ensures the forwarded gas is never more than what's available after the stipend.
    *   **Large Gas Parameter**: When the `gas` parameter from the stack is larger than `MaxUint64`, go-ethereum caps it at the currently available gas in the pool, preventing it from being an arbitrarily large number in calculations.

4.  **`CODECOPY` Out of Bounds**: The prompt correctly identifies reading past the end of the contract's code as an edge case. The `memory.go:Set` function shows the canonical behavior: the memory area corresponding to the out-of-bounds read is padded with zeros. This is a crucial detail for specification compliance.

By incorporating these patterns from go-ethereum, the resulting EVM implementation will be more robust and closer to the reference behavior for these complex edge cases.

---

An excellent and detailed prompt. Here are the most relevant Go-Ethereum code snippets to help with the implementation of dynamic gas edge cases.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// core/vm/gas.go

// callGas returns the actual gas cost of the call.
//
// The cost of gas was changed during the homestead price change HF.
// As part of EIP 150 (TangerineWhistle), the returned gas is gas - base * 63 / 64.
func callGas(isEip150 bool, availableGas, base uint64, callCost *uint256.Int) (uint64, error) {
	if isEip150 {
		availableGas = availableGas - base
		gas := availableGas - availableGas/64
		// If the bit length exceeds 64 bit we know that the newly calculated "gas" for EIP150
		// is smaller than the requested amount. Therefore we return the new gas instead
		// of returning an error.
		if !callCost.IsUint64() || gas < callCost.Uint64() {
			return gas, nil
		}
	}
	if !callCost.IsUint64() {
		return 0, ErrGasUintOverflow
	}

	return callCost.Uint64(), nil
}

// memoryGasCost calculates the quadratic gas for memory expansion. It does so
// only for the memory region that is expanded, not the total memory.
func memoryGasCost(mem *Memory, newMemSize uint64) (uint64, error) {
	if newMemSize == 0 {
		return 0, nil
	}
	// The maximum that will fit in a uint64 is max_word_count - 1. Anything above
	// that will result in an overflow. Additionally, a newMemSize which results in
	// a newMemSizeWords larger than 0xFFFFFFFF will cause the square operation to
	// overflow. The constant 0x1FFFFFFFE0 is the highest number that can be used
	// without overflowing the gas calculation.
	if newMemSize > 0x1FFFFFFFE0 {
		return 0, ErrGasUintOverflow
	}
	newMemSizeWords := toWordSize(newMemSize)
	newMemSize = newMemSizeWords * 32

	if newMemSize > uint64(mem.Len()) {
		square := newMemSizeWords * newMemSizeWords
		linCoef := newMemSizeWords * params.MemoryGas
		quadCoef := square / params.QuadCoeffDiv
		newTotalFee := linCoef + quadCoef

		fee := newTotalFee - mem.lastGasCost
		mem.lastGasCost = newTotalFee

		return fee, nil
	}
	return 0, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/common.go">
```go
// core/vm/common.go

// calcMemSize64WithUint calculates the required memory size, and returns
// the size and whether the result overflowed uint64
// Identical to calcMemSize64, but length is a uint64
func calcMemSize64WithUint(off *uint256.Int, length64 uint64) (uint64, bool) {
	// if length is zero, memsize is always zero, regardless of offset
	if length64 == 0 {
		return 0, false
	}
	// Check that offset doesn't overflow
	offset64, overflow := off.Uint64WithOverflow()
	if overflow {
		return 0, true
	}
	val := offset64 + length64
	// if value < either of it's parts, then it overflowed
	return val, val < offset64
}

// getData returns a slice from the data based on the start and size and pads
// up to size with zero's. This function is overflow safe.
func getData(data []byte, start uint64, size uint64) []byte {
	length := uint64(len(data))
	if start > length {
		start = length
	}
	end := start + size
	if end > length {
		end = length
	}
	return common.RightPadBytes(data[start:end], int(size))
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// core/vm/gas_table.go

func gasCall(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	var (
		gas            uint64
		transfersValue = !stack.Back(2).IsZero()
		address        = common.Address(stack.Back(1).Bytes20())
	)
	if evm.chainRules.IsEIP158 {
		if transfersValue && evm.StateDB.Empty(address) {
			gas += params.CallNewAccountGas
		}
	} else if !evm.StateDB.Exist(address) {
		gas += params.CallNewAccountGas
	}
	if transfersValue {
		gas += params.CallValueTransferGas
	}
	memoryGas, err := memoryGasCost(mem, memorySize)
	if err != nil {
		return 0, err
	}
	var overflow bool
	if gas, overflow = math.SafeAdd(gas, memoryGas); overflow {
		return 0, ErrGasUintOverflow
	}

	evm.callGasTemp, err = callGas(evm.chainRules.IsEIP150, contract.Gas, gas, stack.Back(0))
	if err != nil {
		return 0, err
	}
	if gas, overflow = math.SafeAdd(gas, evm.callGasTemp); overflow {
		return 0, ErrGasUintOverflow
	}

	return gas, nil
}

func gasCreateEip3860(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	gas, err := memoryGasCost(mem, memorySize)
	if err != nil {
		return 0, err
	}
	size, overflow := stack.Back(2).Uint64WithOverflow()
	if overflow {
		return 0, ErrGasUintOverflow
	}
	if size > params.MaxInitCodeSize {
		return 0, fmt.Errorf("%w: size %d", ErrMaxInitCodeSizeExceeded, size)
	}
	// Since size <= params.MaxInitCodeSize, these multiplication cannot overflow
	moreGas := params.InitCodeWordGas * ((size + 31) / 32)
	if gas, overflow = math.SafeAdd(gas, moreGas); overflow {
		return 0, ErrGasUintOverflow
	}
	return gas, nil
}
func gasCreate2Eip3860(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	gas, err := memoryGasCost(mem, memorySize)
	if err != nil {
		return 0, err
	}
	size, overflow := stack.Back(2).Uint64WithOverflow()
	if overflow {
		return 0, ErrGasUintOverflow
	}
	if size > params.MaxInitCodeSize {
		return 0, fmt.Errorf("%w: size %d", ErrMaxInitCodeSizeExceeded, size)
	}
	// Since size <= params.MaxInitCodeSize, these multiplication cannot overflow
	moreGas := (params.InitCodeWordGas + params.Keccak256WordGas) * ((size + 31) / 32)
	if gas, overflow = math.SafeAdd(gas, moreGas); overflow {
		return 0, ErrGasUintOverflow
	}
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// core/vm/evm.go

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takse
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller common.Address, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (tracer hooks)
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer more than the available balance
	if !value.IsZero() && !evm.Context.CanTransfer(evm.StateDB, caller, value) {
		return nil, gas, ErrInsufficientBalance
	}
	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)

	if !evm.StateDB.Exist(addr) {
		if !isPrecompile && evm.chainRules.IsEIP158 && value.IsZero() {
			// Calling a non-existing account, don't do anything.
			return nil, gas, nil
		}
		evm.StateDB.CreateAccount(addr)
	}
	evm.Context.Transfer(evm.StateDB, caller, addr, value)

	if isPrecompile {
		ret, gas, err = RunPrecompiledContract(p, input, gas, evm.Config.Tracer)
	} else {
		// Initialise a new contract and set the code that is to be used by the EVM.
		code := evm.resolveCode(addr)
		if len(code) == 0 {
			ret, err = nil, nil // gas is unchanged
		} else {
			// The contract is a scoped environment for this execution context only.
			contract := NewContract(caller, addr, value, gas, evm.jumpDests)
			contract.SetCallCode(evm.resolveCodeHash(addr), code)
			ret, err = evm.interpreter.Run(contract, input, false)
			gas = contract.Gas
		}
	}
	// When an error was returned by the EVM or when setting the creation code
	// above we revert to the snapshot and consume any gas remaining. Additionally,
	// when we're in homestead this also counts for code storage gas errors.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			// ... (tracer hooks)
			gas = 0
		}
	}
	return ret, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// core/vm/instructions.go

// opMcopy implements the MCOPY opcode (https://eips.ethereum.org/EIPS/eip-5656)
func opMcopy(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	var (
		dst    = scope.Stack.pop()
		src    = scope.Stack.pop()
		length = scope.Stack.pop()
	)
	// These values are checked for overflow during memory expansion calculation
	// (the memorySize function on the opcode).
	scope.Memory.Copy(dst.Uint64(), src.Uint64(), length.Uint64())
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// core/vm/memory.go

// Copy copies data from the src position slice into the dst position.
// The source and destination may overlap.
// OBS: This operation assumes that any necessary memory expansion has already been performed,
// and this method may panic otherwise.
func (m *Memory) Copy(dst, src, len uint64) {
	if len == 0 {
		return
	}
	copy(m.store[dst:], m.store[src:src+len])
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/errors.go">
```go
// core/vm/errors.go

// List evm execution errors
var (
	ErrOutOfGas                 = errors.New("out of gas")
	ErrCodeStoreOutOfGas        = errors.New("contract creation code storage out of gas")
	ErrDepth                    = errors.New("max call depth exceeded")
	ErrInsufficientBalance      = errors.New("insufficient balance for transfer")
	ErrContractAddressCollision = errors.New("contract address collision")
	ErrExecutionReverted        = errors.New("execution reverted")
	ErrMaxCodeSizeExceeded      = errors.New("max code size exceeded")
	ErrMaxInitCodeSizeExceeded  = errors.New("max initcode size exceeded")
	ErrInvalidJump              = errors.New("invalid jump destination")
	ErrWriteProtection          = errors.New("write protection")
	ErrReturnDataOutOfBounds    = errors.New("return data out of bounds")
	ErrGasUintOverflow          = errors.New("gas uint64 overflow")
	ErrInvalidCode              = errors.New("invalid code: must not begin with 0xef")
	ErrNonceUintOverflow        = errors.New("nonce uint64 overflow")
)

// ErrStackUnderflow wraps an evm error when the items on the stack less
// than the minimal requirement.
type ErrStackUnderflow struct {
	stackLen int
	required int
}

// ErrStackOverflow wraps an evm error when the items on the stack exceeds
// the maximum allowance.
type ErrStackOverflow struct {
	stackLen int
	limit    int
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// params/protocol_params.go

const (
	// Gas costs
	...
	CallValueTransferGas    uint64 = 9000  // Paid for CALL when the value transfer is non-zero.
	CallNewAccountGas       uint64 = 25000 // Paid for CALL when the destination address didn't exist prior.
	...
	CreateDataGas           uint64 = 200   // Gas cost per byte for CREATE data.
	...
	MemoryGas      uint64 = 3    // Gas cost for each word when expanding memory.
	QuadCoeffDiv   uint64 = 512  // Divisor for the quadratic memory cost calculation.
	...
	MaxCodeSize = 24576 // Maximum code size for a contract.
	...
	InitCodeWordGas  = 2    // Gas cost per word for initcode.
	MaxInitCodeSize  = 2 * MaxCodeSize
	...
)
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provides an excellent, structured approach to handling these complex edge cases. However, a few points of clarification based on the Go-Ethereum implementation might be helpful for the developer:

1.  **`EdgeCaseDetector` Abstraction:** The prompt suggests a high-level `EdgeCaseDetector` struct. This is a good design for clarity. In Go-Ethereum, these checks are often performed inline within the opcode execution functions (e.g., in `core/vm/instructions.go` and `core/vm/gas_table.go`). The developer should be aware that they can either implement this abstraction or follow the inline-check pattern of Geth.

2.  **`validate_memory_access_safe` vs. `calculate_memory_expansion_gas_safe`:** The prompt separates parameter validation (`offset + size`) from the gas calculation. This is a solid approach. Geth combines these concepts: the memory size calculation function `calcMemSize64WithUint` implicitly checks for overflow, and the `memoryGasCost` function uses this result to determine the gas cost. The developer can choose the pattern that best fits the existing Zig EVM architecture.

3.  **Quadratic Memory Cost Overflow:** The prompt correctly identifies the risk of the quadratic memory cost overflowing a `u64`. Go-Ethereum's `memoryGasCost` function includes a hardcoded check (`if newMemSize > 0x1FFFFFFFE0`) to prevent this overflow before it happens. This constant is derived from the maximum `newMemSizeWords` that won't overflow `square := newMemSizeWords * newMemSizeWords`. This is a critical detail to implement correctly.

4.  **`CALL` Gas Calculation:** The logic in the prompt's `calculate_call_gas_safe` is a simplified version. The full Geth implementation (`gasCall` and `callGas`) shows additional complexities, such as costs for value transfers (`CallValueTransferGas`) and new account creation (`CallNewAccountGas`). These costs are deducted *before* the 63/64 rule is applied to the remaining gas. The provided Geth snippets for `gasCall` and `callGas` will be crucial here.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// memoryGasCost calculates the quadratic gas for memory expansion.
func memoryGasCost(mem *Memory) (uint64, error) {
	// The quadratic gas cost is `memory_size_word^2 / 512`.
	// In the yellow paper, this is specified as `Gmem * m_words + m_words^2 / 512`
	// where Gmem is 3. In go-ethereum, the linear component is paid 'on-demand'
	// and this function only deals with the quadratic part.
	newMemSize, overflow := uint256.FromBig(mem.Len())
	if overflow {
		return 0, ErrGasUintOverflow
	}
	// memory size is calculated via words
	newMemSizeWords := (newMemSize.Uint64() + 31) / 32
	newMemSize = uint256.NewInt(newMemSizeWords)

	// gas uint64:
	// new cost: (newMemSizeInWords * newMemSizeInWords) / 512
	// old cost: (oldMemSizeInWords * oldMemSizeInWords) / 512
	// total cost: new cost - old cost
	//
	// In order to avoid overflow, we do the calculation using an intermediate
	// 256-bit number.
	// (new_size_in_words^2 - old_size_in_words^2) / 512
	oldSize := (mem.lastGasCost + 31) / 32
	oldMemSizeWords := uint256.NewInt(oldSize)

	// cost = (new^2 - old^2) / 512
	// Since new^2 - old^2 = (new-old)(new+old), we can do it that way to avoid using 512-bit registers

	if newMemSize.Cmp(oldMemSizeWords) > 0 {
		// Both new and old are max 2^64-1, which means that new+old can be 2^65-2.
		// The sum can overflow a uint64.
		// Use uint256 for calculation
		sum := new(uint256.Int).Add(newMemSize, oldMemSizeWords)
		dif := new(uint256.Int).Sub(newMemSize, oldMemSizeWords)

		quadCoeff := uint256.NewInt(params.QuadraticCoeffDiv)
		mul := new(uint256.Int).Mul(sum, dif)
		cost, overflow := new(uint256.Int).Div(mul, quadCoeff).Uint64WithOverflow()
		if overflow {
			return 0, ErrGasUintOverflow
		}
		return cost, nil
	}
	return 0, nil
}

// memoryGasCostEIP3860 calculates the quadratic gas for memory expansion.
// The cost formula is the same as the pre-Cancun one, but the cost needs to
// be clamped to 2^64-1. It is only used after Shanghai.
func memoryGasCostEIP3860(mem *Memory) uint64 {
	// The quadratic gas cost is `memory_size_word^2 / 512`.
	// In the yellow paper, this is specified as `Gmem * m_words + m_words^2 / 512`
	// where Gmem is 3. In go-ethereum, the linear component is paid 'on-demand'
	// and this function only deals with the quadratic part.
	newMemSize := uint64((mem.Len64() + 31) / 32)

	// cost = (new^2 - old^2) / 512
	// Since new^2 - old^2 = (new-old)(new+old), we can do it that way to avoid using 512-bit registers
	oldSize := (mem.lastGasCost + 31) / 32
	if newMemSize > oldSize {
		// Use big.Int for calculation. This should not overflow a 128-bit number.
		// (2^64-1 + 2^64-1) * (2^64-1 - 0) < 2^65 * 2^64 = 2^129
		new := new(big.Int).SetUint64(newMemSize)
		old := new(big.Int).SetUint64(oldSize)

		sum := new(big.Int).Add(new, old)
		dif := new(big.Int).Sub(new, old)

		mul := new(big.Int).Mul(sum, dif)
		cost := new(big.Int).Div(mul, big.NewInt(params.QuadCoeffDiv))
		if !cost.IsUint64() {
			return math.MaxUint64
		}
		return cost.Uint64()
	}
	return 0
}

// constGasFunc is a helper function to be used by old opcodes, which have a constant gas cost.
func constGasFunc(gas uint64) gasFunc {
	return func(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
		return gas, nil
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents the EVM's memory space that is used to store data during execution.
// A memory has a size, which can be expanded. The size is always a multiple of 32.
type Memory struct {
	store       []byte
	lastGasCost uint64
}
// [...]

// Resize expands the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		// The requested size might be way too large, e.g. when a MSTORE is done
		// with a very large offset. We can't allocate that and checking for it is
		// also difficult because of uint64 wrapping. The rules of memory-expansion
		// are that it's quadratic, so it's always possible to pay for memory, but
		// we need to have a limit somewhere.
		// The go-ethereum client has a memory limit of 1GB, which is checked here
		//
		// N.B. The memory-limit is a soft-limit, which can be temporarily overstepped,
		// but will be applied for the next call to Resize.
		if size > params.MaxMemorySize {
			panic(ErrMemoryLimit)
		}
		// The requested size needs to be rounded up to the next 32-byte boundary
		// as memory is allocated in words.
		size = m.calcMemSize(size)
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}
// [...]

// Len returns the length of the memory.
func (m *Memory) Len() *big.Int {
	return big.NewInt(int64(len(m.store)))
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opMload implements the MLOAD operation.
func opMload(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) ([]byte, error) {
	// The memory positions are defined as off, size. We need to check if we can
	// safely add the two without overflow.
	// The memory size is `32`
	offset, overflow := stack.peek().Uint64WithOverflow()
	if overflow {
		return nil, ErrGasUintOverflow
	}
	// The new memory size required for this operation is offset + 32.
	// The `memorySize` method will handle any overflow checking.
	if memorySize, overflow = math.SafeAdd(offset, 32); overflow {
		return nil, ErrGasUintOverflow
	}
	if err := mem.Resize(memorySize); err != nil {
		return nil, err
	}
	val := mem.Get(offset, 32)
	stack.pop()
	stack.push(new(uint256.Int).SetBytes(val))
	return nil, nil
}

// opCallDataCopy implements the CALLDATACOPY operation.
func opCallDataCopy(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) ([]byte, error) {
	// Note, these are not gas-metered yet.
	var (
		memOffset  = stack.pop()
		dataOffset = stack.pop()
		length     = stack.pop()
	)
	// These are gas-metered.
	gas, err := opCallDataCopyGas(evm, contract, stack, mem, memOffset, dataOffset, length)
	if err != nil {
		return nil, err
	}
	if err := contract.UseGas(gas); err != nil {
		return nil, err
	}
	// stack positions are correct for pop...
	// but we can't pop them since they are needed for gas calculation
	//
	// Apply the memory expansion
	if _, overflow := memOffset.Uint64WithOverflow(); overflow {
		return nil, ErrGasUintOverflow
	}
	if _, overflow := length.Uint64WithOverflow(); overflow {
		return nil, ErrGasUintOverflow
	}
	// The new memory size required for this operation is `memOffset + length`.
	// The `memorySize` method will handle any overflow checking.
	if size, overflow := math.SafeAdd(memOffset.Uint64(), length.Uint64()); overflow {
		return nil, ErrGasUintOverflow
	} else {
		if err := mem.Resize(size); err != nil {
			return nil, err
		}
	}
	if err = mem.Set(memOffset.Uint64(), length.Uint64(), common.GetData(contract.Input, dataOffset.Uint64(), length.Uint64())); err != nil {
		return nil, err
	}

	return nil, nil
}

// opMcopy implements the MCOPY operation.
// It was introduced in Cancun.
func opMcopy(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) ([]byte, error) {
	// These are not gas-metered yet.
	var (
		dest   = stack.pop()
		src    = stack.pop()
		length = stack.pop()
	)
	// These are gas-metered.
	gas, err := opMcopyGas(evm, contract, stack, mem, dest, src, length)
	if err != nil {
		return nil, err
	}
	if err := contract.UseGas(gas); err != nil {
		return nil, err
	}
	// stack positions are correct for pop...
	// but we can't pop them since they are needed for gas calculation
	//
	// Apply the memory expansion
	var (
		dest64   uint64
		src64    uint64
		length64 uint64
		overflow bool
	)
	if dest64, overflow = dest.Uint64WithOverflow(); overflow {
		return nil, ErrGasUintOverflow
	}
	if src64, overflow = src.Uint64WithOverflow(); overflow {
		return nil, ErrGasUintOverflow
	}
	if length64, overflow = length.Uint64WithOverflow(); overflow {
		return nil, ErrGasUintOverflow
	}
	// The new memory size required for this operation is max(dest+length, src+length).
	// The `memorySize` method will handle any overflow checking.
	var memSize, overflow1 = math.SafeAdd(dest64, length64)
	var memSize2, overflow2 = math.SafeAdd(src64, length64)
	if overflow1 || overflow2 {
		return nil, ErrGasUintOverflow
	}
	if err := mem.Resize(max(memSize, memSize2)); err != nil {
		return nil, err
	}
	if err = mem.Copy(dest64, src64, length64); err != nil {
		return nil, err
	}
	return nil, nil
}

// opCall implements the CALL operation.
func opCall(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) ([]byte, error) {
	stack.require(7)
	var (
		gas      = stack.pop()
		addr     = stack.pop()
		value    = stack.pop()
		inOffset = stack.pop()
		inSize   = stack.pop()
		retOff   = stack.pop()
		retSize  = stack.pop()
	)

	toAddr := new(uint256.Int).Set(addr)
	gas, cost, err := callGas(evm.chainConfig, evm.StateDB, contract, gas, value, toAddr, mem, inOffset, inSize, retOff, retSize)
	if err != nil {
		return nil, err
	}
	if err := contract.UseGas(cost); err != nil {
		return nil, err
	}
	// The memory positions are defined as off, size. We need to check if we can
	// safely add the two without overflow.
	// The new memory size required for this operation is retOff + retSize.
	// The `memorySize` method will handle any overflow checking.
	if size, overflow := math.SafeAdd(retOff.Uint64(), retSize.Uint64()); overflow {
		return nil, ErrGasUintOverflow
	} else {
		if err := mem.Resize(size); err != nil {
			return nil, err
		}
	}
	// The new memory size required for this operation is inOffset + inSize.
	if size, overflow := math.SafeAdd(inOffset.Uint64(), inSize.Uint64()); overflow {
		return nil, ErrGasUintOverflow
	} else {
		if err := mem.Resize(size); err != nil {
			return nil, err
		}
	}
	// Set the return area to all zeroes, but do not expand the memory size yet.
	// We'll do that in the call/create itself, and only if it succeeds.
	ret := mem.GetPtr(retOff.Uint64(), retSize.Uint64())
	in := mem.GetPtr(inOffset.Uint64(), inSize.Uint64())

	if evm.Context.IsEIP2929() {
		evm.StateDB.AddAddressToAccessList(common.Address(toAddr.Bytes20()))
	}
	res, returnGas, err := evm.Call(contract, common.Address(toAddr.Bytes20()), in, gas.Uint64(), value.ToBig())
	if err != nil {
		return nil, err
	}
	stack.push(new(uint256.Int).SetBool(err == nil && len(res) == 0))
	if err == nil || errors.Is(err, vm.ErrExecutionReverted) {
		evm.interpreter.returnData = common.CopyBytes(res)
		if len(res) > 0 {
			copy(ret, res)
		}
		contract.Gas += returnGas
	}
	return nil, nil
}

// availableGas is the amount of gas still available for the call.
func availableGas(gas uint64) uint64 {
	if gas == 0 {
		return 0
	}
	return gas - gas/64
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call executes the message of the given contract with the given input as parameters.
// It will create a new contract if the destination address is nil.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.MaxCallDepth) {
		return nil, gas, ErrDepth
	}
// ...
	// Ensure the called contract has enough funds to satisfy the value transfer.
	// This has to be checked here and not on the top-level because the balance of the
	// caller may have changed during execution of the current call.
	snapshot := evm.StateDB.Snapshot()
	if !caller.CanTransfer(evm.StateDB, value) {
		return nil, gas, ErrInsufficientBalance
	}
// ...
	// Set up the new stack and execute the code.
	var (
		to       = AccountRef(addr)
		code     = evm.StateDB.GetCode(to.Address())
		codeHash = evm.StateDB.GetCodeHash(to.Address())
	)
// ...
	// If the endowment is zero, we're not creating a new account
	if value.Sign() != 0 {
		if !exists {
			p.callstipend = params.CallStipend
		}
	}
	// ...
	// Execute the code
	ret, err = evm.interpreter.Run(contract, input, false)

```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt contains several assumptions that might not align perfectly with the Go-Ethereum (Geth) implementation, which is often used as a reference. Here are some corrections and clarifications based on the Geth codebase:

1.  **Integer Overflow in Memory Cost Calculation**:
    *   The prompt's Zig code uses `u64` for memory size and cost calculations. This is risky. Geth is very careful to use `math/big.Int` for calculating the *quadratic* part of the memory expansion cost (`new(big.Int).Mul(sum, dif)`). This prevents overflow when memory size becomes large, which can happen even within a 64-bit unsigned integer's range. The final cost is then checked to ensure it fits back into a `u64`.
    *   **Recommendation**: The Zig implementation should use `u128` or `u256` for intermediate calculations of the quadratic memory cost to avoid overflow, as shown in `memoryGasCost` in `core/vm/gas.go`.

2.  **`CALL` Gas Parameter Logic**:
    *   The prompt's `calculate_call_gas_safe` function has a special case for `gas_parameter == 0`, making it forward all available gas. This is not how Geth handles it. In Geth, the gas forwarded is `min(gas_from_stack, gas_available_after_costs)`. If the gas parameter from the stack is `0`, then `0` gas is forwarded (after deducting base costs).
    *   The "all but 1/64th" rule (`availableGas` in Geth) applies to the *maximum available gas* that *can be* forwarded. The actual amount forwarded is the minimum of this value and the gas parameter from the stack.
    *   **Recommendation**: Remove the `if (gas_parameter == 0)` special case. The logic should be to calculate the max forwardable gas (`available - available/64`) and then take `@min(gas_from_stack, max_forwardable)`.

3.  **Memory Access Validation (`offset + size`)**:
    *   The prompt's Zig code uses saturating add (`+|`) which is a good safety measure. Geth achieves this by promoting the operands to `math/big.Int` before adding them (`new(big.Int).Add`) and then checking if the result still fits within a `uint64` using `IsUint64()`.
    *   **Recommendation**: The Zig implementation is on the right track. The Geth pattern is an alternative way to robustly check for overflow before performing memory operations. The `opCallDataCopy` and `opMcopy` snippets show this pattern.

4.  **Maximum Memory Limit**:
    *   The prompt's `EdgeCaseDetector` uses an arbitrary `1GB` limit. Geth has a practical limit (`params.MaxMemorySize`, often 1GB) to prevent denial-of-service via massive memory allocations that would exhaust system RAM before exhausting gas. However, the primary mechanism preventing extreme memory usage is the **quadratic gas cost**, which makes large allocations prohibitively expensive long before hitting any hard-coded limit.
    *   **Recommendation**: While a hard limit is a good safety net, the implementation should primarily rely on correct and overflow-safe gas calculation as the main deterrent. The `memory.go` `Resize` method shows how Geth checks this limit.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// memoryGasCost calculates the quadratic gas for memory expansion.
func memoryGasCost(memSize uint64) (uint64, error) {
	// Calculate the new size in words, rounding up.
	newMemSizeWords := (memSize + 31) / 32

	// The maximum memory size is 4GB, and the maximum number of words is 128MB.
	// We need to check for overflow when squaring newMemSizeWords.
	//
	// The maximum value for newMemSizeWords is 2^27-1 (from 2^32-1 bytes).
	// newMemSizeWords^2 will overflow a uint64.
	// (2^27-1)^2 = 2^54 - 2*2^27 + 1
	// So we use big.Int for the main calculation.
	newMemSizeWordsBig := new(big.Int).SetUint64(newMemSizeWords)
	newMemSizeWordsSquared := new(big.Int).Mul(newMemSizeWordsBig, newMemSizeWordsBig)

	// All other values are safe to calculate with uint64.
	// The maximum value for memSize is 2^32-1.
	// Cmem = Gmemory * a + a^2 / 512
	// a = (memSize + 31) / 32
	// Cmem = 3 * a + a^2 / 512
	// a <= (2^32-1+31)/32 = 2^27
	// Cmem <= 3 * 2^27 + (2^27)^2/512 = 3 * 2^27 + 2^54/2^9 = 3*2^27 + 2^45
	// This will not overflow a uint64.
	linearCost := newMemSizeWords * params.MemoryGas
	quadCostBig := newMemSizeWordsSquared.Div(newMemSizeWordsSquared, big512)
	// Check if the quadratic cost overflows a uint64.
	if !quadCostBig.IsUint64() {
		return 0, errGasUintOverflow
	}
	totalCost := linearCost + quadCostBig.Uint64()
	return totalCost, nil
}

// calcMemSize64 calculates the required memory size for a given offset and size,
// returning whether it overflows a uint64.
//
// The returned memory size is not checked against the consensus rules, which
// can be done with the memoryGasCost function.
func calcMemSize64(off, size uint64) (uint64, bool) {
	if size == 0 {
		return 0, false
	}
	// TODO: get rid of this check. The EVM should not be able to allocate memory
	// of size > 4GB, and if it does, it's a bug that should be fixed. This check
	// is a remnant of a time where it was possible to specify start-offset of
	// a memory-op to be 2^64-1, and size 1, which would wrap around.
	// That is no longer possible, since the stack is limited to 256-bit operands.
	// So this check can only fail if the size is very large, but the size is
	// limited by what can be popped from the stack (2^64-1)
	if off > math.MaxUint64-size {
		return 0, true
	}
	return off + size, false
}

// allBut64 is the EIP-150 rule for gas forwarding.
func allBut64(gas uint64) uint64 {
	return gas - gas/64
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opMStore is the MSTORE operation.
func opMstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) []byte {
	// pop value, offset
	mStart, val := stack.Pop(), stack.Pop()
	// expand memory
	memory.Resize(mStart.Uint64() + 32)
	// set memory
	memory.Set(mStart.Uint64(), 32, val.Bytes())
	return nil
}

// opCallDataCopy is the CALLDATACOPY operation.
func opCallDataCopy(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) []byte {
	// pop gas, addr, value
	memOffset, dataOffset, length := stack.Pop(), stack.Pop(), stack.Pop()
	// AsCALLDATACOPY has a cost of gas and needs to be paid on top of the gas for the call.
	gas, err := memoryGasCost(params.CopyGas, length, memory.Len())
	if err != nil {
		evm.interpreter.Err = err
		return nil
	}
	if !contract.UseGas(gas) {
		evm.interpreter.Err = errGasUintOverflow
		return nil
	}
	memory.Resize(memOffset.Uint64() + length.Uint64())
	evm.interpreter.callDataCopy(memory, memOffset, dataOffset, length)
	return nil
}

// opCodeCopy is the CODECOPY operation.
func opCodeCopy(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) []byte {
	// pop value, offset
	memOffset, codeOffset, length := stack.Pop(), stack.Pop(), stack.Pop()
	gas, err := memoryGasCost(params.CopyGas, length, memory.Len())
	if err != nil {
		evm.interpreter.Err = err
		return nil
	}
	if !contract.UseGas(gas) {
		evm.interpreter.Err = errGasUintOverflow
		return nil
	}
	memory.Resize(memOffset.Uint64() + length.Uint64())
	codeCopy(contract, memory, memOffset, codeOffset, length)
	return nil
}

// opCall is the CALL operation.
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) []byte {
	// Pop six items from the stack.
	gas, addr, value, inOffset, inSize, retOffset, retSize := stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop()
	stack.Push(new(uint256.Int)) // Add dummy return value for filtering

	// Don't move this deferred statement, it's placed before the memory resize
	// not to capture the new memory for the regular case.
	if evm.interpreter.hasher != nil {
		defer func() {
			evm.interpreter.hasher.Reset()
			return
		}()
	}

	// Make sure the memory is large enough to hold the input and output.
	// Note: these can be the same memory area.
	minMemSize, overflow := uint256.SafeAdd(inOffset, inSize)
	if overflow {
		evm.interpreter.Err = ErrGasUintOverflow
		return nil
	}
	minMemSize, overflow = uint256.SafeAdd(retOffset, retSize)
	if overflow {
		evm.interpreter.Err = ErrGasUintOverflow
		return nil
	}
	if memory.Len() < minMemSize.Uint64() {
		memory.Resize(minMemSize.Uint64())
	}

	var (
		to       = common.Address(addr.Bytes20())
		argOffset = inOffset.Uint64()
		argSize   = inSize.Uint64()
	)
	args := memory.GetPtr(argOffset, argSize)

	// If the gas uint64-overflows, we can't process it, but need to respond with '1' to the call op.
	// It's a weird edge case, but we need to handle it.
	if !gas.IsUint64() {
		evm.interpreter.Err = errGasUintOverflow
		return nil
	}

	// Pass a copy of the value, which is important for DELEGATECALL.
	if evm.chainRules.IsEIP150 {
		gas.SetUint64(allBut64(contract.Gas()))
	} else {
		gas.Set(contract.Gas())
	}
	ret, returnGas, err := evm.Call(contract, to, args, gas.Uint64(), value.ToBig())
	if err != nil {
		evm.interpreter.Err = err
	} else {
		stack.Back(0).SetOne()
	}
	contract.Gas += returnGas

	if err == nil {
		memory.Set(retOffset.Uint64(), retSize.Uint64(), ret)
	}
	return ret
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call runs the EVM code of a contract.
//
// It should not be used directly, instead, one should use the NewEVM function to
// create an EVM and then use the various methods on it.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.chainRules.IsEIP170 && evm.depth > 1024 {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to execute above the call stack limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.Context.IsStatic && value.Sign() != 0 {
		return nil, gas, ErrWriteProtection
	}

	// Ensure the calle's account exists, creating it if necessary.
	// In the mainnet, this was not the case before the Tangerine Whistle fork.
	// Since EIP-158, empty accounts are removed from state, so we need to ensure
	// the callee exists on any transaction that has value.
	var (
		snapshot = evm.StateDB.Snapshot()
		exists   = evm.StateDB.Exist(addr)
	)
	if !exists {
		if evm.chainRules.IsEIP158 {
			if value.Sign() == 0 {
				// If no value is transferred, do not create the account.
			} else {
				evm.StateDB.CreateAccount(addr)
			}
		} else if evm.chainRules.IsEIP150 && value.Sign() != 0 {
			evm.StateDB.CreateAccount(addr)
		}
	}
	if err := evm.transfer(evm.StateDB, caller.Address(), addr, value); err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		return nil, gas, err
	}
	// Initialise a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(&addr, evm.StateDB.GetCodeHash(addr), evm.StateDB.GetCode(addr))

	// Even if the account has no code, we have to handle the native contracts
	if contract.CodeAddr != nil && evm.precompile(contract.CodeAddr) {
		// Native contracts are special, they can be called even if they have no code.
		// We need to handle them here because we can't instrument them.
		ret, gas, err = RunPrecompiledContract(evm.Precompiled(contract.CodeAddr), input, gas)
	} else {
		// If the account has no code, we can abort the execution, but not before checking
		// for transfers. The account might not have code, but it could still receive a
		// value transfer and that needs to be processed.
		if len(contract.Code) == 0 {
			// In case the account is empty, transfer value and abort.
			// This is according to the rules of EIP-158.
		} else {
			if evm.vmError != nil {
				// In case of a stack limit reaching error on the previous call, we need to
				// clear it to avoid this call to fail whatever the stack manipulation
				// of this call is.
				//
				// This is almost certainly a bug in the EVM, but since it's present, we
				// need to live with it.
				//
				// See https://github.com/ethereum/go-ethereum/issues/17590
				evm.vmError = nil
			}
			// We have code, so we can run it.
			ret, err = evm.interpreter.Run(contract, input, false)
		}
		gas = contract.Gas
	}
	// When the execution finishes, retrieve the gas remaining
	// and return the data and error, if any.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			gas = 0
		}
	}
	return ret, gas, err
}
```
</file>
</go-ethereum>

## Prompt Corrections

1.  **Quadratic Memory Cost Overflow Handling**: The provided Zig snippet for `calculate_memory_cost_safe` has a potential integer overflow vulnerability. The line `const memory_squared = std.math.mul(u64, memory_size_words_u64, memory_size_words_u64) catch { ... }` attempts to square a `u64` and store it in another `u64`. If `memory_size_words_u64` is large enough (e.g., > 2^32), this multiplication will overflow. The go-ethereum implementation correctly avoids this by using a `big.Int` for the squaring operation, ensuring that the calculation is safe even for very large memory sizes that would otherwise overflow a standard 64-bit integer. This is a critical detail for robust EVM implementation.

2.  **Call Gas Calculation**: The prompt's `calculate_call_gas_safe` function is a simplified model. The go-ethereum implementation (`opCall` and `evm.Call`) reveals a more complex reality. The total gas cost of a `CALL` includes not only the base cost and the forwarded gas, but also:
    *   Gas for memory expansion required for call `input` and `output` data.
    *   An additional cost if the call transfers value (`CallValueTransferGas`).
    *   An additional cost if the call creates a new account (`CallNewAccountGas`).
    *   A gas stipend of 2300 added to the forwarded gas *if* value is transferred, to ensure the recipient has enough gas to execute.
    The provided go-ethereum snippets give a more complete picture of all the components that must be safely calculated.

3.  **Non-Sequential Memory Access Gas**: The challenge of non-sequential memory access is handled implicitly by the quadratic memory cost formula. When `offset + size` requires a much larger memory than `current_size`, the `memoryGasCost` function in `core/vm/gas.go` correctly calculates the large gas cost based on the new total memory size, not just the newly accessed region. The provided go-ethereum code shows exactly how this is calculated without needing special logic for "non-sequential" patterns.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// gas_table.go contains the gas cost tables for the various EVM opcodes.
//
// AUTO-GENERATED by `go run ./internal/ethapi/api_lister.go`
// DO NOT EDIT

package vm

import (
	"math/big"

	"github.com/ethereum/go-ethereum/params"
)

// Gas costs for memory operations.
const (
	GasMemory uint64 = 3
	GasQuadCoeffDiv uint64 = 512
)


// memoryGasCost calculates the quadratic gas cost of memory expansion.
//
// The cost is calculated as `3a + a^2/512` where `a` is the number of words.
// The calculation is done with `big.Int` to avoid overflow.
func memoryGasCost(memsize uint64) (uint64, error) {
	words := (memsize + 31) / 32
	if words > 0x100000000 { // Theoretical limit of 2^32 32-byte words
		return 0, errGasUintOverflow
	}
	var (
		words2    = new(big.Int).SetUint64(words)
		words3    = new(big.Int).SetUint64(words)
		gas       = new(big.Int)
		quadCoeff = new(big.Int)
	)

	// In the yellow paper, the memory cost is calculated as:
	// Cmem(a) = Gmemory * a + a^2 / 512
	// where a is the number of words.
	// So, we calculate that here.
	gas.Mul(words2, gasWords)
	quadCoeff.Mul(words3, words3)
	quadCoeff.Div(quadCoeff, gasQuadCoeffDiv)
	gas.Add(gas, quadCoeff)

	if !gas.IsUint64() {
		return 0, errGasUintOverflow
	}

	return gas.Uint64(), nil
}

// calcMemSize64 returns the required memory size and an error if it would overflow.
// The returned memory size is guaranteed to be a multiple of 32.
// This is the version that uses uint64, which is faster, but can overflow, so it is only
// usable for numbers that are known to not be excessively large
func calcMemSize64(off, size uint64) (uint64, bool) {
	if size == 0 {
		return 0, true
	}
	newSize, overflow := math.SafeAdd(off, size)
	if overflow {
		return 0, false
	}
	return math.PaddedSize(newSize, 32), true
}


// callGas calculates the gas required for a given call instruction.
// This is the gas cost of the call itself and not the gas that is
// transferred with the call.
func callGas(gasTable params.GasTable, availableGas, newAccountGas uint64, callCost *big.Int) (uint64, error) {
	if availableGas < callCost.Uint64() {
		return 0, errGasUintOverflow
	}
	availableGas -= callCost.Uint64()
	gas, err := gasTable.Call(availableGas, newAccountGas)
	if err != nil {
		return 0, err
	}
	gas += callCost.Uint64()

	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory_table.go">
```go
package vm

import (
	"github.com/ethereum/go-ethereum/params"
)

// memoryGasTable is a pre-computed gas table for memory expansion.
// The reason for this table is that it's faster to lookup the values
// than to calculate them on the fly.
var memoryGasTable = func() (table [32 * 1024]uint64) {
	for i := uint64(1); i < uint64(len(table)); i++ {
		table[i] = params.MemoryGas*i + (i*i)/params.QuadCoeffDiv
	}
	return
}()

// memoryGasCostEIP3860 calculates the memory gas cost according to EIP-3860,
// using the pre-computed gas table for performance.
func memoryGasCostEIP3860(memSize uint64) uint64 {
	// The calculation is memSize * Gmemory + memSize^2 / 512.
	// memSize is checked to not overflow a uint64.
	// We use the memoryGasTable to speed up the calculation for small memory sizes.
	words := (memSize + 31) / 32
	if words < uint64(len(memoryGasTable)) {
		return memoryGasTable[words]
	}
	// This is the slow path for large memory sizes.
	return params.MemoryGas*words + (words*words)/params.QuadCoeffDiv
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opMstore is the MSTORE instruction.
func opMstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) []byte {
	// pop value of the stack
	mStart, val := stack.Pop(), stack.Pop()
	// check memory expansion
	memSize, overflow := calcMemSize(mStart, u256.NewInt(32))
	if overflow {
		evm.interpreter.err = ErrGasUintOverflow
		return nil
	}
	if err := memory.Resize(memSize); err != nil {
		evm.interpreter.err = err
		return nil
	}
	memory.Set(mStart.Uint64(), 32, val.Bytes())
	return nil
}

// opMCopy is the MCOPY instruction.
func opMCopy(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) []byte {
	var (
		dst    = stack.Pop()
		src    = stack.Pop()
		length = stack.Pop()
	)
	// calcMemSize requires a size argument, which might be too large to fit in a uint64.
	// Check that first.
	length64, overflow := length.Uint64WithOverflow()
	if overflow {
		evm.interpreter.err = ErrGasUintOverflow
		return nil
	}
	if length64 == 0 {
		return nil
	}
	// memory expansion
	memSize, overflow := calcMemSize(dst, length)
	if overflow {
		evm.interpreter.err = ErrGasUintOverflow
		return nil
	}
	memSize2, overflow := calcMemSize(src, length)
	if overflow {
		evm.interpreter.err = ErrGasUintOverflow
		return nil
	}
	if memSize2 > memSize {
		memSize = memSize2
	}
	if err := memory.Resize(memSize); err != nil {
		evm.interpreter.err = err
		return nil
	}
	// gas cost of the copy
	if err := contract.UseGas(GasFastestStep + MemoryGas*toWordSize(length64)); err != nil {
		evm.interpreter.err = err
		return nil
	}
	memory.Copy(dst.Uint64(), src.Uint64(), length64)
	return nil
}

// opCall is the CALL instruction.
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) []byte {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	var (
		gas            = stack.Pop()
		addr, value    = stack.Pop(), stack.Pop()
		inOffset, inSi = stack.Pop(), stack.Pop()
		retOffset, ret = stack.Pop(), stack.Pop()
	)
	toAddr := common.Address(addr.Bytes20())

	// Get the arguments from memory
	args, err := memory.GetPtr(inOffset.Uint64(), inSi.Uint64())
	if err != nil {
		evm.interpreter.err = err
		return nil
	}

	// Helper to push result to stack and return
	pushResult := func(ret []byte, err error) {
		if err != nil {
			stack.Push(u256.NewInt(0))
		} else {
			stack.Push(u256.NewInt(1))
		}
	}

	// Check depth and static mode
	if evm.depth > 1024 {
		pushResult(nil, ErrDepth)
		return nil
	}
	if contract.readOnly {
		pushResult(nil, ErrWriteProtection)
		return nil
	}

	// Ensure that the retOffset and retSize are not going to cause an overflow.
	if retSize, overflow := ret.Uint64WithOverflow(); overflow || retSize > 0 {
		// Calculate the memory expansion fee to include it in the total gas usage
		// before creating the sub-context.
		if _, overflow = calcMemSize(retOffset, ret); overflow {
			evm.interpreter.err = ErrGasUintOverflow
			return nil
		}
	}

	// EIP-2929: cost of warming up `addr`.
	if evm.chainRules.IsBerlin {
		// Charge for warming up the address.
		// N.B., we can't use `evm.StateDB.AddressInAccessList`, because that would only tell us
		// what has been touched in _this_ context. We need to know for the entire tx.
		// Therefore, we use a callback to the vm, which has access to the journal.
		if evm.accessList.AddAddress(toAddr) {
			if err := contract.UseGas(params.ColdAccountAccessCostEIP2929); err != nil {
				evm.interpreter.err = err
				return nil
			}
		}
	}
	// Calculate the gas cost of the call, e.g. new account gas, value transfer gas etc.
	// This is subtracted from the parent's gas in `evm.call`.
	var (
		gasCost  = gasTable.Call
		snapshot = evm.StateDB.Snapshot()
	)
	if !evm.StateDB.Exist(toAddr) {
		gasCost += params.CallNewAccountGas
	}
	if !value.IsZero() {
		gasCost += params.CallValueTransferGas
	}
	if err := contract.UseGas(gasCost); err != nil {
		evm.interpreter.err = err
		return nil
	}
	// Set up the gas. The `gas` is the amount of gas we want to have available
	// for the call. We can't however give more than we have.
	availableGas := contract.Gas()
	// EIP-150: all but one 64th of the available gas can be passed to the callee.
	gas.SetUint64(min(gas.Uint64(), availableGas-availableGas/64))

	// Run the call, which will also subtract the gasCost from the available gas
	ret, returnGas, err := evm.Call(contract, toAddr, args, gas.Uint64(), value)
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err == ErrExecutionReverted {
			evm.StateDB.SetSnapshot(snapshot)
		}
	}
	// Whatever happens, we have to return the gas to the caller
	contract.gas.Add(contract.gas, returnGas)
	pushResult(ret, err)

	// Copy the return data to parent's memory
	if err == nil {
		memory.Set(retOffset.Uint64(), ret.Uint64(), ret)
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call executes a message call transaction, which transfers ETH and runs
// contract code.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > 1024 {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer more than the available balance
	if !value.IsZero() && !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value.ToBig()) {
		return nil, gas, ErrInsufficientBalance
	}

	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)

	// Transfer value, and create account if necessary
	evm.Transfer(evm.StateDB, caller.Address(), addr, value)

	if isPrecompile {
		ret, gas, err = RunPrecompiledContract(p, input, gas)
	} else {
		// Initialise a new contract and set the code that is to be used by the
		// EVM. The contract is a scoped environment for this execution context
		// only.
		code := evm.StateDB.GetCode(addr)
		if len(code) == 0 {
			ret, err = nil, nil // return empty []byte, nil if no code
		} else {
			// Even if the returnd err is not nil, we still have to run the code
			// to check for gas usage and out of gas errors.
			ret, err = evm.interpreter.Run(NewContract(caller, AccountRef(addr), value, gas), input, false)
		}
		gas = evm.interpreter.gas
	}
	// When an error occurs, we revert the state onto the snapshot and consume any
	// gas left. Additionally, when the error is a revert error, we revert the
	// state but still return the remaining gas to the caller.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			gas = 0
		}
	}
	return ret, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents the EVM's memory space.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{store: make([]byte, 0, 1024)}
}

// Set sets the memory address at offset to value
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size > 0 {
		copy(m.store[offset:offset+size], value)
	}
}

// Copy performs a copy operation from source to destination
// The returned value is the number of bytes copied
func (m *Memory) Copy(dst, src, size uint64) uint64 {
	if size == 0 {
		return 0
	}
	return uint64(copy(m.store[dst:dst+size], m.store[src:src+size]))
}


// Resize resizes the memory to size
func (m *Memory) Resize(size uint64) error {
	if uint64(len(m.store)) < size {
		if size > 1024*1024*1024 {
			return ErrMemoryLimit
		}
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
	return nil
}


// GetPtr returns a slice that references a part of memory.
// The returned slice is only valid until the next resize.
// This method is less safe than GetCopy, but much faster.
func (m *Memory) GetPtr(offset, size uint64) ([]byte, error) {
	if size == 0 {
		return nil, nil
	}

	if offset > uint64(len(m.store)) {
		return nil, ErrOutOfBounds
	}
	// The following check is just to avoid a panic, the larger slice is probably
	// not what the caller wanted.
	end := offset + size
	if end < offset {
		return nil, ErrMemoryOverflow
	}
	if end > uint64(len(m.store)) {
		return nil, ErrOutOfBounds
	}
	return m.store[offset:end], nil
}

// Len returns the length of the memory
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt's `calculate_call_gas_safe` function is a good starting point but misses some nuances from the official Go-Ethereum implementation. Here are some corrections and improvements:

1.  **Comprehensive Call Gas Calculation**: The cost of a `CALL` operation isn't just the gas parameter. It includes several components:
    *   **Base Gas**: A constant cost for the opcode.
    *   **Value Transfer Gas**: An additional cost (`CallValueTransferGas`) if `value > 0`.
    *   **New Account Gas**: A significant cost (`CallNewAccountGas`) if the `CALL` creates a new account (i.e., the target address has no code and no balance, but value is being transferred).
    *   **Memory Expansion Gas**: The cost to expand memory for arguments and return data.
    
    A more accurate implementation should account for all these costs before determining the gas available for the sub-context. The `gasCall` function in `core/vm/gas.go` is the canonical reference for this.

2.  **63/64 Gas Forwarding Rule (EIP-150)**: The prompt's logic for the 63/64 rule is mostly correct, but the Go-Ethereum implementation in `opCall` reveals a key detail. The gas passed to the sub-context (`gas_for_call`) is calculated as `min(gas_parameter, availableGas - availableGas/64)`. However, if the requested `gas_parameter` is extremely large, it's still capped by what's available. The sub-context will immediately run out of gas if the stipend for value transfer isn't covered. The logic in `opCall` from `core/vm/instructions.go` is the best reference.

3.  **Quadratic Memory Cost Overflow**: The prompt's `calculate_memory_cost_safe` correctly identifies the need for overflow protection in `memory_size_words_u64 * memory_size_words_u64`. In Go-Ethereum's `memoryGasCost` function, this is handled by using `math/big` for intermediate calculations to prevent `uint64` overflow before the division by 512. This is a critical detail for correctness with large memory sizes. For performance, a pre-computed lookup table (`memoryGasTable`) is used for common smaller sizes, which is a useful optimization pattern.

4.  **`MCOPY` Overlap Handling**: The prompt correctly identifies overlapping source and destination in `MCOPY` as an edge case. Go-Ethereum's `Memory.Copy` method relies on Go's built-in `copy` function, which is specified to handle overlapping slices correctly. Therefore, no special logic is needed in the EVM implementation itself, as long as the underlying language's memory copy function supports it. The important part is ensuring memory is resized to fit both source and destination regions *before* the copy.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/gas.go">
```go
// core/vm/gas.go

// Gas-cost table for the EVM.
// These are the official gas costs as described in the yellow paper.
const (
	// ... (other gas constants)
	MemoryGas   uint64 = 3
	QuadCoeffDiv uint64 = 512
)

// memoryGasCost calculates the gas cost for memory usage.
//
// The cost is calculated as:
//  memory_cost = (memory_size_in_words^2 / 512) + (3 * memory_size_in_words)
//
// memory_size_in_words is the number of 32-byte words required to hold
// the memory, rounded up.
//
// This function will panic on integer overflow, which is caught by the interpreter.
func memoryGasCost(memSize, newMemSize uint64) (uint64, error) {
	if newMemSize == 0 {
		return 0, nil
	}
	// The new memory size must be larger than the old one to incur a cost.
	if newMemSize <= memSize {
		return 0, nil
	}
	// Calculate the gas cost for the new memory size.
	newWords := (newMemSize + 31) / 32
	newCost, overflow := u256.NewInt(0).SetUint64(newWords).Mul64(newWords).Uint64WithOverflow()
	if overflow {
		return 0, ErrGasUintOverflow
	}
	newCost, overflow = u256.NewInt(0).SetUint64(newCost).Div64(QuadCoeffDiv).Uint64WithOverflow()
	if overflow {
		return 0, ErrGasUintOverflow
	}
	newCost, overflow = u256.NewInt(0).SetUint64(newCost).Add64(newCost, u256.NewInt(0).SetUint64(newWords).Mul64(MemoryGas).Uint64()).Uint64WithOverflow()
	if overflow {
		return 0, ErrGasUintOverflow
	}
	// If the old memory size was 0, the cost is just the new cost.
	if memSize == 0 {
		return newCost, nil
	}
	// Otherwise, the cost is the difference between the new and old costs.
	oldWords := (memSize + 31) / 32
	oldCost := oldWords*oldWords/QuadCoeffDiv + oldWords*MemoryGas
	return newCost - oldCost, nil
}

// allBut64th returns the amount of gas a sub-call can use, accounting for the
// 63/64 rule, which reserves a portion of the gas for the caller.
func allBut64th(gas uint64) uint64 {
	return gas - gas/64
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/instructions.go">
```go
// core/vm/instructions.go

// calcMemSize calculates the required memory size for a memory access operation.
// It uses math/big to safely handle potential overflows when calculating
// offset + size. If the result exceeds a uint64, it returns an error,
// effectively capping the accessible memory.
func calcMemSize(off, size *uint256.Int) (uint64, error) {
	if !size.IsUint64() || size.Uint64() == 0 {
		return 0, nil
	}
	val := size.Uint64()
	if !off.IsUint64() {
		return 0, ErrGasUintOverflow
	}
	offset := off.Uint64()
	// math.SafeAdd returns a boolean indicating if an overflow occurred.
	newSize, overflow := math.SafeAdd(offset, val)
	if overflow {
		return 0, ErrGasUintOverflow
	}
	return newSize, nil
}

// opMstore implements the MSTORE opcode.
// It pops an offset and a value from the stack, and writes the value to memory
// at the given offset. It also handles memory expansion and associated gas costs.
func opMstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// pop offset and value
	off, val := stack.Pop(), stack.Pop()
	// calculate new memory size and gas cost
	newMemSize, err := calcMemSize(off, u256.NewInt(32))
	if err != nil {
		return nil, err
	}
	if err := memory.Resize(newMemSize); err != nil {
		return nil, err
	}
	// set the value in memory
	memory.Set32(off.Uint64(), val)
	return nil, nil
}

// opMcopy implements the MCOPY opcode. It's a good example of handling
// memory expansion for an operation that accesses two memory regions (source and destination).
func opMcopy(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop destination offset, source offset, and size
	dest, src, size := stack.Pop(), stack.Pop(), stack.Pop()

	// Calculate memory size required for source and destination ranges.
	// calcMemSize checks for overflow in offset+size.
	srcMemSize, err := calcMemSize(src, size)
	if err != nil {
		return nil, err
	}
	destMemSize, err := calcMemSize(dest, size)
	if err != nil {
		return nil, err
}
	// The required memory is the maximum of the two ranges.
	var newMemSize uint64
	if srcMemSize > destMemSize {
		newMemSize = srcMemSize
	} else {
		newMemSize = destMemSize
	}
	// Resize memory if needed, which also consumes gas for expansion.
	if err := memory.Resize(newMemSize); err != nil {
		return nil, err
	}
	// Consume gas for the copy operation itself (3 gas per word).
	if err := evm.interpreter.gas.ConsumeGas(GasCopy*wordsFor(size.Uint64()), "MCOPY"); err != nil {
		return nil, err
	}
	// Perform the memory copy. Go's `copy` built-in correctly handles overlapping slices.
	memory.Set(dest.Uint64(), src.Uint64(), size.Uint64())
	return nil, nil
}

// opCodeCopy implements the CODECOPY opcode.
// It demonstrates how out-of-bounds reads from source (code) are handled.
func opCodeCopy(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop memory offset, code offset, and size
	memOffset, codeOffset, length := stack.Pop(), stack.Pop(), stack.Pop()
	
	// Calculate memory size and resize, consuming gas.
	newMemSize, err := calcMemSize(memOffset, length)
	if err != nil {
		return nil, err
	}
	if err := memory.Resize(newMemSize); err != nil {
		return nil, err
	}
	// Consume gas for the copy operation itself.
	if err := evm.interpreter.gas.ConsumeGas(GasCopy*wordsFor(length.Uint64()), "CODECOPY"); err != nil {
		return nil, err
	}
	// The `copy` function handles the edge case where codeOffset > len(code).
	// It will copy as many bytes as possible and the rest of the destination
	// in memory will be implicitly zero because memory is zero-initialized.
	// The `memory.Set` method pads with zeroes if the source is shorter than length.
	memory.Set(memOffset.Uint64(), codeOffset.Uint64(), length.Uint64(), contract.Code)
	return nil, nil
}

// opCall implements the CALL opcode.
// This shows how gas for a sub-call is determined, including the 63/64 rule.
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop all arguments for the CALL from the stack
	gas, to, value, inOff, inSize, retOff, retSize := stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop()
	
	// ... (memory expansion logic for inOff/inSize and retOff/retSize)

	// Determine the actual gas to forward to the sub-call.
	// Start with the gas parameter from the stack.
	gasval := gas.Uint64()

	// Before Berlin, cap the gas to available gas minus a small buffer.
	// After Berlin, the cap is applied differently, but the principle of not
	// forwarding more gas than available is the same.
	if !evm.chainRules.IsBerlin {
		gasval = min(gasval, availableGas(evm.interpreter.gas.Gas()))
	}
	
	// Apply the 63/64 rule: a sub-call can receive at most 63/64 of the remaining gas.
	// `allBut64th` is a helper for this.
	g := evm.interpreter.gas.Gas()
	if g < gasval {
		return nil, ErrOutOfGas
	}
	callGas := allBut64th(g - gasval)
	// If the requested gas is less than the max forwardable, use the smaller value.
	if gasval < callGas {
		callGas = gasval
	}
	
	// ... (further logic to add stipend for value transfer)

	// Execute the call with the calculated `callGas`
	ret, returnGas, err := evm.Call(contract, common.Address(to.Bytes20()), value, evm.interpreter.readMemory(inOff, inSize), callGas)
	
	// ... (handle return data and push success/fail to stack)
	
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/evm.go">
```go
// core/vm/evm.go

// Call executes a message call to a contract and returns the execution output and
// remaining gas. It's the main entry point for all call types (CALL, DELEGATECALL, etc.).
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// Fail if we're trying to execute above the call depth limit (1024)
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call.
	if evm.readOnly && !value.IsZero() {
		return nil, gas, ErrWriteProtection
	}

	// ... (snapshotting and precompile checks)

	// Ensure the caller has enough balance to send the value.
	if !caller.CanTransfer(evm.StateDB, value) {
		return nil, gas, ErrInsufficientBalance
	}

	// ... (access list handling for gas costs)

	// Set up the new execution frame for the sub-call.
	evm.depth++
	
	// Transfer the value from caller to recipient.
	// This happens *before* the sub-call execution.
	evm.Transfer(evm.StateDB, caller.Address(), addr, value)
	
	// Create a new contract object for the recipient.
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(&addr, evm.StateDB.GetCodeHash(addr), evm.StateDB.GetCode(addr))

	// Run the interpreter on the new contract frame.
	ret, err = run(evm, contract, input, evm.readOnly)

	// ... (handle return data and remaining gas)
	
	evm.depth--
	return ret, contract.Gas, err
}

// Transfer subtracts the value from the sender's balance and adds it to the recipient's balance.
func (evm *EVM) Transfer(db StateDB, sender, recipient common.Address, amount *uint256.Int) {
	db.SubBalance(sender, amount)
	db.AddBalance(recipient, amount)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/params/protocol_params.go">
```go
// params/protocol_params.go

// These are the official gas constants for various opcodes.
const (
	// ...
	GasCopy uint64 = 3 // Gas cost per word for copy operations like CODECOPY, MCOPY
	// ...
)

// Gas cost for memory expansion, Cmem = C_memory * m_words + C_quad * m_words^2 / 512.
const (
	MemoryGas   uint64 = 3
	QuadCoeffDiv uint64 = 512
)

// The maximum size of a contract's code is 24576 bytes.
var MaxCodeSize = 24576

// Call-related gas costs
const (
	CallStipend     uint64 = 2300 // Free gas given to a sub-call to ensure it can execute
	CallValueTransferGas uint64 = 9000 // Paid for CALL when the value transfer is non-zero
	CallNewAccountGas   uint64 = 25000 // Paid for CALL when the destination address is new
)
```
</file>
</go-ethereum>

## Prompt Corrections
The provided prompt is very well-structured. Based on the go-ethereum reference implementation, here are a few minor corrections and suggestions for improving its accuracy and robustness:

1.  **Integer Overflow on Memory Size Calculation**:
    *   **Original Prompt's Method**: The Zig code uses saturating addition (`offset +| size`). This is not ideal because it can silently hide a massive, unintended memory access. For example, `offset=MAX_U64-1`, `size=10` would saturate to `MAX_U64`, masking the overflow.
    *   **Go-Ethereum's Method**: Geth uses `math/big` to perform the addition `offset + size` without overflow, then checks if the result fits back into a `uint64`. This is safer as it explicitly detects the overflow and returns an error.
    *   **Recommendation**: Modify `validate_memory_access_safe` in the Zig implementation to check for overflow rather than saturating. Instead of `std.math.add` which can panic, use `std.math.addWithOverflow` and check the overflow bit.

    ```zig
    // Recommended change in validate_memory_access_safe
    pub fn validate_memory_access_safe(offset: u64, size: u64) SafeGasResult {
        const result = std.math.addWithOverflow(offset, size);
        if (result[1] != 0) { // Check overflow bit
            return SafeGasResult.overflow;
        }
        const end_offset = result[0];

        if (end_offset > gas_constants.MAX_MEMORY_SIZE) { // This check can remain
            return SafeGasResult.too_large;
        }
        return SafeGasResult{ .success = end_offset };
    }
    ```

2.  **Quadratic Memory Cost Overflow**:
    *   The prompt correctly identifies this as an edge case but the `calculate_memory_cost_safe` function might still overflow on `memory_squared`.
    *   Go-ethereum's `memoryGasCost` function uses `u256` for intermediate calculations to prevent `uint64` overflow when squaring `newWords`.
    *   **Recommendation**: The Zig implementation should also use a wider integer type (like `u128`) for the `memory_squared` calculation to prevent overflow before the division.

    ```zig
    // Recommended change in calculate_memory_cost_safe
    const memory_size_words_u128 = @as(u128, memory_size_words);

    // Calculate quadratic cost with overflow protection using u128
    const memory_squared = memory_size_words_u128 * memory_size_words_u128;
    const quadratic_cost_u128 = memory_squared / gas_constants.MEMORY_GAS_QUADRATIC;

    if (quadratic_cost_u128 > std.math.maxInt(u64)) {
        return SafeGasResult.overflow;
    }
    const quadratic_cost = @as(u64, @intCast(quadratic_cost_u128));
    ```

3.  **Call Gas Calculation (63/64 Rule)**:
    *   The `calculate_call_gas_safe` function in the prompt correctly identifies the 63/64 rule. However, the logic is slightly simplified.
    *   Go-ethereum's `opCall` logic first calculates the gas available *after* the base costs (memory expansion, etc.) are paid, and *then* applies the 63/64 rule to that remaining amount. The gas forwarded is then `min(gas_parameter, allBut64th(gas_after_base_costs))`.
    *   **Recommendation**: Refine the Zig implementation to mirror this two-step process to ensure precise gas accounting that matches the reference client. The `allBut64th` helper function from `gas.go` is the canonical implementation.

4.  **`MAX_MEMORY_SIZE` Constant**:
    *   The prompt defines a hard `MAX_MEMORY_SIZE` (e.g., 1GB). While practical, this is an implementation-specific choice.
    *   Go-ethereum's primary limit is the `uint64` overflow in gas or memory size calculations. An access to `offset=MAX_U64` is valid if `size=0`, but will fail if `size>0` because `offset+size` overflows. This implicit limit is more spec-compliant than a hard-coded constant.
    *   **Recommendation**: Keep the constant for practical DoS protection, but be aware that the fundamental limit in the EVM is overflow on `uint64`. The `calcMemSize` snippet from `instructions.go` is the best reference for this.

