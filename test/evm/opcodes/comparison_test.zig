const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes to test
const evm = @import("evm");
const comparison = evm.opcodes.comparison;

test "Comparison: LT (less than) operations" {
    const allocator = testing.allocator;
    
    // Set up test VM and frame
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: a < b (true)
    try test_frame.pushStack(&[_]u256{10, 5}); // Push 5, then 10
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // 5 < 10 = true
    
    // Test 2: a > b (false)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{5, 10}); // Push 10, then 5
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // 10 < 5 = false
    
    // Test 3: a == b (false)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42, 42});
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // 42 < 42 = false
    
    // Test 4: Compare with zero
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{1, 0});
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // 0 < 1 = true
    
    // Test 5: Compare with max value
    test_frame.frame.stack.clear();
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{max_u256, max_u256 - 1});
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // (max-1) < max = true
    
    // Test gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasFastestStep);
}

test "Comparison: GT (greater than) operations" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: a > b (true)
    try test_frame.pushStack(&[_]u256{5, 10}); // Push 10, then 5
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // 10 > 5 = true
    
    // Test 2: a < b (false)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{10, 5}); // Push 5, then 10
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // 5 > 10 = false
    
    // Test 3: a == b (false)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42, 42});
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // 42 > 42 = false
    
    // Test 4: Compare with zero
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 1});
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // 1 > 0 = true
    
    // Test gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasFastestStep);
}

test "Comparison: SLT (signed less than) operations" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: Both positive, a < b
    try test_frame.pushStack(&[_]u256{10, 5});
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // 5 < 10 = true
    
    // Test 2: Negative < positive
    test_frame.frame.stack.clear();
    const negative_one = std.math.maxInt(u256); // -1 in two's complement
    try test_frame.pushStack(&[_]u256{10, negative_one});
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // -1 < 10 = true
    
    // Test 3: Positive < negative (false)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{negative_one, 10});
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // 10 < -1 = false
    
    // Test 4: Both negative
    test_frame.frame.stack.clear();
    const negative_two = std.math.maxInt(u256) - 1; // -2 in two's complement
    try test_frame.pushStack(&[_]u256{negative_one, negative_two});
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // -2 < -1 = true
    
    // Test 5: Most negative vs most positive
    test_frame.frame.stack.clear();
    const most_negative = @as(u256, 1) << 255; // 0x80000...0
    const most_positive = (@as(u256, 1) << 255) - 1; // 0x7FFFF...F
    try test_frame.pushStack(&[_]u256{most_positive, most_negative});
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // most_negative < most_positive = true
    
    // Test gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasFastestStep);
}

test "Comparison: SGT (signed greater than) operations" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: Both positive, a > b
    try test_frame.pushStack(&[_]u256{5, 10});
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // 10 > 5 = true
    
    // Test 2: Positive > negative
    test_frame.frame.stack.clear();
    const negative_one = std.math.maxInt(u256); // -1 in two's complement
    try test_frame.pushStack(&[_]u256{negative_one, 10});
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // 10 > -1 = true
    
    // Test 3: Negative > positive (false)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{10, negative_one});
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // -1 > 10 = false
    
    // Test 4: Both negative
    test_frame.frame.stack.clear();
    const negative_two = std.math.maxInt(u256) - 1; // -2 in two's complement
    try test_frame.pushStack(&[_]u256{negative_two, negative_one});
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // -1 > -2 = true
    
    // Test gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasFastestStep);
}

test "Comparison: EQ (equal) operations" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: Equal values
    try test_frame.pushStack(&[_]u256{42, 42});
    _ = try helpers.executeOpcode(0x14, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // 42 == 42 = true
    
    // Test 2: Different values
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42, 43});
    _ = try helpers.executeOpcode(0x14, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // 42 == 43 = false
    
    // Test 3: Zero equality
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 0});
    _ = try helpers.executeOpcode(0x14, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // 0 == 0 = true
    
    // Test 4: Max value equality
    test_frame.frame.stack.clear();
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{max_u256, max_u256});
    _ = try helpers.executeOpcode(0x14, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // max == max = true
    
    // Test gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasFastestStep);
}

test "Comparison: ISZERO operations" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: Zero value
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x15, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // 0 == 0 = true
    
    // Test 2: Non-zero value
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42});
    _ = try helpers.executeOpcode(0x15, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // 42 == 0 = false
    
    // Test 3: Small non-zero value
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{1});
    _ = try helpers.executeOpcode(0x15, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // 1 == 0 = false
    
    // Test 4: Max value
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{std.math.maxInt(u256)});
    _ = try helpers.executeOpcode(0x15, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // max == 0 = false
    
    // Test gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasFastestStep);
}

test "Comparison: Stack underflow errors" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test LT with empty stack
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame)
    );
    
    // Test LT with only one item
    try test_frame.pushStack(&[_]u256{42});
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame)
    );
    
    // Test ISZERO with empty stack
    test_frame.frame.stack.clear();
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcode(0x15, &test_vm.vm, test_frame.frame)
    );
}

test "Comparison: Edge cases" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test signed comparison edge cases
    const sign_bit = @as(u256, 1) << 255;
    
    // Test: 0x8000...0000 (most negative) vs 0x7FFF...FFFF (most positive)
    try test_frame.pushStack(&[_]u256{sign_bit - 1, sign_bit});
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // most_negative < most_positive
    
    // Test: Boundary between positive and negative
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{sign_bit, sign_bit - 1});
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // most_positive < most_negative = false
    
    // Test: Equal signed values
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{sign_bit, sign_bit});
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Equal values, so not greater
}

test "Comparison: Gas consumption verification" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // All comparison operations cost 3 gas (GasFastestStep)
    const operations = [_]struct {
        name: []const u8,
        opcode: u8,
        stack_items: u8,
    }{
        .{ .name = "LT", .opcode = 0x10, .stack_items = 2 },
        .{ .name = "GT", .opcode = 0x11, .stack_items = 2 },
        .{ .name = "SLT", .opcode = 0x12, .stack_items = 2 },
        .{ .name = "SGT", .opcode = 0x13, .stack_items = 2 },
        .{ .name = "EQ", .opcode = 0x14, .stack_items = 2 },
        .{ .name = "ISZERO", .opcode = 0x15, .stack_items = 1 },
    };
    
    inline for (operations) |op_info| {
        test_frame.frame.stack.clear();
        test_frame.frame.gas_remaining = 1000;
        
        // Push required stack items
        var i: u8 = 0;
        while (i < op_info.stack_items) : (i += 1) {
            try test_frame.pushStack(&[_]u256{42});
        }
        
        _ = try helpers.executeOpcode(op_info.opcode, &test_vm.vm, test_frame.frame);
        try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasFastestStep);
    }
}
