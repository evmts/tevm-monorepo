const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const ExecutionError = @import("../execution_error.zig");
const Frame = @import("../frame.zig");
const opcodes = @import("../opcodes/package.zig");

// UNDEFINED operation
pub const UNDEFINED = Operation{
    .execute = undefined_execute,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
    .undefined = true,
};

fn undefined_execute(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    return ExecutionError.Error.InvalidOpcode;
}

// GAS operation
pub const GAS = Operation{
    .execute = gas_op,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

fn gas_op(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    try stack_push(&frame.stack, @as(u256, @intCast(frame.gas_remaining)));

    return Operation.ExecutionResult{};
}

// Helper to convert Stack errors to ExecutionError
inline fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| switch (err) {
        Stack.Error.Overflow => return ExecutionError.Error.StackOverflow,
        else => return ExecutionError.Error.StackOverflow,
    };
}

// SLOAD variants for different hardforks
pub const SLOAD_FRONTIER_TO_TANGERINE = Operation{
    .execute = opcodes.storage.op_sload,
    .constant_gas = opcodes.gas_constants.SloadGas, // 50
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const SLOAD_TANGERINE_TO_ISTANBUL = Operation{
    .execute = opcodes.storage.op_sload,
    .constant_gas = 200,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const SLOAD_ISTANBUL_TO_BERLIN = Operation{
    .execute = opcodes.storage.op_sload,
    .constant_gas = 800,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};