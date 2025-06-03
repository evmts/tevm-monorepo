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
    
    const address_u256 = try stack_pop(&frame.stack);
    const address = from_u256(address_u256);
    
    // Get balance from VM state
    const balance = vm.balances.get(address) orelse 0;
    try stack_push(&frame.stack, balance);
    
    return "";
}

pub fn op_origin(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Push transaction origin address
    const origin = to_u256(vm.tx_origin);
    try stack_push(&frame.stack, origin);
    
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
    
    // Push gas price from transaction context
    try stack_push(&frame.stack, vm.gas_price);
    
    return "";
}

pub fn op_extcodesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const address_u256 = try stack_pop(&frame.stack);
    const address = from_u256(address_u256);
    
    // Get code size from VM state
    const code = vm.code.get(address) orelse &[_]u8{};
    try stack_push(&frame.stack, @as(u256, @intCast(code.len)));
    
    return "";
}

pub fn op_extcodecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const address_u256 = try stack_pop(&frame.stack);
    const mem_offset = try stack_pop(&frame.stack);
    const code_offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    if (size == 0) {
        return "";
    }
    
    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    
    const address = from_u256(address_u256);
    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));
    
    // Get external code from VM state
    const code = vm.code.get(address) orelse &[_]u8{};
    
    // Ensure memory is available
    _ = try frame.memory.ensure_capacity(mem_offset_usize + size_usize);
    
    const memory_slice = frame.memory.slice();
    
    // Copy code to memory, padding with zeros if necessary
    for (0..size_usize) |i| {
        if (code_offset_usize + i < code.len) {
            memory_slice[mem_offset_usize + i] = code[code_offset_usize + i];
        } else {
            memory_slice[mem_offset_usize + i] = 0;
        }
    }
    
    return "";
}

pub fn op_extcodehash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const address_u256 = try stack_pop(&frame.stack);
    const address = from_u256(address_u256);
    
    // Get code from VM state and compute hash
    const code = vm.code.get(address) orelse &[_]u8{};
    if (code.len == 0) {
        // Empty account - return zero
        try stack_push(&frame.stack, 0);
    } else {
        // Compute keccak256 hash of the code
        var hash: [32]u8 = undefined;
        std.crypto.hash.sha3.Keccak256.hash(code, &hash, .{});
        
        // Convert hash to u256
        var hash_u256: u256 = 0;
        for (hash) |byte| {
            hash_u256 = (hash_u256 << 8) | byte;
        }
        try stack_push(&frame.stack, hash_u256);
    }
    
    return "";
}

pub fn op_selfbalance(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Get balance of current executing contract
    const self_address = frame.contract.address;
    const balance = vm.balances.get(self_address) orelse 0;
    try stack_push(&frame.stack, balance);
    
    return "";
}

pub fn op_chainid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Push chain ID from VM context
    try stack_push(&frame.stack, vm.chain_id);
    
    return "";
}