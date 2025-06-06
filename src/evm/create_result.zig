const Address = @import("Address");

/// Result structure returned by contract creation operations (CREATE/CREATE2)
const Self = @This();

success: bool,
address: Address.Address,
gas_left: u64,
output: ?[]const u8,