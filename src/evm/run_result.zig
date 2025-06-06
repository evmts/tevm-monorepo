const ExecutionError = @import("execution_error.zig");

const Self = @This();

status: enum { Success, Revert, Invalid, OutOfGas },
err: ?ExecutionError.Error,
gas_left: u64,
gas_used: u64,
output: ?[]const u8,
