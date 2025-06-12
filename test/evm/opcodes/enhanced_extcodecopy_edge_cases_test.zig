const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");
const evm = @import("evm");

/// Enhanced EXTCODECOPY edge case tests inspired by revm and go-ethereum patterns
/// 
/// This comprehensive test suite focuses on boundary conditions, overflow scenarios,
/// and edge cases that production EVM implementations handle. Tests are based on
/// patterns found in revm's extcodecopy implementation and go-ethereum's getData utility.
///
/// Key areas covered:
/// - EIP-2929 cold/warm account access gas optimization
/// - Code offset overflow handling (revm: as_usize_saturated pattern)
/// - Empty code account handling and boundary conditions
/// - Memory expansion gas accounting for external code copies
/// - Cross-account code copying scenarios
/// - Large offset boundary conditions with external code
/// - Gas calculation accuracy for cold vs warm account access

test "EXTCODECOPY: EIP-2929 cold/warm account access patterns" {
    // Inspired by revm's cold/warm gas calculation in extcodecopy_cost
    // Tests the gas difference between first access (cold) and subsequent access (warm)
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up target contract with code
    const target_code = [_]u8{0x60, 0x00, 0x60, 0x01, 0x01, 0x60, 0x00, 0x55}; // Simple storage operation
    try test_vm.vm.state.set_code(helpers.TestAddresses.BOB, &target_code);

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

    // Test case 1: First access to BOB's code (cold access)
    const bob_address_u256 = helpers.Address.to_u256(helpers.TestAddresses.BOB);
    try test_frame.pushStack(&[_]u256{ target_code.len, 0, 0, bob_address_u256 }); // size, code_offset, mem_offset, address
    const gas_before_cold = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame); // EXTCODECOPY
    const gas_cold = gas_before_cold - test_frame.frame.gas_remaining;

    // Verify code was copied correctly
    const mem_slice1 = try test_frame.frame.memory.get_slice(0, target_code.len);
    try testing.expectEqualSlices(u8, &target_code, mem_slice1);

    // Test case 2: Second access to BOB's code (warm access)
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ target_code.len, 0, 0, bob_address_u256 });
    const gas_before_warm = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);
    const gas_warm = gas_before_warm - test_frame.frame.gas_remaining;

    // Cold access should cost significantly more than warm access
    try testing.expect(gas_cold > gas_warm);
    
    // EIP-2929: Cold access = 2600 gas, warm access = 100 gas (base costs)
    // Plus copy costs and memory expansion
    const cold_warm_diff = gas_cold - gas_warm;
    try testing.expectEqual(@as(u64, 2500), cold_warm_diff); // 2600 - 100 = 2500
}

test "EXTCODECOPY: Code offset overflow handling (revm pattern)" {
    // Inspired by revm's as_usize_saturated! macro and min(code_offset, code.len()) pattern
    // Tests behavior when code_offset overflows or exceeds code length
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const target_code = [_]u8{0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88};
    try test_vm.vm.state.set_code(helpers.TestAddresses.BOB, &target_code);

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

    const bob_address_u256 = helpers.Address.to_u256(helpers.TestAddresses.BOB);

    // Test case 1: Extremely large code_offset (near u256 max)
    // Should saturate and result in all-zero copy due to offset > code.len
    const huge_code_offset = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ 8, huge_code_offset, 0, bob_address_u256 });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    // Verify memory is filled with zeros (overflow saturation behavior)
    const mem_slice = try test_frame.frame.memory.get_slice(0, 8);
    const expected_zeros = [_]u8{0x00} ** 8;
    try testing.expectEqualSlices(u8, &expected_zeros, mem_slice);

    // Test case 2: code_offset = usize max
    test_frame.frame.memory.resize_context(0) catch unreachable;
    const max_usize_as_u256: u256 = std.math.maxInt(usize);
    try test_frame.pushStack(&[_]u256{ 4, max_usize_as_u256, 0, bob_address_u256 });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice2 = try test_frame.frame.memory.get_slice(0, 4);
    const expected_zeros2 = [_]u8{0x00} ** 4;
    try testing.expectEqualSlices(u8, &expected_zeros2, mem_slice2);

    // Test case 3: code_offset just beyond code length
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 4, target_code.len + 1, 0, bob_address_u256 });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice3 = try test_frame.frame.memory.get_slice(0, 4);
    const expected_zeros3 = [_]u8{0x00} ** 4;
    try testing.expectEqualSlices(u8, &expected_zeros3, mem_slice3);
}

