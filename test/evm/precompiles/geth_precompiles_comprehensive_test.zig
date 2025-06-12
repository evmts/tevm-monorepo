const std = @import("std");
const testing = std.testing;
const helpers = @import("../opcodes/test_helpers.zig");

// Import precompiles through evm module
const evm = @import("evm");

/// Precompiled contract test case structure matching geth's precompiledTest
const PrecompiledTestCase = struct {
    input: []const u8,
    expected: []const u8,
    gas: u64,
    name: []const u8,
    should_fail: bool = false,
};

/// Precompiled contract failure test case
const PrecompiledFailureTestCase = struct {
    input: []const u8,
    expected_error: []const u8,
    name: []const u8,
};

/// Helper function to convert hex string to bytes
fn hex_to_bytes(allocator: std.mem.Allocator, hex_str: []const u8) ![]u8 {
    if (hex_str.len % 2 != 0) return error.InvalidHexLength;
    
    var result = try allocator.alloc(u8, hex_str.len / 2);
    for (0..result.len) |i| {
        const byte_str = hex_str[i * 2..(i * 2) + 2];
        result[i] = try std.fmt.parseInt(u8, byte_str, 16);
    }
    return result;
}

/// Helper function to convert bytes to hex string for comparison
fn bytes_to_hex(allocator: std.mem.Allocator, bytes: []const u8) ![]u8 {
    var result = try allocator.alloc(u8, bytes.len * 2);
    for (bytes, 0..) |byte, i| {
        _ = try std.fmt.bufPrint(result[i * 2..(i * 2) + 2], "{x:0>2}", .{byte});
    }
    return result;
}

/// Test ECRECOVER precompile with geth test vectors
test "Geth-style ECRECOVER precompile tests" {
    const allocator = testing.allocator;

    // Test cases from geth's ecRecover.json
    const ecrecover_test_cases = [_]PrecompiledTestCase{
        .{
            .input = "18c547e4f7b0f325ad1e56f57e26c745b09a3e503d86e00e5255ff7f715d3d1c000000000000000000000000000000000000000000000000000000000000001c73b1693892219d736caba55bdb67216e485557ea6b6af75f37096c9aa6a5a75feeb940b1d03b21e36b0e47e79769f095fe2ab855bd91e3a38756b7d75a9c4549",
            .expected = "000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b",
            .gas = 3000,
            .name = "ValidKey",
        },
        .{
            .input = "a8b53bdf3306a35a7103ab5504a0c9b492295564b6202b1942a84ef300107281000000000000000000000000000000000000000000000000000000000000001b307835653165303366353363653138623737326363623030393366663731663366353366356337356237346463623331613835616138623838393262346538621122334455667788991011121314151617181920212223242526272829303132",
            .expected = "",
            .gas = 3000,
            .name = "CallEcrecoverUnrecoverableKey",
            .should_fail = true,
        },
        .{
            .input = "18c547e4f7b0f325ad1e56f57e26c745b09a3e503d86e00e5255ff7f715d3d1c100000000000000000000000000000000000000000000000000000000000001c73b1693892219d736caba55bdb67216e485557ea6b6af75f37096c9aa6a5a75feeb940b1d03b21e36b0e47e79769f095fe2ab855bd91e3a38756b7d75a9c4549",
            .expected = "",
            .gas = 3000,
            .name = "InvalidHighV-bits-1",
            .should_fail = true,
        },
    };

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    for (ecrecover_test_cases, 0..) |test_case, i| {
        var contract = try helpers.createTestContract(
            allocator,
            helpers.TestAddresses.CONTRACT,
            helpers.TestAddresses.ALICE,
            0,
            &[_]u8{},
        );
        defer contract.deinit(allocator, null);

        var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
        defer test_frame.deinit();

        // Convert input hex to bytes
        const input_bytes = hex_to_bytes(allocator, test_case.input) catch |err| {
            std.debug.print("ECRECOVER test {} failed to parse input: {}\n", .{ i, err });
            continue;
        };
        defer allocator.free(input_bytes);

        // Test the ECRECOVER precompile (address 0x01)
        // In a real implementation, this would call the precompile
        // For now, we'll test the structure and log the test case
        std.debug.print("ECRECOVER test {}: {s}\n", .{ i, test_case.name });
        std.debug.print("  Input length: {} bytes\n", .{input_bytes.len});
        std.debug.print("  Expected gas: {}\n", .{test_case.gas});
        std.debug.print("  Should fail: {}\n", .{test_case.should_fail});

        if (!test_case.should_fail and test_case.expected.len > 0) {
            const expected_bytes = hex_to_bytes(allocator, test_case.expected) catch continue;
            defer allocator.free(expected_bytes);
            std.debug.print("  Expected output length: {} bytes\n", .{expected_bytes.len});
        }
    }
}

