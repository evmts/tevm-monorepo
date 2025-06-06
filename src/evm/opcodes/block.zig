const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Address = @import("Address");
const error_mapping = @import("../error_mapping.zig");

pub fn op_blockhash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const block_number = try error_mapping.stack_pop(&frame.stack);

    const current_block = vm.context.block_number;

    if (block_number >= current_block) {
        try error_mapping.stack_push(&frame.stack, 0);
    } else if (current_block > block_number + 256) {
        try error_mapping.stack_push(&frame.stack, 0);
    } else if (block_number == 0) {
        try error_mapping.stack_push(&frame.stack, 0);
    } else {
        // Return a pseudo-hash based on block number for testing
        // In production, this would retrieve the actual block hash from chain history
        const hash = std.hash.Wyhash.hash(0, std.mem.asBytes(&block_number));
        try error_mapping.stack_push(&frame.stack, hash);
    }

    return Operation.ExecutionResult{};
}

pub fn op_coinbase(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try error_mapping.stack_push(&frame.stack, Address.to_u256(vm.context.block_coinbase));

    return Operation.ExecutionResult{};
}

pub fn op_timestamp(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try error_mapping.stack_push(&frame.stack, @as(u256, @intCast(vm.context.block_timestamp)));

    return Operation.ExecutionResult{};
}

pub fn op_number(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try error_mapping.stack_push(&frame.stack, @as(u256, @intCast(vm.context.block_number)));

    return Operation.ExecutionResult{};
}

pub fn op_difficulty(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get difficulty/prevrandao from block context
    // Post-merge this returns PREVRANDAO
    try error_mapping.stack_push(&frame.stack, vm.context.block_difficulty);

    return Operation.ExecutionResult{};
}

pub fn op_prevrandao(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    // Same as difficulty post-merge
    return op_difficulty(pc, interpreter, state);
}

pub fn op_gaslimit(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try error_mapping.stack_push(&frame.stack, @as(u256, @intCast(vm.context.block_gas_limit)));

    return Operation.ExecutionResult{};
}

pub fn op_basefee(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get base fee from block context
    // Push base fee (EIP-1559)
    try error_mapping.stack_push(&frame.stack, vm.context.block_base_fee);

    return Operation.ExecutionResult{};
}

pub fn op_blobhash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const index = try error_mapping.stack_pop(&frame.stack);

    // EIP-4844: Get blob hash at index
    if (index >= vm.context.blob_hashes.len) {
        try error_mapping.stack_push(&frame.stack, 0);
    } else {
        const idx = @as(usize, @intCast(index));
        try error_mapping.stack_push(&frame.stack, vm.context.blob_hashes[idx]);
    }

    return Operation.ExecutionResult{};
}

pub fn op_blobbasefee(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get blob base fee from block context
    // Push blob base fee (EIP-4844)
    try error_mapping.stack_push(&frame.stack, vm.context.blob_base_fee);

    return Operation.ExecutionResult{};
}
