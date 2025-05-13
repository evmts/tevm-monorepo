const address = @import("../Address/address.zig");

pub const Block = struct {
    number: u64,
    coinbase: [20]u8,
    timestamp: u64,
    difficulty: u256,
    prevRandao: [32]u8,
    gasLimit: u265,
    baseFeePerGas: ?u256 = null,
    getBlobGasPrice: u256,
};

pub const emptyBlock = Block{
    .number = 0,
    .coinbase = address.ZERO_ADDRESS,
    .timestamp = 0,
    .difficulty = 0,
    .prevRandao = .{0} ** 32,
    .gasLimit = 0,
    .getBlobGasPrice = 0,
    .baseFeePerGas = null,
};
