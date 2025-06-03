const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");

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

pub fn op_blockhash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const block_number = try stack_pop(&frame.stack);
    _ = block_number;
    
    // TODO: Implement block hash retrieval
    // For now, return zero hash
    try stack_push(&frame.stack, 0);
    
    return "";
}

pub fn op_coinbase(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // TODO: Get coinbase from block context
    // For now, push zero address
    try stack_push(&frame.stack, 0);
    
    return "";
}

pub fn op_timestamp(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    _ = interpreter;
    
    // TODO: Get timestamp from block context
    // For now, push a placeholder value
    try stack_push(&frame.stack, 1234567890);
    
    return "";
}

pub fn op_number(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    _ = interpreter;
    
    // TODO: Get block number from block context
    // For now, push a placeholder value
    try stack_push(&frame.stack, 1);
    
    return "";
}

pub fn op_difficulty(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // TODO: Get difficulty/prevrandao from block context
    // Post-merge this returns PREVRANDAO
    try stack_push(&frame.stack, 0);
    
    return "";
}

pub fn op_prevrandao(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    // Same as difficulty post-merge
    return op_difficulty(pc, interpreter, state);
}

pub fn op_gaslimit(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // TODO: Get gas limit from block context
    // Push block gas limit
    try stack_push(&frame.stack, 30_000_000);
    
    return "";
}

pub fn op_basefee(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // TODO: Get base fee from block context
    // Push base fee (EIP-1559)
    try stack_push(&frame.stack, 0);
    
    return "";
}

pub fn op_blobhash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const index = try stack_pop(&frame.stack);
    _ = index;
    
    // TODO: Implement blob hash retrieval
    // EIP-4844: Get blob hash at index
    try stack_push(&frame.stack, 0);
    
    return "";
}

pub fn op_blobbasefee(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // TODO: Get blob base fee from block context
    // Push blob base fee (EIP-4844)
    try stack_push(&frame.stack, 0);
    
    return "";
}