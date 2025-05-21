const Opcodes = @import(".Opcodes.zig").opcodes;

pub const Contract = struct {
    const Self = @This();

    code: []const u8,

    pub fn getOp(self: Self, pc: usize) u8 {
        if (pc < self.code.len) {
            return self.code[pc];
        }
        return Opcodes.STOP;
    }
};
