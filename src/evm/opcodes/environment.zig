const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Address = @import("Address");
const to_u256 = Address.to_u256;
const from_u256 = Address.from_u256;
const gas_constants = @import("../gas_constants.zig");
const AccessList = @import("../access_list.zig").AccessList;

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

pub fn op_address(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Push contract address as u256
    const addr = to_u256(frame.contract.address);
    try stack_push(&frame.stack, addr);
    
    return Operation.ExecutionResult{};
}

pub fn op_balance(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const address_u256 = try stack_pop(&frame.stack);
    const address = from_u256(address_u256);
    
    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }
    
    // Get balance from VM state
    const balance = vm.balances.get(address) orelse 0;
    try stack_push(&frame.stack, balance);
    
    return Operation.ExecutionResult{};
}

pub fn op_origin(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Push transaction origin address
    const origin = to_u256(vm.tx_origin);
    try stack_push(&frame.stack, origin);
    
    return Operation.ExecutionResult{};
}

pub fn op_caller(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Push caller address
    const caller = to_u256(frame.contract.caller);
    try stack_push(&frame.stack, caller);
    
    return Operation.ExecutionResult{};
}

pub fn op_callvalue(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Push call value
    try stack_push(&frame.stack, frame.contract.value);
    
    return Operation.ExecutionResult{};
}

pub fn op_gasprice(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Push gas price from transaction context
    try stack_push(&frame.stack, vm.gas_price);
    
    return Operation.ExecutionResult{};
}

pub fn op_extcodesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const address_u256 = try stack_pop(&frame.stack);
    const address = from_u256(address_u256);
    
    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }
    
    // Get code size from VM state
    const code = vm.code.get(address) orelse &[_]u8{};
    try stack_push(&frame.stack, @as(u256, @intCast(code.len)));
    
    return Operation.ExecutionResult{};
}

pub fn op_extcodecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const address_u256 = try stack_pop(&frame.stack);
    const mem_offset = try stack_pop(&frame.stack);
    const code_offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    if (size == 0) {
        return Operation.ExecutionResult{};
    }
    
    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    
    const address = from_u256(address_u256);
    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));
    
    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }
    
    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);
    
    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);
    
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
    
    return Operation.ExecutionResult{};
}

pub fn op_extcodehash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const address_u256 = try stack_pop(&frame.stack);
    const address = from_u256(address_u256);
    
    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }
    
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
    
    return Operation.ExecutionResult{};
}

pub fn op_selfbalance(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Get balance of current executing contract
    const self_address = frame.contract.address;
    const balance = vm.balances.get(self_address) orelse 0;
    try stack_push(&frame.stack, balance);
    
    return Operation.ExecutionResult{};
}

pub fn op_chainid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Push chain ID from VM context
    try stack_push(&frame.stack, vm.chain_id);
    
    return Operation.ExecutionResult{};
}

pub fn op_calldatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Push size of calldata
    try stack_push(&frame.stack, @as(u256, @intCast(frame.contract.input.len)));
    
    return Operation.ExecutionResult{};
}

pub fn op_codesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Push size of current contract's code
    try stack_push(&frame.stack, @as(u256, @intCast(frame.contract.code.len)));
    
    return Operation.ExecutionResult{};
}

pub fn op_calldataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Pop offset from stack
    const offset = try stack_pop(&frame.stack);
    
    if (offset > std.math.maxInt(usize)) {
        // Offset too large, push zero
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }
    
    const offset_usize = @as(usize, @intCast(offset));
    const calldata = frame.contract.input;
    
    // Load 32 bytes from calldata, padding with zeros if necessary
    var value: u256 = 0;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        if (offset_usize + i < calldata.len) {
            value = (value << 8) | calldata[offset_usize + i];
        } else {
            value = value << 8; // Pad with zero
        }
    }
    
    try stack_push(&frame.stack, value);
    
    return Operation.ExecutionResult{};
}

pub fn op_codecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Pop memory offset, code offset, and size
    const mem_offset = try stack_pop(&frame.stack);
    const code_offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    if (size == 0) {
        return Operation.ExecutionResult{};
    }
    
    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize)) {
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
    
    // Get current contract code
    const code = frame.contract.code;
    
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
    
    return Operation.ExecutionResult{};
}
/// RETURNDATALOAD opcode (0xF7): Loads a 32-byte word from return data
/// This is an EOF opcode that allows reading from the return data buffer
pub fn op_returndataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Pop offset from stack
    const offset = try stack_pop(&frame.stack);
    
    // Check if offset is within bounds
    if (offset > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    
    const offset_usize = @as(usize, @intCast(offset));
    const return_data = frame.return_data_buffer;
    
    // If offset + 32 > return_data.len, this is an error (unlike CALLDATALOAD which pads with zeros)
    if (offset_usize + 32 > return_data.len) {
        return ExecutionError.Error.OutOfOffset;
    }
    
    // Load 32 bytes from return data
    var value: u256 = 0;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        value = (value << 8) | return_data[offset_usize + i];
    }
    
    try stack_push(&frame.stack, value);
    
    return Operation.ExecutionResult{};
}
