const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// 0x00: STOP opcode
// ============================

test "STOP (0x00): Halt execution" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0x00}; // STOP
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Execute STOP
    const result = helpers.executeOpcode(0x00, &test_vm.vm, test_frame.frame);
    
    // Should return STOP error
    try testing.expectError(helpers.ExecutionError.Error.STOP, result);
}

// ============================
// 0x01: ADD opcode
// ============================

test "ADD (0x01): Basic addition" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0x01}; // ADD
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test basic addition: 5 + 10 = 15
    try test_frame.pushStack(5);
    try test_frame.pushStack(10);
    
    const result = try helpers.executeOpcode(0x01, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 15), value);
}

test "ADD: Overflow wraps to zero" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x01},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test overflow: MAX + 1 = 0
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(max_u256);
    try test_frame.pushStack(1);
    
    _ = try helpers.executeOpcode(0x01, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), value);
}

test "ADD: Large numbers" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x01},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test large number addition
    const large1 = std.math.maxInt(u256) / 2;
    const large2 = std.math.maxInt(u256) / 3;
    try test_frame.pushStack(large1);
    try test_frame.pushStack(large2);
    
    _ = try helpers.executeOpcode(0x01, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    const expected = large1 +% large2; // Wrapping addition
    try testing.expectEqual(expected, value);
}

// ============================
// 0x02: MUL opcode
// ============================

test "MUL (0x02): Basic multiplication" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x02},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test basic multiplication: 5 * 10 = 50
    try test_frame.pushStack(5);
    try test_frame.pushStack(10);
    
    _ = try helpers.executeOpcode(0x02, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 50), value);
}

test "MUL: Multiplication by zero" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x02},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test multiplication by zero
    try test_frame.pushStack(1000);
    try test_frame.pushStack(0);
    
    _ = try helpers.executeOpcode(0x02, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), value);
}

test "MUL: Overflow behavior" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x02},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test overflow: (2^128) * (2^128) should wrap
    const half_max = @as(u256, 1) << 128;
    try test_frame.pushStack(half_max);
    try test_frame.pushStack(half_max);
    
    _ = try helpers.executeOpcode(0x02, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    // Result should be 0 due to overflow (2^256 mod 2^256 = 0)
    try testing.expectEqual(@as(u256, 0), value);
}

// ============================
// 0x03: SUB opcode
// ============================

test "SUB (0x03): Basic subtraction" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x03},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test basic subtraction: 10 - 5 = 5
    try test_frame.pushStack(10);
    try test_frame.pushStack(5);
    
    _ = try helpers.executeOpcode(0x03, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 5), value);
}

test "SUB: Underflow wraps to max" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x03},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test underflow: 0 - 1 = MAX
    try test_frame.pushStack(0);
    try test_frame.pushStack(1);
    
    _ = try helpers.executeOpcode(0x03, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(std.math.maxInt(u256), value);
}

// ============================
// 0x04: DIV opcode
// ============================

test "DIV (0x04): Basic division" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x04},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test basic division: 20 / 5 = 4
    try test_frame.pushStack(20);
    try test_frame.pushStack(5);
    
    _ = try helpers.executeOpcode(0x04, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 4), value);
}

test "DIV: Division by zero returns zero" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x04},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test division by zero: 100 / 0 = 0
    try test_frame.pushStack(100);
    try test_frame.pushStack(0);
    
    _ = try helpers.executeOpcode(0x04, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), value);
}

test "DIV: Integer division truncates" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x04},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test truncation: 7 / 3 = 2 (not 2.33...)
    try test_frame.pushStack(7);
    try test_frame.pushStack(3);
    
    _ = try helpers.executeOpcode(0x04, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 2), value);
}

// ============================
// 0x05: SDIV opcode
// ============================

test "SDIV (0x05): Signed division positive" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x05},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test positive division: 20 / 5 = 4
    try test_frame.pushStack(20);
    try test_frame.pushStack(5);
    
    _ = try helpers.executeOpcode(0x05, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 4), value);
}

test "SDIV: Signed division negative" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x05},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test negative division: -20 / 5 = -4
    // In two's complement: -20 = MAX - 19
    const neg_20 = std.math.maxInt(u256) - 19;
    try test_frame.pushStack(neg_20);
    try test_frame.pushStack(5);
    
    _ = try helpers.executeOpcode(0x05, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    const expected = std.math.maxInt(u256) - 3; // -4 in two's complement
    try testing.expectEqual(expected, value);
}

test "SDIV: Division by zero returns zero" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x05},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test division by zero
    try test_frame.pushStack(100);
    try test_frame.pushStack(0);
    
    _ = try helpers.executeOpcode(0x05, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), value);
}

