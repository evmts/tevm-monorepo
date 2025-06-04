const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// 0x16: AND opcode
// ============================

test "AND (0x16): Basic bitwise AND" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0x16}; // AND
    
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
    
    // Test: 0xFF00 & 0x0FF0 = 0x0F00
    try test_frame.pushStack(&[_]u256{0xFF00});
    try test_frame.pushStack(&[_]u256{0x0FF0});
    
    const result = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0x0F00), value);
}

test "AND: All zeros" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x16},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: 0xFFFF & 0x0000 = 0x0000
    try test_frame.pushStack(&[_]u256{0xFFFF});
    try test_frame.pushStack(&[_]u256{0x0000});
    
    _ = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), value);
}

test "AND: All ones" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x16},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: MAX & MAX = MAX
    const max = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{max});
    try test_frame.pushStack(&[_]u256{max});
    
    _ = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(max, value);
}

test "AND: Masking operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x16},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: Extract lower byte with mask
    try test_frame.pushStack(&[_]u256{0x123456});
    try test_frame.pushStack(&[_]u256{0xFF});
    
    _ = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0x56), value);
}

// ============================
// 0x17: OR opcode
// ============================

test "OR (0x17): Basic bitwise OR" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x17},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: 0xF000 | 0x00F0 = 0xF0F0
    try test_frame.pushStack(&[_]u256{0xF000});
    try test_frame.pushStack(&[_]u256{0x00F0});
    
    _ = try helpers.executeOpcode(0x17, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0xF0F0), value);
}

test "OR: With zero" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x17},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: 0x1234 | 0x0000 = 0x1234
    try test_frame.pushStack(&[_]u256{0x1234});
    try test_frame.pushStack(&[_]u256{0x0000});
    
    _ = try helpers.executeOpcode(0x17, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0x1234), value);
}

test "OR: Setting bits" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x17},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: Set specific bits
    try test_frame.pushStack(&[_]u256{0x1000});
    try test_frame.pushStack(&[_]u256{0x0200});
    
    _ = try helpers.executeOpcode(0x17, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0x1200), value);
}

// ============================
// 0x18: XOR opcode
// ============================

test "XOR (0x18): Basic bitwise XOR" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x18},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: 0xFF00 ^ 0x0FF0 = 0xF0F0
    try test_frame.pushStack(&[_]u256{0xFF00});
    try test_frame.pushStack(&[_]u256{0x0FF0});
    
    _ = try helpers.executeOpcode(0x18, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0xF0F0), value);
}

test "XOR: Self XOR equals zero" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x18},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: X ^ X = 0
    try test_frame.pushStack(&[_]u256{0x123456});
    try test_frame.pushStack(&[_]u256{0x123456});
    
    _ = try helpers.executeOpcode(0x18, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), value);
}

test "XOR: Toggle bits" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x18},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: Toggle specific bits
    try test_frame.pushStack(&[_]u256{0b1010});
    try test_frame.pushStack(&[_]u256{0b1100});
    
    _ = try helpers.executeOpcode(0x18, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0b0110), value);
}

// ============================
// 0x19: NOT opcode
// ============================

test "NOT (0x19): Basic bitwise NOT" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x19},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: NOT 0 = MAX
    try test_frame.pushStack(&[_]u256{0});
    
    _ = try helpers.executeOpcode(0x19, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(std.math.maxInt(u256), value);
}

test "NOT: Invert all bits" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x19},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: NOT MAX = 0
    try test_frame.pushStack(&[_]u256{std.math.maxInt(u256)});
    
    _ = try helpers.executeOpcode(0x19, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), value);
}

test "NOT: Double NOT returns original" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x19, 0x19},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: NOT(NOT(X)) = X
    const original = 0x123456789ABCDEF;
    try test_frame.pushStack(&[_]u256{original});
    
    // First NOT
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x19, &test_vm.vm, test_frame.frame);
    
    // Second NOT
    test_frame.frame.pc = 1;
    _ = try helpers.executeOpcode(0x19, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, original), value);
}

// ============================
// 0x1A: BYTE opcode
// ============================

test "BYTE (0x1A): Extract first byte" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x1A},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: Extract byte 0 (most significant) from 0x123456...
    try test_frame.pushStack(&[_]u256{0x1234567890ABCDEF}); // value (pushed first, popped second)
    try test_frame.pushStack(&[_]u256{0}); // byte index (pushed last, popped first)
    
    _ = try helpers.executeOpcode(0x1A, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), value); // Most significant byte is 0
}

