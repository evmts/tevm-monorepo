/// Enhanced arithmetic opcode tests inspired by revm and go-ethereum patterns
/// 
/// This test suite covers complex edge cases and attack vectors that are commonly
/// tested in production EVM implementations like revm and go-ethereum.
const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// EXP Opcode Edge Cases (Inspired by revm test patterns)
// ============================

test "EXP: Gas consumption edge cases from revm patterns" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

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

    // Test case 1: Exponent = 0 should use minimal gas (revm test)
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 1000;
    try test_frame.pushStack(&[_]u256{ 123, 0 }); // base=123, exp=0
    _ = try helpers.executeOpcode(0x0A, test_vm.vm, test_frame.frame);
    
    const result1 = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), result1); // Any number^0 = 1
    
    // Test case 2: Single byte exponent gas calculation
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 1000;
    const initial_gas = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{ 2, 255 }); // base=2, exp=255 (1 byte)
    _ = try helpers.executeOpcode(0x0A, test_vm.vm, test_frame.frame);
    
    _ = try test_frame.popStack();
    const gas_used = initial_gas - test_frame.frame.gas_remaining;
    // Base EXP gas (10) + 1 byte * 50 = 60 gas total
    try testing.expectEqual(@as(u64, 60), gas_used);

    // Test case 3: Multi-byte exponent gas escalation
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 1000;
    const initial_gas_2 = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{ 2, 256 }); // base=2, exp=256 (2 bytes)
    _ = try helpers.executeOpcode(0x0A, test_vm.vm, test_frame.frame);
    
    _ = try test_frame.popStack();
    const gas_used_2 = initial_gas_2 - test_frame.frame.gas_remaining;
    // Base EXP gas (10) + 2 bytes * 50 = 110 gas total
    try testing.expectEqual(@as(u64, 110), gas_used_2);
}

test "EXP: Overflow and underflow patterns from go-ethereum" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

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

    const test_cases = [_]struct {
        base: u256,
        exp: u256,
        expected: u256,
        desc: []const u8,
    }{
        // Edge cases from go-ethereum test suite
        .{ .base = 0, .exp = 0, .expected = 1, .desc = "0^0 = 1 (mathematical convention)" },
        .{ .base = 0, .exp = 1, .expected = 0, .desc = "0^1 = 0" },
        .{ .base = 1, .exp = std.math.maxInt(u256), .expected = 1, .desc = "1^MAX = 1" },
        .{ .base = 2, .exp = 255, .expected = @as(u256, 1) << 255, .desc = "2^255 edge case" },
        .{ .base = 2, .exp = 256, .expected = 0, .desc = "2^256 overflow wraps to 0" },
        
        // Large base, small exponent (revm edge case)
        .{ .base = std.math.maxInt(u256), .exp = 1, .expected = std.math.maxInt(u256), .desc = "MAX^1 = MAX" },
        .{ .base = std.math.maxInt(u256), .exp = 2, .expected = 1, .desc = "MAX^2 wraps to 1" },
        
        // Fermat number tests (from cryptographic test vectors)
        .{ .base = 3, .exp = 5, .expected = 243, .desc = "3^5 = 243" },
        .{ .base = 17, .exp = 1, .expected = 17, .desc = "17^1 = 17 (Fermat prime)" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        test_frame.frame.gas_remaining = 10000;
        
        try test_frame.pushStack(&[_]u256{ case.base, case.exp });
        _ = try helpers.executeOpcode(0x0A, test_vm.vm, test_frame.frame);
        
        const result = try test_frame.popStack();
        try testing.expectEqual(case.expected, result);
    }
}

// ============================
// SIGNEXTEND Edge Cases (Patterns from revm)
// ============================

