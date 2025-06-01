const std = @import("std");
const Opcode = @import("Opcode.zig");
const ExecutionError = @import("ExecutionError.zig");
// TODO: Add these when files are created
// const Interpreter = @import("interpreter.zig").Interpreter;
// const InterpreterState = @import("InterpreterState.zig").InterpreterState;
const Stack = @import("Stack.zig");
const Memory = @import("memory.zig");

/// ExecutionFunc is a function executed by the EVM during interpretation
pub const ExecutionFunc = *const fn (pc: usize, interpreter: anytype, state: anytype) ExecutionError![]const u8;

/// GasFunc calculates the gas required for an operation
pub const GasFunc = *const fn (interpreter: anytype, state: anytype, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64;

/// MemorySizeFunc calculates the memory size required for an operation
pub const MemorySizeFunc = *const fn (stack: *Stack) Opcode.MemorySize;

/// Operation represents an opcode in the EVM
const Self = @This();

// Execute is the operation function
execute: ExecutionFunc,
// ConstantGas is the base gas required for the operation
constant_gas: u64,
// DynamicGas calculates the dynamic portion of gas for the operation
dynamic_gas: ?GasFunc = null,
// MinStack tells how many stack items are required
min_stack: u32,
// MaxStack specifies the max length the stack can have for this operation
// to not overflow the stack
max_stack: u32,
// Memory size returns the memory size required for the operation
memory_size: ?MemorySizeFunc = null,
// Undefined denotes if the instruction is not officially defined in the jump table
undefined: bool = false,

/// NULL operation (for unassigned slots)
pub const NULL = Self{
    .execute = undefinedExecute,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = 0,
    .undefined = true,
};

fn undefinedExecute(pc: usize, interpreter: anytype, state: anytype) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = state;
    return ExecutionError.INVALID;
}