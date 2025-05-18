const std = @import("std");
const testing = std.testing;
const Test = @import("package.zig");

test "SimpleContract bytecode" {
    try testing.expect(Test.SimpleContract.bytecode.len > 0);
    try testing.expect(Test.SimpleContract.deployedBytecode.len > 0);
}

test "BlockReader bytecode" {
    try testing.expect(Test.BlockReader.bytecode.len > 0);
    try testing.expect(Test.BlockReader.deployedBytecode.len > 0);
}

test "TestERC20 & TestERC721 bytecode" {
    try testing.expect(Test.TestERC20.bytecode.len > 0);
    try testing.expect(Test.TestERC20.deployedBytecode.len > 0);
    try testing.expect(Test.TestERC721.bytecode.len > 0);
    try testing.expect(Test.TestERC721.deployedBytecode.len > 0);
}

test "EnvUrls from transports" {
    // Create a temporary allocator for testing
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Test URL parsing - we don't expect any environment variables in the test
    // but the function should return empty arrays without errors
    const transports = try Test.getTransports(allocator);
    try testing.expectEqual(@as(usize, 0), transports.mainnet.items.len);
    try testing.expectEqual(@as(usize, 0), transports.optimism.items.len);
}