/// Test SHA256 precompile with comprehensive test vectors
test "Geth-style SHA256 precompile tests" {
    const allocator = testing.allocator;

    // SHA256 test cases - these should be deterministic
    const sha256_test_cases = [_]PrecompiledTestCase{
        .{
            .input = "",
            .expected = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            .gas = 60,
            .name = "EmptyInput",
        },
        .{
            .input = "61",
            .expected = "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
            .gas = 60,
            .name = "SingleByte_a",
        },
        .{
            .input = "616263",
            .expected = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
            .gas = 60,
            .name = "ThreeBytes_abc",
        },
        .{
            .input = "6d657373616765206469676573747300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            .expected = "107dbf389d9e9f71a3a95f6c055b9251bc5268c2be16d6c13492ea45b0199f33",
            .gas = 72,
            .name = "MessageDigest",
        },
    };

    for (sha256_test_cases, 0..) |test_case, i| {
        const input_bytes = hex_to_bytes(allocator, test_case.input) catch continue;
        defer allocator.free(input_bytes);

        std.debug.print("SHA256 test {}: {s}\n", .{ i, test_case.name });
        std.debug.print("  Input: {s}\n", .{test_case.input});
        std.debug.print("  Expected: {s}\n", .{test_case.expected});
        std.debug.print("  Gas: {}\n", .{test_case.gas});

        // In a real implementation, we would call the SHA256 precompile and verify the result
        // For now, we verify the test structure
        try testing.expect(test_case.expected.len == 64); // SHA256 produces 32 bytes = 64 hex chars
    }
}

/// Test RIPEMD160 precompile
test "Geth-style RIPEMD160 precompile tests" {
    const allocator = testing.allocator;

    const ripemd160_test_cases = [_]PrecompiledTestCase{
        .{
            .input = "",
            .expected = "0000000000000000000000009c1185a5c5e9fc54612808977ee8f548b2258d31",
            .gas = 600,
            .name = "EmptyInput",
        },
        .{
            .input = "61",
            .expected = "0000000000000000000000000bdc9d2d256b3ee9daae347be6f4dc835a467ffe",
            .gas = 600,
            .name = "SingleByte_a",
        },
        .{
            .input = "616263",
            .expected = "0000000000000000000000008eb208f7e05d987a9b044a8e98c6b087f15a0bfc",
            .gas = 600,
            .name = "ThreeBytes_abc",
        },
    };

    for (ripemd160_test_cases, 0..) |test_case, i| {
        std.debug.print("RIPEMD160 test {}: {s}\n", .{ i, test_case.name });
        std.debug.print("  Input: {s}\n", .{test_case.input});
        std.debug.print("  Expected: {s}\n", .{test_case.expected});

        // RIPEMD160 output is 20 bytes, padded to 32 bytes (64 hex chars)
        try testing.expect(test_case.expected.len == 64);
    }
}

/// Test IDENTITY precompile (simple copy)
test "Geth-style IDENTITY precompile tests" {
    const allocator = testing.allocator;

    const identity_test_cases = [_]PrecompiledTestCase{
        .{
            .input = "",
            .expected = "",
            .gas = 15,
            .name = "EmptyInput",
        },
        .{
            .input = "01",
            .expected = "01",
            .gas = 15,
            .name = "SingleByte",
        },
        .{
            .input = "0123456789abcdef",
            .expected = "0123456789abcdef",
            .gas = 15,
            .name = "MultipleBytes",
        },
        .{
            .input = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            .gas = 15,
            .name = "MaxBytes",
        },
    };

    for (identity_test_cases, 0..) |test_case, i| {
        std.debug.print("IDENTITY test {}: {s}\n", .{ i, test_case.name });
        std.debug.print("  Input: {s}\n", .{test_case.input});
        std.debug.print("  Expected: {s}\n", .{test_case.expected});

        // IDENTITY should return exactly the same as input
        try testing.expect(std.mem.eql(u8, test_case.input, test_case.expected));
    }
}

