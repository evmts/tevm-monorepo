const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../gas_constants.zig");
const error_mapping = @import("../error_mapping.zig");
const Address = @import("Address");
const Log = @import("../log.zig");

// EIP-3529 (London) gas costs for SSTORE
const SSTORE_SET_GAS: u64 = 20000;
const SSTORE_RESET_GAS: u64 = 2900;
const SSTORE_CLEARS_REFUND: u64 = 4800;

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

    if (frame.stack.size < 1) unreachable;

    const slot = frame.stack.peek_unsafe().*;

    if (vm.chain_rules.IsBerlin) {
        const Contract = @import("../contract.zig");
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

    if (frame.stack.size < 2) unreachable;

    // Stack order: [..., value, slot] where slot is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const slot = popped.b; // Second popped (was top)

    const current_value = try error_mapping.vm_get_storage(vm, frame.contract.address, slot);

    const Contract = @import("../contract.zig");
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

    if (frame.stack.size < 2) unreachable;

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // Stack order: [..., value, slot] where slot is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const slot = popped.b; // Second popped (was top)

    try error_mapping.vm_set_transient_storage(vm, frame.contract.address, slot, value);

    return Operation.ExecutionResult{};
}
