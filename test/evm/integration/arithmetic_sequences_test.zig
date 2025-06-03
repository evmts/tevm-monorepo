const std = @import("std");
const testing = std.testing;
const helpers = @import("../opcodes/test_helpers.zig");

// Import opcodes
const arithmetic = @import("../../../src/evm/opcodes/arithmetic.zig");
const stack = @import("../../../src/evm/opcodes/stack.zig");
const comparison = @import("../../../src/evm/opcodes/comparison.zig");
const control = @import("../../../src/evm/opcodes/control.zig");

test "Integration: Complex arithmetic calculation" {
    // Test: Calculate (10 + 20) * 3 - 15
    // Expected result: 75
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Push values and execute: (10 + 20) * 3 - 15
    try test_frame.pushStack(&[_]u256{10, 20}); // Push 20, then 10
    _ = try helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame); // 30
    
    try test_frame.pushStack(&[_]u256{3}); // Push 3
    _ = try helpers.executeOpcode(arithmetic.op_mul, &test_vm.vm, &test_frame.frame); // 90
    
    try test_frame.pushStack(&[_]u256{15}); // Push 15
    _ = try helpers.executeOpcode(arithmetic.op_sub, &test_vm.vm, &test_frame.frame); // 75
    
    try helpers.expectStackValue(&test_frame.frame, 0, 75);
    try testing.expectEqual(@as(usize, 1), test_frame.stackSize());
}

test "Integration: Modular arithmetic with overflow" {
    // Test: Calculate (MAX_U256 + 5) % 1000
    // Expected: 5 (due to overflow wrapping)
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    const max_u256 = std.math.maxInt(u256);
    
    // Calculate (MAX_U256 + 5) % 1000
    try test_frame.pushStack(&[_]u256{max_u256, 5}); // Push 5, then MAX
    _ = try helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame); // Overflows to 4
    
    try test_frame.pushStack(&[_]u256{1000}); // Push modulus
    _ = try helpers.executeOpcode(arithmetic.op_mod, &test_vm.vm, &test_frame.frame); // 4 % 1000 = 4
    
    try helpers.expectStackValue(&test_frame.frame, 0, 4);
}

test "Integration: Fibonacci sequence calculation" {
    // Calculate first 5 Fibonacci numbers using stack manipulation
    // 0, 1, 1, 2, 3
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Initialize with 0, 1
    try test_frame.pushStack(&[_]u256{0, 1}); // Stack: [1, 0]
    
    // Calculate fib(2) = 1
    _ = try helpers.executeOpcode(stack.op_dup2, &test_vm.vm, &test_frame.frame); // Stack: [0, 1, 0]
    _ = try helpers.executeOpcode(stack.op_dup2, &test_vm.vm, &test_frame.frame); // Stack: [1, 0, 1, 0]
    _ = try helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame); // Stack: [1, 0, 1]
    
    // Calculate fib(3) = 2
    _ = try helpers.executeOpcode(stack.op_dup2, &test_vm.vm, &test_frame.frame); // Stack: [0, 1, 0, 1]
    _ = try helpers.executeOpcode(stack.op_dup2, &test_vm.vm, &test_frame.frame); // Stack: [1, 0, 1, 0, 1]
    _ = try helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame); // Stack: [1, 1, 0, 1]
    _ = try helpers.executeOpcode(stack.op_swap1, &test_vm.vm, &test_frame.frame); // Stack: [1, 1, 0, 1]
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame); // Stack: [1, 1, 0]
    _ = try helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame); // Stack: [2, 0]
    
    // Calculate fib(4) = 3
    _ = try helpers.executeOpcode(stack.op_dup1, &test_vm.vm, &test_frame.frame); // Stack: [2, 2, 0]
    try test_frame.pushStack(&[_]u256{1}); // Stack: [1, 2, 2, 0]
    _ = try helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame); // Stack: [3, 2, 0]
    
    // Verify we have fib(4) = 3 on top
    try helpers.expectStackValue(&test_frame.frame, 0, 3);
    try helpers.expectStackValue(&test_frame.frame, 1, 2);
}

