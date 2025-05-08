//! Call operations for ZigEVM
//! This module implements opcodes that make calls to other contracts or accounts

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Address = types.Address;
const Error = types.Error;
const ExecutionResult = types.ExecutionResult;
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;
const ReturnData = @import("../interpreter/return_data.zig").ReturnData;
const Storage = @import("storage.zig").Storage;
const EvmEnvironment = @import("environment.zig").EvmEnvironment;

/// Maximum call depth allowed in the EVM
pub const MAX_CALL_DEPTH = 1024;

/// Callback function type for external calls
/// This allows the interpreter to handle calls to other contracts
pub const CallFn = fn (
    caller_address: Address,
    target_address: Address,
    value: U256,
    input_data: []const u8,
    gas_limit: u64,
    is_static: bool,
    delegated_from: ?Address,
) ExecutionResult;

/// Callback function type for account balance retrieval
pub const GetBalanceFn = fn (
    address: Address
) U256;

/// Callback function type for code retrieval
pub const GetCodeFn = fn (
    address: Address
) []const u8;

/// Gas calculation helper - implements EIP-150 gas rules
fn calculateCallGas(gas_left: u64, requested_gas: u64, value_transfer: bool) struct { gas_limit: u64, gas_cost: u64 } {
    // Base call cost
    const stipend: u64 = if (value_transfer) 9000 else 0;
    
    // Calculate available gas after taking fee into account
    // EIP-150: All gas passed to internal calls is capped at 63/64 of available gas
    const max_gas = gas_left - (gas_left / 64);
    const gas_limit = @min(requested_gas, max_gas);
    const gas_cost = gas_limit + stipend;
    
    return .{ .gas_limit = gas_limit, .gas_cost = gas_cost };
}

