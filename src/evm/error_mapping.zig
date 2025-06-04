const std = @import("std");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("stack.zig");
const Memory = @import("memory.zig");

/// Centralized error mapping functions for consistent error handling across the EVM
/// Map Stack errors to ExecutionError
pub fn map_stack_error(err: Stack.Error) ExecutionError.Error {
    return switch (err) {
        Stack.Error.Overflow => ExecutionError.Error.StackOverflow,
        Stack.Error.Underflow => ExecutionError.Error.StackUnderflow,
        Stack.Error.OutOfBounds => ExecutionError.Error.StackUnderflow,
        Stack.Error.InvalidPosition => ExecutionError.Error.StackUnderflow,
    };
}

/// Map Memory errors to ExecutionError
pub fn map_memory_error(err: Memory.MemoryError) ExecutionError.Error {
    return switch (err) {
        Memory.MemoryError.OutOfMemory => ExecutionError.Error.OutOfGas,
        Memory.MemoryError.InvalidOffset => ExecutionError.Error.InvalidOffset,
        Memory.MemoryError.InvalidSize => ExecutionError.Error.InvalidSize,
        Memory.MemoryError.MemoryLimitExceeded => ExecutionError.Error.OutOfGas, // Map memory limit exceeded to OutOfGas as per EVM spec
        Memory.MemoryError.ChildContextActive => ExecutionError.Error.ChildContextActive,
        Memory.MemoryError.NoChildContextToRevertOrCommit => ExecutionError.Error.NoChildContextToRevertOrCommit,
    };
}

/// Map VM-level errors to ExecutionError
pub fn map_vm_error(err: anyerror) ExecutionError.Error {
    return switch (err) {
        error.OutOfMemory => ExecutionError.Error.OutOfGas,
        error.WriteProtection => ExecutionError.Error.WriteProtection,
        // Default to OutOfGas for allocation failures
        else => ExecutionError.Error.OutOfGas,
    };
}

/// Helper function for stack pop with error mapping
pub fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| map_stack_error(err);
}

/// Helper function for stack push with error mapping
pub fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| map_stack_error(err);
}

/// Helper function for stack peek with error mapping
pub fn stack_peek(stack: *const Stack, position: usize) ExecutionError.Error!u256 {
    return stack.peek(position) catch |err| map_stack_error(err);
}

/// Helper function for memory operations with error mapping
pub fn memory_set_byte(memory: *Memory, offset: usize, value: u8) ExecutionError.Error!void {
    return memory.set_byte(offset, value) catch |err| map_memory_error(err);
}

pub fn memory_set_u256(memory: *Memory, offset: usize, value: u256) ExecutionError.Error!void {
    return memory.set_u256(offset, value) catch |err| map_memory_error(err);
}

pub fn memory_set_data(memory: *Memory, offset: usize, data: []const u8) ExecutionError.Error!void {
    return memory.set_data(offset, data) catch |err| map_memory_error(err);
}

pub fn memory_get_slice(memory: *const Memory, offset: usize, size: usize) ExecutionError.Error![]const u8 {
    return memory.get_slice(offset, size) catch |err| map_memory_error(err);
}

pub fn memory_ensure_capacity(memory: *Memory, size: usize) ExecutionError.Error!void {
    _ = memory.ensure_context_capacity(size) catch |err| return map_memory_error(err);
}

pub fn memory_copy_within(memory: *Memory, src: usize, dest: usize, size: usize) ExecutionError.Error!void {
    return memory.copy_within(src, dest, size) catch |err| map_memory_error(err);
}

pub fn memory_get_u256(memory: *const Memory, offset: usize) ExecutionError.Error!u256 {
    return memory.get_u256(offset) catch |err| map_memory_error(err);
}

pub fn memory_set_data_bounded(memory: *Memory, offset: usize, data: []const u8, data_offset: usize, size: usize) ExecutionError.Error!void {
    return memory.set_data_bounded(offset, data, data_offset, size) catch |err| map_memory_error(err);
}

/// Helper function for VM storage operations with error mapping
pub fn vm_set_storage(vm: anytype, address: anytype, slot: u256, value: u256) ExecutionError.Error!void {
    return vm.set_storage(address, slot, value) catch |err| map_vm_error(err);
}

pub fn vm_get_storage(vm: anytype, address: anytype, slot: u256) ExecutionError.Error!u256 {
    return vm.get_storage(address, slot) catch |err| map_vm_error(err);
}

pub fn vm_set_transient_storage(vm: anytype, address: anytype, slot: u256, value: u256) ExecutionError.Error!void {
    return vm.set_transient_storage(address, slot, value) catch |err| map_vm_error(err);
}

pub fn vm_get_transient_storage(vm: anytype, address: anytype, slot: u256) ExecutionError.Error!u256 {
    return vm.get_transient_storage(address, slot) catch |err| map_vm_error(err);
}

test "map_stack_error" {
    const testing = std.testing;

    try testing.expectEqual(ExecutionError.Error.StackOverflow, map_stack_error(Stack.Error.Overflow));
    try testing.expectEqual(ExecutionError.Error.StackUnderflow, map_stack_error(Stack.Error.Underflow));
    try testing.expectEqual(ExecutionError.Error.StackUnderflow, map_stack_error(Stack.Error.OutOfBounds));
    try testing.expectEqual(ExecutionError.Error.StackUnderflow, map_stack_error(Stack.Error.InvalidPosition));
}

test "map_memory_error" {
    const testing = std.testing;

    try testing.expectEqual(ExecutionError.Error.OutOfMemory, map_memory_error(Memory.MemoryError.OutOfMemory));
    try testing.expectEqual(ExecutionError.Error.InvalidOffset, map_memory_error(Memory.MemoryError.InvalidOffset));
    try testing.expectEqual(ExecutionError.Error.InvalidSize, map_memory_error(Memory.MemoryError.InvalidSize));
    try testing.expectEqual(ExecutionError.Error.OutOfGas, map_memory_error(Memory.MemoryError.MemoryLimitExceeded)); // Updated to match OutOfGas mapping
    try testing.expectEqual(ExecutionError.Error.ChildContextActive, map_memory_error(Memory.MemoryError.ChildContextActive));
    try testing.expectEqual(ExecutionError.Error.NoChildContextToRevertOrCommit, map_memory_error(Memory.MemoryError.NoChildContextToRevertOrCommit));
}

test "map_vm_error" {
    const testing = std.testing;

    try testing.expectEqual(ExecutionError.Error.OutOfGas, map_vm_error(error.OutOfMemory));
    try testing.expectEqual(ExecutionError.Error.WriteProtection, map_vm_error(error.WriteProtection));
    // Test unknown error defaults to OutOfGas
    try testing.expectEqual(ExecutionError.Error.OutOfGas, map_vm_error(error.UnknownError));
}
