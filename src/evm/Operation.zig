const std = @import("std");
const opcodes = @import("opcodes.zig");
const Stack = @import("Stack.zig").Stack;
const Memory = @import("Memory.zig").Memory;
const Frame = @import("Frame.zig").Frame;

fn opUndefined(frame: *Frame) ![]const u8 {
    _ = frame;
    return error.InvalidOpcode;
}

pub const Operation = struct {
    pub const NULL = Operation{
        .execute = opUndefined,
        .constant_gas = 0,
        .dynamic_gas = null,
        .min_stack = 0,
        .max_stack = 1024,
        .memory_size = null,
        .undefined = true,
    };

    // Execute is the operation function
    execute: *const fn (frame: *Frame) opcodes.ExecutionError![]const u8,
    // ConstantGas is the base gas required for the operation
    constant_gas: u64,
    // DynamicGas calculates the dynamic portion of gas for the operation
    dynamic_gas: ?*const fn (frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 = null,
    // MinStack tells how many stack items are required
    min_stack: u32,
    // MaxStack specifies the max length the stack can have for this operation
    // to not overflow the stack
    max_stack: u32,
    // Memory size returns the memory size required for the operation
    memory_size: ?*const fn (stack: *Stack) opcodes.MemorySize = null,
    // Undefined denotes if the instruction is not officially defined in the jump table
    undefined: bool = false,
};
