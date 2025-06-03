const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
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

pub fn op_address(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Push contract address as u256
    const addr = to_u256(frame.contract.address);
    try stack_push(&frame.stack, addr);
    
    return "";
}

pub fn op_balance(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;
    
    const address = try stack_pop(&frame.stack);
    _ = address;
    
    // TODO: Get balance from state
    // For now, push zero balance
    try stack_push(&frame.stack, 0);
    
    return "";
}

pub fn op_origin(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;
    
    // TODO: Push transaction origin address
    // For now, push zero address
    try stack_push(&frame.stack, 0);
    
    return "";
}

pub fn op_caller(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Push caller address
    const caller = to_u256(frame.contract.caller);
    try stack_push(&frame.stack, caller);
    
    return "";
}

pub fn op_callvalue(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Push call value
    try stack_push(&frame.stack, frame.contract.value);
    
    return "";
}

pub fn op_gasprice(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;
    
    // TODO: Push gas price
    // For now, push zero
    try stack_push(&frame.stack, 0);
    
    return "";
}

pub fn op_extcodesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;
    
    const address = try stack_pop(&frame.stack);
    _ = address;
    
    // TODO: Get code size from state
    // For now, push zero
    try stack_push(&frame.stack, 0);
    
    return "";
}

pub fn op_extcodecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;
    
    const address = try stack_pop(&frame.stack);
    const mem_offset = try stack_pop(&frame.stack);
    const code_offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    _ = address;
    _ = code_offset;
    
    if (size == 0) {
        return "";
    }
    
    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    
    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const size_usize = @as(usize, @intCast(size));
    
    // TODO: Get external code and copy to memory
    // For now, just ensure memory is available and fill with zeros
    _ = try frame.memory.ensure_capacity(mem_offset_usize + size_usize);
    
    const memory_slice = frame.memory.slice();
    for (0..size_usize) |i| {
        memory_slice[mem_offset_usize + i] = 0;
    }
    
    return "";
}

pub fn op_extcodehash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;
    
    const address = try stack_pop(&frame.stack);
    _ = address;
    
    // TODO: Get code hash from state
    // For now, push zero hash
    try stack_push(&frame.stack, 0);
    
    return "";
}

pub fn op_selfbalance(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;
    
    // TODO: Get self balance
    // For now, push zero
    try stack_push(&frame.stack, 0);
    
    return "";
}

pub fn op_chainid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;
    
    // TODO: Push chain ID
    // For now, push mainnet chain ID
    try stack_push(&frame.stack, 1);
    
    return "";
}