//! Error mapping module - Translates component-specific errors to ExecutionError
//! 
//! This module provides a centralized error translation layer that maps errors from
//! various EVM components (Stack, Memory, VM) to the unified ExecutionError type.
//! This ensures consistent error handling throughout the EVM implementation.
//! 
//! ## Purpose
//! 
//! Different EVM components have their own error types:
//! - Stack operations can fail with overflow/underflow
//! - Memory operations can exceed limits or have invalid offsets
//! - VM operations can violate state rules or run out of resources
//! 
//! This module translates all these specific errors into ExecutionError values
//! that the main execution loop can handle uniformly.
//! 
//! ## Design Benefits
//! 
//! 1. **Separation of Concerns**: Components define their own error types
//! 2. **Consistent Handling**: All errors are mapped to ExecutionError
//! 3. **Maintainability**: Error mappings are centralized in one place
//! 4. **Type Safety**: Compile-time checking of error mappings
//! 
//! ## Usage Pattern
//! 
//! ```zig
//! // Instead of:
//! const value = stack.pop() catch |err| switch (err) {
//!     Stack.Error.Underflow => return ExecutionError.Error.StackUnderflow,
//!     // ... handle other cases
//! };
//! 
//! // Use:
//! const value = try stack_pop(stack);
//! ```

const std = @import("std");
const ExecutionError = @import("execution/execution_error.zig");
const Stack = @import("stack.zig");
const Memory = @import("memory.zig");

/// Map Stack errors to ExecutionError
/// 
/// Translates stack-specific errors into execution errors that can be
/// handled by the main EVM execution loop.
/// 
/// ## Error Mappings
/// - `Overflow` → `StackOverflow`: Stack exceeded 1024 elements
/// - `Underflow` → `StackUnderflow`: Attempted to pop from empty stack
/// - `OutOfBounds` → `StackUnderflow`: Invalid stack position access
/// - `InvalidPosition` → `StackUnderflow`: Peek/swap at invalid position
/// 
/// ## Parameters
/// - `err`: The Stack error to map
/// 
/// ## Returns
/// The corresponding ExecutionError
pub fn map_stack_error(err: Stack.Error) ExecutionError.Error {
    return switch (err) {
        Stack.Error.Overflow => ExecutionError.Error.StackOverflow,
        Stack.Error.Underflow => ExecutionError.Error.StackUnderflow,
        Stack.Error.OutOfBounds => ExecutionError.Error.StackUnderflow,
        Stack.Error.InvalidPosition => ExecutionError.Error.StackUnderflow,
    };
}

/// Map Memory errors to ExecutionError
/// 
/// Translates memory-specific errors into execution errors. Note that
/// memory limit exceeded is mapped to OutOfGas per EVM specifications.
/// 
/// ## Error Mappings
/// - `OutOfMemory` → `OutOfMemory`: System allocation failure
/// - `InvalidOffset` → `InvalidOffset`: Offset beyond addressable range
/// - `InvalidSize` → `InvalidSize`: Size calculation overflow
/// - `MemoryLimitExceeded` → `OutOfGas`: Memory expansion too expensive
/// - `ChildContextActive` → `ChildContextActive`: Context management error
/// - `NoChildContextToRevertOrCommit` → `NoChildContextToRevertOrCommit`: No context to revert
/// 
/// ## Special Case: MemoryLimitExceeded
/// The EVM doesn't have a specific "memory limit exceeded" error. Instead,
/// memory expansion that would be too expensive results in OutOfGas.
/// 
/// ## Parameters
/// - `err`: The Memory error to map
/// 
/// ## Returns
/// The corresponding ExecutionError
pub fn map_memory_error(err: Memory.MemoryError) ExecutionError.Error {
    return switch (err) {
        Memory.MemoryError.OutOfMemory => ExecutionError.Error.OutOfMemory,
        Memory.MemoryError.InvalidOffset => ExecutionError.Error.InvalidOffset,
        Memory.MemoryError.InvalidSize => ExecutionError.Error.InvalidSize,
        Memory.MemoryError.MemoryLimitExceeded => ExecutionError.Error.OutOfGas, // Map memory limit exceeded to OutOfGas as per EVM spec
        Memory.MemoryError.ChildContextActive => ExecutionError.Error.ChildContextActive,
        Memory.MemoryError.NoChildContextToRevertOrCommit => ExecutionError.Error.NoChildContextToRevertOrCommit,
    };
}