test "EXTCODECOPY: Empty code account handling" {
    // Tests behavior when copying from accounts with no code (common case)
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // No code set for BOB (empty account)
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

    const bob_address_u256 = helpers.Address.to_u256(helpers.TestAddresses.BOB);

    // Test case 1: Copy from empty account (should fill with zeros)
    try test_frame.pushStack(&[_]u256{ 32, 0, 0, bob_address_u256 });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice = try test_frame.frame.memory.get_slice(0, 32);
    const expected_zeros = [_]u8{0x00} ** 32;
    try testing.expectEqualSlices(u8, &expected_zeros, mem_slice);

    // Test case 2: Copy with non-zero code_offset from empty account
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 16, 100, 0, bob_address_u256 });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice2 = try test_frame.frame.memory.get_slice(0, 16);
    const expected_zeros2 = [_]u8{0x00} ** 16;
    try testing.expectEqualSlices(u8, &expected_zeros2, mem_slice2);

    // Test case 3: Non-existent account (zero address)
    test_frame.frame.memory.resize_context(0) catch unreachable;
    const zero_address_u256 = helpers.Address.to_u256(helpers.Address.zero());
    try test_frame.pushStack(&[_]u256{ 8, 0, 0, zero_address_u256 });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice3 = try test_frame.frame.memory.get_slice(0, 8);
    const expected_zeros3 = [_]u8{0x00} ** 8;
    try testing.expectEqualSlices(u8, &expected_zeros3, mem_slice3);
}

test "EXTCODECOPY: getData-style partial copy with boundary conditions" {
    // Inspired by go-ethereum's getData function behavior
    // Tests correct handling of partial copies beyond code bounds
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const target_code = [_]u8{0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08};
    try test_vm.vm.state.set_code(helpers.TestAddresses.BOB, &target_code);

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

    const bob_address_u256 = helpers.Address.to_u256(helpers.TestAddresses.BOB);

    // Test case 1: Copy starting within bounds but extending beyond
    // Similar to go-ethereum's getData when end > length
    try test_frame.pushStack(&[_]u256{ 16, 4, 0, bob_address_u256 }); // size=16, code_offset=4, mem_offset=0, address
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice = try test_frame.frame.memory.get_slice(0, 16);
    // Should contain code[4:8] followed by zeros
    const expected = [_]u8{0x05, 0x06, 0x07, 0x08} ++ [_]u8{0x00} ** 12;
    try testing.expectEqualSlices(u8, &expected, mem_slice);

    // Test case 2: Copy starting exactly at code end
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 8, 8, 0, bob_address_u256 }); // size=8, code_offset=8 (== code.len), mem_offset=0
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice2 = try test_frame.frame.memory.get_slice(0, 8);
    const expected_zeros = [_]u8{0x00} ** 8;
    try testing.expectEqualSlices(u8, &expected_zeros, mem_slice2);

    // Test case 3: Copy starting one byte past code end
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 4, 9, 0, bob_address_u256 }); // size=4, code_offset=9 (> code.len), mem_offset=0
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice3 = try test_frame.frame.memory.get_slice(0, 4);
    const expected_zeros3 = [_]u8{0x00} ** 4;
    try testing.expectEqualSlices(u8, &expected_zeros3, mem_slice3);
}

test "EXTCODECOPY: Cross-account code copying scenarios" {
    // Tests copying between different contracts and account types
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up multiple accounts with different code patterns
    const contract_a_code = [_]u8{0xAA} ** 20;
    const contract_b_code = [_]u8{0xBB} ** 30;
    const contract_c_code = [_]u8{0xCC} ** 10;

    try test_vm.vm.state.set_code(helpers.TestAddresses.BOB, &contract_a_code);
    try test_vm.vm.state.set_code(helpers.TestAddresses.CHARLIE, &contract_b_code);
    try test_vm.vm.state.set_code(helpers.TestAddresses.DAVE, &contract_c_code);

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

    // Test case 1: Copy from contract A
    const bob_address_u256 = helpers.Address.to_u256(helpers.TestAddresses.BOB);
    try test_frame.pushStack(&[_]u256{ 15, 5, 0, bob_address_u256 }); // Copy 15 bytes from offset 5
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice1 = try test_frame.frame.memory.get_slice(0, 15);
    const expected1 = [_]u8{0xAA} ** 15; // Should be all 0xAA
    try testing.expectEqualSlices(u8, &expected1, mem_slice1);

    // Test case 2: Copy from contract B to different memory location
    const charlie_address_u256 = helpers.Address.to_u256(helpers.TestAddresses.CHARLIE);
    try test_frame.pushStack(&[_]u256{ 25, 5, 100, charlie_address_u256 }); // Copy 25 bytes from offset 5 to mem offset 100
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice2 = try test_frame.frame.memory.get_slice(100, 25);
    const expected2 = [_]u8{0xBB} ** 25; // Should be all 0xBB
    try testing.expectEqualSlices(u8, &expected2, mem_slice2);

    // Test case 3: Copy from contract C with overflow
    const dave_address_u256 = helpers.Address.to_u256(helpers.TestAddresses.DAVE);
    try test_frame.pushStack(&[_]u256{ 15, 5, 200, dave_address_u256 }); // Copy 15 bytes, but only 5 available (10 - 5)
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice3 = try test_frame.frame.memory.get_slice(200, 15);
    const expected3 = [_]u8{0xCC} ** 5 ++ [_]u8{0x00} ** 10; // 5 bytes of 0xCC, then zeros
    try testing.expectEqualSlices(u8, &expected3, mem_slice3);
}

