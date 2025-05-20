const std = @import("std");
const precompile = @import("Precompiles.zig");
const Address = @import("../../Address/address.zig").Address;
const Evm = @import("../Evm.zig").Evm;

test "Precompile contract loading" {
    const testing = std.testing;
    
    // Create a test allocator
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Test getting precompiled contracts
    var rules = Evm.ChainRules{};
    rules.IsByzantium = true;
    
    var contracts = try precompile.activePrecompiledContracts(allocator, rules);
    defer contracts.deinit();
    
    try testing.expectEqual(@as(usize, 8), contracts.count());
    
    // Test getting a specific contract
    // ECRECOVER at address 0x01
    var ecrecover_addr: Address = undefined;
    @memset(&ecrecover_addr, 0);
    ecrecover_addr[19] = 1;
    
    // ECRECOVER should exist
    try testing.expect(contracts.contains(ecrecover_addr));
    
    // Identity at address 0x04 should exist
    var identity_addr: Address = undefined;
    @memset(&identity_addr, 0);
    identity_addr[19] = 4;
    
    try testing.expect(contracts.contains(identity_addr));
    
    // Non-existent precompile should not exist
    var nonexistent: Address = undefined;
    @memset(&nonexistent, 0);
    nonexistent[19] = 0;
    
    try testing.expect(!contracts.contains(nonexistent));
}