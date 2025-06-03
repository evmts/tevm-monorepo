const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const error_mapping = evm.error_mapping;
const ExecutionError = evm.execution_error;
const Stack = evm.stack;
const Memory = evm.memory;

test "Error mapping: Stack errors mapped correctly" {
    const allocator = testing.allocator;
    
    // Test stack overflow mapping
    var stack = Stack{};
    
    // Fill stack to capacity
    var i: usize = 0;
    while (i < Stack.CAPACITY) : (i += 1) {
        try stack.append(@intCast(i));
    }
    
    // Next append should fail with Overflow
    const result = error_mapping.stack_push(&stack, 999);
    try testing.expectError(ExecutionError.Error.StackOverflow, result);
    
    // Test stack underflow mapping
    var empty_stack = Stack{};
    const pop_result = error_mapping.stack_pop(&empty_stack);
    try testing.expectError(ExecutionError.Error.StackUnderflow, pop_result);
    
    // Test peek out of bounds
    const peek_result = error_mapping.stack_peek(&empty_stack, 10);
    try testing.expectError(ExecutionError.Error.StackUnderflow, peek_result);
}

test "Error mapping: Memory errors mapped correctly" {
    const allocator = testing.allocator;
    
    // Create memory with small limit
    var memory = try Memory.init(allocator, 1024, 1024); // 1KB limit
    defer memory.deinit();
    memory.finalize_root();
    
    // Test memory limit exceeded
    const result = error_mapping.memory_ensure_capacity(&memory, 2048);
    try testing.expectError(ExecutionError.Error.MemoryLimitExceeded, result);
    
    // Test invalid offset
    const slice_result = error_mapping.memory_get_slice(&memory, 2000, 100);
    try testing.expectError(ExecutionError.Error.InvalidOffset, slice_result);
}

test "Error mapping: VM errors mapped correctly" {
    // Create a mock VM that returns specific errors
    const MockVm = struct {
        pub fn get_storage(self: *@This(), address: anytype, slot: u256) !u256 {
            _ = self;
            _ = address;
            _ = slot;
            return error.OutOfMemory;
        }
        
        pub fn set_storage(self: *@This(), address: anytype, slot: u256, value: u256) !void {
            _ = self;
            _ = address;
            _ = slot;
            _ = value;
            return error.OutOfMemory;
        }
        
        pub fn set_transient_storage(self: *@This(), address: anytype, slot: u256, value: u256) !void {
            _ = self;
            _ = address;
            _ = slot;
            _ = value;
            return error.WriteProtection;
        }
    };
    
    var mock_vm = MockVm{};
    
    // Test OutOfMemory -> OutOfGas mapping
    const get_result = error_mapping.vm_get_storage(&mock_vm, 0, 0);
    try testing.expectError(ExecutionError.Error.OutOfGas, get_result);
    
    const set_result = error_mapping.vm_set_storage(&mock_vm, 0, 0, 0);
    try testing.expectError(ExecutionError.Error.OutOfGas, set_result);
    
    // Test WriteProtection mapping
    const transient_result = error_mapping.vm_set_transient_storage(&mock_vm, 0, 0, 0);
    try testing.expectError(ExecutionError.Error.WriteProtection, transient_result);
}

test "Error mapping: Helper functions work correctly" {
    const allocator = testing.allocator;
    
    // Test successful operations
    var stack = Stack{};
    try error_mapping.stack_push(&stack, 42);
    const value = try error_mapping.stack_pop(&stack);
    try testing.expectEqual(@as(u256, 42), value);
    
    // Test memory operations
    var memory = try Memory.init_default(allocator);
    defer memory.deinit();
    memory.finalize_root();
    
    try error_mapping.memory_set_byte(&memory, 0, 0xFF);
    try error_mapping.memory_set_word(&memory, 32, 12345);
    
    const data = [_]u8{1, 2, 3, 4};
    try error_mapping.memory_set_data(&memory, 64, &data);
    
    const slice = try error_mapping.memory_get_slice(&memory, 64, 4);
    try testing.expectEqualSlices(u8, &data, slice);
}

test "Error mapping: Edge cases handled properly" {
    // Test that all error types are handled
    try testing.expectEqual(ExecutionError.Error.StackOverflow, error_mapping.map_stack_error(Stack.Error.Overflow));
    try testing.expectEqual(ExecutionError.Error.StackUnderflow, error_mapping.map_stack_error(Stack.Error.Underflow));
    try testing.expectEqual(ExecutionError.Error.StackUnderflow, error_mapping.map_stack_error(Stack.Error.OutOfBounds));
    try testing.expectEqual(ExecutionError.Error.StackUnderflow, error_mapping.map_stack_error(Stack.Error.InvalidPosition));
    
    // Test memory error mappings
    try testing.expectEqual(ExecutionError.Error.OutOfMemory, error_mapping.map_memory_error(Memory.MemoryError.OutOfMemory));
    try testing.expectEqual(ExecutionError.Error.InvalidOffset, error_mapping.map_memory_error(Memory.MemoryError.InvalidOffset));
    try testing.expectEqual(ExecutionError.Error.InvalidSize, error_mapping.map_memory_error(Memory.MemoryError.InvalidSize));
    try testing.expectEqual(ExecutionError.Error.MemoryLimitExceeded, error_mapping.map_memory_error(Memory.MemoryError.MemoryLimitExceeded));
    try testing.expectEqual(ExecutionError.Error.ChildContextActive, error_mapping.map_memory_error(Memory.MemoryError.ChildContextActive));
    try testing.expectEqual(ExecutionError.Error.NoChildContextToRevertOrCommit, error_mapping.map_memory_error(Memory.MemoryError.NoChildContextToRevertOrCommit));
    
    // Test VM error mappings including unknown errors
    try testing.expectEqual(ExecutionError.Error.OutOfGas, error_mapping.map_vm_error(error.OutOfMemory));
    try testing.expectEqual(ExecutionError.Error.WriteProtection, error_mapping.map_vm_error(error.WriteProtection));
    try testing.expectEqual(ExecutionError.Error.OutOfGas, error_mapping.map_vm_error(error.SomeRandomError));
}