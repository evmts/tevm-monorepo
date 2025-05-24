// Import from Address package
const Address = @import("Address");

pub const Block = struct {
    number: u64,
    coinbase: [20]u8,
    timestamp: u64,
    difficulty: u64,
    prevRandao: [32]u8,
    gasLimit: u64,
    baseFeePerGas: ?u64 = null,
    getBlobGasPrice: u64,
};

pub const emptyBlock = Block{
    .number = 0,
    .coinbase = Address.ZERO_ADDRESS,
    .timestamp = 0,
    .difficulty = 0,
    .prevRandao = .{0} ** 32,
    .gasLimit = 0,
    .getBlobGasPrice = 0,
    .baseFeePerGas = null,
};

test "Block structure" {
    const std = @import("std");
    
    // Test empty block initialization
    const empty = emptyBlock;
    try std.testing.expectEqual(@as(u64, 0), empty.number);
    try std.testing.expectEqualSlices(u8, &Address.ZERO_ADDRESS, &empty.coinbase);
    try std.testing.expectEqual(@as(u64, 0), empty.timestamp);
    try std.testing.expectEqual(@as(u64, 0), empty.difficulty);
    
    var zeros: [32]u8 = .{0} ** 32;
    try std.testing.expectEqualSlices(u8, &zeros, &empty.prevRandao);
    
    try std.testing.expectEqual(@as(u64, 0), empty.gasLimit);
    try std.testing.expectEqual(@as(u64, 0), empty.getBlobGasPrice);
    try std.testing.expectEqual(@as(?u64, null), empty.baseFeePerGas);
    
    // Test custom block
    const testBlock = Block{
        .number = 12345,
        .coinbase = Address.ZERO_ADDRESS,
        .timestamp = 1675297352,
        .difficulty = 2,
        .prevRandao = .{1} ** 32,
        .gasLimit = 15000000,
        .getBlobGasPrice = 100000,
        .baseFeePerGas = 1000000000,
    };
    
    try std.testing.expectEqual(@as(u64, 12345), testBlock.number);
    try std.testing.expectEqual(@as(u64, 1675297352), testBlock.timestamp);
    try std.testing.expectEqual(@as(u64, 2), testBlock.difficulty);
    try std.testing.expectEqual(@as(u64, 15000000), testBlock.gasLimit);
    try std.testing.expectEqual(@as(u64, 100000), testBlock.getBlobGasPrice);
    try std.testing.expectEqual(@as(?u64, 1000000000), testBlock.baseFeePerGas);
    
    var ones: [32]u8 = .{1} ** 32;
    try std.testing.expectEqualSlices(u8, &ones, &testBlock.prevRandao);
}