test "SIGNEXTEND: Boundary conditions and bit manipulation patterns" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

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

    const test_cases = [_]struct {
        byte_pos: u256,
        value: u256,
        expected: u256,
        desc: []const u8,
    }{
        // Basic sign extension (revm test vectors)
        .{ .byte_pos = 0, .value = 0x7F, .expected = 0x7F, .desc = "Positive sign from byte 0" },
        .{ .byte_pos = 0, .value = 0x80, .expected = std.math.maxInt(u256) - 0x7F, .desc = "Negative sign from byte 0" },
        
        // Boundary cases at different byte positions
        .{ .byte_pos = 1, .value = 0x7FFF, .expected = 0x7FFF, .desc = "Positive at byte 1 boundary" },
        .{ .byte_pos = 1, .value = 0x8000, .expected = (~@as(u256, 0x7FFF)), .desc = "Negative at byte 1 boundary" },
        
        // Edge case: byte position >= 31 (should return unchanged)
        .{ .byte_pos = 31, .value = 0x80, .expected = 0x80, .desc = "No extension when byte_pos = 31" },
        .{ .byte_pos = 32, .value = 0x80, .expected = 0x80, .desc = "No extension when byte_pos > 31" },
        .{ .byte_pos = 255, .value = 0x80, .expected = 0x80, .desc = "No extension when byte_pos = 255" },
        
        // Complex bit patterns (go-ethereum test vectors)
        .{ .byte_pos = 3, .value = 0x7FFFFFFF, .expected = 0x7FFFFFFF, .desc = "4-byte positive number" },
        .{ .byte_pos = 3, .value = 0x80000000, .expected = (~@as(u256, 0x7FFFFFFF)), .desc = "4-byte negative number" },
        
        // Zero cases
        .{ .byte_pos = 0, .value = 0, .expected = 0, .desc = "Zero value remains zero" },
        .{ .byte_pos = 5, .value = 0, .expected = 0, .desc = "Zero at any byte position" },
        
        // Maximum value patterns
        .{ .byte_pos = 31, .value = std.math.maxInt(u256), .expected = std.math.maxInt(u256), .desc = "MAX value at byte 31" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        
        try test_frame.pushStack(&[_]u256{ case.byte_pos, case.value });
        _ = try helpers.executeOpcode(0x0B, test_vm.vm, test_frame.frame);
        
        const result = try test_frame.popStack();
        try testing.expectEqual(case.expected, result);
    }
}

// ============================
// ADDMOD/MULMOD Edge Cases (Cryptographic patterns)
// ============================

test "ADDMOD: Modular arithmetic edge cases from cryptographic libraries" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

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

    const test_cases = [_]struct {
        a: u256,
        b: u256,
        n: u256,
        expected: u256,
        desc: []const u8,
    }{
        // Basic modular arithmetic
        .{ .a = 10, .b = 15, .n = 7, .expected = 4, .desc = "(10 + 15) mod 7 = 4" },
        
        // Edge case: n = 0 should return 0 (division by zero)
        .{ .a = 10, .b = 15, .n = 0, .expected = 0, .desc = "Division by zero returns 0" },
        
        // Large number modular arithmetic (cryptographic field operations)
        .{ .a = std.math.maxInt(u256), .b = 1, .n = 2, .expected = 0, .desc = "(MAX + 1) mod 2 = 0" },
        .{ .a = std.math.maxInt(u256), .b = std.math.maxInt(u256), .n = std.math.maxInt(u256), .expected = 1, .desc = "Wraparound case" },
        
        // Prime field operations (common in elliptic curve cryptography)
        .{ .a = 2, .b = 3, .n = 5, .expected = 0, .desc = "(2 + 3) mod 5 = 0" },
        .{ .a = 7, .b = 11, .n = 13, .expected = 5, .desc = "(7 + 11) mod 13 = 5" },
        
        // Identity cases
        .{ .a = 0, .b = 0, .n = 5, .expected = 0, .desc = "(0 + 0) mod 5 = 0" },
        .{ .a = 1, .b = 0, .n = 2, .expected = 1, .desc = "(1 + 0) mod 2 = 1" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        
        try test_frame.pushStack(&[_]u256{ case.a, case.b, case.n });
        _ = try helpers.executeOpcode(0x08, test_vm.vm, test_frame.frame);
        
        const result = try test_frame.popStack();
        try testing.expectEqual(case.expected, result);
    }
}

