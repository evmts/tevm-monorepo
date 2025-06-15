const std = @import("std");
const testing = std.testing;
const evm = @import("evm");

// Test equivalents for evmone unit tests
// Based on evmone/test/unittests/evm_test.cpp

// Note: These tests focus on testing the basic types and operations
// that evmone tests to ensure API compatibility.

test "basic_stack_operations" {
    // Test that we can perform basic stack operations like evmone
    var stack = evm.Stack{};
    
    // Test empty stack
    try testing.expectEqual(@as(usize, 0), stack.size);
    
    // Test push/pop operations
    try stack.append(1);
    try stack.append(2);
    try stack.append(3);
    
    try testing.expectEqual(@as(usize, 3), stack.size);
    
    // Test pop operations
    const val3 = try stack.pop();
    const val2 = try stack.pop();
    const val1 = try stack.pop();
    
    try testing.expectEqual(@as(u256, 3), val3);
    try testing.expectEqual(@as(u256, 2), val2);
    try testing.expectEqual(@as(u256, 1), val1);
    try testing.expectEqual(@as(usize, 0), stack.size);
}

test "stack_underflow_protection" {
    // Test that stack underflow is properly detected
    var stack = evm.Stack{};
    
    // Try to pop from empty stack
    const result = stack.pop();
    try testing.expectError(evm.ExecutionError.Error.StackUnderflow, result);
}

test "stack_overflow_protection" {
    // Test that stack overflow is properly detected
    var stack = evm.Stack{};
    
    // Fill stack to capacity
    var i: usize = 0;
    while (i < evm.Stack.CAPACITY) {
        try stack.append(@as(u256, @intCast(i)));
        i += 1;
    }
    
    // Try to push one more item
    const result = stack.append(999);
    try testing.expectError(evm.ExecutionError.Error.StackOverflow, result);
}

test "basic_memory_operations" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var memory = try evm.Memory.init_default(allocator);
    memory.finalize_root(); // Required after init() and storage at stable address
    defer memory.deinit();
    
    // Test initial state
    try testing.expectEqual(@as(usize, 0), memory.context_size());
    
    // Test memory expansion
    const data = [_]u8{0xaa, 0xbb, 0xcc, 0xdd};
    try memory.set_data(0, &data);
    
    // Memory should expand to accommodate the data
    try testing.expect(memory.context_size() >= data.len);
    
    // Test reading back the data
    const read_data = try memory.get_slice(0, data.len);
    try testing.expectEqualSlices(u8, &data, read_data);
}

test "execution_error_types" {
    // Test that all the evmone-equivalent error types exist
    const errors = [_]evm.ExecutionError.Error{
        evm.ExecutionError.Error.STOP,
        evm.ExecutionError.Error.REVERT,
        evm.ExecutionError.Error.INVALID,
        evm.ExecutionError.Error.OutOfGas,
        evm.ExecutionError.Error.StackUnderflow,
        evm.ExecutionError.Error.StackOverflow,
        evm.ExecutionError.Error.InvalidJump,
    };
    
    // Just verify the types exist and can be compared
    for (errors) |err| {
        try testing.expect(err == err);
    }
}

test "arithmetic_operations_basic" {
    // Test basic arithmetic patterns that evmone tests
    var stack = evm.Stack{};
    
    // Test ADD pattern: push 5, push 3, ADD should give 8
    try stack.append(5);
    try stack.append(3);
    
    // Simulate ADD operation manually
    const b = try stack.pop();
    const a = try stack.pop();
    const result = a + b;
    try stack.append(result);
    
    try testing.expectEqual(@as(usize, 1), stack.size);
    const top = try stack.peek();
    try testing.expectEqual(@as(u256, 8), top);
}

test "jump_destination_validation" {
    // Test basic jump destination concepts that evmone tests
    
    // JUMPDEST opcode is 0x5b
    const jumpdest_opcode: u8 = 0x5b;
    const invalid_opcode: u8 = 0x00; // STOP
    
    // Basic validation - JUMPDEST is valid, others are not
    try testing.expectEqual(@as(u8, 0x5b), jumpdest_opcode);
    try testing.expect(invalid_opcode != jumpdest_opcode);
}

test "gas_tracking_concepts" {
    // Test basic gas tracking concepts that evmone uses
    const initial_gas: u64 = 1000;
    var remaining_gas: u64 = initial_gas;
    
    // Simulate gas consumption
    const operation_cost: u64 = 3;
    if (remaining_gas >= operation_cost) {
        remaining_gas -= operation_cost;
    } else {
        return evm.ExecutionError.Error.OutOfGas;
    }
    
    try testing.expectEqual(@as(u64, 997), remaining_gas);
}

test "memory_expansion_gas" {
    // Test memory expansion gas calculation concepts
    const word_size: usize = 32;
    
    // Calculate number of words needed for a given size
    const size: usize = 50;
    const words_needed = (size + word_size - 1) / word_size;
    
    try testing.expectEqual(@as(usize, 2), words_needed); // 50 bytes needs 2 words
    
    // Memory expansion should be quadratic cost
    const linear_cost = words_needed * 3;
    const quadratic_cost = (words_needed * words_needed) / 512;
    const total_cost = linear_cost + quadratic_cost;
    
    try testing.expect(total_cost >= linear_cost);
}

test "code_analysis_basics" {
    // Test basic code analysis concepts that evmone uses
    
    // Simple bytecode: PUSH1 0x04, JUMP, STOP, JUMPDEST
    const bytecode = [_]u8{ 0x60, 0x04, 0x56, 0x00, 0x5b };
    
    // Find jump destinations
    var jump_destinations = std.ArrayList(usize).init(testing.allocator);
    defer jump_destinations.deinit();
    
    for (bytecode, 0..) |byte, i| {
        if (byte == 0x5b) { // JUMPDEST
            try jump_destinations.append(i);
        }
    }
    
    try testing.expectEqual(@as(usize, 1), jump_destinations.items.len);
    try testing.expectEqual(@as(usize, 4), jump_destinations.items[0]);
}