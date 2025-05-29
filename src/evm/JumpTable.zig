const std = @import("std");
const opcodes = @import("opcodes.zig");
const Stack = @import("Stack.zig").Stack;
const Memory = @import("Memory.zig").Memory;
const Frame = @import("Frame.zig").Frame;
const Operation = @import("Operation.zig").Operation;
const gas_constants = @import("gas_constants.zig");

const Hardfork = enum {
    CANCUN,
};

pub fn opAdd(frame: *Frame) !void {
    // might be able to use popUnsafe
    const a = try frame.stack.pop();
    const b = try frame.stack.pop();
    frame.stack.push(a +% b);
}

pub const JumpTable = struct {
    const Self = @This();

    /// Array of operations indexed by opcode value (0-255)
    table: [256]?*const Operation = [_]?*const Operation{null} ** 256,

    pub fn getOperation(self: *const JumpTable, opcode: u8) *const Operation {
        return self.table[opcode] orelse &Operation.NULL;
    }

    pub fn validate(self: *JumpTable) void {
        for (0..256) |i| {
            if (self.table[i] == null) {
                self.table[i] = &Operation.NULL;
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

    pub fn initFromHardfork(allocator: std.mem.Allocator, hardfork: Hardfork) Self {
        var jump_table = JumpTable{};
        _ = hardfork;
        const add_op = allocator.create(Operation);
        add_op.* = Operation{
            .execute = opAdd,
            .constant_gas = gas_constants.GasFastestStep,
            .min_stack = 2,
            .max_stack = Stack.CAPACITY,
        };
        jump_table.table[0x01] = add_op;

        return jump_table;
    }
};
