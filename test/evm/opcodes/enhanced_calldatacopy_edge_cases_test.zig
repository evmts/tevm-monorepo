const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");
const evm = @import("evm");

/// Enhanced CALLDATACOPY edge case tests inspired by revm and go-ethereum patterns
/// 
/// This comprehensive test suite focuses on boundary conditions, overflow scenarios,
/// and edge cases that production EVM implementations handle. Tests are based on
/// patterns found in revm's calldatacopy implementation and go-ethereum's getData utility.
///
/// Key areas covered:
/// - Overflow handling in data_offset parameters (revm: as_usize_saturated pattern)
/// - Memory expansion gas accounting edge cases
/// - Partial copy scenarios with zero-padding behavior
/// - Large offset boundary conditions
/// - Gas calculation accuracy for various input sizes
/// - Cross-boundary memory operations

test "CALLDATACOPY: Overflow handling in data_offset (revm pattern)" {
    // Inspired by revm's as_usize_saturated! macro usage in calldatacopy
    // Tests behavior when data_offset overflows to ensure saturation behavior
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const calldata = [_]u8{0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88};

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

    test_frame.frame.input = &calldata;

    // Test case 1: Extremely large data_offset (near u256 max)
    // Should saturate to usize max and result in all-zero copy due to offset > calldata.len
    const huge_data_offset = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ 8, huge_data_offset, 0 }); // size=8, data_offset=huge, mem_offset=0
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    // Verify memory is filled with zeros (overflow saturation behavior)
    const mem_slice = try test_frame.frame.memory.get_slice(0, 8);
    const expected_zeros = [_]u8{0x00} ** 8;
    try testing.expectEqualSlices(u8, &expected_zeros, mem_slice);

    // Test case 2: data_offset = usize max
    test_frame.frame.memory.resize_context(0) catch unreachable;
    const max_usize_as_u256: u256 = std.math.maxInt(usize);
    try test_frame.pushStack(&[_]u256{ 4, max_usize_as_u256, 0 });
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    const mem_slice2 = try test_frame.frame.memory.get_slice(0, 4);
    const expected_zeros2 = [_]u8{0x00} ** 4;
    try testing.expectEqualSlices(u8, &expected_zeros2, mem_slice2);
}

test "CALLDATACOPY: Memory expansion gas calculation edge cases" {
    // Based on go-ethereum's memory expansion cost calculation
    // Tests scenarios where memory expansion crosses cost boundaries
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const calldata = [_]u8{0xAA} ** 1024; // 1KB of data

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    // Test case 1: Large memory expansion (expensive)
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000000);
    defer test_frame.deinit();
    test_frame.frame.input = &calldata;

    // Copy to very high memory offset to trigger expensive expansion
    const large_mem_offset = 100000;
    const gas_before = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{ 32, 0, large_mem_offset });
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);
    const gas_used = gas_before - test_frame.frame.gas_remaining;

    // Should use significantly more gas due to memory expansion
    try testing.expect(gas_used > 1000); // Much higher than base cost

    // Test case 2: Copy that exactly hits a 32-byte boundary
    test_frame.frame.memory.resize_context(0) catch unreachable;
    test_frame.frame.gas_remaining = 100000;
    const gas_before2 = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{ 32, 0, 32 }); // Copy 32 bytes to offset 32
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);
    const gas_used2 = gas_before2 - test_frame.frame.gas_remaining;

    // Verify word-aligned copy gas calculation
    // Should be base cost + memory expansion + copy cost (3 + memory + 3*1 = 6 + memory)
    try testing.expect(gas_used2 >= 6);
}

test "CALLDATACOPY: getData-style partial copy with zero padding" {
    // Inspired by go-ethereum's getData function behavior
    // Tests correct handling of partial copies beyond calldata bounds
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const calldata = [_]u8{0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08};

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    test_frame.frame.input = &calldata;

    // Test case 1: Copy starting within bounds but extending beyond
    // Similar to go-ethereum's getData when end > length
    try test_frame.pushStack(&[_]u256{ 16, 4, 0 }); // size=16, data_offset=4, mem_offset=0
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    const mem_slice = try test_frame.frame.memory.get_slice(0, 16);
    // Should contain calldata[4:8] followed by zeros
    const expected = [_]u8{0x05, 0x06, 0x07, 0x08} ++ [_]u8{0x00} ** 12;
    try testing.expectEqualSlices(u8, &expected, mem_slice);

    // Test case 2: Copy starting exactly at calldata end
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 8, 8, 0 }); // size=8, data_offset=8 (== calldata.len), mem_offset=0
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    const mem_slice2 = try test_frame.frame.memory.get_slice(0, 8);
    const expected_zeros = [_]u8{0x00} ** 8;
    try testing.expectEqualSlices(u8, &expected_zeros, mem_slice2);

    // Test case 3: Copy starting one byte past calldata end  
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 4, 9, 0 }); // size=4, data_offset=9 (> calldata.len), mem_offset=0
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    const mem_slice3 = try test_frame.frame.memory.get_slice(0, 4);
    const expected_zeros3 = [_]u8{0x00} ** 4;
    try testing.expectEqualSlices(u8, &expected_zeros3, mem_slice3);
}

