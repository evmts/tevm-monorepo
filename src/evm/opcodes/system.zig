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

pub fn op_create(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
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
        return Operation.ExecutionResult{};
    }
    
    // Get init code from memory
    var init_code: []const u8 = &[_]u8{};
    if (size > 0) {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
            return ExecutionError.Error.OutOfOffset;
        }
        
        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));
        
        // Calculate memory expansion gas cost
        const current_size = frame.memory.total_size();
        const new_size = offset_usize + size_usize;
        const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
        try frame.consume_gas(memory_gas);
        
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
    
    if (!result.success) {
        try stack_push(&frame.stack, 0);
        frame.return_data_buffer = result.output orelse &[_]u8{};
        return Operation.ExecutionResult{};
    }
    
    // EIP-2929: Mark the newly created address as warm
    _ = try vm.access_list.access_address(result.address);
    try stack_push(&frame.stack, to_u256(result.address));
    
    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};
    
    return Operation.ExecutionResult{};
}

/// CREATE2 opcode (0xf5): Create contract with deterministic address
/// 
/// Creates a new contract with a deterministic address based on the deployer's
/// address, a salt value, and the init code hash. This allows predicting the
/// contract address before deployment.
/// 
/// ## Stack Requirements
/// - Consumes 4 values: [value, offset, size, salt]
///   - `value`: Wei to send to the new contract
///   - `offset`: Memory offset of init code
///   - `size`: Size of init code in bytes
///   - `salt`: 256-bit salt for address generation
/// - Pushes 1 value: New contract address (or 0 on failure)
/// 
/// ## Gas Cost
/// - Static: 32000 gas base cost
/// - Dynamic: 
///   - Memory expansion: quadratic cost for reading init code
///   - Init code: 200 gas per byte
///   - Hashing: 6 gas per 32-byte word (for address calculation)
///   - Execution: All gas except 1/64th is forwarded to init code
/// 
/// ## Address Calculation
/// address = keccak256(0xff ++ deployer_address ++ salt ++ keccak256(init_code))[12:]
/// 
/// ## Edge Cases
/// - Fails in static calls (state modification not allowed)
/// - Returns 0 if call depth >= 1024
/// - Returns 0 if account already exists at computed address
/// - Init code size limited by EIP-3860 (max 49152 bytes)
/// - Address collision is astronomically unlikely but would fail creation
/// 
/// ## EIP References
/// - EIP-1014: Introduced CREATE2 in Constantinople
/// - EIP-3860: Limit and meter initcode
pub fn op_create2(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Check if we're in a static call - no state modifications allowed
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const value = try stack_pop(&frame.stack);
    const offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    const salt = try stack_pop(&frame.stack);
    
    // Check call depth limit (protection against stack overflow)
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }
    
    // Get init code from memory
    var init_code: []const u8 = &[_]u8{};
    if (size > 0) {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
            return ExecutionError.Error.OutOfOffset;
        }
        
        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));
        
        // Calculate memory expansion gas cost
        const current_size = frame.memory.total_size();
        const new_size = offset_usize + size_usize;
        const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
        try frame.consume_gas(memory_gas);
        
        _ = try frame.memory.ensure_capacity(offset_usize + size_usize);
        init_code = frame.memory.slice()[offset_usize..offset_usize + size_usize];
    }
    
    // Calculate gas costs specific to CREATE2
    // Init code gas: 200 per byte (discourages large contracts)
    const init_code_cost = @as(u64, @intCast(init_code.len)) * 200;
    // Hash gas: 6 per word for keccak256(init_code) in address calculation
    const hash_cost = @as(u64, @intCast((init_code.len + 31) / 32)) * 6;
    try frame.consume_gas(init_code_cost + hash_cost);
    
    // Calculate gas to give to the new contract (all but 1/64th)
    const gas_for_call = frame.gas_remaining - (frame.gas_remaining / 64);
    
    // Create the contract with CREATE2
    const result = try vm.create2_contract(frame.contract.address, value, init_code, salt, gas_for_call);
    
    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining / 64 + result.gas_left;
    
    if (!result.success) {
        try stack_push(&frame.stack, 0);
        frame.return_data_buffer = result.output orelse &[_]u8{};
        return Operation.ExecutionResult{};
    }
    
    // EIP-2929: Mark the newly created address as warm
    _ = try vm.access_list.access_address(result.address);
    try stack_push(&frame.stack, to_u256(result.address));
    
    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};
    
    return Operation.ExecutionResult{};
}

pub fn op_call(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
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
        return Operation.ExecutionResult{};
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
    
    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }
    
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
    
    return Operation.ExecutionResult{};
}

pub fn op_callcode(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
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
        return Operation.ExecutionResult{};
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
    
    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }
    
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
    
    return Operation.ExecutionResult{};
}

pub fn op_delegatecall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
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
        return Operation.ExecutionResult{};
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
    
    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }
    
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
    
    return Operation.ExecutionResult{};
}

pub fn op_staticcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
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
        return Operation.ExecutionResult{};
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
    
    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }
    
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
    
    return Operation.ExecutionResult{};
}
/// EXTCALL opcode (0xF8): External call with EOF validation
/// Not implemented - EOF feature
pub fn op_extcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    
    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}

/// EXTDELEGATECALL opcode (0xF9): External delegate call with EOF validation
/// Not implemented - EOF feature
pub fn op_extdelegatecall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    
    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}

/// EXTSTATICCALL opcode (0xFB): External static call with EOF validation
/// Not implemented - EOF feature
pub fn op_extstaticcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    
    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}
