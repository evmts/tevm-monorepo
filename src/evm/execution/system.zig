const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Contract = @import("../contract/contract.zig");
const Address = @import("Address");
const to_u256 = Address.to_u256;
const from_u256 = Address.from_u256;
const gas_constants = @import("../constants/gas_constants.zig");
const AccessList = @import("../access_list/access_list.zig").AccessList;

// Import helper functions from error_mapping

// Gas opcode handler
pub fn gas_op(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    try frame.stack.append(@as(u256, @intCast(frame.gas_remaining)));

    return Operation.ExecutionResult{};
}

// Helper to check if u256 fits in usize
fn check_offset_bounds(value: u256) ExecutionError.Error!void {
    if (value > std.math.maxInt(usize)) {
        @branchHint(.cold);
        return ExecutionError.Error.InvalidOffset;
    }
}

pub fn op_create(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Check if we're in a static call
    if (frame.is_static) {
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    const value = try frame.stack.pop();
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    // Debug: CREATE opcode: value, offset, size

    // Check depth
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // EIP-3860: Check initcode size limit FIRST (Shanghai and later)
    try check_offset_bounds(size);
    const size_usize = @as(usize, @intCast(size));
    if (vm.chain_rules.IsEIP3860 and size_usize > gas_constants.MaxInitcodeSize) {
        @branchHint(.unlikely);
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
        _ = try frame.memory.ensure_context_capacity(offset_usize + size_usize);
        init_code = try frame.memory.get_slice(offset_usize, size_usize);
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
        @branchHint(.unlikely);
        try frame.stack.append(0);
        frame.return_data_buffer = result.output orelse &[_]u8{};
        return Operation.ExecutionResult{};
    }

    // EIP-2929: Mark the newly created address as warm
    _ = try vm.access_list.access_address(result.address);
    try frame.stack.append(to_u256(result.address));

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
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    const value = try frame.stack.pop();
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();
    const salt = try frame.stack.pop();

    if (frame.depth >= 1024) {
        try frame.stack.append( 0);
        return Operation.ExecutionResult{};
    }

    // EIP-3860: Check initcode size limit FIRST (Shanghai and later)
    try check_offset_bounds(size);
    const size_usize = @as(usize, @intCast(size));
    if (vm.chain_rules.IsEIP3860 and size_usize > gas_constants.MaxInitcodeSize) {
        @branchHint(.unlikely);
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
        _ = try frame.memory.ensure_context_capacity(offset_usize + size_usize);
        init_code = try frame.memory.get_slice(offset_usize, size_usize);
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
        @branchHint(.unlikely);
        try frame.stack.append(0);
        frame.return_data_buffer = result.output orelse &[_]u8{};
        return Operation.ExecutionResult{};
    }

    // EIP-2929: Mark the newly created address as warm
    _ = try vm.access_list.access_address(result.address);
    try frame.stack.append(to_u256(result.address));

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    return Operation.ExecutionResult{};
}

pub fn op_call(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const value = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check depth
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        // Check that offset + size doesn't overflow and fits in usize
        if (args_offset > std.math.maxInt(usize) or args_size > std.math.maxInt(usize)) {
            @branchHint(.cold);
            return ExecutionError.Error.InvalidOffset;
        }
        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        // Check that offset + size doesn't overflow usize
        if (args_offset_usize > std.math.maxInt(usize) - args_size_usize) {
            @branchHint(.cold);
            return ExecutionError.Error.InvalidOffset;
        }

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        // Check that offset + size doesn't overflow and fits in usize
        if (ret_offset > std.math.maxInt(usize) or ret_size > std.math.maxInt(usize)) {
            @branchHint(.cold);
            return ExecutionError.Error.InvalidOffset;
        }
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        // Check that offset + size doesn't overflow usize
        if (ret_offset_usize > std.math.maxInt(usize) - ret_size_usize) {
            @branchHint(.cold);
            return ExecutionError.Error.InvalidOffset;
        }

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    if (frame.is_static and value != 0) {
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    const to_address = from_u256(to);

    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.unlikely);
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
        std.mem.copyForwards(u8, memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @branchHint(.unlikely);
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try frame.stack.append(if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_callcode(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const value = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check depth
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.unlikely);
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
        std.mem.copyForwards(u8, memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @branchHint(.unlikely);
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try frame.stack.append(if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_delegatecall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check depth
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.unlikely);
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
        std.mem.copyForwards(u8, memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @branchHint(.unlikely);
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try frame.stack.append(if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_staticcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check depth
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.unlikely);
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
        std.mem.copyForwards(u8, memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @branchHint(.unlikely);
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try frame.stack.append(if (result.success) 1 else 0);

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
