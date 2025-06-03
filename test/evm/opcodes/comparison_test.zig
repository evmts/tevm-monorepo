const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes to test
const comparison = @import("../../../src/evm/opcodes/comparison.zig");

test "Comparison: LT (less than) operations" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: 5 < 10 = true (1)
    try test_frame.pushStack(&[_]u256{10, 5});
    _ = try helpers.executeOpcodeWithResult(comparison.op_lt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
    
    // Test 2: 10 < 5 = false (0)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{5, 10});
    _ = try helpers.executeOpcodeWithResult(comparison.op_lt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0);
    
    // Test 3: 5 < 5 = false (0)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{5, 5});
    _ = try helpers.executeOpcodeWithResult(comparison.op_lt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0);
    
    // Test 4: 0 < max = true (1)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{std.math.maxInt(u256), 0});
    _ = try helpers.executeOpcodeWithResult(comparison.op_lt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
    
    // Test gas consumption
    try helpers.expectGasUsed(&test_frame.frame, 1000, 3); // LT costs GasFastestStep = 3
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: 10 > 5 = true (1)
    try test_frame.pushStack(&[_]u256{5, 10});
    _ = try helpers.executeOpcodeWithResult(comparison.op_gt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
    
    // Test 2: 5 > 10 = false (0)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{10, 5});
    _ = try helpers.executeOpcodeWithResult(comparison.op_gt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0);
    
    // Test 3: 5 > 5 = false (0)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{5, 5});
    _ = try helpers.executeOpcodeWithResult(comparison.op_gt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0);
    
    // Test 4: max > 0 = true (1)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, std.math.maxInt(u256)});
    _ = try helpers.executeOpcodeWithResult(comparison.op_gt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: Positive numbers (same as unsigned)
    try test_frame.pushStack(&[_]u256{10, 5});
    _ = try helpers.executeOpcodeWithResult(comparison.op_slt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
    
    // Test 2: Negative < Positive (-1 < 0 = true)
    test_frame.frame.stack.clear();
    const neg_one = std.math.maxInt(u256); // -1 in two's complement
    try test_frame.pushStack(&[_]u256{0, neg_one});
    _ = try helpers.executeOpcodeWithResult(comparison.op_slt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
    
    // Test 3: Positive < Negative (0 < -1 = false)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{neg_one, 0});
    _ = try helpers.executeOpcodeWithResult(comparison.op_slt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0);
    
    // Test 4: Two negative numbers (-2 < -1 = true)
    test_frame.frame.stack.clear();
    const neg_two = std.math.maxInt(u256) - 1; // -2 in two's complement
    try test_frame.pushStack(&[_]u256{neg_one, neg_two});
    _ = try helpers.executeOpcodeWithResult(comparison.op_slt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
    
    // Test 5: Most negative vs most positive
    test_frame.frame.stack.clear();
    const most_negative = @as(u256, 1) << 255; // -2^255
    const most_positive = most_negative - 1; // 2^255 - 1
    try test_frame.pushStack(&[_]u256{most_positive, most_negative});
    _ = try helpers.executeOpcodeWithResult(comparison.op_slt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1); // -2^255 < 2^255-1
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: Positive numbers (same as unsigned)
    try test_frame.pushStack(&[_]u256{5, 10});
    _ = try helpers.executeOpcodeWithResult(comparison.op_sgt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
    
    // Test 2: Positive > Negative (0 > -1 = true)
    test_frame.frame.stack.clear();
    const neg_one = std.math.maxInt(u256); // -1 in two's complement
    try test_frame.pushStack(&[_]u256{neg_one, 0});
    _ = try helpers.executeOpcodeWithResult(comparison.op_sgt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
    
    // Test 3: Negative > Positive (-1 > 0 = false)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, neg_one});
    _ = try helpers.executeOpcodeWithResult(comparison.op_sgt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0);
    
    // Test 4: Two negative numbers (-1 > -2 = true)
    test_frame.frame.stack.clear();
    const neg_two = std.math.maxInt(u256) - 1; // -2 in two's complement
    try test_frame.pushStack(&[_]u256{neg_two, neg_one});
    _ = try helpers.executeOpcodeWithResult(comparison.op_sgt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
}

test "Comparison: EQ (equality) operations" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: Equal values
    try test_frame.pushStack(&[_]u256{42, 42});
    _ = try helpers.executeOpcodeWithResult(comparison.op_eq, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
    
    // Test 2: Different values
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42, 43});
    _ = try helpers.executeOpcodeWithResult(comparison.op_eq, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0);
    
    // Test 3: Zero equality
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 0});
    _ = try helpers.executeOpcodeWithResult(comparison.op_eq, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
    
    // Test 4: Max value equality
    test_frame.frame.stack.clear();
    const max = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{max, max});
    _ = try helpers.executeOpcodeWithResult(comparison.op_eq, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: Zero value
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcodeWithResult(comparison.op_iszero, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
    
    // Test 2: Non-zero value
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42});
    _ = try helpers.executeOpcodeWithResult(comparison.op_iszero, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0);
    
    // Test 3: Small non-zero value
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{1});
    _ = try helpers.executeOpcodeWithResult(comparison.op_iszero, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0);
    
    // Test 4: Max value
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{std.math.maxInt(u256)});
    _ = try helpers.executeOpcodeWithResult(comparison.op_iszero, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0);
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test LT with empty stack
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcodeWithResult(comparison.op_lt, &test_vm.vm, &test_frame.frame)
    );
    
    // Test LT with only one item
    try test_frame.pushStack(&[_]u256{42});
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcodeWithResult(comparison.op_lt, &test_vm.vm, &test_frame.frame)
    );
    
    // Test ISZERO with empty stack
    test_frame.frame.stack.clear();
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcodeWithResult(comparison.op_iszero, &test_vm.vm, &test_frame.frame)
    );
}

