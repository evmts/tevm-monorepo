const std = @import("std");
const opcodes = @import("opcodes.zig");
const Interpreter = @import("interpreter.zig").Interpreter;
const InterpreterState = @import("InterpreterState.zig").InterpreterState;
const Stack = @import("Stack.zig").Stack;
const Memory = @import("Memory.zig").Memory;
const Frame = @import("Frame.zig").Frame;

pub const Operation = struct {
    // Execute is the operation function
    execute: *const fn (pc: usize, interpreter: *Interpreter, state: *InterpreterState) opcodes.ExecutionError![]const u8,
    // ConstantGas is the base gas required for the operation
    constant_gas: u64,
    // DynamicGas calculates the dynamic portion of gas for the operation
    dynamic_gas: ?*const fn (interpreter: *Interpreter, state: *InterpreterState, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 = null,
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

fn opUndefined(pc: usize, interpreter: *Interpreter, frame: *Frame) ![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = frame;
    return error.InvalidOpcode;
}

const UNDEFINED_OPERATION = Operation{
    .execute = opUndefined,
    .constant_gas = 0,
    .dynamic_gas = null,
    .min_stack = 0,
    .max_stack = 1024,
    .memory_size = null,
    .undefined = true,
};

pub const JumpTable = struct {
    const Self = @This();

    /// Array of operations indexed by opcode value (0-255)
    table: [256]?*const Operation = [_]?*const Operation{null} ** 256,

    pub fn getOperation(self: *const JumpTable, opcode: u8) *const Operation {
        return self.table[opcode] orelse &UNDEFINED_OPERATION;
    }

    pub fn validate(self: *JumpTable) void {
        for (0..256) |i| {
            if (self.table[i] == null) {
                self.table[i] = &UNDEFINED_OPERATION;
            } else if (self.table[i].?.memory_size != null and self.table[i].?.dynamic_gas == null) {
                @panic("Operation has memory size but no dynamic gas calculation");
            }
        }
    }

    pub fn copy(self: *const JumpTable, allocator: std.mem.Allocator) !JumpTable {
        var new_table = JumpTable.init();
        for (0..256) |i| {
            if (self.table[i] != null) {
                const op_copy = try allocator.create(Operation);
                op_copy.* = self.table[i].?.*;
                new_table.table[i] = op_copy;
            }
        }
        return new_table;
    }
};
