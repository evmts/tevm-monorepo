const Address = @import("Address");

// Log struct for EVM event logs (LOG0-LOG4 opcodes)
const Self = @This();

address: Address.Address,
topics: []const u256,
data: []const u8,
