const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Contract = @import("../contract.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../gas_constants.zig");
const error_mapping = @import("../error_mapping.zig");
const Address = @import("Address");
const Log = @import("../log.zig");
const ChainRules = @import("../chain_rules.zig");

// EIP-3529 (London) gas costs for SSTORE
const SSTORE_SET_GAS: u64 = 20000;
const SSTORE_RESET_GAS: u64 = 2900;
const SSTORE_CLEARS_REFUND: u64 = 4800;

// Pre-London refund constants
const SSTORE_SET_GAS_PRE_LONDON: u64 = 20000;
const SSTORE_CLEARS_REFUND_PRE_LONDON: u64 = 15000;

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

fn calculate_sstore_gas(current: u256, new: u256) u64 {
    if (current == new) return 0;
    if (current == 0) return SSTORE_SET_GAS;
    if (new == 0) return SSTORE_RESET_GAS;
    return SSTORE_RESET_GAS;
}

pub fn op_sload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    std.debug.assert(frame.stack.size >= 1);

    const slot = frame.stack.peek_unsafe().*;

    if (vm.chain_rules.IsBerlin) {
        const is_cold = frame.contract.mark_storage_slot_warm(frame.allocator, slot, null) catch |err| switch (err) {
            Contract.MarkStorageSlotWarmError.OutOfAllocatorMemory => {
                return ExecutionError.Error.OutOfMemory;
            },
        };
        const gas_cost = if (is_cold) gas_constants.ColdSloadCost else gas_constants.WarmStorageReadCost;
        try frame.consume_gas(gas_cost);
    } else {
        // Pre-Berlin: gas is handled by jump table constant_gas
        // For Istanbul, this would be 800 gas set in the jump table
    }

    const value = try error_mapping.vm_get_storage(vm, frame.contract.address, slot);

    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

/// SSTORE opcode - Store value in persistent storage
pub fn op_sstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.is_static) return ExecutionError.Error.WriteProtection;

    // EIP-1706: Disable SSTORE with gasleft lower than call stipend (2300)
    // This prevents reentrancy attacks by ensuring enough gas remains for exception handling
    if (vm.chain_rules.IsIstanbul and frame.gas_remaining <= gas_constants.SstoreSentryGas) return ExecutionError.Error.OutOfGas;

    std.debug.assert(frame.stack.size >= 2);

    // Stack order: [..., value, slot] where slot is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const slot = popped.b; // Second popped (was top)

    const current_value = try error_mapping.vm_get_storage(vm, frame.contract.address, slot);
    
    // Get original value for EIP-2200 refund calculations
    const original_value = if (vm.state.in_transaction) 
        try vm.state.get_original_storage(frame.contract.address, slot)
    else 
        current_value; // Fallback if not in transaction context

    const is_cold = frame.contract.mark_storage_slot_warm(frame.allocator, slot, null) catch |err| switch (err) {
        Contract.MarkStorageSlotWarmError.OutOfAllocatorMemory => {
            Log.err("SSTORE: mark_storage_slot_warm failed: {}", .{err});
            return ExecutionError.Error.OutOfMemory;
        },
    };

    var total_gas: u64 = 0;

    if (is_cold) {
        total_gas += gas_constants.ColdSloadCost;
    }

    // Add dynamic gas based on value change
    const dynamic_gas = calculate_sstore_gas(current_value, value);
    total_gas += dynamic_gas;

    // Consume all gas at once
    try frame.consume_gas(total_gas);

    try error_mapping.vm_set_storage(vm, frame.contract.address, slot, value);
    
    // Apply EIP-2200 gas refunds using original, current, and new values
    if (vm.chain_rules.IsIstanbul) {
        apply_sstore_refund(frame.contract, original_value, current_value, value, vm.chain_rules);
    }

    return Operation.ExecutionResult{};
}

/// Apply EIP-2200 gas refunds based on storage value transitions
/// 
/// Handles all refund cases for SSTORE operations:
/// - Clearing storage (non-zero to zero): Add refund
/// - Reverting a clear (original != 0, current = 0, new != 0): Remove refund  
/// - Restoring original value: Add refund
/// - Other cases that warrant refund adjustments
///
/// ## Parameters
/// - `contract`: The contract executing SSTORE
/// - `original`: Value at start of transaction
/// - `current`: Value before this SSTORE
/// - `new`: Value being set
/// - `rules`: Chain rules to determine refund amounts
fn apply_sstore_refund(contract: *Contract, original: u256, current: u256, new: u256, rules: ChainRules) void {
    // Determine refund amount based on hardfork
    const refund_amount = if (rules.IsLondon) SSTORE_CLEARS_REFUND else SSTORE_CLEARS_REFUND_PRE_LONDON;
    
    // If no change, no refund
    if (current == new) return;
    
    // Case 1: Storage slot is being cleared (non-zero to zero)
    if (current != 0 and new == 0) {
        contract.add_gas_refund(refund_amount);
        return;
    }
    
    // Case 2: Reverting a previous clear in same transaction
    // original != 0, current = 0, new != 0
    if (original != 0 and current == 0 and new != 0) {
        // We previously got a refund for clearing, now we're undoing it
        contract.sub_gas_refund(refund_amount);
        return;
    }
    
    // Case 3: Restoring original value (where original != 0)
    // This gives a refund as we're effectively undoing all changes
    if (original == new and original != 0 and current != original) {
        contract.add_gas_refund(refund_amount);
        return;
    }
    
    // Case 4: Setting back to zero after changing from zero
    // original = 0, current != 0, new = 0
    // This is different from case 1 - we set from 0 to non-zero, now back to 0
    // Net effect is no change, so we remove the refund we would have gotten
    if (original == 0 and current != 0 and new == 0) {
        // Note: In some implementations this might not give a refund
        // as the net effect across the transaction is no change
        // But per EIP-2200, we do give the refund for the clear operation
        contract.add_gas_refund(refund_amount);
        return;
    }
}

pub fn op_tload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Gas is already handled by jump table constant_gas = 100

    std.debug.assert(frame.stack.size >= 1);

    // Get slot from top of stack unsafely - bounds checking is done in jump_table.zig
    const slot = frame.stack.peek_unsafe().*;

    const value = try error_mapping.vm_get_transient_storage(vm, frame.contract.address, slot);

    // Replace top of stack with loaded value unsafely - bounds checking is done in jump_table.zig
    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

pub fn op_tstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.is_static) return ExecutionError.Error.WriteProtection;

    // Gas is already handled by jump table constant_gas = 100

    std.debug.assert(frame.stack.size >= 2);

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // Stack order: [..., value, slot] where slot is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const slot = popped.b; // Second popped (was top)

    try error_mapping.vm_set_transient_storage(vm, frame.contract.address, slot, value);

    return Operation.ExecutionResult{};
}
