const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes to test
const arithmetic = @import("../../../src/evm/opcodes/arithmetic.zig");

test "Arithmetic: ADD basic operations" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: Simple addition
    try test_frame.pushStack(&[_]u256{5, 10}); // Push 10, then 5
    _ = try helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 15);
    try testing.expectEqual(@as(usize, 1), test_frame.stackSize());
    
    // Test 2: Addition with overflow
    test_frame.frame.stack.clear();
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{max_u256, 1});
    _ = try helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0); // Should wrap around
    
    // Test 3: Adding zero
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 42});
    _ = try helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 42);
    
    // Test gas consumption
    try helpers.expectGasUsed(&test_frame.frame, 1000, 3); // ADD costs GasFastestStep = 3
}

test "Arithmetic: SUB basic operations" {
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
    
    // Test 1: Simple subtraction
    try test_frame.pushStack(&[_]u256{5, 10}); // Push 10, then 5
    _ = try helpers.executeOpcode(arithmetic.op_sub, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 5); // 10 - 5 = 5
    
    // Test 2: Subtraction with underflow
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{10, 5}); // Push 5, then 10
    _ = try helpers.executeOpcode(arithmetic.op_sub, &test_vm.vm, &test_frame.frame);
    const expected = std.math.maxInt(u256) - 4; // 5 - 10 wraps to max - 4
    try helpers.expectStackValue(&test_frame.frame, 0, expected);
    
    // Test 3: Subtracting zero
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 42});
    _ = try helpers.executeOpcode(arithmetic.op_sub, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 42);
}

test "Arithmetic: MUL basic operations" {
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
    
    // Test 1: Simple multiplication
    try test_frame.pushStack(&[_]u256{7, 6});
    _ = try helpers.executeOpcode(arithmetic.op_mul, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 42);
    
    // Test 2: Multiplication by zero
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 42});
    _ = try helpers.executeOpcode(arithmetic.op_mul, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0);
    
    // Test 3: Multiplication overflow
    test_frame.frame.stack.clear();
    const large_val = @as(u256, 1) << 200;
    try test_frame.pushStack(&[_]u256{large_val, large_val});
    _ = try helpers.executeOpcode(arithmetic.op_mul, &test_vm.vm, &test_frame.frame);
    // Result should be truncated to 256 bits
    const expected = (large_val *% large_val) & std.math.maxInt(u256);
    try helpers.expectStackValue(&test_frame.frame, 0, expected);
}

test "Arithmetic: DIV basic operations" {
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
    
    // Test 1: Simple division
    try test_frame.pushStack(&[_]u256{6, 42});
    _ = try helpers.executeOpcode(arithmetic.op_div, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 7); // 42 / 6 = 7
    
    // Test 2: Division by zero
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 42});
    _ = try helpers.executeOpcode(arithmetic.op_div, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0); // Division by zero returns 0
    
    // Test 3: Division with remainder
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{7, 50});
    _ = try helpers.executeOpcode(arithmetic.op_div, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 7); // 50 / 7 = 7 (integer division)
}

test "Arithmetic: MOD basic operations" {
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
    
    // Test 1: Simple modulo
    try test_frame.pushStack(&[_]u256{7, 50});
    _ = try helpers.executeOpcode(arithmetic.op_mod, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1); // 50 % 7 = 1
    
    // Test 2: Modulo by zero
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 42});
    _ = try helpers.executeOpcode(arithmetic.op_mod, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0); // Modulo by zero returns 0
    
    // Test 3: Perfect division
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{6, 42});
    _ = try helpers.executeOpcode(arithmetic.op_mod, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0); // 42 % 6 = 0
}

test "Arithmetic: ADDMOD complex operations" {
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
    
    // Test 1: Simple addmod
    try test_frame.pushStack(&[_]u256{10, 7, 5}); // (5 + 7) % 10 = 2
    _ = try helpers.executeOpcode(arithmetic.op_addmod, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 2);
    
    // Test 2: Addmod with overflow
    test_frame.frame.stack.clear();
    const max = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{100, max, 50}); // (50 + max) % 100
    _ = try helpers.executeOpcode(arithmetic.op_addmod, &test_vm.vm, &test_frame.frame);
    // Expected: (50 + max) % 100 = 49 (since max = 2^256 - 1)
    try helpers.expectStackValue(&test_frame.frame, 0, 49);
    
    // Test 3: Modulo by zero
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 7, 5});
    _ = try helpers.executeOpcode(arithmetic.op_addmod, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0); // Modulo by zero returns 0
}

test "Arithmetic: MULMOD complex operations" {
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
    
    // Test 1: Simple mulmod
    try test_frame.pushStack(&[_]u256{10, 7, 5}); // (5 * 7) % 10 = 5
    _ = try helpers.executeOpcode(arithmetic.op_mulmod, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 5);
    
    // Test 2: Mulmod with large numbers
    test_frame.frame.stack.clear();
    const large = @as(u256, 1) << 200;
    try test_frame.pushStack(&[_]u256{1000, large, large}); // (large * large) % 1000
    _ = try helpers.executeOpcode(arithmetic.op_mulmod, &test_vm.vm, &test_frame.frame);
    // The result should be correct even though large * large overflows
    try testing.expect((try test_frame.frame.stack.peek_n(0)) < 1000);
    
    // Test 3: Modulo by zero
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 7, 5});
    _ = try helpers.executeOpcode(arithmetic.op_mulmod, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0); // Modulo by zero returns 0
}

test "Arithmetic: EXP exponential operations" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000); // More gas for EXP
    defer test_frame.deinit();
    
    // Test 1: Simple exponentiation
    try test_frame.pushStack(&[_]u256{3, 2}); // 2^3 = 8
    _ = try helpers.executeOpcode(arithmetic.op_exp, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 8);
    
    // Test 2: Zero exponent
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 42}); // 42^0 = 1
    _ = try helpers.executeOpcode(arithmetic.op_exp, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
    
    // Test 3: Zero base
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{5, 0}); // 0^5 = 0
    _ = try helpers.executeOpcode(arithmetic.op_exp, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0);
    
    // Test 4: Large exponent (gas consumption)
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 10000;
    try test_frame.pushStack(&[_]u256{256, 2}); // 2^256 (should use lots of gas)
    _ = try helpers.executeOpcode(arithmetic.op_exp, &test_vm.vm, &test_frame.frame);
    // Gas should be consumed: 10 (base) + 50 * 32 (256 bits = 32 bytes)
    const expected_gas = 10 + 50 * 32;
    try helpers.expectGasUsed(&test_frame.frame, 10000, expected_gas);
}

test "Arithmetic: Stack underflow errors" {
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
    
    // Test ADD with empty stack
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame)
    );
    
    // Test ADD with only one item
    try test_frame.pushStack(&[_]u256{42});
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame)
    );
    
    // Test ADDMOD with only two items (needs three)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42, 7});
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcode(arithmetic.op_addmod, &test_vm.vm, &test_frame.frame)
    );
}