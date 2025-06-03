const std = @import("std");
const Opcode = @import("opcode.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("stack.zig");
const Memory = @import("memory.zig");

/// Forward declarations - these would be defined by the actual interpreter
pub const Interpreter = opaque {};
pub const State = opaque {};

/// ExecutionResult holds the result of executing an opcode
pub const ExecutionResult = struct {
    /// Number of bytes consumed by this opcode (including immediate data)
    /// For most opcodes this is 1, but PUSH opcodes consume 1 + n bytes
    bytes_consumed: usize = 1,
    /// Return data if the execution should halt (empty means continue)
    output: []const u8 = "",
};

/// ExecutionFunc is a function executed by the EVM during interpretation
pub const ExecutionFunc = *const fn (pc: usize, interpreter: *Interpreter, state: *State) ExecutionError.Error!ExecutionResult;

/// GasFunc calculates the gas required for an operation
pub const GasFunc = *const fn (interpreter: *Interpreter, state: *State, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64;

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
    .execute = undefined_execute,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = 0,
    .undefined = true,
};

fn undefined_execute(pc: usize, interpreter: *Interpreter, state: *State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    return ExecutionError.Error.InvalidOpcode;
}
