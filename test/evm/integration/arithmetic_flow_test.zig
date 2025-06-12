const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers");
const evm = @import("evm");
const opcodes = evm.opcodes;

// Integration tests for arithmetic operations combined with control flow

test "Integration: Arithmetic with conditional jumps" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Create a simple contract that:
    // 1. Adds two numbers
    // 2. Compares result with a threshold
    // 3. Jumps based on comparison
    var code = [_]u8{
        0x60, 0x05, // PUSH1 5
        0x60, 0x0a, // PUSH1 10
        0x01,       // ADD
        0x60, 0x0c, // PUSH1 12 (threshold)
        0x11,       // GT (result > threshold)
        0x60, 0x0c, // PUSH1 12 (jump destination)
        0x57,       // JUMPI
        0x60, 0x00, // PUSH1 0
        0x00,       // STOP
        0x5b,       // JUMPDEST (at position 12)
        0x60, 0x01, // PUSH1 1
        0x00,       // STOP
    };
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Execute sequence: PUSH 5, PUSH 10, ADD
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.program_counter += 2; // Advance past PUSH1 data
    
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.program_counter += 2; // Advance past PUSH1 data
    
    _ = try helpers.executeOpcode(0x01, &test_vm.vm, test_frame.frame);
    
    // Stack should have 15
    try helpers.expectStackValue(test_frame.frame, 0, 15);
    
    // Continue: PUSH 12, GT
    test_frame.frame.program_counter += 1;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.program_counter += 2;
    
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame);
    
    // 15 > 12 should be 1
    try helpers.expectStackValue(test_frame.frame, 0, 1);
    
    // Continue: PUSH 12, JUMPI
    test_frame.frame.program_counter += 1;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.program_counter += 2;
    
    _ = try helpers.executeOpcode(0x57, &test_vm.vm, test_frame.frame);
    
    // Should have jumped to position 12
    try testing.expectEqual(@as(usize, 12), test_frame.frame.program_counter);
}

test "Integration: Complex arithmetic expression evaluation" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Calculate: ((10 + 5) * 3) - 7
    // Expected: ((15) * 3) - 7 = 45 - 7 = 38
    
    // Push values and execute
    try test_frame.pushStack(&[_]u256{10, 5});
    _ = try helpers.executeOpcode(0x01, &test_vm.vm, test_frame.frame);
    
    try test_frame.pushStack(&[_]u256{3});
    _ = try helpers.executeOpcode(0x02, &test_vm.vm, test_frame.frame);
    
    try test_frame.pushStack(&[_]u256{7});
    _ = try helpers.executeOpcode(0x03, &test_vm.vm, test_frame.frame);
    
    try helpers.expectStackValue(test_frame.frame, 0, 38);
}

test "Integration: Modular arithmetic chain" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test ADDMOD followed by MULMOD
    // (10 + 15) % 7 = 25 % 7 = 4
    // (4 * 3) % 5 = 12 % 5 = 2
    
    try test_frame.pushStack(&[_]u256{10, 15, 7});
    _ = try helpers.executeOpcode(0x08, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 4);
    
    try test_frame.pushStack(&[_]u256{3, 5});
    _ = try helpers.executeOpcode(0x09, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 2);
}

test "Integration: Division by zero handling in expression" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test: 10 / 0 = 0, then 0 + 5 = 5
    try test_frame.pushStack(&[_]u256{10, 0});
    _ = try helpers.executeOpcode(0x04, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Division by zero returns 0
    
    try test_frame.pushStack(&[_]u256{5});
    _ = try helpers.executeOpcode(0x01, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 5);
}

test "Integration: Bitwise operations with arithmetic" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test: ((0xFF AND 0x0F) << 4) + 10
    // Expected: ((0x0F) << 4) + 10 = 0xF0 + 10 = 240 + 10 = 250
    
    try test_frame.pushStack(&[_]u256{0xFF, 0x0F});
    _ = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0F);
    
    try test_frame.pushStack(&[_]u256{4});
    _ = try helpers.executeOpcode(0x1B, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xF0);
    
    try test_frame.pushStack(&[_]u256{10});
    _ = try helpers.executeOpcode(0x01, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 250);
}

test "Integration: Stack manipulation with arithmetic" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test DUP and SWAP with arithmetic
    // Stack: [10, 20]
    // DUP1 -> [10, 20, 20]
    // ADD -> [10, 40]
    // SWAP1 -> [40, 10]
    // SUB -> [30]
    
    try test_frame.pushStack(&[_]u256{10, 20});
    _ = try helpers.executeOpcode(0x80, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 3), test_frame.stackSize());
    
    _ = try helpers.executeOpcode(0x01, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 2), test_frame.stackSize());
    try helpers.expectStackValue(test_frame.frame, 0, 40);
    try helpers.expectStackValue(test_frame.frame, 1, 10);
    
    _ = try helpers.executeOpcode(0x90, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 10);
    try helpers.expectStackValue(test_frame.frame, 1, 40);
    
    _ = try helpers.executeOpcode(0x03, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 30);
}

test "Integration: Comparison chain for range checking" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Check if value is in range [10, 20]
    // value >= 10 AND value <= 20
    const value: u256 = 15;
    
    // Check value >= 10
    try test_frame.pushStack(&[_]u256{value, 10});
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);
    _ = try helpers.executeOpcode(0x15, &test_vm.vm, test_frame.frame);
    const ge_10 = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), ge_10); // 15 >= 10 is true
    
    // Check value <= 20
    try test_frame.pushStack(&[_]u256{20, value});
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);
    _ = try helpers.executeOpcode(0x15, &test_vm.vm, test_frame.frame);
    const le_20 = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), le_20); // 15 <= 20 is true
    
    // AND the results
    try test_frame.pushStack(&[_]u256{ge_10, le_20});
    _ = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // In range
}

test "Integration: EXP with modular arithmetic" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Calculate (2^8) % 100 = 256 % 100 = 56
    try test_frame.pushStack(&[_]u256{2, 8});
    _ = try helpers.executeOpcode(0x0A, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 256);
    
    try test_frame.pushStack(&[_]u256{100});
    _ = try helpers.executeOpcode(0x06, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 56);
}

test "Integration: Signed arithmetic with comparisons" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test signed operations
    // -5 (two's complement) compared with 10
    const neg_5 = std.math.maxInt(u256) - 4; // Two's complement of -5
    
    try test_frame.pushStack(&[_]u256{neg_5, 10});
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // -5 < 10 is true
    
    // SDIV: -10 / 3 = -3 (rounds toward zero)
    test_frame.frame.stack.clear();
    const neg_10 = std.math.maxInt(u256) - 9; // Two's complement of -10
    try test_frame.pushStack(&[_]u256{neg_10, 3});
    _ = try helpers.executeOpcode(0x05, &test_vm.vm, test_frame.frame);
    
    const result = try test_frame.popStack();
    const expected_neg_3 = std.math.maxInt(u256) - 2; // Two's complement of -3
    try testing.expectEqual(expected_neg_3, result);
}