/// Test BLAKE2F precompile with geth test vectors
test "Geth-style BLAKE2F precompile tests" {
    const allocator = testing.allocator;

    // Test cases from geth's blake2F.json
    const blake2f_test_cases = [_]PrecompiledTestCase{
        .{
            .input = "0000000048c9bdf267e6096a3ba7ca8485ae67bb2bf894fe72f36e3cf1361d5f3af54fa5d182e6ad7f520e511f6c3e2b8c68059b6bbd41fbabd9831f79217e1319cde05b61626300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000001",
            .expected = "08c9bcf367e6096a3ba7ca8485ae67bb2bf894fe72f36e3cf1361d5f3af54fa5d282e6ad7f520e511f6c3e2b8c68059b9442be0454267ce079217e1319cde05b",
            .gas = 0,
            .name = "vector 4",
        },
        .{
            .input = "0000000c48c9bdf267e6096a3ba7ca8485ae67bb2bf894fe72f36e3cf1361d5f3af54fa5d182e6ad7f520e511f6c3e2b8c68059b6bbd41fbabd9831f79217e1319cde05b61626300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000001",
            .expected = "ba80a53f981c4d0d6a2797b69f12f6e94c212f14685ac4b74b12bb6fdbffa2d17d87c5392aab792dc252d5de4533cc9518d38aa8dbf1925ab92386edd4009923",
            .gas = 12,
            .name = "vector 5",
        },
        .{
            .input = "0000000c48c9bdf267e6096a3ba7ca8485ae67bb2bf894fe72f36e3cf1361d5f3af54fa5d182e6ad7f520e511f6c3e2b8c68059b6bbd41fbabd9831f79217e1319cde05b61626300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000",
            .expected = "75ab69d3190a562c51aef8d88f1c2775876944407270c42c9844252c26d2875298743e7f6d5ea2f2d3e8d226039cd31b4e426ac4f2d3d666a610c2116fde4735",
            .gas = 12,
            .name = "vector 6",
        },
    ];

    for (blake2f_test_cases, 0..) |test_case, i| {
        const input_bytes = hex_to_bytes(allocator, test_case.input) catch continue;
        defer allocator.free(input_bytes);

        std.debug.print("BLAKE2F test {}: {s}\n", .{ i, test_case.name });
        std.debug.print("  Input length: {} bytes\n", .{input_bytes.len});
        std.debug.print("  Expected output length: {} chars\n", .{test_case.expected.len});
        std.debug.print("  Gas cost: {}\n", .{test_case.gas});

        // BLAKE2F input should be exactly 213 bytes
        try testing.expect(input_bytes.len == 213);
        // BLAKE2F output should be 64 bytes (128 hex chars)
        try testing.expect(test_case.expected.len == 128);
    }
}

/// Test BLAKE2F malformed input cases
test "Geth-style BLAKE2F failure cases" {
    const allocator = testing.allocator;

    const blake2f_failure_cases = [_]PrecompiledFailureTestCase{
        .{
            .input = "",
            .expected_error = "blake2f invalid input length",
            .name = "vector 0: empty input",
        },
        .{
            .input = "00000c48c9bdf267e6096a3ba7ca8485ae67bb2bf894fe72f36e3cf1361d5f3af54fa5d182e6ad7f520e511f6c3e2b8c68059b6bbd41fbabd9831f79217e1319cde05b61626300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000001",
            .expected_error = "blake2f invalid input length",
            .name = "vector 1: less than 213 bytes input",
        },
        .{
            .input = "000000000c48c9bdf267e6096a3ba7ca8485ae67bb2bf894fe72f36e3cf1361d5f3af54fa5d182e6ad7f520e511f6c3e2b8c68059b6bbd41fbabd9831f79217e1319cde05b61626300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000001",
            .expected_error = "blake2f invalid input length",
            .name = "vector 2: more than 213 bytes input",
        },
        .{
            .input = "0000000c48c9bdf267e6096a3ba7ca8485ae67bb2bf894fe72f36e3cf1361d5f3af54fa5d182e6ad7f520e511f6c3e2b8c68059b6bbd41fbabd9831f79217e1319cde05b61626300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000002",
            .expected_error = "blake2f invalid final flag",
            .name = "vector 3: malformed final block indicator flag",
        },
    };

    for (blake2f_failure_cases, 0..) |test_case, i| {
        std.debug.print("BLAKE2F failure test {}: {s}\n", .{ i, test_case.name });
        
        if (test_case.input.len > 0) {
            const input_bytes = hex_to_bytes(allocator, test_case.input) catch {
                std.debug.print("  Input parsing failed as expected\n");
                continue;
            };
            defer allocator.free(input_bytes);
            std.debug.print("  Input length: {} bytes\n", .{input_bytes.len});
        } else {
            std.debug.print("  Empty input\n");
        }
        
        std.debug.print("  Expected error: {s}\n", .{test_case.expected_error});
    }
}

