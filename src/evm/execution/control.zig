const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const ExecutionResult = @import("execution_result.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame/frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const AccessList = @import("../access_list/access_list.zig").AccessList;
const Address = @import("Address");
const from_u256 = Address.from_u256;

pub fn op_stop(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    return ExecutionError.Error.STOP;
}

pub fn op_jump(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 1) {
        @branchHint(.cold);
        unreachable;
    }

    // Use unsafe pop since bounds checking is done by jump_table
    const dest = frame.stack.pop_unsafe();

    // Check if destination is a valid JUMPDEST (pass u256 directly)
    if (!frame.contract.valid_jumpdest(frame.allocator, dest)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.InvalidJump;
    }

    // After validation, convert to usize for setting pc
    if (dest > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.InvalidJump;
    }

    frame.pc = @as(usize, @intCast(dest));

    return ExecutionResult{};
}

pub fn op_jumpi(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Use batch pop for performance - pop 2 values at once
    const values = frame.stack.pop2_unsafe();
    const dest = values.b; // Second from top (was on top)
    const condition = values.a; // Third from top (was second)

    if (condition != 0) {
        @branchHint(.likely);
        // Check if destination is a valid JUMPDEST (pass u256 directly)
        if (!frame.contract.valid_jumpdest(frame.allocator, dest)) {
            @branchHint(.unlikely);
            return ExecutionError.Error.InvalidJump;
        }

        // After validation, convert to usize for setting pc
        if (dest > std.math.maxInt(usize)) {
            @branchHint(.unlikely);
            return ExecutionError.Error.InvalidJump;
        }

        frame.pc = @as(usize, @intCast(dest));
    }

    return ExecutionResult{};
}

pub fn op_pc(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size >= Stack.CAPACITY) {
        @branchHint(.cold);
        unreachable;
    }

    // Use unsafe push since bounds checking is done by jump_table
    frame.stack.append_unsafe(@as(u256, @intCast(pc)));

    return ExecutionResult{};
}

pub fn op_jumpdest(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // No-op, just marks valid jump destination
    return ExecutionResult{};
}

pub fn op_return(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Use batch pop for performance - pop 2 values at once
    const values = frame.stack.pop2_unsafe();
    const size = values.b; // Second from top (was on top)
    const offset = values.a; // Third from top (was second)

    if (size == 0) {
        @branchHint(.unlikely);
        try frame.return_data.set(&[_]u8{});
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
            @branchHint(.unlikely);
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

            _ = try frame.memory.ensure_context_capacity(end);
        }

        // Get data from memory
        const data = try frame.memory.get_slice(offset_usize, size_usize);

        // Note: The memory gas cost already protects against excessive memory use.
        // The VM should handle copying the data when needed. We just set the reference.
        try frame.return_data.set(data);
    }

    return ExecutionError.Error.STOP; // RETURN ends execution normally
}

pub fn op_revert(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Use batch pop for performance - pop 2 values at once
    const values = frame.stack.pop2_unsafe();
    const size = values.b; // Second from top (was on top)
    const offset = values.a; // Third from top (was second)

    if (size == 0) {
        @branchHint(.unlikely);
        try frame.return_data.set(&[_]u8{});
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
            @branchHint(.unlikely);
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

            _ = try frame.memory.ensure_context_capacity(end);
        }

        // Get data from memory
        const data = try frame.memory.get_slice(offset_usize, size_usize);

        // Note: The memory gas cost already protects against excessive memory use.
        // The VM should handle copying the data when needed. We just set the reference.
        try frame.return_data.set(data);
    }

    return ExecutionError.Error.REVERT;
}

pub fn op_invalid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug: op_invalid entered
    // INVALID opcode consumes all remaining gas
    frame.gas_remaining = 0;
    // Debug: op_invalid returning InvalidOpcode

    return ExecutionError.Error.InvalidOpcode;
}

pub fn op_selfdestruct(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Check if we're in a static call
    if (frame.is_static) {
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    if (frame.stack.size < 1) {
        @branchHint(.cold);
        unreachable;
    }

    // Use unsafe pop since bounds checking is done by jump_table
    const recipient_u256 = frame.stack.pop_unsafe();
    const recipient = from_u256(recipient_u256);

    // EIP-2929: Check if recipient address is cold and consume appropriate gas
    // Note: Jump table already consumes base SELFDESTRUCT gas cost
    const access_cost = vm.access_list.access_address(recipient) catch |err| switch (err) {
        error.OutOfMemory => return ExecutionError.Error.OutOfGas,
    };
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.likely);
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Mark contract for destruction at end of transaction
    vm.state.mark_for_destruction(frame.contract.address, recipient) catch |err| switch (err) {
        error.OutOfMemory => return ExecutionError.Error.OutOfGas,
    };

    // Halt execution
    return ExecutionError.Error.STOP;
}