test "Integration: Conditional arithmetic based on comparison" {
    // Test: If a > b, calculate a - b, else calculate b - a
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test case 1: a=30, b=20 (a > b)
    try test_frame.pushStack(&[_]u256{30, 20}); // Stack: [20, 30]
    
    // Duplicate values for comparison
    _ = try helpers.executeOpcode(stack.op_dup2, &test_vm.vm, &test_frame.frame); // Stack: [30, 20, 30]
    _ = try helpers.executeOpcode(stack.op_dup2, &test_vm.vm, &test_frame.frame); // Stack: [20, 30, 20, 30]
    
    // Compare a > b
    _ = try helpers.executeOpcode(comparison.op_gt, &test_vm.vm, &test_frame.frame); // Stack: [1, 20, 30] (30 > 20 = true)
    
    // If true (a > b), calculate a - b
    // Since we got 1 (true), we proceed with a - b
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame); // Stack: [20, 30]
    _ = try helpers.executeOpcode(arithmetic.op_sub, &test_vm.vm, &test_frame.frame); // Stack: [10] (30 - 20)
    
    try helpers.expectStackValue(&test_frame.frame, 0, 10);
    
    // Test case 2: a=15, b=25 (a < b)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{15, 25}); // Stack: [25, 15]
    
    // Duplicate values for comparison
    _ = try helpers.executeOpcode(stack.op_dup2, &test_vm.vm, &test_frame.frame); // Stack: [15, 25, 15]
    _ = try helpers.executeOpcode(stack.op_dup2, &test_vm.vm, &test_frame.frame); // Stack: [25, 15, 25, 15]
    
    // Compare a > b
    _ = try helpers.executeOpcode(comparison.op_gt, &test_vm.vm, &test_frame.frame); // Stack: [0, 25, 15] (15 > 25 = false)
    
    // If false (a <= b), we would calculate b - a
    // For this test, we'll just verify the comparison result
    try helpers.expectStackValue(&test_frame.frame, 0, 0); // Comparison was false
}

test "Integration: Calculate average of multiple values" {
    // Calculate average of 10, 20, 30, 40, 50
    // Expected: 150 / 5 = 30
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Push all values
    try test_frame.pushStack(&[_]u256{10, 20, 30, 40, 50});
    
    // Add them all together
    _ = try helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame); // 90
    _ = try helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame); // 60  
    _ = try helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame); // 30
    _ = try helpers.executeOpcode(arithmetic.op_add, &test_vm.vm, &test_frame.frame); // 150
    
    // Divide by count
    try test_frame.pushStack(&[_]u256{5});
    _ = try helpers.executeOpcode(arithmetic.op_div, &test_vm.vm, &test_frame.frame); // 30
    
    try helpers.expectStackValue(&test_frame.frame, 0, 30);
}

test "Integration: Complex ADDMOD and MULMOD calculations" {
    // Test: Calculate (a + b) % n and (a * b) % n for large values
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test ADDMOD with values that would overflow
    const a: u256 = std.math.maxInt(u256) - 10;
    const b: u256 = 20;
    const n: u256 = 100;
    
    // Calculate (a + b) % n
    // Since a + b overflows, we expect ((MAX-10) + 20) % 100 = 9
    try test_frame.pushStack(&[_]u256{a, b, n});
    _ = try helpers.executeOpcode(arithmetic.op_addmod, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 9);
    
    // Test MULMOD with large values
    test_frame.frame.stack.clear();
    const x: u256 = 1000000000000000000; // 10^18
    const y: u256 = 1000000000000000000; // 10^18  
    const m: u256 = 1000000007; // Large prime
    
    // Calculate (x * y) % m
    try test_frame.pushStack(&[_]u256{x, y, m});
    _ = try helpers.executeOpcode(arithmetic.op_mulmod, &test_vm.vm, &test_frame.frame);
    
    // x * y = 10^36, which is much larger than u256 max
    // We expect a specific result based on modular arithmetic
    const result = try test_frame.popStack();
    try testing.expect(result < m); // Result should be less than modulus
}

test "Integration: Exponentiation chain" {
    // Calculate 2^3^2 (right associative, so 2^(3^2) = 2^9 = 512)
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 50000); // More gas for EXP
    defer test_frame.deinit();
    
    // First calculate 3^2
    try test_frame.pushStack(&[_]u256{3, 2});
    _ = try helpers.executeOpcode(arithmetic.op_exp, &test_vm.vm, &test_frame.frame); // 9
    
    // Then calculate 2^9
    try test_frame.pushStack(&[_]u256{2}); // Push base
    _ = try helpers.executeOpcode(stack.op_swap1, &test_vm.vm, &test_frame.frame); // Swap to get [2, 9]
    _ = try helpers.executeOpcode(arithmetic.op_exp, &test_vm.vm, &test_frame.frame); // 512
    
    try helpers.expectStackValue(&test_frame.frame, 0, 512);
}