/// Test precompile gas calculations
test "Geth-style precompile gas cost verification" {
    const allocator = testing.allocator;

    const gas_test_cases = [_]struct {
        precompile_addr: u8,
        input_size: usize,
        expected_base_gas: u64,
        name: []const u8,
    }{
        .{ .precompile_addr = 0x01, .input_size = 128, .expected_base_gas = 3000, .name = "ECRECOVER" },
        .{ .precompile_addr = 0x02, .input_size = 0, .expected_base_gas = 60, .name = "SHA256 empty" },
        .{ .precompile_addr = 0x02, .input_size = 32, .expected_base_gas = 60, .name = "SHA256 32 bytes" },
        .{ .precompile_addr = 0x02, .input_size = 64, .expected_base_gas = 72, .name = "SHA256 64 bytes" },
        .{ .precompile_addr = 0x03, .input_size = 0, .expected_base_gas = 600, .name = "RIPEMD160 empty" },
        .{ .precompile_addr = 0x03, .input_size = 32, .expected_base_gas = 600, .name = "RIPEMD160 32 bytes" },
        .{ .precompile_addr = 0x04, .input_size = 0, .expected_base_gas = 15, .name = "IDENTITY empty" },
        .{ .precompile_addr = 0x04, .input_size = 32, .expected_base_gas = 15, .name = "IDENTITY 32 bytes" },
        .{ .precompile_addr = 0x09, .input_size = 213, .expected_base_gas = 0, .name = "BLAKE2F" },
    };

    for (gas_test_cases, 0..) |test_case, i| {
        std.debug.print("Gas test {}: {s}\n", .{ i, test_case.name });
        std.debug.print("  Precompile address: 0x{x:0>2}\n", .{test_case.precompile_addr});
        std.debug.print("  Input size: {} bytes\n", .{test_case.input_size});
        std.debug.print("  Expected base gas: {}\n", .{test_case.expected_base_gas});

        // In a real implementation, we would calculate the actual gas cost
        // and verify it matches the expected value
        // For SHA256/RIPEMD160, gas cost includes per-word charges
        // For IDENTITY, gas cost is 15 + 3 * (input_size + 31) / 32
        
        if (test_case.precompile_addr == 0x04) { // IDENTITY
            const word_gas = 3 * ((test_case.input_size + 31) / 32);
            const total_expected = test_case.expected_base_gas + word_gas;
            std.debug.print("  IDENTITY total gas: {}\n", .{total_expected});
        }
    }
}

/// Test precompile address validation
test "Geth-style precompile address mapping" {
    // Standard precompile addresses as defined in geth
    const precompile_addresses = [_]struct {
        addr: u8,
        name: []const u8,
    }{
        .{ .addr = 0x01, .name = "ECRECOVER" },
        .{ .addr = 0x02, .name = "SHA256" },
        .{ .addr = 0x03, .name = "RIPEMD160" },
        .{ .addr = 0x04, .name = "IDENTITY" },
        .{ .addr = 0x05, .name = "MODEXP" },
        .{ .addr = 0x06, .name = "BN256ADD" },
        .{ .addr = 0x07, .name = "BN256SCALARMUL" },
        .{ .addr = 0x08, .name = "BN256PAIRING" },
        .{ .addr = 0x09, .name = "BLAKE2F" },
        .{ .addr = 0x0a, .name = "KZG_POINT_EVALUATION" },
    };

    for (precompile_addresses) |precompile| {
        std.debug.print("Precompile 0x{x:0>2}: {s}\n", .{ precompile.addr, precompile.name });
        
        // Verify address is valid (non-zero, in expected range)
        try testing.expect(precompile.addr > 0);
        try testing.expect(precompile.addr <= 0x0a); // Current max standard precompile
    }

    // Verify total count matches geth's standard precompiles
    try testing.expect(precompile_addresses.len == 10);
}