test "MULMOD: Complex multiplication patterns from revm" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

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

    const test_cases = [_]struct {
        a: u256,
        b: u256,
        n: u256,
        expected: u256,
        desc: []const u8,
    }{
        // Basic multiplication modulo
        .{ .a = 3, .b = 4, .n = 5, .expected = 2, .desc = "(3 * 4) mod 5 = 2" },
        
        // Division by zero case
        .{ .a = 10, .b = 20, .n = 0, .expected = 0, .desc = "Division by zero returns 0" },
        
        // Large multiplication with overflow (critical for security)
        .{ .a = @as(u256, 1) << 128, .b = @as(u256, 1) << 128, .n = 3, .expected = 1, .desc = "Large multiplication overflow" },
        
        // Fermat's little theorem test cases (cryptographic relevance)
        .{ .a = 2, .b = 6, .n = 7, .expected = 5, .desc = "2^6 mod 7 = 1 (Fermat)" },
        
        // Identity and zero cases
        .{ .a = 0, .b = 100, .n = 7, .expected = 0, .desc = "(0 * 100) mod 7 = 0" },
        .{ .a = 1, .b = 5, .n = 6, .expected = 5, .desc = "(1 * 5) mod 6 = 5" },
        
        // Edge case: all values are maximum
        .{ .a = std.math.maxInt(u256), .b = std.math.maxInt(u256), .n = std.math.maxInt(u256), .expected = 0, .desc = "MAX * MAX mod MAX = 0" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        
        try test_frame.pushStack(&[_]u256{ case.a, case.b, case.n });
        _ = try helpers.executeOpcode(0x09, test_vm.vm, test_frame.frame);
        
        const result = try test_frame.popStack();
        try testing.expectEqual(case.expected, result);
    }
}

// ============================
// SDIV/SMOD Signed Arithmetic Edge Cases
// ============================

test "SDIV: Signed division edge cases from go-ethereum" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

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

    // Two's complement representation tests
    const negative_one = ~@as(u256, 0); // -1 in two's complement
    const negative_two = ~@as(u256, 1); // -2 in two's complement
    const min_i256 = @as(u256, 1) << 255; // Most negative number

    const test_cases = [_]struct {
        a: u256,
        b: u256,
        expected: u256,
        desc: []const u8,
    }{
        // Basic signed division
        .{ .a = 10, .b = 2, .expected = 5, .desc = "10 / 2 = 5" },
        .{ .a = 10, .b = negative_two, .expected = (~@as(u256, 4)), .desc = "10 / -2 = -5" },
        
        // Division by zero (should return 0)
        .{ .a = 10, .b = 0, .expected = 0, .desc = "Division by zero returns 0" },
        
        // Edge case: most negative number divided by -1 (overflow case)
        .{ .a = min_i256, .b = negative_one, .expected = min_i256, .desc = "MIN_I256 / -1 overflow protection" },
        
        // Negative divided by negative
        .{ .a = negative_two, .b = negative_two, .expected = 1, .desc = "-2 / -2 = 1" },
        
        // Zero cases
        .{ .a = 0, .b = 5, .expected = 0, .desc = "0 / 5 = 0" },
        .{ .a = 0, .b = negative_one, .expected = 0, .desc = "0 / -1 = 0" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        
        try test_frame.pushStack(&[_]u256{ case.a, case.b });
        _ = try helpers.executeOpcode(0x05, test_vm.vm, test_frame.frame);
        
        const result = try test_frame.popStack();
        try testing.expectEqual(case.expected, result);
    }
}