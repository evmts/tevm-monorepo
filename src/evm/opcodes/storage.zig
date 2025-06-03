const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../gas_constants.zig");

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

pub fn op_sload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const slot = try stack_pop(&frame.stack);
    
    // EIP-2929: Check if storage slot is cold and consume appropriate gas
    const is_cold = try frame.contract.mark_storage_slot_warm(slot, null);
    if (is_cold) {
        // Cold storage access costs more (2100 gas)
        try frame.consume_gas(gas_constants.ColdSloadCost - gas_constants.WarmStorageReadCost); // Subtract the warm cost already consumed by the opcode
    }
    
    // Get storage value
    const value = vm.get_storage(frame.contract.address, slot) catch |err| switch (err) {
        error.OutOfMemory => return ExecutionError.Error.OutOfGas,
    };
    
    try stack_push(&frame.stack, value);
    
    return "";
}

pub fn op_sstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Check if we're in a static call
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const slot = try stack_pop(&frame.stack);
    const value = try stack_pop(&frame.stack);
    
    // EIP-2929: Check if storage slot is cold and consume appropriate gas
    const is_cold = try frame.contract.mark_storage_slot_warm(slot, null);
    if (is_cold) {
        // Cold storage access costs more (2100 gas)
        try frame.consume_gas(gas_constants.ColdSloadCost);
    }
    
    // Set storage value
    vm.set_storage(frame.contract.address, slot, value) catch |err| switch (err) {
        error.OutOfMemory => return ExecutionError.Error.OutOfGas,
    };
    
    return "";
}

pub fn op_tload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const slot = try stack_pop(&frame.stack);
    
    // Get transient storage value (EIP-1153)
    const value = vm.get_transient_storage(frame.contract.address, slot) catch |err| switch (err) {
        error.OutOfMemory => return ExecutionError.Error.OutOfGas,
    };
    
    try stack_push(&frame.stack, value);
    
    return "";
}

pub fn op_tstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Check if we're in a static call
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const slot = try stack_pop(&frame.stack);
    const value = try stack_pop(&frame.stack);
    
    // Set transient storage value (EIP-1153)
    vm.set_transient_storage(frame.contract.address, slot, value) catch |err| switch (err) {
        error.OutOfMemory => return ExecutionError.Error.OutOfGas,
    };
    
    return "";
}