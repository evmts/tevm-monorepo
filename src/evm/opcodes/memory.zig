const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Memory = @import("../memory.zig");
const gas_constants = @import("../gas_constants.zig");
const error_mapping = @import("../error_mapping.zig");

// Import helper functions from error_mapping for operations we can't optimize
const map_memory_error = error_mapping.map_memory_error;

// Helper to check if u256 fits in usize
inline fn check_offset_bounds(value: u256) ExecutionError.Error!void {
    if (value > std.math.maxInt(usize)) return ExecutionError.Error.InvalidOffset;
}

pub fn op_mload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 1);

    // Get offset from top of stack unsafely - bounds checking is done in jump_table.zig
    const offset = frame.stack.peek_unsafe().*;

    if (offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const offset_usize = @as(usize, @intCast(offset));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 32;
    const gas_cost = gas_constants.memory_gas_cost(current_size, new_size);

    try frame.consume_gas(gas_cost);

    // Ensure memory is available
    _ = frame.memory.ensure_context_capacity(offset_usize + 32) catch |err| return map_memory_error(err);

    // Read 32 bytes from memory
    const value = frame.memory.get_u256(offset_usize) catch |err| return map_memory_error(err);

    // Replace top of stack with loaded value unsafely - bounds checking is done in jump_table.zig
    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

pub fn op_mstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // EVM Stack: [..., value, offset] where offset is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const offset = popped.b; // Second popped (was top)

    if (offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const offset_usize = @as(usize, @intCast(offset));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 32; // MSTORE writes 32 bytes
    const expansion_gas_cost = gas_constants.memory_gas_cost(current_size, new_size);

    try frame.consume_gas(expansion_gas_cost);

    // Ensure memory is available
    try error_mapping.memory_ensure_capacity(&frame.memory, offset_usize + 32);

    // Write 32 bytes to memory (big-endian)
    try error_mapping.memory_set_u256(&frame.memory, offset_usize, value);

    return Operation.ExecutionResult{};
}

pub fn op_mstore8(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // EVM Stack: [..., value, offset] where offset is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const offset = popped.b; // Second popped (was top)

    if (offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const offset_usize = @as(usize, @intCast(offset));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 1;
    const gas_cost = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(gas_cost);

    // Ensure memory is available - expand to word boundary to match gas calculation
    const word_aligned_size = ((new_size + 31) / 32) * 32;
    try error_mapping.memory_ensure_capacity(&frame.memory, word_aligned_size);

    // Write single byte to memory
    const byte_value = @as(u8, @truncate(value));
    try error_mapping.memory_set_byte(&frame.memory, offset_usize, byte_value);

    return Operation.ExecutionResult{};
}

pub fn op_msize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size < Stack.CAPACITY);

    // MSIZE returns the size in bytes, but memory is always expanded in 32-byte words
    // So we need to round up to the nearest word boundary
    const size = frame.memory.context_size();
    const word_aligned_size = ((size + 31) / 32) * 32;

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(word_aligned_size)));

    return Operation.ExecutionResult{};
}

pub fn op_mcopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 3);

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., dest, src, size] (top to bottom)
    const size = frame.stack.pop_unsafe();
    const src = frame.stack.pop_unsafe();
    const dest = frame.stack.pop_unsafe();

    if (size == 0) return Operation.ExecutionResult{};

    if (dest > std.math.maxInt(usize) or src > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const dest_usize = @as(usize, @intCast(dest));
    const src_usize = @as(usize, @intCast(src));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const max_addr = @max(dest_usize + size_usize, src_usize + size_usize);
    const memory_gas = gas_constants.memory_gas_cost(current_size, max_addr);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available for both source and destination
    try error_mapping.memory_ensure_capacity(&frame.memory, max_addr);

    // Copy with overlap handling
    try error_mapping.memory_copy_within(&frame.memory, src_usize, dest_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_calldataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 1);

    // Get offset from top of stack unsafely - bounds checking is done in jump_table.zig
    const offset = frame.stack.peek_unsafe().*;

    if (offset > std.math.maxInt(usize)) {
        // Replace top of stack with 0
        frame.stack.set_top_unsafe(0);
        return Operation.ExecutionResult{};
    }

    const offset_usize = @as(usize, @intCast(offset));

    // Read 32 bytes from calldata (pad with zeros)
    var result: u256 = 0;

    for (0..32) |i| {
        if (offset_usize + i < frame.input.len) {
            result = (result << 8) | frame.input[offset_usize + i];
        } else {
            result = result << 8;
        }
    }

    // Replace top of stack with loaded value unsafely - bounds checking is done in jump_table.zig
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_calldatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size < Stack.CAPACITY);

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(frame.input.len)));

    return Operation.ExecutionResult{};
}

pub fn op_calldatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 3);

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., size, data_offset, mem_offset] (top to bottom)
    const mem_offset = frame.stack.pop_unsafe();
    const data_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const data_offset_usize = @as(usize, @intCast(data_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available
    _ = frame.memory.ensure_context_capacity(mem_offset_usize + size_usize) catch |err| return map_memory_error(err);

    // Copy calldata to memory
    frame.memory.set_data_bounded(mem_offset_usize, frame.input, data_offset_usize, size_usize) catch |err| return map_memory_error(err);

    return Operation.ExecutionResult{};
}

pub fn op_codesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size < Stack.CAPACITY);

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(frame.contract.code.len)));

    return Operation.ExecutionResult{};
}

pub fn op_codecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 3);

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., size, code_offset, mem_offset] (top to bottom)
    const mem_offset = frame.stack.pop_unsafe();
    const code_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available
    _ = frame.memory.ensure_context_capacity(mem_offset_usize + size_usize) catch |err| return map_memory_error(err);

    // Copy code to memory
    frame.memory.set_data_bounded(mem_offset_usize, frame.contract.code, code_offset_usize, size_usize) catch |err| return map_memory_error(err);

    return Operation.ExecutionResult{};
}

pub fn op_returndatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size < Stack.CAPACITY);

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(frame.return_data_buffer.len)));

    return Operation.ExecutionResult{};
}

pub fn op_returndatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 3);

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., size, data_offset, mem_offset] (top to bottom)
    const mem_offset = frame.stack.pop_unsafe();
    const data_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const data_offset_usize = @as(usize, @intCast(data_offset));
    const size_usize = @as(usize, @intCast(size));

    // Check bounds
    if (data_offset_usize + size_usize > frame.return_data_buffer.len) return ExecutionError.Error.ReturnDataOutOfBounds;

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available
    _ = frame.memory.ensure_context_capacity(mem_offset_usize + size_usize) catch |err| return map_memory_error(err);

    // Copy return data to memory
    frame.memory.set_data(mem_offset_usize, frame.return_data_buffer[data_offset_usize .. data_offset_usize + size_usize]) catch |err| return map_memory_error(err);

    return Operation.ExecutionResult{};
}