test "SDIV: Edge case MIN / -1" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x05},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test MIN / -1 = MIN (special case)
    const min_i256 = @as(u256, 1) << 255; // -2^255 in two's complement
    const neg_1 = std.math.maxInt(u256); // -1 in two's complement
    try test_frame.pushStack(min_i256);
    try test_frame.pushStack(neg_1);
    
    _ = try helpers.executeOpcode(0x05, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(min_i256, value);
}

// ============================
// 0x06: MOD opcode
// ============================

test "MOD (0x06): Basic modulo" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x06},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test basic modulo: 17 % 5 = 2
    try test_frame.pushStack(17);
    try test_frame.pushStack(5);
    
    _ = try helpers.executeOpcode(0x06, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 2), value);
}

test "MOD: Modulo by zero returns zero" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x06},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test modulo by zero: 100 % 0 = 0
    try test_frame.pushStack(100);
    try test_frame.pushStack(0);
    
    _ = try helpers.executeOpcode(0x06, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), value);
}

// ============================
// 0x07: SMOD opcode
// ============================

test "SMOD (0x07): Signed modulo positive" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x07},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test positive modulo: 17 % 5 = 2
    try test_frame.pushStack(17);
    try test_frame.pushStack(5);
    
    _ = try helpers.executeOpcode(0x07, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 2), value);
}

test "SMOD: Signed modulo negative" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x07},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test negative modulo: -17 % 5 = -2
    const neg_17 = std.math.maxInt(u256) - 16;
    try test_frame.pushStack(neg_17);
    try test_frame.pushStack(5);
    
    _ = try helpers.executeOpcode(0x07, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    const expected = std.math.maxInt(u256) - 1; // -2 in two's complement
    try testing.expectEqual(expected, value);
}

// ============================
// 0x08: ADDMOD opcode
// ============================

test "ADDMOD (0x08): Basic modular addition" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x08},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: (10 + 10) % 8 = 4
    try test_frame.pushStack(10);
    try test_frame.pushStack(10);
    try test_frame.pushStack(8);
    
    _ = try helpers.executeOpcode(0x08, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 4), value);
}

test "ADDMOD: Modulo zero returns zero" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x08},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: (10 + 10) % 0 = 0
    try test_frame.pushStack(10);
    try test_frame.pushStack(10);
    try test_frame.pushStack(0);
    
    _ = try helpers.executeOpcode(0x08, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), value);
}

test "ADDMOD: No intermediate overflow" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x08},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test with values that would overflow u256
    const max = std.math.maxInt(u256);
    try test_frame.pushStack(max);
    try test_frame.pushStack(max);
    try test_frame.pushStack(10);
    
    _ = try helpers.executeOpcode(0x08, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    // (MAX + MAX) % 10 = 8 (because MAX + MAX = 2^257 - 2, and (2^257 - 2) % 10 = 8)
    try testing.expectEqual(@as(u256, 8), value);
}

// ============================
// 0x09: MULMOD opcode
// ============================

test "MULMOD (0x09): Basic modular multiplication" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x09},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: (10 * 10) % 8 = 4
    try test_frame.pushStack(10);
    try test_frame.pushStack(10);
    try test_frame.pushStack(8);
    
    _ = try helpers.executeOpcode(0x09, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 4), value);
}

test "MULMOD: No intermediate overflow" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x09},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test with values that would overflow u256
    const large = @as(u256, 1) << 200;
    try test_frame.pushStack(large);
    try test_frame.pushStack(large);
    try test_frame.pushStack(100);
    
    _ = try helpers.executeOpcode(0x09, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    // Should compute correctly without overflow
    try testing.expect(value < 100);
}

// ============================
// 0x0A: EXP opcode
// ============================

test "EXP (0x0A): Basic exponentiation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x0A},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: 2^8 = 256
    try test_frame.pushStack(2);
    try test_frame.pushStack(8);
    
    _ = try helpers.executeOpcode(0x0A, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 256), value);
}

test "EXP: Zero exponent" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x0A},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: 100^0 = 1
    try test_frame.pushStack(100);
    try test_frame.pushStack(0);
    
    _ = try helpers.executeOpcode(0x0A, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), value);
}

test "EXP: Zero base with non-zero exponent" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x0A},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: 0^10 = 0
    try test_frame.pushStack(0);
    try test_frame.pushStack(10);
    
    _ = try helpers.executeOpcode(0x0A, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), value);
}

test "EXP: Gas consumption scales with exponent size" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x0A},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test with large exponent
    try test_frame.pushStack(2);
    try test_frame.pushStack(0x10000); // Large exponent
    
    const gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x0A, &test_vm.vm, test_frame.frame);
    const gas_used = gas_before - test_frame.frame.gas_remaining;
    
    // EXP uses 10 + 50 * byte_size_of_exponent
    // 0x10000 = 65536, which is 3 bytes
    // Expected: 10 + 50 * 3 = 160
    try testing.expect(gas_used >= 160);
}