test "EXTCODECOPY: Large code stress test with memory expansion" {
    // Tests behavior with large external code similar to real-world contracts
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create large contract code (8KB)
    const large_code = try allocator.alloc(u8, 8192);
    defer allocator.free(large_code);
    
    // Fill with pattern for verification
    for (large_code, 0..) |*byte, i| {
        byte.* = @as(u8, @intCast((i * 11 + 17) % 256)); // Pseudo-random pattern
    }

    try test_vm.vm.state.set_code(helpers.TestAddresses.BOB, large_code);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000000);
    defer test_frame.deinit();

    const bob_address_u256 = helpers.Address.to_u256(helpers.TestAddresses.BOB);

    // Test case 1: Copy large chunk from middle of code
    const copy_size = 2048;
    const code_offset = 3072;
    const mem_offset = 0;

    try test_frame.pushStack(&[_]u256{ copy_size, code_offset, mem_offset, bob_address_u256 });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice = try test_frame.frame.memory.get_slice(mem_offset, copy_size);
    try testing.expectEqualSlices(u8, large_code[code_offset..code_offset + copy_size], mem_slice);

    // Test case 2: Copy near end with partial overflow
    test_frame.frame.memory.resize_context(0) catch unreachable;
    const code_offset2 = 7500; // Near end of 8192-byte code
    const copy_size2 = 1000;   // Will extend beyond code
    
    try test_frame.pushStack(&[_]u256{ copy_size2, code_offset2, 0, bob_address_u256 });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice2 = try test_frame.frame.memory.get_slice(0, copy_size2);
    
    // Verify partial copy with zero padding
    const available_bytes = large_code.len - code_offset2; // 692 bytes available
    try testing.expectEqualSlices(u8, large_code[code_offset2..], mem_slice2[0..available_bytes]);
    
    // Verify zero padding
    for (mem_slice2[available_bytes..]) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "EXTCODECOPY: Memory offset overflow boundary conditions" {
    // Tests edge cases with memory offsets near usize boundaries
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const target_code = [_]u8{0x11, 0x22, 0x33, 0x44};
    try test_vm.vm.state.set_code(helpers.TestAddresses.BOB, &target_code);

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

    const bob_address_u256 = helpers.Address.to_u256(helpers.TestAddresses.BOB);

    // Test case 1: mem_offset causes OutOfOffset error
    const huge_mem_offset = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ 4, 0, huge_mem_offset, bob_address_u256 });

    const result = helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, result);

    // Test case 2: Size causes overflow when added to mem_offset
    test_frame.frame.stack.clear();
    const large_mem_offset = std.math.maxInt(usize) - 10;
    const large_size = 20; // mem_offset + size would overflow

    try test_frame.pushStack(&[_]u256{ large_size, 0, large_mem_offset, bob_address_u256 });
    const result2 = helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, result2);
}

