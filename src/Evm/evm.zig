const std = @import("std");
const _interpreter = @import("EvmInterpreter.zig");

pub const Evm = _interpreter.Evm;

test "export test" {
    std.testing.refAllDeclsRecursive(@This());
    std.testing.refAllDeclsRecursive(Evm);
}
