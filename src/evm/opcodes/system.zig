const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Contract = @import("../contract.zig");
const Address = @import("Address");
const to_u256 = Address.to_u256;
const from_u256 = Address.from_u256;

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
    
    // Check if we're in a static call
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const value = try stack_pop(&frame.stack);
    const offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    // Check depth
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return "";
    }
    
    // Get init code from memory
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
    const init_code_cost = @as(u64, @intCast(init_code.len)) * 200; // CREATE data gas
    try frame.consume_gas(init_code_cost);
    
    // Calculate gas to give to the new contract (all but 1/64th)
    const gas_for_call = frame.gas_remaining - (frame.gas_remaining / 64);
    
    // Create the contract
    const result = try vm.create_contract(frame.contract.address, value, init_code, gas_for_call);
    
    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining / 64 + result.gas_left;
    
    if (result.success) {
        try stack_push(&frame.stack, to_u256(result.address));
    } else {
        try stack_push(&frame.stack, 0);
    }
    
    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};
    
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
    try frame.consume_gas(init_code_cost + hash_cost);
    
    // Calculate gas to give to the new contract (all but 1/64th)
    const gas_for_call = frame.gas_remaining - (frame.gas_remaining / 64);
    
    // Create the contract with CREATE2
    const result = try vm.create2_contract(frame.contract.address, value, init_code, salt, gas_for_call);
    
    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining / 64 + result.gas_left;
    
    if (result.success) {
        try stack_push(&frame.stack, to_u256(result.address));
    } else {
        try stack_push(&frame.stack, 0);
    }
    
    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};
    
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
    
    // Check if we're in a static call and trying to transfer value
    if (frame.is_static and value != 0) {
        return ExecutionError.Error.WriteProtection;
    }
    
    // Convert to address to Address type
    const to_address = from_u256(to);
    
    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));
    
    // Add stipend for value transfers
    if (value != 0) {
        gas_for_call += 2300; // Call stipend
    }
    
    // Execute the call
    const result = try vm.call_contract(frame.contract.address, to_address, value, args, gas_for_call, frame.is_static);
    
    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;
    
    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;
        
        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        @memcpy(memory_slice[ret_offset_usize..ret_offset_usize + copy_size], output[0..copy_size]);
        
        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @memset(memory_slice[ret_offset_usize + copy_size..ret_offset_usize + ret_size_usize], 0);
        }
    }
    
    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};
    
    // Push success status
    try stack_push(&frame.stack, if (result.success) 1 else 0);
    
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
    
    // Convert to address
    const to_address = from_u256(to);
    
    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));
    
    // Add stipend for value transfers
    if (value != 0) {
        gas_for_call += 2300; // Call stipend
    }
    
    // Execute the callcode (execute target's code with current storage context)
    // For callcode, we use the current contract's address as the execution context
    const result = try vm.callcode_contract(frame.contract.address, to_address, value, args, gas_for_call, frame.is_static);
    
    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;
    
    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;
        
        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        @memcpy(memory_slice[ret_offset_usize..ret_offset_usize + copy_size], output[0..copy_size]);
        
        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @memset(memory_slice[ret_offset_usize + copy_size..ret_offset_usize + ret_size_usize], 0);
        }
    }
    
    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};
    
    // Push success status
    try stack_push(&frame.stack, if (result.success) 1 else 0);
    
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
    
    // Convert to address
    const to_address = from_u256(to);
    
    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));
    
    // Execute the delegatecall (execute target's code with current storage context and msg.sender/value)
    // For delegatecall, we preserve the current contract's context
    // Note: delegatecall doesn't transfer value, it uses the current contract's value
    const result = try vm.delegatecall_contract(frame.contract.address, to_address, args, gas_for_call, frame.is_static);
    
    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;
    
    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;
        
        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        @memcpy(memory_slice[ret_offset_usize..ret_offset_usize + copy_size], output[0..copy_size]);
        
        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @memset(memory_slice[ret_offset_usize + copy_size..ret_offset_usize + ret_size_usize], 0);
        }
    }
    
    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};
    
    // Push success status
    try stack_push(&frame.stack, if (result.success) 1 else 0);
    
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
    
    // Convert to address
    const to_address = from_u256(to);
    
    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));
    
    // Execute the static call (no value transfer, is_static = true)
    const result = try vm.call_contract(frame.contract.address, to_address, 0, args, gas_for_call, true);
    
    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;
    
    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;
        
        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        @memcpy(memory_slice[ret_offset_usize..ret_offset_usize + copy_size], output[0..copy_size]);
        
        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @memset(memory_slice[ret_offset_usize + copy_size..ret_offset_usize + ret_size_usize], 0);
        }
    }
    
    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};
    
    // Push success status
    try stack_push(&frame.stack, if (result.success) 1 else 0);
    
    return "";
}