test "Comparison: Edge cases with signed arithmetic" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test boundary between positive and negative
    const sign_bit = @as(u256, 1) << 255;
    const max_positive = sign_bit - 1;
    const min_negative = sign_bit;
    
    // max_positive < min_negative (unsigned), but max_positive > min_negative (signed)
    try test_frame.pushStack(&[_]u256{min_negative, max_positive});
    _ = try helpers.executeOpcodeWithResult(comparison.op_lt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1); // Unsigned comparison
    
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{min_negative, max_positive});
    _ = try helpers.executeOpcodeWithResult(comparison.op_slt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0); // Signed comparison (max_positive > min_negative)
}

test "Comparison: Gas consumption uniformity" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // All comparison operations cost 3 gas (GasFastestStep)
    const operations = [_]struct {
        name: []const u8,
        op: fn(usize, *helpers.Operation.Interpreter, *helpers.Operation.State) helpers.ExecutionError.Error!helpers.Operation.ExecutionResult,
        stack_items: u8,
    }{
        .{ .name = "LT", .op = comparison.op_lt, .stack_items = 2 },
        .{ .name = "GT", .op = comparison.op_gt, .stack_items = 2 },
        .{ .name = "SLT", .op = comparison.op_slt, .stack_items = 2 },
        .{ .name = "SGT", .op = comparison.op_sgt, .stack_items = 2 },
        .{ .name = "EQ", .op = comparison.op_eq, .stack_items = 2 },
        .{ .name = "ISZERO", .op = comparison.op_iszero, .stack_items = 1 },
    };
    
    for (operations) |op_info| {
        test_frame.frame.stack.clear();
        test_frame.frame.gas_remaining = 1000;
        
        // Push required stack items
        var i: u8 = 0;
        while (i < op_info.stack_items) : (i += 1) {
            try test_frame.pushStack(&[_]u256{42});
        }
        
        _ = try helpers.executeOpcodeWithResult(op_info.op, &test_vm.vm, &test_frame.frame);
        try helpers.expectGasUsed(&test_frame.frame, 1000, helpers.gas_constants.GasFastestStep);
    }
}