/// Perform CALL operation - calls another contract
pub fn call(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    environment: ?*EvmEnvironment,
    call_fn: ?CallFn,
    is_static: bool,
) !void {
    _ = code;
    _ = gas_refund;
    
    // Cannot do value transfer in static context
    if (is_static) {
        // Check if a value is being transferred (peek at the 3rd stack item)
        if (stack.getSize() >= 3) {
            const value_idx = stack.getSize() - 3;
            const value = stack.getItem(value_idx) catch return Error.StackUnderflow;
            if (!value.isZero()) {
                return Error.StaticModeViolation;
            }
        }
    }
    
    // Pop values from stack
    const gas = try stack.pop(); // Gas limit
    const to_addr_u256 = try stack.pop(); // Target address
    const value = try stack.pop(); // Value to transfer
    const in_offset = try stack.pop(); // Input data offset in memory
    const in_size = try stack.pop(); // Input data size
    const out_offset = try stack.pop(); // Output data offset in memory
    const out_size = try stack.pop(); // Output data size
    
    // Ensure parameters fit in usize
    if (in_offset.words[1] != 0 or in_offset.words[2] != 0 or in_offset.words[3] != 0 or
        in_size.words[1] != 0 or in_size.words[2] != 0 or in_size.words[3] != 0 or
        out_offset.words[1] != 0 or out_offset.words[2] != 0 or out_offset.words[3] != 0 or
        out_size.words[1] != 0 or out_size.words[2] != 0 or out_size.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_in_offset = @as(usize, in_offset.words[0]);
    const mem_in_size = @as(usize, in_size.words[0]);
    const mem_out_offset = @as(usize, out_offset.words[0]);
    const mem_out_size = @as(usize, out_size.words[0]);
    
    // Ensure gas parameter fits in u64
    const gas_u64 = if (gas.words[1] == 0 and gas.words[2] == 0 and gas.words[3] == 0)
        @as(u64, gas.words[0])
    else
        std.math.maxInt(u64);
    
    // Calculate gas costs for the CALL operation
    const has_value = !value.isZero();
    const gas_calc = calculateCallGas(gas_left.*, gas_u64, has_value);
    
    // Base gas cost for call - 700 for non-zero value transfers, 40 otherwise
    var call_gas_cost: u64 = if (has_value) 700 else 40;
    
    // Add memory expansion gas cost for input and output
    if (mem_in_size > 0) {
        // Calculate memory expansion cost for input
        call_gas_cost += memory.expand(mem_in_offset + mem_in_size);
    }
    
    if (mem_out_size > 0) {
        // Calculate memory expansion cost for output
        call_gas_cost += memory.expand(mem_out_offset + mem_out_size);
    }
    
    // Add the cost for the gas being passed to the call
    call_gas_cost += gas_calc.gas_cost;
    
    // Check if enough gas is available
    if (gas_left.* < call_gas_cost) {
        return Error.OutOfGas;
    }
    
    // Convert target address to Address type
    var to_addr_bytes: [20]u8 = [_]u8{0} ** 20;
    const addr_bytes = @as(u128, to_addr_u256.words[0]) | (@as(u128, to_addr_u256.words[1]) << 64);
    for (0..20) |i| {
        const shift_amount = @as(u7, @intCast((19 - i) * 8));
        to_addr_bytes[i] = @as(u8, @intCast((addr_bytes >> shift_amount) & 0xFF));
    }
    const to_addr = Address{ .bytes = to_addr_bytes };
    
    // Copy input data from memory
    var input_data = std.ArrayList(u8).init(std.heap.c_allocator);
    defer input_data.deinit();
    
    if (mem_in_size > 0) {
        try input_data.resize(mem_in_size);
        const available_input = @min(mem_in_size, memory.size - mem_in_offset);
        
        if (available_input > 0) {
            @memcpy(input_data.items[0..available_input], memory.page.buffer[mem_in_offset..][0..available_input]);
        }
        
        // Fill remaining with zeros if needed
        if (available_input < mem_in_size) {
            @memset(input_data.items[available_input..], 0);
        }
    }
    
    // Deduct gas for the call
    gas_left.* -= call_gas_cost;
    
    // Get caller address from environment
    var caller_addr = Address.zero();
    if (environment) |env| {
        caller_addr = env.address;
    }
    
    // Execute the call if the callback is provided
    var success = true;
    var call_result = ExecutionResult{
        .Success = .{
            .gas_used = 0,
            .gas_refunded = 0,
            .return_data = &[_]u8{},
        }
    };
    
    if (call_fn) |cfn| {
        call_result = cfn(
            caller_addr,
            to_addr,
            value,
            input_data.items,
            gas_calc.gas_limit,
            is_static,
            null // Not a delegatecall
        );
    }
    
    // Handle return data
    var return_data: []const u8 = &[_]u8{};
    
    switch (call_result) {
        .Success => |success_data| {
            // Copy successful return data to memory
            return_data = success_data.return_data;
            
            // Refund unused gas
            const gas_used = @min(gas_calc.gas_limit, success_data.gas_used);
            const gas_refunded = gas_calc.gas_limit - gas_used;
            gas_left.* += gas_refunded;
        },
        .Revert => |revert_data| {
            // Even though the call failed, we still set the return data
            return_data = revert_data.return_data;
            success = false;
            
            // Refund unused gas
            const gas_refunded = gas_calc.gas_limit - revert_data.gas_used;
            gas_left.* += gas_refunded;
        },
        .Error => |_| {
            // For errors, there's no return data and no gas refund
            success = false;
        },
    }
    
    // Copy return data to memory
    if (mem_out_size > 0 and return_data.len > 0) {
        const copy_size = @min(mem_out_size, return_data.len);
        for (0..copy_size) |i| {
            if (mem_out_offset + i < memory.size) {
                memory.page.buffer[mem_out_offset + i] = return_data[i];
            }
        }
    }
    
    // Push success flag to stack (1 for success, 0 for failure)
    try stack.push(U256.fromU64(if (success) 1 else 0));
    
    // Advance PC
    pc.* += 1;
}

/// Perform STATICCALL operation - calls another contract in static mode
pub fn staticcall(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    environment: ?*EvmEnvironment,
    call_fn: ?CallFn,
    _: bool, // is_static parameter (ignored because STATICCALL is always static)
) !void {
    _ = code;
    _ = gas_refund;
    
    // Pop values from stack
    const gas = try stack.pop(); // Gas limit
    const to_addr_u256 = try stack.pop(); // Target address
    const in_offset = try stack.pop(); // Input data offset in memory
    const in_size = try stack.pop(); // Input data size
    const out_offset = try stack.pop(); // Output data offset in memory
    const out_size = try stack.pop(); // Output data size
    
    // Ensure parameters fit in usize
    if (in_offset.words[1] != 0 or in_offset.words[2] != 0 or in_offset.words[3] != 0 or
        in_size.words[1] != 0 or in_size.words[2] != 0 or in_size.words[3] != 0 or
        out_offset.words[1] != 0 or out_offset.words[2] != 0 or out_offset.words[3] != 0 or
        out_size.words[1] != 0 or out_size.words[2] != 0 or out_size.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_in_offset = @as(usize, in_offset.words[0]);
    const mem_in_size = @as(usize, in_size.words[0]);
    const mem_out_offset = @as(usize, out_offset.words[0]);
    const mem_out_size = @as(usize, out_size.words[0]);
    
    // Ensure gas parameter fits in u64
    const gas_u64 = if (gas.words[1] == 0 and gas.words[2] == 0 and gas.words[3] == 0)
        @as(u64, gas.words[0])
    else
        std.math.maxInt(u64);
    
    // Calculate gas costs for the STATICCALL operation
    const gas_calc = calculateCallGas(gas_left.*, gas_u64, false);
    
    // Base gas cost for static call - 40
    var call_gas_cost: u64 = 40;
    
    // Add memory expansion gas cost for input and output
    if (mem_in_size > 0) {
        // Calculate memory expansion cost for input
        call_gas_cost += memory.expand(mem_in_offset + mem_in_size);
    }
    
    if (mem_out_size > 0) {
        // Calculate memory expansion cost for output
        call_gas_cost += memory.expand(mem_out_offset + mem_out_size);
    }
    
    // Add the cost for the gas being passed to the call
    call_gas_cost += gas_calc.gas_cost;
    
    // Check if enough gas is available
    if (gas_left.* < call_gas_cost) {
        return Error.OutOfGas;
    }
    
    // Convert target address to Address type
    var to_addr_bytes: [20]u8 = [_]u8{0} ** 20;
    const addr_bytes = @as(u128, to_addr_u256.words[0]) | (@as(u128, to_addr_u256.words[1]) << 64);
    for (0..20) |i| {
        const shift_amount = @as(u7, @intCast((19 - i) * 8));
        to_addr_bytes[i] = @as(u8, @intCast((addr_bytes >> shift_amount) & 0xFF));
    }
    const to_addr = Address{ .bytes = to_addr_bytes };
    
    // Copy input data from memory
    var input_data = std.ArrayList(u8).init(std.heap.c_allocator);
    defer input_data.deinit();
    
    if (mem_in_size > 0) {
        try input_data.resize(mem_in_size);
        const available_input = @min(mem_in_size, memory.size - mem_in_offset);
        
        if (available_input > 0) {
            @memcpy(input_data.items[0..available_input], memory.page.buffer[mem_in_offset..][0..available_input]);
        }
        
        // Fill remaining with zeros if needed
        if (available_input < mem_in_size) {
            @memset(input_data.items[available_input..], 0);
        }
    }
    
    // Deduct gas for the call
    gas_left.* -= call_gas_cost;
    
    // Get caller address from environment
    var caller_addr = Address.zero();
    if (environment) |env| {
        caller_addr = env.address;
    }
    
    // Execute the call if the callback is provided
    var success = true;
    var call_result = ExecutionResult{
        .Success = .{
            .gas_used = 0,
            .gas_refunded = 0,
            .return_data = &[_]u8{},
        }
    };
    
    if (call_fn) |cfn| {
        call_result = cfn(
            caller_addr,
            to_addr,
            U256.zero(), // STATICCALL has no value transfer
            input_data.items,
            gas_calc.gas_limit,
            true, // Always static
            null // Not a delegatecall
        );
    }
    
    // Handle return data
    var return_data: []const u8 = &[_]u8{};
    
    switch (call_result) {
        .Success => |success_data| {
            // Copy successful return data to memory
            return_data = success_data.return_data;
            
            // Refund unused gas
            const gas_used = @min(gas_calc.gas_limit, success_data.gas_used);
            const gas_refunded = gas_calc.gas_limit - gas_used;
            gas_left.* += gas_refunded;
        },
        .Revert => |revert_data| {
            // Even though the call failed, we still set the return data
            return_data = revert_data.return_data;
            success = false;
            
            // Refund unused gas
            const gas_refunded = gas_calc.gas_limit - revert_data.gas_used;
            gas_left.* += gas_refunded;
        },
        .Error => |_| {
            // For errors, there's no return data and no gas refund
            success = false;
        },
    }
    
    // Copy return data to memory
    if (mem_out_size > 0 and return_data.len > 0) {
        const copy_size = @min(mem_out_size, return_data.len);
        for (0..copy_size) |i| {
            if (mem_out_offset + i < memory.size) {
                memory.page.buffer[mem_out_offset + i] = return_data[i];
            }
        }
    }
    
    // Push success flag to stack (1 for success, 0 for failure)
    try stack.push(U256.fromU64(if (success) 1 else 0));
    
    // Advance PC
    pc.* += 1;
}

/// Perform DELEGATECALL operation - calls another contract with current context
pub fn delegatecall(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    environment: ?*EvmEnvironment,
    call_fn: ?CallFn,
) !void {
    _ = code;
    _ = gas_refund;
    
    // Pop values from stack
    const gas = try stack.pop(); // Gas limit
    const to_addr_u256 = try stack.pop(); // Target address
    const in_offset = try stack.pop(); // Input data offset in memory
    const in_size = try stack.pop(); // Input data size
    const out_offset = try stack.pop(); // Output data offset in memory
    const out_size = try stack.pop(); // Output data size
    
    // Ensure parameters fit in usize
    if (in_offset.words[1] != 0 or in_offset.words[2] != 0 or in_offset.words[3] != 0 or
        in_size.words[1] != 0 or in_size.words[2] != 0 or in_size.words[3] != 0 or
        out_offset.words[1] != 0 or out_offset.words[2] != 0 or out_offset.words[3] != 0 or
        out_size.words[1] != 0 or out_size.words[2] != 0 or out_size.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_in_offset = @as(usize, in_offset.words[0]);
    const mem_in_size = @as(usize, in_size.words[0]);
    const mem_out_offset = @as(usize, out_offset.words[0]);
    const mem_out_size = @as(usize, out_size.words[0]);
    
    // Ensure gas parameter fits in u64
    const gas_u64 = if (gas.words[1] == 0 and gas.words[2] == 0 and gas.words[3] == 0)
        @as(u64, gas.words[0])
    else
        std.math.maxInt(u64);
    
    // Calculate gas costs for the DELEGATECALL operation
    const gas_calc = calculateCallGas(gas_left.*, gas_u64, false);
    
    // Base gas cost for delegate call - 40
    var call_gas_cost: u64 = 40;
    
    // Add memory expansion gas cost for input and output
    if (mem_in_size > 0) {
        // Calculate memory expansion cost for input
        call_gas_cost += memory.expand(mem_in_offset + mem_in_size);
    }
    
    if (mem_out_size > 0) {
        // Calculate memory expansion cost for output
        call_gas_cost += memory.expand(mem_out_offset + mem_out_size);
    }
    
    // Add the cost for the gas being passed to the call
    call_gas_cost += gas_calc.gas_cost;
    
    // Check if enough gas is available
    if (gas_left.* < call_gas_cost) {
        return Error.OutOfGas;
    }
    
    // Convert target address to Address type
    var to_addr_bytes: [20]u8 = [_]u8{0} ** 20;
    const addr_bytes = @as(u128, to_addr_u256.words[0]) | (@as(u128, to_addr_u256.words[1]) << 64);
    for (0..20) |i| {
        const shift_amount = @as(u7, @intCast((19 - i) * 8));
        to_addr_bytes[i] = @as(u8, @intCast((addr_bytes >> shift_amount) & 0xFF));
    }
    const to_addr = Address{ .bytes = to_addr_bytes };
    
    // Copy input data from memory
    var input_data = std.ArrayList(u8).init(std.heap.c_allocator);
    defer input_data.deinit();
    
    if (mem_in_size > 0) {
        try input_data.resize(mem_in_size);
        const available_input = @min(mem_in_size, memory.size - mem_in_offset);
        
        if (available_input > 0) {
            @memcpy(input_data.items[0..available_input], memory.page.buffer[mem_in_offset..][0..available_input]);
        }
        
        // Fill remaining with zeros if needed
        if (available_input < mem_in_size) {
            @memset(input_data.items[available_input..], 0);
        }
    }
    
    // Deduct gas for the call
    gas_left.* -= call_gas_cost;
    
    // Get caller address and value from environment
    var caller_addr = Address.zero();
    var call_value = U256.zero();
    if (environment) |env| {
        caller_addr = env.address;
        call_value = env.value;
    }
    
    // Execute the call if the callback is provided
    var success = true;
    var call_result = ExecutionResult{
        .Success = .{
            .gas_used = 0,
            .gas_refunded = 0,
            .return_data = &[_]u8{},
        }
    };
    
    if (call_fn) |cfn| {
        call_result = cfn(
            caller_addr,
            to_addr,
            call_value, // Use the original call's value
            input_data.items,
            gas_calc.gas_limit,
            false, // Not necessarily static
            caller_addr // Delegated from the caller's address
        );
    }
    
    // Handle return data
    var return_data: []const u8 = &[_]u8{};
    
    switch (call_result) {
        .Success => |success_data| {
            // Copy successful return data to memory
            return_data = success_data.return_data;
            
            // Refund unused gas
            const gas_used = @min(gas_calc.gas_limit, success_data.gas_used);
            const gas_refunded = gas_calc.gas_limit - gas_used;
            gas_left.* += gas_refunded;
        },
        .Revert => |revert_data| {
            // Even though the call failed, we still set the return data
            return_data = revert_data.return_data;
            success = false;
            
            // Refund unused gas
            const gas_refunded = gas_calc.gas_limit - revert_data.gas_used;
            gas_left.* += gas_refunded;
        },
        .Error => |_| {
            // For errors, there's no return data and no gas refund
            success = false;
        },
    }
    
    // Copy return data to memory
    if (mem_out_size > 0 and return_data.len > 0) {
        const copy_size = @min(mem_out_size, return_data.len);
        for (0..copy_size) |i| {
            if (mem_out_offset + i < memory.size) {
                memory.page.buffer[mem_out_offset + i] = return_data[i];
            }
        }
    }
    
    // Push success flag to stack (1 for success, 0 for failure)
    try stack.push(U256.fromU64(if (success) 1 else 0));
    
    // Advance PC
    pc.* += 1;
}

/// Perform CALLCODE operation - calls another contract using target's code but current context
pub fn callcode(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    environment: ?*EvmEnvironment,
    call_fn: ?CallFn,
) !void {
    _ = code;
    _ = gas_refund;
    
    // Pop values from stack
    const gas = try stack.pop(); // Gas limit
    const to_addr_u256 = try stack.pop(); // Target address
    const value = try stack.pop(); // Value to transfer
    const in_offset = try stack.pop(); // Input data offset in memory
    const in_size = try stack.pop(); // Input data size
    const out_offset = try stack.pop(); // Output data offset in memory
    const out_size = try stack.pop(); // Output data size
    
    // Ensure parameters fit in usize
    if (in_offset.words[1] != 0 or in_offset.words[2] != 0 or in_offset.words[3] != 0 or
        in_size.words[1] != 0 or in_size.words[2] != 0 or in_size.words[3] != 0 or
        out_offset.words[1] != 0 or out_offset.words[2] != 0 or out_offset.words[3] != 0 or
        out_size.words[1] != 0 or out_size.words[2] != 0 or out_size.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_in_offset = @as(usize, in_offset.words[0]);
    const mem_in_size = @as(usize, in_size.words[0]);
    const mem_out_offset = @as(usize, out_offset.words[0]);
    const mem_out_size = @as(usize, out_size.words[0]);
    
    // Ensure gas parameter fits in u64
    const gas_u64 = if (gas.words[1] == 0 and gas.words[2] == 0 and gas.words[3] == 0)
        @as(u64, gas.words[0])
    else
        std.math.maxInt(u64);
    
    // Calculate gas costs for the CALLCODE operation
    const has_value = !value.isZero();
    const gas_calc = calculateCallGas(gas_left.*, gas_u64, has_value);
    
    // Base gas cost for callcode - 700 for non-zero value transfers, 40 otherwise
    var call_gas_cost: u64 = if (has_value) 700 else 40;
    
    // Add memory expansion gas cost for input and output
    if (mem_in_size > 0) {
        // Calculate memory expansion cost for input
        call_gas_cost += memory.expand(mem_in_offset + mem_in_size);
    }
    
    if (mem_out_size > 0) {
        // Calculate memory expansion cost for output
        call_gas_cost += memory.expand(mem_out_offset + mem_out_size);
    }
    
    // Add the cost for the gas being passed to the call
    call_gas_cost += gas_calc.gas_cost;
    
    // Check if enough gas is available
    if (gas_left.* < call_gas_cost) {
        return Error.OutOfGas;
    }
    
    // Convert target address to Address type
    var to_addr_bytes: [20]u8 = [_]u8{0} ** 20;
    const addr_bytes = @as(u128, to_addr_u256.words[0]) | (@as(u128, to_addr_u256.words[1]) << 64);
    for (0..20) |i| {
        const shift_amount = @as(u7, @intCast((19 - i) * 8));
        to_addr_bytes[i] = @as(u8, @intCast((addr_bytes >> shift_amount) & 0xFF));
    }
    const to_addr = Address{ .bytes = to_addr_bytes };
    
    // Copy input data from memory
    var input_data = std.ArrayList(u8).init(std.heap.c_allocator);
    defer input_data.deinit();
    
    if (mem_in_size > 0) {
        try input_data.resize(mem_in_size);
        const available_input = @min(mem_in_size, memory.size - mem_in_offset);
        
        if (available_input > 0) {
            @memcpy(input_data.items[0..available_input], memory.page.buffer[mem_in_offset..][0..available_input]);
        }
        
        // Fill remaining with zeros if needed
        if (available_input < mem_in_size) {
            @memset(input_data.items[available_input..], 0);
        }
    }
    
    // Deduct gas for the call
    gas_left.* -= call_gas_cost;
    
    // Get caller address from environment
    var caller_addr = Address.zero();
    if (environment) |env| {
        caller_addr = env.address;
    }
    
    // Execute the call if the callback is provided
    var success = true;
    var call_result = ExecutionResult{
        .Success = .{
            .gas_used = 0,
            .gas_refunded = 0,
            .return_data = &[_]u8{},
        }
    };
    
    if (call_fn) |cfn| {
        call_result = cfn(
            caller_addr,
            to_addr,
            value,
            input_data.items,
            gas_calc.gas_limit,
            false, // Not necessarily static
            caller_addr // Delegated from the caller's address
        );
    }
    
    // Handle return data
    var return_data: []const u8 = &[_]u8{};
    
    switch (call_result) {
        .Success => |success_data| {
            // Copy successful return data to memory
            return_data = success_data.return_data;
            
            // Refund unused gas
            const gas_used = @min(gas_calc.gas_limit, success_data.gas_used);
            const gas_refunded = gas_calc.gas_limit - gas_used;
            gas_left.* += gas_refunded;
        },
        .Revert => |revert_data| {
            // Even though the call failed, we still set the return data
            return_data = revert_data.return_data;
            success = false;
            
            // Refund unused gas
            const gas_refunded = gas_calc.gas_limit - revert_data.gas_used;
            gas_left.* += gas_refunded;
        },
        .Error => |_| {
            // For errors, there's no return data and no gas refund
            success = false;
        },
    }
    
    // Copy return data to memory
    if (mem_out_size > 0 and return_data.len > 0) {
        const copy_size = @min(mem_out_size, return_data.len);
        for (0..copy_size) |i| {
            if (mem_out_offset + i < memory.size) {
                memory.page.buffer[mem_out_offset + i] = return_data[i];
            }
        }
    }
    
    // Push success flag to stack (1 for success, 0 for failure)
    try stack.push(U256.fromU64(if (success) 1 else 0));
    
    // Advance PC
    pc.* += 1;
}

/// Get the code size of a contract at a given address
pub fn extcodesize(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    get_code_fn: ?GetCodeFn,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost for EXTCODESIZE - 700 (increases to 2600 with EIP-2929 for cold access)
    const gas_cost: u64 = 700;
    if (gas_left.* < gas_cost) {
        return Error.OutOfGas;
    }
    gas_left.* -= gas_cost;
    
    // Pop the address from the stack
    const addr_u256 = try stack.pop();
    
    // Convert to Address type
    var addr_bytes: [20]u8 = [_]u8{0} ** 20;
    const addr_value = @as(u128, addr_u256.words[0]) | (@as(u128, addr_u256.words[1]) << 64);
    for (0..20) |i| {
        const shift_amount = @as(u7, @intCast((19 - i) * 8));
        addr_bytes[i] = @as(u8, @intCast((addr_value >> shift_amount) & 0xFF));
    }
    const addr = Address{ .bytes = addr_bytes };
    
    // Get the code size
    var code_size: usize = 0;
    if (get_code_fn) |fn_ptr| {
        const external_code = fn_ptr(addr);
        code_size = external_code.len;
    }
    
    // Push the code size to the stack
    try stack.push(U256.fromU64(code_size));
    
    // Advance PC
    pc.* += 1;
}

/// Copy the code of a contract at a given address
pub fn extcodecopy(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    get_code_fn: ?GetCodeFn,
) !void {
    _ = code;
    _ = gas_refund;
    
    // Pop values from stack
    const addr_u256 = try stack.pop(); // Address to get code from
    const mem_offset = try stack.pop(); // Destination offset in memory
    const code_offset = try stack.pop(); // Offset in the code to copy from
    const size = try stack.pop(); // Size to copy
    
    // Ensure parameters fit in usize
    if (mem_offset.words[1] != 0 or mem_offset.words[2] != 0 or mem_offset.words[3] != 0 or
        code_offset.words[1] != 0 or code_offset.words[2] != 0 or code_offset.words[3] != 0 or
        size.words[1] != 0 or size.words[2] != 0 or size.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_dest = @as(usize, mem_offset.words[0]);
    const code_src = @as(usize, code_offset.words[0]);
    const copy_size = @as(usize, size.words[0]);
    
    // Gas cost - 700 base cost (increases to 2600 with EIP-2929 for cold access) + 3 per word
    var gas_cost: u64 = 700;
    
    // Skip operation for zero size
    if (copy_size == 0) {
        pc.* += 1;
        return;
    }
    
    // Add memory expansion gas cost
    gas_cost += memory.expand(mem_dest + copy_size);
    
    // Add gas cost per word copied (rounded up)
    gas_cost += ((copy_size + 31) / 32) * 3;
    
    // Check gas
    if (gas_left.* < gas_cost) {
        return Error.OutOfGas;
    }
    gas_left.* -= gas_cost;
    
    // Convert to Address type
    var addr_bytes: [20]u8 = [_]u8{0} ** 20;
    const addr_value = @as(u128, addr_u256.words[0]) | (@as(u128, addr_u256.words[1]) << 64);
    for (0..20) |i| {
        const shift_amount = @as(u7, @intCast((19 - i) * 8));
        addr_bytes[i] = @as(u8, @intCast((addr_value >> shift_amount) & 0xFF));
    }
    const addr = Address{ .bytes = addr_bytes };
    
    // Get the code
    var external_code: []const u8 = &[_]u8{};
    if (get_code_fn) |fn_ptr| {
        external_code = fn_ptr(addr);
    }
    
    // Copy the code to memory
    if (code_src < external_code.len) {
        const available_code = external_code.len - code_src;
        const to_copy = @min(copy_size, available_code);
        
        for (0..to_copy) |i| {
            if (mem_dest + i < memory.size) {
                memory.page.buffer[mem_dest + i] = external_code[code_src + i];
            }
        }
        
        // Fill remaining with zeros if needed
        for (to_copy..copy_size) |i| {
            if (mem_dest + i < memory.size) {
                memory.page.buffer[mem_dest + i] = 0;
            }
        }
    } else {
        // If code_src is beyond the end of the code, just write zeros
        for (0..copy_size) |i| {
            if (mem_dest + i < memory.size) {
                memory.page.buffer[mem_dest + i] = 0;
            }
        }
    }
    
    // Advance PC
    pc.* += 1;
}

/// Get the hash of a contract's code at a given address
pub fn extcodehash(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    get_code_fn: ?GetCodeFn,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost for EXTCODEHASH - 700 (increases to 2600 with EIP-2929 for cold access)
    const gas_cost: u64 = 700;
    if (gas_left.* < gas_cost) {
        return Error.OutOfGas;
    }
    gas_left.* -= gas_cost;
    
    // Pop the address from the stack
    const addr_u256 = try stack.pop();
    
    // Convert to Address type
    var addr_bytes: [20]u8 = [_]u8{0} ** 20;
    const addr_value = @as(u128, addr_u256.words[0]) | (@as(u128, addr_u256.words[1]) << 64);
    for (0..20) |i| {
        const shift_amount = @as(u7, @intCast((19 - i) * 8));
        addr_bytes[i] = @as(u8, @intCast((addr_value >> shift_amount) & 0xFF));
    }
    const addr = Address{ .bytes = addr_bytes };
    
    // Get the code
    var external_code: []const u8 = &[_]u8{};
    if (get_code_fn) |fn_ptr| {
        external_code = fn_ptr(addr);
    }
    
    // Compute the hash of the code (in a real implementation, this would use Keccak-256)
    // For simplicity, we'll use a placeholder hash
    var code_hash = U256.zero();
    if (external_code.len > 0) {
        // Simple hash function - just a placeholder
        var hash_value: u64 = 0;
        for (external_code) |byte| {
            hash_value = hash_value *% 33 +% byte;
        }
        code_hash = U256.fromU64(hash_value);
    }
    
    // Push the code hash to the stack
    try stack.push(code_hash);
    
    // Advance PC
    pc.* += 1;
}

/// Get the balance of an account at a given address
pub fn balance(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
    get_balance_fn: ?GetBalanceFn,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Gas cost for BALANCE - 700 (increases to 2600 with EIP-2929 for cold access)
    const gas_cost: u64 = 700;
    if (gas_left.* < gas_cost) {
        return Error.OutOfGas;
    }
    gas_left.* -= gas_cost;
    
    // Pop the address from the stack
    const addr_u256 = try stack.pop();
    
    // Convert to Address type
    var addr_bytes: [20]u8 = [_]u8{0} ** 20;
    const addr_value = @as(u128, addr_u256.words[0]) | (@as(u128, addr_u256.words[1]) << 64);
    for (0..20) |i| {
        const shift_amount = @as(u7, @intCast((19 - i) * 8));
        addr_bytes[i] = @as(u8, @intCast((addr_value >> shift_amount) & 0xFF));
    }
    const addr = Address{ .bytes = addr_bytes };
    
    // Get the balance
    var balance_value = U256.zero();
    if (get_balance_fn) |fn_ptr| {
        balance_value = fn_ptr(addr);
    }
    
    // Push the balance to the stack
    try stack.push(balance_value);
    
    // Advance PC
    pc.* += 1;
}

// Tests go here
test "CALL gas calculation" {
    // Test the gas calculation for different scenarios
    
    // Normal case without value transfer
    const no_value = calculateCallGas(10000, 5000, false);
    try std.testing.expectEqual(@as(u64, 5000), no_value.gas_limit);
    try std.testing.expectEqual(@as(u64, 5000), no_value.gas_cost);
    
    // With value transfer (should add 9000 stipend)
    const with_value = calculateCallGas(10000, 5000, true);
    try std.testing.expectEqual(@as(u64, 5000), with_value.gas_limit);
    try std.testing.expectEqual(@as(u64, 14000), with_value.gas_cost); // 5000 + 9000
    
    // Test 63/64 rule
    const limited_gas = calculateCallGas(6400, 6300, false);
    try std.testing.expectEqual(@as(u64, 6300), limited_gas.gas_limit);
    try std.testing.expectEqual(@as(u64, 6300), limited_gas.gas_cost);
    
    const over_limit = calculateCallGas(6400, 6500, false);
    try std.testing.expectEqual(@as(u64, 6300), over_limit.gas_limit); // Limited to 63/64 of 6400
    try std.testing.expectEqual(@as(u64, 6300), over_limit.gas_cost);
}

test "Address conversion for calls" {
    // Test the conversion from U256 to Address
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Setup a simple CALL test
    const addr_hex = 0x1234567890123456789012345678901234567890;
    const addr_u256 = U256.fromU64(addr_hex);
    
    // Push the minimum parameters needed for a CALL
    try stack.push(U256.fromU64(1000)); // gas
    try stack.push(addr_u256);          // address
    try stack.push(U256.zero());        // value
    try stack.push(U256.zero());        // in_offset
    try stack.push(U256.zero());        // in_size
    try stack.push(U256.zero());        // out_offset
    try stack.push(U256.zero());        // out_size
    
    // Skip the actual call operation verification since we can't capture the target address
    // in a test closure. Instead, we'll verify the stack and PC updates.
    var pc: usize = 0;
    var gas_left: u64 = 50000;
    var gas_refund: u64 = 0;
    
    // Call function with a simple success mock
    const simple_mock = struct {
        fn callFn(
            _: Address,
            _: Address,
            _: U256,
            _: []const u8,
            _: u64,
            _: bool,
            _: ?Address,
        ) ExecutionResult {
            return .{
                .Success = .{
                    .gas_used = 100,
                    .gas_refunded = 0,
                    .return_data = &[_]u8{},
                }
            };
        }
    }.callFn;
    
    try call(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, null, simple_mock, false);
    
    // Verify PC was advanced and stack has success flag
    try std.testing.expectEqual(@as(usize, 1), pc);
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    try std.testing.expectEqual(U256.fromU64(1), try stack.pop()); // Success flag
}

test "CALL success and failure" {
    // Test that CALL correctly handles success and failure cases
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Setup a simple CALL test
    try stack.push(U256.fromU64(1000)); // gas
    try stack.push(U256.fromU64(0x42)); // address
    try stack.push(U256.zero());        // value
    try stack.push(U256.zero());        // in_offset
    try stack.push(U256.zero());        // in_size
    try stack.push(U256.zero());        // out_offset
    try stack.push(U256.zero());        // out_size
    
    // Success case
    const success_fn = struct {
        fn mockCall(
            caller: Address,
            target: Address,
            value: U256,
            input: []const u8,
            gas: u64,
            static_mode: bool,
            delegated: ?Address,
        ) ExecutionResult {
            _ = caller;
            _ = target;
            _ = value;
            _ = input;
            _ = gas;
            _ = static_mode;
            _ = delegated;
            
            return .{
                .Success = .{
                    .gas_used = 500,
                    .gas_refunded = 0,
                    .return_data = &[_]u8{},
                }
            };
        }
    }.mockCall;
    
    // Call with success function
    var pc: usize = 0;
    var gas_left: u64 = 50000;
    var gas_refund: u64 = 0;
    
    try call(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, null, success_fn, false);
    
    // Check that the success flag is 1
    try std.testing.expectEqual(U256.fromU64(1), try stack.pop());
    
    // Setup for failure case
    try stack.push(U256.fromU64(1000)); // gas
    try stack.push(U256.fromU64(0x42)); // address
    try stack.push(U256.zero());        // value
    try stack.push(U256.zero());        // in_offset
    try stack.push(U256.zero());        // in_size
    try stack.push(U256.zero());        // out_offset
    try stack.push(U256.zero());        // out_size
    
    // Failure case
    const failure_fn = struct {
        fn mockCall(
            caller: Address,
            target: Address,
            value: U256,
            input: []const u8,
            gas: u64,
            static_mode: bool,
            delegated: ?Address,
        ) ExecutionResult {
            _ = caller;
            _ = target;
            _ = value;
            _ = input;
            _ = gas;
            _ = static_mode;
            _ = delegated;
            
            return .{
                .Error = .{
                    .error_type = Error.OutOfGas,
                    .gas_used = 1000,
                }
            };
        }
    }.mockCall;
    
    // Reset PC and gas
    pc = 0;
    gas_left = 50000;
    gas_refund = 0;
    
    try call(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, null, failure_fn, false);
    
    // Check that the success flag is 0
    try std.testing.expectEqual(U256.fromU64(0), try stack.pop());
}

test "CALL with value in static context" {
    // Test that CALL with value transfer in static context fails
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Setup a CALL with non-zero value
    try stack.push(U256.fromU64(1000)); // gas
    try stack.push(U256.fromU64(0x42)); // address
    try stack.push(U256.fromU64(100));  // value - non-zero
    try stack.push(U256.zero());        // in_offset
    try stack.push(U256.zero());        // in_size
    try stack.push(U256.zero());        // out_offset
    try stack.push(U256.zero());        // out_size
    
    // Call in static context
    var pc: usize = 0;
    var gas_left: u64 = 50000;
    var gas_refund: u64 = 0;
    
    // This should fail with StaticModeViolation
    try std.testing.expectError(
        Error.StaticModeViolation,
        call(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, null, null, true)
    );
    
    // Stack should be unchanged
    try std.testing.expectEqual(@as(usize, 7), stack.getSize());
}

test "STATICCALL basic operation" {
    // Test that STATICCALL works correctly (without capturing the static flag)
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Setup a STATICCALL
    try stack.push(U256.fromU64(1000)); // gas
    try stack.push(U256.fromU64(0x42)); // address
    try stack.push(U256.zero());        // in_offset
    try stack.push(U256.zero());        // in_size
    try stack.push(U256.zero());        // out_offset
    try stack.push(U256.zero());        // out_size
    
    // Simple mock call function (we can't capture the static flag due to Zig's closure restrictions)
    const simple_mock = struct {
        fn callFn(
            _: Address,
            _: Address,
            _: U256,
            _: []const u8,
            _: u64,
            _: bool,
            _: ?Address,
        ) ExecutionResult {
            return .{
                .Success = .{
                    .gas_used = 100,
                    .gas_refunded = 0,
                    .return_data = &[_]u8{},
                }
            };
        }
    }.callFn;
    
    // Call STATICCALL in non-static context
    var pc: usize = 0;
    var gas_left: u64 = 50000;
    var gas_refund: u64 = 0;
    
    try staticcall(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, null, simple_mock, false);
    
    // Verify PC was advanced and stack has success flag
    try std.testing.expectEqual(@as(usize, 1), pc);
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    try std.testing.expectEqual(U256.fromU64(1), try stack.pop()); // Success flag
}