/// Map VM-level errors to ExecutionError
/// 
/// Translates general VM errors (typically from state operations or
/// system-level failures) into execution errors.
/// 
/// ## Error Mappings
/// - `OutOfMemory` → `OutOfGas`: System resource exhaustion
/// - `WriteProtection` → `WriteProtection`: Attempted write in static context
/// - All others → `OutOfGas`: Conservative default for unknown errors
/// 
/// ## Design Note
/// Unknown errors default to OutOfGas as it's the safest error that
/// ensures state is reverted and no invalid operations succeed.
/// 
/// ## Parameters
/// - `err`: Any error type (uses anyerror for flexibility)
/// 
/// ## Returns
/// The corresponding ExecutionError
pub fn map_vm_error(err: anyerror) ExecutionError.Error {
    return switch (err) {
        error.OutOfMemory => ExecutionError.Error.OutOfGas,
        error.WriteProtection => ExecutionError.Error.WriteProtection,
        // Default to OutOfGas for allocation failures
        else => ExecutionError.Error.OutOfGas,
    };
}

/// Helper function for stack pop with error mapping
/// 
/// Wraps Stack.pop() with automatic error translation to ExecutionError.
/// This is the preferred way to pop values from the stack in opcode implementations.
/// 
/// ## Parameters
/// - `stack`: Mutable reference to the Stack
/// 
/// ## Returns
/// - Success: The popped u256 value
/// - Error: Mapped ExecutionError (typically StackUnderflow)
/// 
/// ## Example
/// ```zig
/// const a = try stack_pop(vm.stack);
/// const b = try stack_pop(vm.stack);
/// const result = a + b;
/// ```
pub fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| map_stack_error(err);
}

/// Helper function for stack push with error mapping
/// 
/// Wraps Stack.append() with automatic error translation to ExecutionError.
/// This is the preferred way to push values onto the stack in opcode implementations.
/// 
/// ## Parameters
/// - `stack`: Mutable reference to the Stack
/// - `value`: The u256 value to push
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError (typically StackOverflow)
/// 
/// ## Example
/// ```zig
/// const result = a + b;
/// try stack_push(vm.stack, result);
/// ```
pub fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| map_stack_error(err);
}

/// Helper function for stack peek with error mapping
/// 
/// Wraps Stack.peek() with automatic error translation to ExecutionError.
/// Allows reading stack values without popping them.
/// 
/// ## Parameters
/// - `stack`: Const reference to the Stack
/// - `position`: Zero-based position from top (0 = top element)
/// 
/// ## Returns
/// - Success: The u256 value at the specified position
/// - Error: Mapped ExecutionError (typically StackUnderflow)
/// 
/// ## Example
/// ```zig
/// // Peek at top element without removing it
/// const top = try stack_peek(vm.stack, 0);
/// ```
pub fn stack_peek(stack: *const Stack, position: usize) ExecutionError.Error!u256 {
    return stack.peek(position) catch |err| map_stack_error(err);
}

/// Helper function for memory set_byte with error mapping
/// 
/// Wraps Memory.set_byte() with automatic error translation.
/// Sets a single byte at the specified memory offset.
/// 
/// ## Parameters
/// - `memory`: Mutable reference to Memory
/// - `offset`: Byte offset in memory
/// - `value`: The byte value to write
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError (OutOfGas if expansion needed)
pub fn memory_set_byte(memory: *Memory, offset: usize, value: u8) ExecutionError.Error!void {
    return memory.set_byte(offset, value) catch |err| map_memory_error(err);
}

