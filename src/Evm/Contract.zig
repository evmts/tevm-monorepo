const std = @import("std");
const Opcode = @import("Opcodes.zig").Opcode;

pub const Contract = struct {
    const Self = @This();

    code: []const u8,

    /// Get the opcode at the current program counter position
    /// Returns STOP if PC is beyond the code length
    pub fn getOp(self: Self, pc: usize) Opcode {
        if (pc >= self.code.len) {
            return Opcode.STOP;
        }
        return @enumFromInt(self.code[pc]);
    }
};

test "Contract getOp with valid and invalid PC" {
    const bytecode = [_]u8{ Opcode.PUSH1.toU8(), 0x01, Opcode.STOP.toU8() };
    const contract = Contract{ .code = &bytecode };

    try std.testing.expectEqual(Opcode.PUSH1, contract.getOp(0));
    try std.testing.expectEqual(Opcode.STOP, contract.getOp(2));

    try std.testing.expectEqual(Opcode.STOP, contract.getOp(3));
    try std.testing.expectEqual(Opcode.STOP, contract.getOp(100));
}

test "Contract with only STOP opcode" {
    const bytecode = [_]u8{Opcode.STOP.toU8()};
    const contract = Contract{ .code = &bytecode };

    try std.testing.expectEqual(Opcode.STOP, contract.getOp(0));
    try std.testing.expectEqual(Opcode.STOP, contract.getOp(1));
}
