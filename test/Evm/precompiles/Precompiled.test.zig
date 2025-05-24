const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Precompiled = evm.precompile.PrecompiledContract;
const B256 = evm.B256;
// Use appropriate error set
const ExecutionError = error{
    OutOfGas,
    OutOfMemory,
    InvalidInput,
};

// Define a minimal Contract structure for tests
const Contract = struct {
    address: B256 = .{ .value = [_]u8{0} ** 32 },
    bytecode: []const u8 = &[_]u8{},
};

// Helper to create a B256 address for a precompiled contract
fn createPrecompiledAddress(addr_num: u8) !B256 {
    // Create a 32-byte value with only the last byte set
    var full_bytes: [32]u8 = [_]u8{0} ** 32;
    full_bytes[31] = addr_num;
    
    return B256{ .value = full_bytes };
}

test "isPrecompiled check" {
    // Address 1-9 should be precompiled
    for (1..10) |i| {
        const addr = try createPrecompiledAddress(@intCast(i));
        try testing.expect(Precompiled.isPrecompiled(addr));
    }
    
    // Address 0 and 10+ should not be precompiled
    const addr_0 = try createPrecompiledAddress(0);
    try testing.expect(!Precompiled.isPrecompiled(addr_0));
    
    const addr_10 = try createPrecompiledAddress(10);
    try testing.expect(!Precompiled.isPrecompiled(addr_10));
    
    // Non-small addresses should not be precompiled
    var non_small_addr_bytes: [32]u8 = [_]u8{0} ** 32;
    non_small_addr_bytes[0] = 1; // Set first byte, making it not a small address
    non_small_addr_bytes[31] = 1; // Set value to 1 (would be ECRECOVER if the address was small)
    const non_small_addr = B256{ .value = non_small_addr_bytes };
    try testing.expect(!Precompiled.isPrecompiled(non_small_addr));
}

test "fromAddress conversion" {
    // Convert address 1 to ECRECOVER
    const addr_1 = try createPrecompiledAddress(1);
    const contract_1 = Precompiled.fromAddress(addr_1);
    try testing.expectEqual(Precompiled.ECRECOVER, contract_1.?);
    
    // Convert address 2 to SHA256
    const addr_2 = try createPrecompiledAddress(2);
    const contract_2 = Precompiled.fromAddress(addr_2);
    try testing.expectEqual(Precompiled.SHA256, contract_2.?);
    
    // Non-precompiled address should return null
    const addr_0 = try createPrecompiledAddress(0);
    const contract_0 = Precompiled.fromAddress(addr_0);
    try testing.expectEqual(@as(?Precompiled, null), contract_0);
}

test "gas cost calculation" {
    // Test basic gas costs
    try testing.expectEqual(@as(u64, 3000), Precompiled.ECRECOVER.gasCost(&[_]u8{}));
    
    // Test SHA256 cost (input dependent)
    try testing.expectEqual(@as(u64, 60), Precompiled.SHA256.gasCost(&[_]u8{})); // Empty input
    try testing.expectEqual(@as(u64, 72), Precompiled.SHA256.gasCost(&[_]u8{1, 2, 3, 4})); // 4 bytes
    try testing.expectEqual(@as(u64, 72), Precompiled.SHA256.gasCost(&[_]u8{1, 2, 3, 4, 5, 6, 7, 8})); // 8 bytes
    
    // Test RIPEMD160 cost (input dependent)
    try testing.expectEqual(@as(u64, 600), Precompiled.RIPEMD160.gasCost(&[_]u8{})); // Empty input
    try testing.expectEqual(@as(u64, 720), Precompiled.RIPEMD160.gasCost(&[_]u8{1, 2, 3, 4})); // 4 bytes
    
    // Test IDENTITY cost (input dependent)
    try testing.expectEqual(@as(u64, 15), Precompiled.IDENTITY.gasCost(&[_]u8{})); // Empty input
    try testing.expectEqual(@as(u64, 18), Precompiled.IDENTITY.gasCost(&[_]u8{1, 2, 3, 4})); // 4 bytes
    
    // Test BN256PAIRING (input dependent)
    try testing.expectEqual(@as(u64, 45000), Precompiled.BN256PAIRING.gasCost(&[_]u8{})); // Empty input
    
    // 192 bytes (one pair) - 45000 + 34000 * 1 = 79000
    var pair_input = [_]u8{0} ** 192;
    try testing.expectEqual(@as(u64, 79000), Precompiled.BN256PAIRING.gasCost(&pair_input)); 
    
    // 384 bytes (two pairs) - 45000 + 34000 * 2 = 113000
    var pair_input2 = [_]u8{0} ** 384;
    try testing.expectEqual(@as(u64, 113000), Precompiled.BN256PAIRING.gasCost(&pair_input2));
}

