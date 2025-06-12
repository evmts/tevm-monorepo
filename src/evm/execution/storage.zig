const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const Address = @import("Address");
const Log = @import("../log.zig");
const gas = @import("../gas/gas.zig");
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;

/// Determine the effective hardfork for SSTORE gas calculations.
/// This maps chain rules to the appropriate hardfork for gas calculations.
/// Checks hardforks from newest to oldest to ensure correct precedence.
fn get_effective_hardfork(chain_rules: anytype) Hardfork {
    if (chain_rules.IsCancun) return .CANCUN;
    if (chain_rules.IsShanghai) return .SHANGHAI;
    if (chain_rules.IsMerge) return .MERGE;
    if (chain_rules.IsLondon) return .LONDON;
    if (chain_rules.IsBerlin) return .BERLIN;
    if (chain_rules.IsIstanbul) return .ISTANBUL;
    if (chain_rules.IsPetersburg) return .PETERSBURG;
    if (chain_rules.IsConstantinople) return .CONSTANTINOPLE;
    if (chain_rules.IsByzantium) return .BYZANTIUM;
    if (chain_rules.IsEIP158) return .SPURIOUS_DRAGON;
    if (chain_rules.IsEIP150) return .TANGERINE_WHISTLE;
    if (chain_rules.IsHomestead) return .HOMESTEAD;
    return .FRONTIER;
}

pub fn op_sload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.stack.size < 1) unreachable;

    const slot = frame.stack.peek_unsafe().*;

    if (vm.chain_rules.IsBerlin) {
        const is_cold = frame.contract.mark_storage_slot_warm(frame.allocator, slot, null) catch {
            return ExecutionError.Error.OutOfMemory;
        };
        const gas_cost = if (is_cold) gas_constants.ColdSloadCost else gas_constants.WarmStorageReadCost;
        try frame.consume_gas(gas_cost);
    } else {
        // Pre-Berlin: gas is handled by jump table constant_gas
        // For Istanbul, this would be 800 gas set in the jump table
    }

    const value = vm.state.get_storage(frame.contract.address, slot);

    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

/// SSTORE opcode - Store value in persistent storage with EIP-2200 gas calculations and refunds
pub fn op_sstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    @branchHint(.likely);
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    Log.debug("SSTORE: Starting execution, gas_remaining={}, static={}", .{ frame.gas_remaining, frame.is_static });

    // Check static call protection
    if (frame.is_static) {
        @branchHint(.unlikely);
        Log.debug("SSTORE: Rejected due to static call context", .{});
        return ExecutionError.Error.WriteProtection;
    }

    // Stack validation (should be done by jump table, but double-check for safety)
    if (frame.stack.size < 2) unreachable;

    // Get the effective hardfork for gas calculations
    const hardfork = get_effective_hardfork(vm.chain_rules);
    
    // Note: Gas sentry check is performed inside calculate_sstore_operation
    // after calculating the actual gas cost

    // Pop stack values: [..., value, slot] where slot is on top
    const popped = frame.stack.pop2_unsafe();
    const new_value = popped.a; // First popped (was second from top)
    const slot = popped.b; // Second popped (was top)

    Log.debug("SSTORE: slot={}, new_value={}", .{ slot, new_value });

    // Get current value from storage
    const current_value = vm.state.get_storage(frame.contract.address, slot);
    
    // Get original value (first access in this transaction)
    const original_value = vm.get_original_storage_value(frame.contract.address, slot) catch |err| {
        Log.debug("SSTORE: Failed to get original storage value: {}", .{err});
        return ExecutionError.Error.OutOfMemory;
    };

    Log.debug("SSTORE: original={}, current={}, new={}", .{ original_value, current_value, new_value });

    // Check if storage slot is warm (EIP-2929)
    const is_cold = frame.contract.mark_storage_slot_warm(frame.allocator, slot, null) catch |err| {
        Log.debug("SSTORE: Failed to mark storage slot warm: {}", .{err});
        return ExecutionError.Error.OutOfMemory;
    };
    const is_warm = !is_cold;

    Log.debug("SSTORE: storage slot is_warm={}", .{is_warm});

    // Calculate gas cost and refund using EIP-2200 logic
    const sstore_result = gas.calculate_sstore_operation(
        original_value,
        current_value,
        new_value,
        hardfork,
        is_warm,
        frame.gas_remaining,
    );

    if (!sstore_result.is_valid) {
        @branchHint(.unlikely);
        Log.debug("SSTORE: Gas sentry check failed", .{});
        return ExecutionError.Error.OutOfGas;
    }

    Log.debug("SSTORE: calculated gas_cost={}, refund={}", .{ sstore_result.gas_cost, sstore_result.refund });

    // Consume gas for the operation
    try frame.consume_gas(sstore_result.gas_cost);

    // Apply refund (can be positive or negative)
    if (sstore_result.refund > 0) {
        vm.add_gas_refund(@as(u64, @intCast(sstore_result.refund)));
    } else if (sstore_result.refund < 0) {
        vm.sub_gas_refund(@as(u64, @intCast(-sstore_result.refund)));
    }

    // Update storage
    try vm.state.set_storage(frame.contract.address, slot, new_value);

    Log.debug("SSTORE: Successfully stored value={} at slot={}, refund_applied={}", .{ new_value, slot, sstore_result.refund });

    return Operation.ExecutionResult{};
}

pub fn op_tload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Gas is already handled by jump table constant_gas = 100

    if (frame.stack.size < 1) unreachable;

    // Get slot from top of stack unsafely - bounds checking is done in jump_table.zig
    const slot = frame.stack.peek_unsafe().*;

    const value = vm.state.get_transient_storage(frame.contract.address, slot);

    // Replace top of stack with loaded value unsafely - bounds checking is done in jump_table.zig
    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

pub fn op_tstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.is_static) {
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    // Gas is already handled by jump table constant_gas = 100

    if (frame.stack.size < 2) unreachable;

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // Stack order: [..., value, slot] where slot is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const slot = popped.b; // Second popped (was top)

    try vm.state.set_transient_storage(frame.contract.address, slot, value);

    return Operation.ExecutionResult{};
}