test "EXTCODECOPY: Gas accounting precision for cold vs warm access" {
    // Verifies precise gas accounting for copies with cold/warm account access
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const target_code = [_]u8{0xAB} ** 100;
    try test_vm.vm.state.set_code(helpers.TestAddresses.BOB, &target_code);

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

    const bob_address_u256 = helpers.Address.to_u256(helpers.TestAddresses.BOB);

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
    };

    // First access (cold) - measure gas costs across boundaries
    var cold_gas_costs: [boundary_tests.len]u64 = undefined;
    for (boundary_tests, 0..) |test_case, i| {
        test_frame.frame.memory.resize_context(0) catch unreachable;
        const gas_before = 50000;
        test_frame.frame.gas_remaining = gas_before;

        try test_frame.pushStack(&[_]u256{ test_case.size, 0, 0, bob_address_u256 });
        _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);
        cold_gas_costs[i] = gas_before - test_frame.frame.gas_remaining;
    }

    // Reset access list for warm access testing
    test_vm.vm.access_list.init_transaction(
        &[_]helpers.Address.Address{},
        &[_]struct { address: helpers.Address.Address, slots: []const u256 }{},
    ) catch unreachable;

    // Warm up the address first
    try test_frame.pushStack(&[_]u256{ 1, 0, 0, bob_address_u256 });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    // Second access (warm) - measure gas costs across boundaries
    var warm_gas_costs: [boundary_tests.len]u64 = undefined;
    for (boundary_tests, 0..) |test_case, i| {
        test_frame.frame.memory.resize_context(0) catch unreachable;
        const gas_before = 50000;
        test_frame.frame.gas_remaining = gas_before;

        try test_frame.pushStack(&[_]u256{ test_case.size, 0, 0, bob_address_u256 });
        _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);
        warm_gas_costs[i] = gas_before - test_frame.frame.gas_remaining;
    }

    // Verify consistent cold/warm difference
    for (cold_gas_costs, warm_gas_costs, 0..) |cold_gas, warm_gas, i| {
        const diff = cold_gas - warm_gas;
        
        // Should consistently be 2500 gas difference (2600 - 100)
        try testing.expectEqual(@as(u64, 2500), diff);
        
        // Within each access type, gas should increase at word boundaries
        if (i > 0) {
            const word_boundary_crossed = (boundary_tests[i].size + 31) / 32 > (boundary_tests[i-1].size + 31) / 32;
            if (word_boundary_crossed) {
                // Gas should increase when crossing word boundary
                try testing.expect(cold_gas > cold_gas_costs[i-1]);
                try testing.expect(warm_gas > warm_gas_costs[i-1]);
            } else {
                // Gas should stay the same within word boundary
                try testing.expectEqual(cold_gas_costs[i-1], cold_gas);
                try testing.expectEqual(warm_gas_costs[i-1], warm_gas);
            }
        }
    }
}

test "EXTCODECOPY: Zero-size operations and gas optimization" {
    // Tests zero-size copy behavior with external code (should be no-op after stack validation)
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const target_code = [_]u8{0x42} ** 10;
    try test_vm.vm.state.set_code(helpers.TestAddresses.BOB, &target_code);

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

    const bob_address_u256 = helpers.Address.to_u256(helpers.TestAddresses.BOB);

    // Test zero-size copy with various offset combinations
    const zero_size_cases = [_]struct {
        mem_offset: u256,
        code_offset: u256,
        desc: []const u8,
    }{
        .{ .mem_offset = 0, .code_offset = 0, .desc = "zero offsets" },
        .{ .mem_offset = 100, .code_offset = 0, .desc = "large mem_offset" },
        .{ .mem_offset = 0, .code_offset = 100, .desc = "large code_offset" },
        .{ .mem_offset = std.math.maxInt(usize), .code_offset = std.math.maxInt(usize), .desc = "max offsets" },
    };

    for (zero_size_cases) |tc| {
        const gas_before = test_frame.frame.gas_remaining;
        const memory_size_before = test_frame.frame.memory.context_size();

        try test_frame.pushStack(&[_]u256{ 0, tc.code_offset, tc.mem_offset, bob_address_u256 }); // size=0
        _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

        // Should only consume access gas (cold/warm), no memory expansion or copy costs
        const gas_used = gas_before - test_frame.frame.gas_remaining;
        
        // First access uses cold gas, subsequent uses warm gas
        const expected_gas = if (tc.mem_offset == 0 and tc.code_offset == 0) @as(u64, 2600) else @as(u64, 100);
        try testing.expectEqual(expected_gas, gas_used);

        // Memory size should not change
        try testing.expectEqual(memory_size_before, test_frame.frame.memory.context_size());
    }
}

test "EXTCODECOPY: Self-referential code copying" {
    // Tests copying code from the executing contract itself
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const self_code = [_]u8{0x60, 0x00, 0x35, 0x60, 0x20, 0x39, 0x60, 0x20, 0xF3}; // Contract init code pattern

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &self_code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Copy from self (current contract address)
    const self_address_u256 = helpers.Address.to_u256(helpers.TestAddresses.CONTRACT);
    try test_frame.pushStack(&[_]u256{ self_code.len, 0, 0, self_address_u256 });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    // Verify code was copied correctly
    const mem_slice = try test_frame.frame.memory.get_slice(0, self_code.len);
    try testing.expectEqualSlices(u8, &self_code, mem_slice);

    // Test partial self-copy
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 4, 2, 0, self_address_u256 }); // Copy 4 bytes from offset 2
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    const mem_slice2 = try test_frame.frame.memory.get_slice(0, 4);
    try testing.expectEqualSlices(u8, self_code[2..6], mem_slice2);
}