test "CALLDATACOPY: Word-aligned gas cost calculation accuracy" {
    // Based on revm's memory expansion and copy gas calculations
    // Tests precise gas costs for various word alignments
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const calldata = [_]u8{0xFF} ** 100;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    test_frame.frame.input = &calldata;

    // Test cases with different word boundary alignments
    const test_cases = [_]struct {
        size: u256,
        expected_words: u64,
        desc: []const u8,
    }{
        .{ .size = 1, .expected_words = 1, .desc = "1 byte = 1 word" },
        .{ .size = 31, .expected_words = 1, .desc = "31 bytes = 1 word" },
        .{ .size = 32, .expected_words = 1, .desc = "32 bytes = 1 word" },
        .{ .size = 33, .expected_words = 2, .desc = "33 bytes = 2 words" },
        .{ .size = 64, .expected_words = 2, .desc = "64 bytes = 2 words" },
        .{ .size = 65, .expected_words = 3, .desc = "65 bytes = 3 words" },
        .{ .size = 96, .expected_words = 3, .desc = "96 bytes = 3 words" },
        .{ .size = 97, .expected_words = 4, .desc = "97 bytes = 4 words" },
    };

    for (test_cases) |tc| {
        test_frame.frame.memory.resize_context(0) catch unreachable;
        const gas_before = 10000;
        test_frame.frame.gas_remaining = gas_before;

        try test_frame.pushStack(&[_]u256{ tc.size, 0, 0 });
        _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

        const gas_used = gas_before - test_frame.frame.gas_remaining;
        
        // Gas should include: base(3) + memory expansion + copy_gas * word_count
        // Copy gas per word is 3 (VERYLOW), so copy cost = 3 * word_count
        const min_expected_gas = 3 + 3 * tc.expected_words; // Base + copy cost
        try testing.expect(gas_used >= min_expected_gas);
    }
}

test "CALLDATACOPY: Zero-size operations and gas optimization" {
    // Tests zero-size copy behavior (should be no-op after stack validation)
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const calldata = [_]u8{0x42} ** 10;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    test_frame.frame.input = &calldata;

    // Test zero-size copy with various offset combinations
    const zero_size_cases = [_]struct {
        mem_offset: u256,
        data_offset: u256,
        desc: []const u8,
    }{
        .{ .mem_offset = 0, .data_offset = 0, .desc = "zero offsets" },
        .{ .mem_offset = 100, .data_offset = 0, .desc = "large mem_offset" },
        .{ .mem_offset = 0, .data_offset = 100, .desc = "large data_offset" },
        .{ .mem_offset = std.math.maxInt(usize), .data_offset = std.math.maxInt(usize), .desc = "max offsets" },
    };

    for (zero_size_cases) |tc| {
        const gas_before = test_frame.frame.gas_remaining;
        const memory_size_before = test_frame.frame.memory.context_size();

        try test_frame.pushStack(&[_]u256{ 0, tc.data_offset, tc.mem_offset }); // size=0
        _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

        // Should only consume base gas (3), no memory expansion or copy costs
        const gas_used = gas_before - test_frame.frame.gas_remaining;
        try testing.expectEqual(@as(u64, 3), gas_used);

        // Memory size should not change
        try testing.expectEqual(memory_size_before, test_frame.frame.memory.context_size());
    }
}

test "CALLDATACOPY: Cross-word boundary copy patterns" {
    // Tests copying across various word boundaries to ensure correct data alignment
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create test pattern with recognizable data
    var calldata: [96]u8 = undefined;
    for (&calldata, 0..) |*byte, i| {
        byte.* = @as(u8, @intCast(i % 256));
    }

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 20000);
    defer test_frame.deinit();

    test_frame.frame.input = &calldata;

    // Test case 1: Copy straddling word boundary
    try test_frame.pushStack(&[_]u256{ 40, 28, 10 }); // size=40, data_offset=28, mem_offset=10
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    const mem_slice1 = try test_frame.frame.memory.get_slice(10, 40);
    try testing.expectEqualSlices(u8, calldata[28..68], mem_slice1);

    // Test case 2: Copy exactly 32 bytes (1 word) at word boundary
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 32, 32, 32 }); // size=32, data_offset=32, mem_offset=32  
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    const mem_slice2 = try test_frame.frame.memory.get_slice(32, 32);
    try testing.expectEqualSlices(u8, calldata[32..64], mem_slice2);

    // Test case 3: Copy 33 bytes (crossing word boundary)
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 33, 31, 0 }); // size=33, data_offset=31, mem_offset=0
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    const mem_slice3 = try test_frame.frame.memory.get_slice(0, 33);
    try testing.expectEqualSlices(u8, calldata[31..64], mem_slice3);
}

