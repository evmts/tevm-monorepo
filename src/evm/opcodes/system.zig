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
const error_mapping = @import("../error_mapping.zig");

// Import helper functions from error_mapping
const stack_pop = error_mapping.stack_pop;
const stack_push = error_mapping.stack_push;
const map_memory_error = error_mapping.map_memory_error;

// Helper to check if u256 fits in usize
fn check_offset_bounds(value: u256) ExecutionError.Error!void {
    if (value > std.math.maxInt(usize)) {
        return ExecutionError.Error.InvalidOffset;
    }
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
    
    std.debug.print("CREATE opcode: value={d}, offset={d}, size={d}\n", .{value, offset, size});
    
    // Check depth
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }
    
    // EIP-3860: Check initcode size limit FIRST (Shanghai and later)
    try check_offset_bounds(size);
    const size_usize = @as(usize, @intCast(size));
    if (vm.chain_rules.IsEIP3860 and size_usize > gas_constants.MaxInitcodeSize) {
        return ExecutionError.Error.MaxCodeSizeExceeded;
    }
    
    // Get init code from memory
    var init_code: []const u8 = &[_]u8{};
    if (size > 0) {
        try check_offset_bounds(offset);
        
        const offset_usize = @as(usize, @intCast(offset));
        
        // Calculate memory expansion gas cost
        const current_size = frame.memory.total_size();
        const new_size = offset_usize + size_usize;
        const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
        try frame.consume_gas(memory_gas);
        
        // Ensure memory is available and get the slice
        _ = frame.memory.ensure_context_capacity(offset_usize + size_usize) catch |err| return map_memory_error(err);
        init_code = frame.memory.get_slice(offset_usize, size_usize) catch |err| return map_memory_error(err);
    }
    
    // Calculate gas for creation
    const init_code_cost = @as(u64, @intCast(init_code.len)) * gas_constants.CreateDataGas;
    
    // EIP-3860: Add gas cost for initcode word size (2 gas per 32-byte word) - Shanghai and later
    const initcode_word_cost = if (vm.chain_rules.IsEIP3860) 
        @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.InitcodeWordGas 
    else 
        0;
    try frame.consume_gas(init_code_cost + initcode_word_cost);
    
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

/// CREATE2 opcode - Create contract with deterministic address
pub fn op_create2(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const value = try stack_pop(&frame.stack);
    const offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    const salt = try stack_pop(&frame.stack);
    
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }
    
    // EIP-3860: Check initcode size limit FIRST (Shanghai and later)
    try check_offset_bounds(size);
    const size_usize = @as(usize, @intCast(size));
    if (vm.chain_rules.IsEIP3860 and size_usize > gas_constants.MaxInitcodeSize) {
        return ExecutionError.Error.MaxCodeSizeExceeded;
    }
    
    // Get init code from memory
    var init_code: []const u8 = &[_]u8{};
    if (size > 0) {
        try check_offset_bounds(offset);
        
        const offset_usize = @as(usize, @intCast(offset));
        
        // Calculate memory expansion gas cost
        const current_size = frame.memory.total_size();
        const new_size = offset_usize + size_usize;
        const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
        try frame.consume_gas(memory_gas);
        
        // Ensure memory is available and get the slice
        _ = frame.memory.ensure_context_capacity(offset_usize + size_usize) catch |err| return map_memory_error(err);
        init_code = frame.memory.get_slice(offset_usize, size_usize) catch |err| return map_memory_error(err);
    }
    
    const init_code_cost = @as(u64, @intCast(init_code.len)) * gas_constants.CreateDataGas;
    const hash_cost = @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.Keccak256WordGas;
    
    // EIP-3860: Add gas cost for initcode word size (2 gas per 32-byte word) - Shanghai and later
    const initcode_word_cost = if (vm.chain_rules.IsEIP3860) 
        @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.InitcodeWordGas 
    else 
        0;
    try frame.consume_gas(init_code_cost + hash_cost + initcode_word_cost);
    
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
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);
        
        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));
        
        _ = frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize) catch |err| return map_memory_error(err);
        args = frame.memory.get_slice(args_offset_usize, args_size_usize) catch |err| return map_memory_error(err);
    }
    
    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);
        
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        
        _ = frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize) catch |err| return map_memory_error(err);
    }
    
    if (frame.is_static and value != 0) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const to_address = from_u256(to);
    
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }
    
    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));
    
    if (value != 0) {
        gas_for_call += 2300; // Stipend
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
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);
        
        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));
        
        _ = frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize) catch |err| return map_memory_error(err);
        args = frame.memory.get_slice(args_offset_usize, args_size_usize) catch |err| return map_memory_error(err);
    }
    
    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);
        
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        
        _ = frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize) catch |err| return map_memory_error(err);
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
    
    if (value != 0) {
        gas_for_call += 2300; // Stipend
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
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);
        
        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));
        
        _ = frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize) catch |err| return map_memory_error(err);
        args = frame.memory.get_slice(args_offset_usize, args_size_usize) catch |err| return map_memory_error(err);
    }
    
    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);
        
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        
        _ = frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize) catch |err| return map_memory_error(err);
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
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);
        
        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));
        
        _ = frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize) catch |err| return map_memory_error(err);
        args = frame.memory.get_slice(args_offset_usize, args_size_usize) catch |err| return map_memory_error(err);
    }
    
    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);
        
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        
        _ = frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize) catch |err| return map_memory_error(err);
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