test "identity execution" {
    const allocator = testing.allocator;
    
    // Test empty input
    const result = try Precompiled.IDENTITY.execute(&[_]u8{}, allocator);
    if (result) |r| {
        defer allocator.free(r);
        try testing.expectEqualSlices(u8, &[_]u8{}, r);
    } else {
        try testing.expect(false); // Fail if we get null
    }
    
    // Test with data
    const input = [_]u8{1, 2, 3, 4, 5};
    const data_result = try Precompiled.IDENTITY.execute(&input, allocator);
    if (data_result) |r| {
        defer allocator.free(r);
        try testing.expectEqualSlices(u8, &input, r);
    } else {
        try testing.expect(false); // Fail if we get null
    }
}

test "sha256 execution" {
    const allocator = testing.allocator;
    
    // Test empty input
    // SHA256("") = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    const result = try Precompiled.SHA256.execute(&[_]u8{}, allocator);
    if (result) |r| {
        defer allocator.free(r);
        try testing.expectEqual(@as(usize, 32), r.len);
        
        // Check first few bytes of the hash
        try testing.expectEqual(@as(u8, 0xe3), r[0]);
        try testing.expectEqual(@as(u8, 0xb0), r[1]);
        try testing.expectEqual(@as(u8, 0xc4), r[2]);
    } else {
        try testing.expect(false); // Fail if we get null
    }
    
    // Test with data
    // SHA256("test") = 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
    const input = [_]u8{'t', 'e', 's', 't'};
    const data_result = try Precompiled.SHA256.execute(&input, allocator);
    if (data_result) |r| {
        defer allocator.free(r);
        try testing.expectEqual(@as(usize, 32), r.len);
        
        // Check first few bytes of the hash
        try testing.expectEqual(@as(u8, 0x9f), r[0]);
        try testing.expectEqual(@as(u8, 0x86), r[1]);
        try testing.expectEqual(@as(u8, 0xd0), r[2]);
    } else {
        try testing.expect(false); // Fail if we get null
    }
}

test "ecrecover execution with invalid input" {
    const allocator = testing.allocator;
    
    // Test with invalid input (too short)
    const result = try Precompiled.ECRECOVER.execute(&[_]u8{1, 2, 3}, allocator);
    if (result) |r| {
        defer allocator.free(r);
        try testing.expectEqual(@as(usize, 0), r.len);
    } else {
        try testing.expect(false); // Fail if we get null
    }
    
    // Test with 128 bytes of zeros
    var zeros = [_]u8{0} ** 128;
    const zeros_result = try Precompiled.ECRECOVER.execute(&zeros, allocator);
    if (zeros_result) |r| {
        defer allocator.free(r);
        try testing.expectEqual(@as(usize, 32), r.len);
        
        // All zeros should return zeros (invalid signature)
        for (r) |byte| {
            try testing.expectEqual(@as(u8, 0), byte);
        }
    } else {
        try testing.expect(false); // Fail if we get null
    }
}

test "Precompiled gas cost" {
    // Get precompiled contract type
    const allocator = testing.allocator;
    const precompiled = Precompiled.IDENTITY;
    
    // Check gas cost
    const gas = precompiled.gasCost(&[_]u8{1, 2, 3, 4});
    try testing.expectEqual(@as(u64, 18), gas); // 15 + 3 * (4+31)/32 = 18
    
    // Run the contract with execute
    const result = try precompiled.execute(&[_]u8{1, 2, 3, 4}, allocator);
    defer if (result) |r| allocator.free(r);
    try testing.expectEqualSlices(u8, &[_]u8{1, 2, 3, 4}, result.?);
    
    // Test non-precompiled address
    const addr_0 = try createPrecompiledAddress(0);
    const contract_0 = Precompiled.fromAddress(addr_0);
    try testing.expectEqual(@as(?Precompiled, null), contract_0);
}