test "CALLDATACOPY: Large calldata stress test" {
    // Tests behavior with large calldata similar to real-world contract calls
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create large calldata (4KB)
    const large_calldata = try allocator.alloc(u8, 4096);
    defer allocator.free(large_calldata);
    
    // Fill with pattern for verification
    for (large_calldata, 0..) |*byte, i| {
        byte.* = @as(u8, @intCast((i * 7 + 13) % 256)); // Pseudo-random pattern
    }

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

    test_frame.frame.input = large_calldata;

    // Test case 1: Copy large chunk from middle
    const copy_size = 1024;
    const data_offset = 1536;
    const mem_offset = 0;

    try test_frame.pushStack(&[_]u256{ copy_size, data_offset, mem_offset });
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    const mem_slice = try test_frame.frame.memory.get_slice(mem_offset, copy_size);
    try testing.expectEqualSlices(u8, large_calldata[data_offset..data_offset + copy_size], mem_slice);

    // Test case 2: Copy near end with partial overflow
    test_frame.frame.memory.resize_context(0) catch unreachable;
    const data_offset2 = 4000; // Near end of 4096-byte calldata
    const copy_size2 = 200;    // Will extend beyond calldata
    
    try test_frame.pushStack(&[_]u256{ copy_size2, data_offset2, 0 });
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    const mem_slice2 = try test_frame.frame.memory.get_slice(0, copy_size2);
    
    // Verify partial copy with zero padding
    const available_bytes = large_calldata.len - data_offset2; // 96 bytes available
    try testing.expectEqualSlices(u8, large_calldata[data_offset2..], mem_slice2[0..available_bytes]);
    
    // Verify zero padding
    for (mem_slice2[available_bytes..]) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "CALLDATACOPY: Memory offset overflow boundary conditions" {
    // Tests edge cases with memory offsets near usize boundaries
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const calldata = [_]u8{0x11, 0x22, 0x33, 0x44};

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    test_frame.frame.input = &calldata;

    // Test case 1: mem_offset causes OutOfOffset error
    const huge_mem_offset = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ 4, 0, huge_mem_offset });

    const result = helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, result);

    // Test case 2: Size causes overflow when added to mem_offset
    test_frame.frame.stack.clear();
    const large_mem_offset = std.math.maxInt(usize) - 10;
    const large_size = 20; // mem_offset + size would overflow

    try test_frame.pushStack(&[_]u256{ large_size, 0, large_mem_offset });
    const result2 = helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, result2);
}

test "CALLDATACOPY: Empty calldata edge cases" {
    // Tests behavior with zero-length calldata (common in constructor calls)
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const empty_calldata: []const u8 = &[_]u8{};

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    test_frame.frame.input = empty_calldata;

    // Test case 1: Copy from empty calldata (should fill with zeros)
    try test_frame.pushStack(&[_]u256{ 32, 0, 0 }); // size=32, data_offset=0, mem_offset=0
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    const mem_slice = try test_frame.frame.memory.get_slice(0, 32);
    const expected_zeros = [_]u8{0x00} ** 32;
    try testing.expectEqualSlices(u8, &expected_zeros, mem_slice);

    // Test case 2: Copy with non-zero data_offset from empty calldata
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 16, 100, 0 }); // size=16, data_offset=100, mem_offset=0
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    const mem_slice2 = try test_frame.frame.memory.get_slice(0, 16);
    const expected_zeros2 = [_]u8{0x00} ** 16;
    try testing.expectEqualSlices(u8, &expected_zeros2, mem_slice2);
}

test "CALLDATACOPY: Gas accounting precision across size boundaries" {
    // Verifies precise gas accounting for copies that cross gas calculation boundaries
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const calldata = [_]u8{0xAB} ** 200;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 50000);
    defer test_frame.deinit();

    test_frame.frame.input = &calldata;

    // Test cases around word boundaries for gas calculation verification
    const boundary_tests = [_]struct {
        size: u64,
        description: []const u8,
    }{
        .{ .size = 31, .description = "Just below 1 word" },
        .{ .size = 32, .description = "Exactly 1 word" },
        .{ .size = 33, .description = "Just above 1 word" },
        .{ .size = 63, .description = "Just below 2 words" },
        .{ .size = 64, .description = "Exactly 2 words" },
        .{ .size = 65, .description = "Just above 2 words" },
        .{ .size = 95, .description = "Just below 3 words" },
        .{ .size = 96, .description = "Exactly 3 words" },
        .{ .size = 97, .description = "Just above 3 words" },
    };

    var previous_gas_used: u64 = 0;

    for (boundary_tests, 0..) |test_case, i| {
        test_frame.frame.memory.resize_context(0) catch unreachable;
        const gas_before = 50000;
        test_frame.frame.gas_remaining = gas_before;

        try test_frame.pushStack(&[_]u256{ test_case.size, 0, 0 });
        _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

        const gas_used = gas_before - test_frame.frame.gas_remaining;

        // Gas should increase in steps at word boundaries
        if (i > 0) {
            const word_boundary_crossed = (test_case.size + 31) / 32 > (boundary_tests[i-1].size + 31) / 32;
            if (word_boundary_crossed) {
                // Gas should increase when crossing word boundary
                try testing.expect(gas_used > previous_gas_used);
            } else {
                // Gas should stay the same within word boundary
                try testing.expectEqual(previous_gas_used, gas_used);
            }
        }

        previous_gas_used = gas_used;
    }
}