const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Memory = @import("../memory.zig");
const gas_constants = @import("../gas_constants.zig");
const error_mapping = @import("../error_mapping.zig");

// Helper to convert Stack errors to ExecutionError
fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| switch (err) {
        Stack.Error.Underflow => return ExecutionError.Error.StackUnderflow,
        else => return ExecutionError.Error.StackUnderflow,
    };
}

fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| switch (err) {
        Stack.Error.Overflow => return ExecutionError.Error.StackOverflow,
        else => return ExecutionError.Error.StackOverflow,
    };
}

pub fn op_mload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const offset = try stack_pop(&frame.stack);
    
    if (offset > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    
    const offset_usize = @as(usize, @intCast(offset));
    
    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 32;
    const gas_cost = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(gas_cost);
    
    // Ensure memory is available
    _ = frame.memory.ensure_context_capacity(offset_usize + 32) catch return ExecutionError.Error.OutOfOffset;
    
    // Read 32 bytes from memory
    const value = frame.memory.get_u256(offset_usize) catch return ExecutionError.Error.OutOfOffset;
    
    try stack_push(&frame.stack, value);
    
    return Operation.ExecutionResult{};
}

pub fn op_mstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // EVM Stack: [..., offset, value] where value is on top
    const value = try stack_pop(&frame.stack);  // Pop value from top
    const offset = try stack_pop(&frame.stack); // Pop offset second
    
    if (offset > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    
    const offset_usize = @as(usize, @intCast(offset));
    
    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 32;
    const gas_cost = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(gas_cost);
    
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
    
    // EVM Stack: [..., offset, value] where value is on top
    const value = try stack_pop(&frame.stack);  // Pop value from top
    const offset = try stack_pop(&frame.stack); // Pop offset second
    
    if (offset > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    
    const offset_usize = @as(usize, @intCast(offset));
    
    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 1;
    const gas_cost = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(gas_cost);
    
    // Ensure memory is available
    try error_mapping.memory_ensure_capacity(&frame.memory, offset_usize + 1);
    
    // Write single byte to memory
    const byte_value = @as(u8, @truncate(value));
    try error_mapping.memory_set_byte(&frame.memory, offset_usize, byte_value);
    
    return Operation.ExecutionResult{};
}

pub fn op_msize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const size = frame.memory.context_size();
    
    try stack_push(&frame.stack, @as(u256, @intCast(size)));
    
    return Operation.ExecutionResult{};
}

pub fn op_mcopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // EVM stack order: [size, src, dest] (top to bottom)
    const size = try stack_pop(&frame.stack);
    const src = try stack_pop(&frame.stack);
    const dest = try stack_pop(&frame.stack);
    
    if (size == 0) {
        return Operation.ExecutionResult{};
    }
    
    if (dest > std.math.maxInt(usize) or src > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    
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
    
    // Debug logging
    if (@import("builtin").mode == .Debug) {
        std.debug.print("MCOPY: src={}, dest={}, size={}\n", .{ src_usize, dest_usize, size_usize });
    }
    
    return Operation.ExecutionResult{};
}

pub fn op_calldataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const offset = try stack_pop(&frame.stack);
    
    if (offset > std.math.maxInt(usize)) {
        try stack_push(&frame.stack, 0);
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
    
    try stack_push(&frame.stack, result);
    
    return Operation.ExecutionResult{};
}

pub fn op_calldatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    try stack_push(&frame.stack, @as(u256, @intCast(frame.input.len)));
    
    return Operation.ExecutionResult{};
}

pub fn op_calldatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const mem_offset = try stack_pop(&frame.stack);
    const data_offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    if (size == 0) {
        return Operation.ExecutionResult{};
    }
    
    if (mem_offset > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    
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
    _ = frame.memory.ensure_context_capacity(mem_offset_usize + size_usize) catch return ExecutionError.Error.OutOfOffset;
    
    // Copy calldata to memory
    frame.memory.set_data_bounded(mem_offset_usize, frame.input, data_offset_usize, size_usize) catch return ExecutionError.Error.OutOfOffset;
    
    return Operation.ExecutionResult{};
}

pub fn op_codesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    try stack_push(&frame.stack, @as(u256, @intCast(frame.contract.code.len)));
    
    return Operation.ExecutionResult{};
}

pub fn op_codecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const mem_offset = try stack_pop(&frame.stack);
    const code_offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    if (size == 0) {
        return Operation.ExecutionResult{};
    }
    
    if (mem_offset > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    
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
    _ = frame.memory.ensure_context_capacity(mem_offset_usize + size_usize) catch return ExecutionError.Error.OutOfOffset;
    
    // Copy code to memory
    frame.memory.set_data_bounded(mem_offset_usize, frame.contract.code, code_offset_usize, size_usize) catch return ExecutionError.Error.OutOfOffset;
    
    return Operation.ExecutionResult{};
}

pub fn op_returndatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    try stack_push(&frame.stack, @as(u256, @intCast(frame.return_data_buffer.len)));
    
    return Operation.ExecutionResult{};
}

pub fn op_returndatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const mem_offset = try stack_pop(&frame.stack);
    const data_offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    if (size == 0) {
        return Operation.ExecutionResult{};
    }
    
    if (mem_offset > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    
    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const data_offset_usize = @as(usize, @intCast(data_offset));
    const size_usize = @as(usize, @intCast(size));
    
    // Check bounds
    if (data_offset_usize + size_usize > frame.return_data_buffer.len) {
        return ExecutionError.Error.ReturnDataOutOfBounds;
    }
    
    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);
    
    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);
    
    // Ensure memory is available
    _ = frame.memory.ensure_context_capacity(mem_offset_usize + size_usize) catch return ExecutionError.Error.OutOfOffset;
    
    // Copy return data to memory
    frame.memory.set_data(mem_offset_usize, frame.return_data_buffer[data_offset_usize..data_offset_usize + size_usize]) catch return ExecutionError.Error.OutOfOffset;
    
    return Operation.ExecutionResult{};
}