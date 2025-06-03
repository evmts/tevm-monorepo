const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Contract = @import("../contract.zig");

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

pub fn op_create(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;
    
    // Check if we're in a static call
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const value = try stack_pop(&frame.stack);
    const offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    _ = value;
    _ = offset;
    _ = size;
    
    // TODO: Implement CREATE opcode
    // For now, push failure (0 address)
    try stack_push(&frame.stack, 0);
    
    return "";
}

pub fn op_create2(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Check if we're in a static call
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const value = try stack_pop(&frame.stack);
    const offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    const salt = try stack_pop(&frame.stack);
    
    // Check depth
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return "";
    }
    
    // Get init code
    var init_code: []const u8 = &[_]u8{};
    if (size > 0) {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
            return ExecutionError.Error.OutOfOffset;
        }
        
        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));
        
        _ = try frame.memory.ensure_capacity(offset_usize + size_usize);
        init_code = frame.memory.slice()[offset_usize..offset_usize + size_usize];
    }
    
    // Calculate gas for creation
    const init_code_cost = @as(u64, @intCast(init_code.len)) * 200;
    const hash_cost = @as(u64, @intCast((init_code.len + 31) / 32)) * 6; // Keccak256 word cost
    try vm.consume_gas(init_code_cost + hash_cost);
    
    // Create the contract with CREATE2
    const result = try vm.create2_contract(frame.contract.address, value, init_code, salt, frame.gas_remaining);
    
    if (result.success) {
        try stack_push(&frame.stack, @as(u256, result.address));
    } else {
        try stack_push(&frame.stack, 0);
    }
    
    // Set return data
    frame.sub_return_data_buffer = result.output;
    
    return "";
}

pub fn op_call(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const gas = try stack_pop(&frame.stack);
    const to = try stack_pop(&frame.stack);
    const value = try stack_pop(&frame.stack);
    const args_offset = try stack_pop(&frame.stack);
    const args_size = try stack_pop(&frame.stack);
    const ret_offset = try stack_pop(&frame.stack);
    const ret_size = try stack_pop(&frame.stack);
    
    // Check depth
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return "";
    }
    
    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        if (args_offset > std.math.maxInt(usize) or args_size > std.math.maxInt(usize)) {
            return ExecutionError.Error.OutOfOffset;
        }
        
        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));
        
        _ = frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize) catch return ExecutionError.Error.OutOfOffset;
        args = frame.memory.get_slice(args_offset_usize, args_size_usize) catch return ExecutionError.Error.OutOfOffset;
    }
    
    // Ensure return memory
    if (ret_size > 0) {
        if (ret_offset > std.math.maxInt(usize) or ret_size > std.math.maxInt(usize)) {
            return ExecutionError.Error.OutOfOffset;
        }
        
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        
        _ = frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize) catch return ExecutionError.Error.OutOfOffset;
    }
    
    // TODO: Execute call
    _ = gas;
    _ = to;
    _ = value;
    _ = vm;
    
    // For now, return success
    try stack_push(&frame.stack, 1);
    
    return "";
}

pub fn op_callcode(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const gas = try stack_pop(&frame.stack);
    const to = try stack_pop(&frame.stack);
    const value = try stack_pop(&frame.stack);
    const args_offset = try stack_pop(&frame.stack);
    const args_size = try stack_pop(&frame.stack);
    const ret_offset = try stack_pop(&frame.stack);
    const ret_size = try stack_pop(&frame.stack);
    
    // Check depth
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return "";
    }
    
    // Similar to CALL but executes code in current context
    // Implementation similar to CALL but with callcode semantics
    
    // For now, simplified implementation
    _ = gas;
    _ = to;
    _ = value;
    _ = args_offset;
    _ = args_size;
    _ = ret_offset;
    _ = ret_size;
    _ = vm;
    
    try stack_push(&frame.stack, 1); // Success
    
    return "";
}

pub fn op_delegatecall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const gas = try stack_pop(&frame.stack);
    const to = try stack_pop(&frame.stack);
    const args_offset = try stack_pop(&frame.stack);
    const args_size = try stack_pop(&frame.stack);
    const ret_offset = try stack_pop(&frame.stack);
    const ret_size = try stack_pop(&frame.stack);
    
    // Check depth
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return "";
    }
    
    // Similar to CALL but with delegatecall semantics (preserves sender and value)
    // Implementation similar to CALL but with delegatecall semantics
    
    // For now, simplified implementation
    _ = gas;
    _ = to;
    _ = args_offset;
    _ = args_size;
    _ = ret_offset;
    _ = ret_size;
    _ = vm;
    
    try stack_push(&frame.stack, 1); // Success
    
    return "";
}

pub fn op_staticcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const gas = try stack_pop(&frame.stack);
    const to = try stack_pop(&frame.stack);
    const args_offset = try stack_pop(&frame.stack);
    const args_size = try stack_pop(&frame.stack);
    const ret_offset = try stack_pop(&frame.stack);
    const ret_size = try stack_pop(&frame.stack);
    
    // Check depth
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return "";
    }
    
    // Similar to CALL but guaranteed not to modify state
    // Implementation similar to CALL but with is_static = true
    
    // For now, simplified implementation
    _ = gas;
    _ = to;
    _ = args_offset;
    _ = args_size;
    _ = ret_offset;
    _ = ret_size;
    _ = vm;
    
    try stack_push(&frame.stack, 1); // Success
    
    return "";
}