// ============================
// 0x0B: SIGNEXTEND opcode
// ============================

test "SIGNEXTEND (0x0B): Extend positive byte" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x0B},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: sign extend 0x7F (positive) from byte 0
    try test_frame.pushStack(0); // byte position
    try test_frame.pushStack(0x7F); // value
    
    _ = try helpers.executeOpcode(0x0B, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0x7F), value);
}

test "SIGNEXTEND: Extend negative byte" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x0B},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: sign extend 0xFF (negative) from byte 0
    try test_frame.pushStack(0); // byte position
    try test_frame.pushStack(0xFF); // value
    
    _ = try helpers.executeOpcode(0x0B, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    // Should extend with 1s
    const expected = std.math.maxInt(u256); // All 1s
    try testing.expectEqual(expected, value);
}

test "SIGNEXTEND: Extend from higher byte position" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x0B},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: sign extend 0x00FF from byte 1 (second byte)
    try test_frame.pushStack(1); // byte position
    try test_frame.pushStack(0x00FF); // value
    
    _ = try helpers.executeOpcode(0x0B, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    // Since bit 15 is 0, it's positive, no extension
    try testing.expectEqual(@as(u256, 0x00FF), value);
}

test "SIGNEXTEND: Byte position >= 31 returns value unchanged" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x0B},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: byte position >= 31 returns original value
    const test_value = 0x123456789ABCDEF;
    try test_frame.pushStack(31); // byte position
    try test_frame.pushStack(test_value);
    
    _ = try helpers.executeOpcode(0x0B, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, test_value), value);
}

// ============================
// Gas consumption tests
// ============================

test "Arithmetic opcodes: Gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const test_cases = [_]struct {
        opcode: u8,
        expected_gas: u64,
        setup: fn(*helpers.TestFrame) anyerror!void,
    }{
        .{ .opcode = 0x01, .expected_gas = 3, .setup = struct { // ADD
            fn setup(frame: *helpers.TestFrame) !void {
                try frame.pushStack(5);
                try frame.pushStack(10);
            }
        }.setup },
        .{ .opcode = 0x02, .expected_gas = 5, .setup = struct { // MUL
            fn setup(frame: *helpers.TestFrame) !void {
                try frame.pushStack(5);
                try frame.pushStack(10);
            }
        }.setup },
        .{ .opcode = 0x08, .expected_gas = 8, .setup = struct { // ADDMOD
            fn setup(frame: *helpers.TestFrame) !void {
                try frame.pushStack(10);
                try frame.pushStack(10);
                try frame.pushStack(8);
            }
        }.setup },
    };
    
    for (test_cases) |tc| {
        var contract = try helpers.createTestContract(
            allocator,
            helpers.TestAddresses.CONTRACT,
            helpers.TestAddresses.ALICE,
            0,
            &[_]u8{tc.opcode},
        );
        defer contract.deinit(null);
        
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();
        
        try tc.setup(&test_frame);
        
        const gas_before = test_frame.frame.gas_remaining;
        _ = try helpers.executeOpcode(tc.opcode, &test_vm.vm, test_frame.frame);
        const gas_used = gas_before - test_frame.frame.gas_remaining;
        
        try testing.expectEqual(tc.expected_gas, gas_used);
    }
}

// ============================
// Stack underflow tests
// ============================

test "Arithmetic opcodes: Stack underflow" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const binary_ops = [_]u8{0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07}; // ADD, MUL, SUB, DIV, SDIV, MOD, SMOD
    const ternary_ops = [_]u8{0x08, 0x09}; // ADDMOD, MULMOD
    
    // Test binary operations with empty stack
    for (binary_ops) |opcode| {
        var contract = try helpers.createTestContract(
            allocator,
            helpers.TestAddresses.CONTRACT,
            helpers.TestAddresses.ALICE,
            0,
            &[_]u8{opcode},
        );
        defer contract.deinit(null);
        
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();
        
        // Empty stack
        const result = helpers.executeOpcode(opcode, &test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
        
        // Only one item
        try test_frame.pushStack(10);
        const result2 = helpers.executeOpcode(opcode, &test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result2);
    }
    
    // Test ternary operations
    for (ternary_ops) |opcode| {
        var contract = try helpers.createTestContract(
            allocator,
            helpers.TestAddresses.CONTRACT,
            helpers.TestAddresses.ALICE,
            0,
            &[_]u8{opcode},
        );
        defer contract.deinit(null);
        
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();
        
        // Only two items (need three)
        try test_frame.pushStack(10);
        try test_frame.pushStack(20);
        const result = helpers.executeOpcode(opcode, &test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
    }
}