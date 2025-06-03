const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../gas_constants.zig");
const error_mapping = @import("../error_mapping.zig");

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
    if (current == new) {
        return 0;
    }
    
    if (current == 0) {
        return SSTORE_SET_GAS;
    }
    
    if (new == 0) {
        return SSTORE_RESET_GAS;
    }
    
    return SSTORE_RESET_GAS;
}

pub fn op_sload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const slot = try stack_pop(&frame.stack);
    
    const is_cold = try frame.contract.mark_storage_slot_warm(slot, null);
    const gas_cost = if (is_cold) gas_constants.ColdSloadCost else gas_constants.WarmStorageReadCost;
    try frame.consume_gas(gas_cost);
    
    const value = try error_mapping.vm_get_storage(vm, frame.contract.address, slot);
    
    try stack_push(&frame.stack, value);
    
    return Operation.ExecutionResult{};
}

/// SSTORE opcode - Store value in persistent storage
pub fn op_sstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const slot = try stack_pop(&frame.stack);
    const value = try stack_pop(&frame.stack);
    
    const is_cold = try frame.contract.mark_storage_slot_warm(slot, null);
    if (is_cold) {
        try frame.consume_gas(gas_constants.ColdSloadCost);
    }
    
    const current_value = try error_mapping.vm_get_storage(vm, frame.contract.address, slot);
    
    const dynamic_gas = calculate_sstore_gas(current_value, value);
    try frame.consume_gas(dynamic_gas);
    
    try error_mapping.vm_set_storage(vm, frame.contract.address, slot, value);
    
    return Operation.ExecutionResult{};
}

pub fn op_tload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const slot = try stack_pop(&frame.stack);
    
    const value = try error_mapping.vm_get_transient_storage(vm, frame.contract.address, slot);
    
    try stack_push(&frame.stack, value);
    
    return Operation.ExecutionResult{};
}

pub fn op_tstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const slot = try stack_pop(&frame.stack);
    const value = try stack_pop(&frame.stack);
    
    try error_mapping.vm_set_transient_storage(vm, frame.contract.address, slot, value);
    
    return Operation.ExecutionResult{};
}