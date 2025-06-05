/// Result structure returned by contract call operations (CALL, CALLCODE, DELEGATECALL, STATICCALL)
const Self = @This();

success: bool,
gas_left: u64,
output: ?[]const u8,