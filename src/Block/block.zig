const address = @import("Address");

pub const Block = struct {
    number: u64,
    coinbase: [20]u8,
    timestamp: u64,
    difficulty: u256,
    prev_randao: [32]u8,
    gas_limit: u265,
    base_fee_per_gas: ?u256 = null,
    get_blob_gas_price: u256,
};

pub const emptyBlock = Block{
    .number = 0,
    .coinbase = address.zero(),
    .timestamp = 0,
    .difficulty = 0,
    .prev_randao = .{0} ** 32,
    .gas_limit = 0,
    .get_blob_gas_price = 0,
    .base_fee_per_gas = null,
};
