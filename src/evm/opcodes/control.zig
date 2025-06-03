const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../gas_constants.zig");

// Helper to convert Stack errors to ExecutionError
inline fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| switch (err) {
        Stack.Error.Underflow => return ExecutionError.Error.StackUnderflow,
        else => return ExecutionError.Error.StackUnderflow,
    };
}

inline fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| switch (err) {
        Stack.Error.Overflow => return ExecutionError.Error.StackOverflow,
        else => return ExecutionError.Error.StackOverflow,
    };
}

pub fn op_stop(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = state;
    
    return ExecutionError.Error.STOP;
}

pub fn op_jump(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const dest = try stack_pop(&frame.stack);
    
    if (dest > std.math.maxInt(usize)) {
        return ExecutionError.Error.InvalidJump;
    }
    
    const dest_usize = @as(usize, @intCast(dest));
    
    // Check if destination is a valid JUMPDEST
    if (!frame.contract.valid_jumpdest(dest)) {
        return ExecutionError.Error.InvalidJump;
    }
    
    frame.pc = dest_usize;
    
    return "";
}

pub fn op_jumpi(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const dest = try stack_pop(&frame.stack);
    const condition = try stack_pop(&frame.stack);
    
    if (condition != 0) {
        if (dest > std.math.maxInt(usize)) {
            return ExecutionError.Error.InvalidJump;
        }
        
        const dest_usize = @as(usize, @intCast(dest));
        
        // Check if destination is a valid JUMPDEST
        if (!frame.contract.valid_jumpdest(dest)) {
            return ExecutionError.Error.InvalidJump;
        }
        
        frame.pc = dest_usize;
    }
    
    return "";
}

pub fn op_pc(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    try stack_push(&frame.stack, @as(u256, @intCast(pc)));
    
    return "";
}

pub fn op_jumpdest(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = state;
    
    // No-op, just marks valid jump destination
    return "";
}

pub fn op_return(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    if (size == 0) {
        frame.return_data_buffer = &[_]u8{};
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
            return ExecutionError.Error.OutOfOffset;
        }
        
        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));
        
        // Calculate memory expansion gas cost
        const current_size = frame.memory.context_size();
        const end = offset_usize + size_usize;
        if (end > offset_usize) { // Check for overflow
            const memory_gas = gas_constants.memory_gas_cost(current_size, end);
            try frame.consume_gas(memory_gas);
            
            _ = frame.memory.ensure_context_capacity(end) catch return ExecutionError.Error.OutOfOffset;
        }
        
        // Get data from memory
        const data = frame.memory.get_slice(offset_usize, size_usize) catch return ExecutionError.Error.OutOfOffset;
        
        // Allocate and copy return data
        const buffer = frame.allocator.alloc(u8, size_usize) catch return ExecutionError.Error.OutOfGas;
        @memcpy(buffer, data);
        frame.return_data_buffer = buffer;
    }
    
    return ExecutionError.Error.STOP; // RETURN ends execution normally
}

pub fn op_revert(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    if (size == 0) {
        frame.return_data_buffer = &[_]u8{};
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
            return ExecutionError.Error.OutOfOffset;
        }
        
        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));
        
        // Ensure memory is available
        const end = offset_usize + size_usize;
        if (end > offset_usize) { // Check for overflow
            _ = frame.memory.ensure_context_capacity(end) catch return ExecutionError.Error.OutOfOffset;
        }
        
        // Get data from memory
        const data = frame.memory.get_slice(offset_usize, size_usize) catch return ExecutionError.Error.OutOfOffset;
        
        // Allocate and copy return data
        const buffer = frame.allocator.alloc(u8, size_usize) catch return ExecutionError.Error.OutOfGas;
        @memcpy(buffer, data);
        frame.return_data_buffer = buffer;
    }
    
    return ExecutionError.Error.REVERT;
}

pub fn op_invalid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = state;
    
    return ExecutionError.Error.InvalidOpcode;
}

pub fn op_selfdestruct(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Check if we're in a static call
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const beneficiary = try stack_pop(&frame.stack);
    _ = beneficiary;
    _ = vm;
    
    // TODO: Schedule selfdestruct
    // For now, just return STOP
    
    return ExecutionError.Error.STOP;
}