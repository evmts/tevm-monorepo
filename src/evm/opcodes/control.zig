const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../gas_constants.zig");
const AccessList = @import("../access_list.zig").AccessList;
const Address = @import("Address");
const from_u256 = Address.from_u256;
const error_mapping = @import("../error_mapping.zig");

// Import helper functions from error_mapping
const stack_pop = error_mapping.stack_pop;
const stack_push = error_mapping.stack_push;
const map_memory_error = error_mapping.map_memory_error;

pub fn op_stop(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    return ExecutionError.Error.STOP;
}

pub fn op_jump(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const dest = try stack_pop(&frame.stack);

    // Check if destination is a valid JUMPDEST (pass u256 directly)
    if (!frame.contract.valid_jumpdest(dest)) {
        return ExecutionError.Error.InvalidJump;
    }

    // After validation, convert to usize for setting pc
    if (dest > std.math.maxInt(usize)) {
        return ExecutionError.Error.InvalidJump;
    }

    frame.pc = @as(usize, @intCast(dest));

    return Operation.ExecutionResult{};
}

pub fn op_jumpi(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // EVM spec: JUMPI pops counter (destination) first, then b (condition)
    // Stack: [... counter b] -> counter is popped first (was on top)
    const dest = try stack_pop(&frame.stack);
    const condition = try stack_pop(&frame.stack);

    const dest_usize = if (dest > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(dest));

    // Debug: JUMPI attempting jump

    if (condition != 0) {
        if (dest_usize < frame.contract.code.len) {
            // Debug: JUMPI target check
            if (frame.contract.analysis) |analysis| {
                if (analysis.jumpdest_positions.len > 0) {
                    var found_in_list = false;
                    for (analysis.jumpdest_positions) |jd_pos| {
                        if (jd_pos == dest_usize) {
                            found_in_list = true;
                            break;
                        }
                    }
                    // Debug: JUMPI detail - jumpdest positions
                } else {
                    // Debug: JUMPI detail - empty jumpdest positions
                }
            } else {
                // Debug: JUMPI detail - analysis is null
            }
        } else {
            // Debug: JUMPI target out of bounds
        }

        // Check if destination is a valid JUMPDEST (pass u256 directly)
        if (!frame.contract.valid_jumpdest(dest)) {
            return ExecutionError.Error.InvalidJump;
        }

        // After validation, convert to usize for setting pc
        if (dest > std.math.maxInt(usize)) {
            return ExecutionError.Error.InvalidJump;
        }

        frame.pc = @as(usize, @intCast(dest));
    }

    return Operation.ExecutionResult{};
}

pub fn op_pc(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    try stack_push(&frame.stack, @as(u256, @intCast(pc)));

    return Operation.ExecutionResult{};
}

pub fn op_jumpdest(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // No-op, just marks valid jump destination
    return Operation.ExecutionResult{};
}

pub fn op_return(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Stack order: push [offset, size] -> pop gets [size, offset]
    const size = try stack_pop(&frame.stack); // First pop gets size (4)
    const offset = try stack_pop(&frame.stack); // Second pop gets offset (10)

    if (size == 0) {
        frame.return_data_buffer = &[_]u8{};
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
            return ExecutionError.Error.OutOfOffset;
        }

        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.context_size();
        const end = offset_usize + size_usize;
        if (end > offset_usize) { // Check for overflow
            const memory_gas = gas_constants.memory_gas_cost(current_size, end);
            try frame.consume_gas(memory_gas);

            _ = frame.memory.ensure_context_capacity(end) catch |err| return map_memory_error(err);
        }

        // Get data from memory
        const data = frame.memory.get_slice(offset_usize, size_usize) catch |err| return map_memory_error(err);

        // Note: The memory gas cost already protects against excessive memory use.
        // The VM should handle copying the data when needed. We just set the reference.
        frame.return_data_buffer = data;
    }

    return ExecutionError.Error.STOP; // RETURN ends execution normally
}

pub fn op_revert(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Stack order: push [offset, size] -> pop gets [size, offset]
    const size = try stack_pop(&frame.stack);
    const offset = try stack_pop(&frame.stack);

    if (size == 0) {
        frame.return_data_buffer = &[_]u8{};
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
            return ExecutionError.Error.OutOfOffset;
        }

        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.context_size();
        const end = offset_usize + size_usize;
        if (end > offset_usize) { // Check for overflow
            const memory_gas = gas_constants.memory_gas_cost(current_size, end);
            try frame.consume_gas(memory_gas);

            _ = frame.memory.ensure_context_capacity(end) catch |err| return map_memory_error(err);
        }

        // Get data from memory
        const data = frame.memory.get_slice(offset_usize, size_usize) catch |err| return map_memory_error(err);

        // Note: The memory gas cost already protects against excessive memory use.
        // The VM should handle copying the data when needed. We just set the reference.
        frame.return_data_buffer = data;
    }

    return ExecutionError.Error.REVERT;
}

pub fn op_invalid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug: op_invalid entered
    // INVALID opcode consumes all remaining gas
    frame.gas_remaining = 0;
    // Debug: op_invalid returning InvalidOpcode

    return ExecutionError.Error.InvalidOpcode;
}

pub fn op_selfdestruct(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Check if we're in a static call
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }

    const beneficiary_u256 = try stack_pop(&frame.stack);
    const beneficiary = from_u256(beneficiary_u256);

    // EIP-2929: Check if beneficiary address is cold and consume appropriate gas
    const access_cost = vm.access_list.access_address(beneficiary) catch |err| switch (err) {
        error.OutOfMemory => return ExecutionError.Error.OutOfGas,
    };
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Schedule selfdestruct for execution at the end of the transaction
    // For now, just return STOP

    return ExecutionError.Error.STOP;
}