/// Helper function for memory set_u256 with error mapping
/// 
/// Wraps Memory.set_u256() to store a 256-bit word in memory.
/// Automatically handles memory expansion if needed.
/// 
/// ## Parameters
/// - `memory`: Mutable reference to Memory
/// - `offset`: Byte offset in memory (will write 32 bytes)
/// - `value`: The u256 value to write
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError (OutOfGas if expansion needed)
/// 
/// ## Note
/// Writes 32 bytes in big-endian format starting at offset
pub fn memory_set_u256(memory: *Memory, offset: usize, value: u256) ExecutionError.Error!void {
    return memory.set_u256(offset, value) catch |err| map_memory_error(err);
}

/// Helper function for memory set_data with error mapping
/// 
/// Wraps Memory.set_data() to copy arbitrary data into memory.
/// Handles memory expansion and bounds checking.
/// 
/// ## Parameters
/// - `memory`: Mutable reference to Memory
/// - `offset`: Starting byte offset in memory
/// - `data`: Slice of bytes to copy
/// 
/// ## Returns
/// - Success: void  
/// - Error: Mapped ExecutionError (OutOfGas if expansion needed)
/// 
/// ## Example
/// ```zig
/// try memory_set_data(vm.memory, 0x20, calldata);
/// ```
pub fn memory_set_data(memory: *Memory, offset: usize, data: []const u8) ExecutionError.Error!void {
    return memory.set_data(offset, data) catch |err| map_memory_error(err);
}

/// Helper function for memory get_slice with error mapping
/// 
/// Wraps Memory.get_slice() to read a range of bytes from memory.
/// Returns zeros for uninitialized memory regions.
/// 
/// ## Parameters
/// - `memory`: Const reference to Memory
/// - `offset`: Starting byte offset
/// - `size`: Number of bytes to read
/// 
/// ## Returns
/// - Success: Slice of memory contents
/// - Error: Mapped ExecutionError (InvalidOffset/InvalidSize)
/// 
/// ## Memory Expansion
/// Reading does NOT expand memory - accessing beyond current size
/// returns zeros without charging gas
pub fn memory_get_slice(memory: *const Memory, offset: usize, size: usize) ExecutionError.Error![]const u8 {
    return memory.get_slice(offset, size) catch |err| map_memory_error(err);
}

/// Helper function for memory ensure_capacity with error mapping
/// 
/// Ensures memory has at least the specified capacity, expanding if needed.
/// This is useful for pre-allocating memory before operations.
/// 
/// ## Parameters
/// - `memory`: Mutable reference to Memory
/// - `size`: Required memory size in bytes
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError (OutOfGas if expansion too expensive)
/// 
/// ## Gas Cost
/// Memory expansion has quadratic gas cost, making large expansions expensive
pub fn memory_ensure_capacity(memory: *Memory, size: usize) ExecutionError.Error!void {
    _ = memory.ensure_context_capacity(size) catch |err| return map_memory_error(err);
}

/// Helper function for memory copy_within with error mapping
/// 
/// Wraps Memory.copy_within() for copying data within memory (MCOPY opcode).
/// Handles overlapping regions correctly.
/// 
/// ## Parameters
/// - `memory`: Mutable reference to Memory
/// - `src`: Source offset in memory
/// - `dest`: Destination offset in memory
/// - `size`: Number of bytes to copy
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError
/// 
/// ## Note
/// Expands memory if dest + size exceeds current size
pub fn memory_copy_within(memory: *Memory, src: usize, dest: usize, size: usize) ExecutionError.Error!void {
    return memory.copy_within(src, dest, size) catch |err| map_memory_error(err);
}