test "BYTE: Extract last byte" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x1A},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: Extract byte 31 (least significant) from value
    try test_frame.pushStack(&[_]u256{0x1234567890ABCDEF}); // value (pushed first, popped second)
    try test_frame.pushStack(&[_]u256{31}); // byte index (pushed last, popped first)
    
    _ = try helpers.executeOpcode(0x1A, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0xEF), value);
}

test "BYTE: Out of bounds returns zero" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x1A},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: Byte index >= 32 returns 0
    try test_frame.pushStack(&[_]u256{0xFFFFFFFFFFFFFFFF}); // value (pushed first, popped second)
    try test_frame.pushStack(&[_]u256{32}); // byte index (out of bounds) (pushed last, popped first)
    
    _ = try helpers.executeOpcode(0x1A, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), value);
}

test "BYTE: Extract from full u256" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x1A},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Create a value with known byte pattern
    // Bytes 24-31: 0x0102030405060708
    const test_value = @as(u256, 0x0102030405060708);
    
    // Test extracting byte 24 (should be 0x01)
    try test_frame.pushStack(&[_]u256{24});
    try test_frame.pushStack(&[_]u256{test_value});
    
    _ = try helpers.executeOpcode(0x1A, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0x01), value);
}

// ============================
// Gas consumption tests
// ============================

test "Bitwise opcodes: Gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const test_cases = [_]struct {
        opcode: u8,
        expected_gas: u64,
        setup: *const fn(*helpers.TestFrame) anyerror!void,
    }{
        .{ .opcode = 0x16, .expected_gas = 3, .setup = struct { // AND
            fn setup(frame: *helpers.TestFrame) !void {
                try frame.pushStack(&[_]u256{0xFF});
                try frame.pushStack(&[_]u256{0x0F});
            }
        }.setup },
        .{ .opcode = 0x17, .expected_gas = 3, .setup = struct { // OR
            fn setup(frame: *helpers.TestFrame) !void {
                try frame.pushStack(&[_]u256{0xFF});
                try frame.pushStack(&[_]u256{0x0F});
            }
        }.setup },
        .{ .opcode = 0x18, .expected_gas = 3, .setup = struct { // XOR
            fn setup(frame: *helpers.TestFrame) !void {
                try frame.pushStack(&[_]u256{0xFF});
                try frame.pushStack(&[_]u256{0x0F});
            }
        }.setup },
        .{ .opcode = 0x19, .expected_gas = 3, .setup = struct { // NOT
            fn setup(frame: *helpers.TestFrame) !void {
                try frame.pushStack(&[_]u256{0xFF});
            }
        }.setup },
        .{ .opcode = 0x1A, .expected_gas = 3, .setup = struct { // BYTE
            fn setup(frame: *helpers.TestFrame) !void {
                try frame.pushStack(&[_]u256{0});
                try frame.pushStack(&[_]u256{0xFF});
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

test "Bitwise opcodes: Stack underflow" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const binary_ops = [_]u8{0x16, 0x17, 0x18, 0x1A}; // AND, OR, XOR, BYTE
    const unary_ops = [_]u8{0x19}; // NOT
    
    // Test binary operations with insufficient stack
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
        
        // Only one item (need two)
        try test_frame.pushStack(&[_]u256{10});
        const result2 = helpers.executeOpcode(opcode, &test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result2);
    }
    
    // Test unary operations with empty stack
    for (unary_ops) |opcode| {
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
    }
}

// ============================
// Edge case tests
// ============================

test "Bitwise operations: Large values" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x16}, // AND
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test with maximum values
    const max = std.math.maxInt(u256);
    const half_max = max >> 1;
    
    try test_frame.pushStack(&[_]u256{max});
    try test_frame.pushStack(&[_]u256{half_max});
    
    _ = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(half_max, value);
}

test "BYTE: Byte extraction patterns" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x1A},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Create a value with distinct byte pattern
    // Each byte has value equal to its position (31-i)
    var test_value: u256 = 0;
    var i: u8 = 0;
    while (i < 32) : (i += 1) {
        test_value = (test_value << 8) | @as(u256, 31 - i);
    }
    
    // Test extracting byte 28 (should be 3)
    try test_frame.pushStack(&[_]u256{28});
    try test_frame.pushStack(&[_]u256{test_value});
    
    _ = try helpers.executeOpcode(0x1A, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 3), value);
}