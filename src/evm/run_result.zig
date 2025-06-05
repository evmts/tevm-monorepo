/// Result structure for simple bytecode execution
const Self = @This();

status: enum { Success, Revert, Invalid, OutOfGas },
gas_left: u64,
gas_used: u64,
output: ?[]const u8,