/// Helper function for memory get_u256 with error mapping
/// 
/// Reads a 256-bit word from memory at the specified offset.
/// 
/// ## Parameters
/// - `memory`: Const reference to Memory
/// - `offset`: Byte offset to read from (reads 32 bytes)
/// 
/// ## Returns
/// - Success: The u256 value read from memory
/// - Error: Mapped ExecutionError
/// 
/// ## Note
/// Reads 32 bytes in big-endian format and converts to u256
pub fn memory_get_u256(memory: *const Memory, offset: usize) ExecutionError.Error!u256 {
    return memory.get_u256(offset) catch |err| map_memory_error(err);
}

/// Helper function for memory set_data_bounded with error mapping
/// 
/// Copies a bounded portion of data into memory with offset control.
/// Useful for CALLDATACOPY and similar opcodes that specify source offset.
/// 
/// ## Parameters
/// - `memory`: Mutable reference to Memory
/// - `offset`: Destination offset in memory
/// - `data`: Source data slice
/// - `data_offset`: Offset within the source data
/// - `size`: Number of bytes to copy
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError
/// 
/// ## Behavior
/// If data_offset + size exceeds data length, pads with zeros
pub fn memory_set_data_bounded(memory: *Memory, offset: usize, data: []const u8, data_offset: usize, size: usize) ExecutionError.Error!void {
    return memory.set_data_bounded(offset, data, data_offset, size) catch |err| map_memory_error(err);
}

/// Helper function for VM storage operations with error mapping
/// 
/// Wraps VM state storage operations with error translation.
/// Storage operations can fail due to write protection or resource limits.
/// 
/// ## Parameters
/// - `vm`: The VM instance (uses anytype for flexibility)
/// - `address`: The account address
/// - `slot`: The storage slot (u256)
/// - `value`: The value to store (u256)
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError (typically WriteProtection in static calls)
/// 
/// ## Note
/// Uses anytype to work with different VM implementations
pub fn vm_set_storage(vm: anytype, address: anytype, slot: u256, value: u256) ExecutionError.Error!void {
    vm.state.set_storage(address, slot, value) catch |err| return map_vm_error(err);
}

/// Helper function for VM storage read with error mapping
/// 
/// Reads a value from contract storage (SLOAD opcode).
/// 
/// ## Parameters
/// - `vm`: The VM instance
/// - `address`: The account address
/// - `slot`: The storage slot to read
/// 
/// ## Returns
/// - Success: The stored u256 value (0 if uninitialized)
/// - Error: Mapped ExecutionError
/// 
/// ## Gas Cost
/// SLOAD has different costs for cold/warm slots (EIP-2929)
pub fn vm_get_storage(vm: anytype, address: anytype, slot: u256) ExecutionError.Error!u256 {
    return vm.state.get_storage(address, slot);
}

/// Helper function for VM transient storage write with error mapping
/// 
/// Sets a value in transient storage (TSTORE opcode from EIP-1153).
/// Transient storage is cleared after each transaction.
/// 
/// ## Parameters
/// - `vm`: The VM instance
/// - `address`: The account address
/// - `slot`: The storage slot
/// - `value`: The value to store
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError (WriteProtection in static calls)
/// 
/// ## Note
/// Transient storage provides cheaper temporary storage within a transaction
pub fn vm_set_transient_storage(vm: anytype, address: anytype, slot: u256, value: u256) ExecutionError.Error!void {
    vm.state.set_transient_storage(address, slot, value) catch |err| return map_vm_error(err);
}

/// Helper function for VM transient storage read with error mapping
/// 
/// Reads a value from transient storage (TLOAD opcode from EIP-1153).
/// 
/// ## Parameters
/// - `vm`: The VM instance
/// - `address`: The account address  
/// - `slot`: The storage slot to read
/// 
/// ## Returns
/// - Success: The stored u256 value (0 if uninitialized)
/// - Error: Mapped ExecutionError
/// 
/// ## Note
/// Transient storage is always warm (no cold/warm distinction)
pub fn vm_get_transient_storage(vm: anytype, address: anytype, slot: u256) ExecutionError.Error!u256 {
    return vm.state.get_transient_storage(address, slot);
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
