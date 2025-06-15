const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes through evm module
const evm = @import("evm");

/// Test case structure for comparison and logical operations
const ComparisonTestCase = struct {
    x: []const u8,
    y: []const u8,
    expected: []const u8,
};

/// Helper function to run comparison/logical operation tests
fn run_comparison_test(
    allocator: std.mem.Allocator,
    test_cases: []const ComparisonTestCase,
    opcode: u8,
    operation_name: []const u8,
) !void {
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

    for (test_cases, 0..) |test_case, i| {
        // Parse hex strings to u256 values
        const x_val = try std.fmt.parseInt(u256, test_case.x, 16);
        const y_val = try std.fmt.parseInt(u256, test_case.y, 16);
        const expected = try std.fmt.parseInt(u256, test_case.expected, 16);

        // Clear stack from previous test
        test_frame.clearStack();

        // Push operands (note: stack is LIFO, so push in reverse order for binary ops)
        try test_frame.pushStack(&[_]u256{ y_val, x_val });

        // Execute the operation
        const result = helpers.executeOpcode(opcode, test_vm.vm, test_frame.frame) catch |err| {
            std.debug.print("Test case {} failed for operation {s}: {}\n", .{ i, operation_name, err });
            return err;
        };

        // Verify exactly one item remains on stack
        if (test_frame.frame.stack.len() != 1) {
            std.debug.print("Expected 1 item on stack after {s}, got {}\n", .{ operation_name, test_frame.frame.stack.len() });
            return error.UnexpectedStackSize;
        }

        // Get the result and compare
        const actual = test_frame.frame.stack.peek(0) catch unreachable;
        if (actual != expected) {
            std.debug.print("Test case {} {s}(0x{s}, 0x{s}): expected 0x{x}, got 0x{x}\n", .{ i, operation_name, test_case.x, test_case.y, expected, actual });
            return error.UnexpectedResult;
        }
    }
}

test "Geth-style LT (Less Than) comprehensive tests" {
    const allocator = testing.allocator;

    // Test cases based on geth's comparison operation patterns
    const lt_test_cases = [_]ComparisonTestCase{
        // Basic comparisons
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000000", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        
        // Edge cases with max values
        .{ .x = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "8000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "8000000000000000000000000000000000000000000000000000000000000000", .y = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000000", .y = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        
        // Sequential values
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000005", .y = "0000000000000000000000000000000000000000000000000000000000000006", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000006", .y = "0000000000000000000000000000000000000000000000000000000000000005", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
    };

    try run_comparison_test(allocator, &lt_test_cases, 0x10, "LT");
}

test "Geth-style GT (Greater Than) comprehensive tests" {
    const allocator = testing.allocator;

    const gt_test_cases = [_]ComparisonTestCase{
        // Basic comparisons (inverse of LT)
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000000", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        
        // Large numbers
        .{ .x = "8000000000000000000000000000000000000000000000000000000000000000", .y = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe", .y = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
    };

    try run_comparison_test(allocator, &gt_test_cases, 0x11, "GT");
}

test "Geth-style SLT (Signed Less Than) comprehensive tests" {
    const allocator = testing.allocator;

    // Signed comparison tests - key difference from unsigned LT
    const slt_test_cases = [_]ComparisonTestCase{
        // Positive vs positive
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000002", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000002", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        
        // Negative vs negative (in two's complement)
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe", .expected = "0000000000000000000000000000000000000000000000000000000000000000" }, // -1 < -2 is false
        .{ .x = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe", .y = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000001" }, // -2 < -1 is true
        
        // Positive vs negative 
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000000" }, // 1 < -1 is false
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000001" }, // -1 < 1 is true
        
        // Zero comparisons
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000000", .y = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000000" }, // 0 < -1 is false
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000001" }, // -1 < 0 is true
        
        // Maximum signed values
        .{ .x = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "8000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000000" }, // max_pos < min_neg is false (unsigned perspective)
        .{ .x = "8000000000000000000000000000000000000000000000000000000000000000", .y = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000001" }, // min_neg < max_pos is true
    };

    try run_comparison_test(allocator, &slt_test_cases, 0x12, "SLT");
}

test "Geth-style SGT (Signed Greater Than) comprehensive tests" {
    const allocator = testing.allocator;

    const sgt_test_cases = [_]ComparisonTestCase{
        // Inverse of SLT cases
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000002", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe", .expected = "0000000000000000000000000000000000000000000000000000000000000001" }, // -1 > -2 is true
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000001" }, // 1 > -1 is true
        .{ .x = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "8000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000001" }, // max_pos > min_neg is true
    };

    try run_comparison_test(allocator, &sgt_test_cases, 0x13, "SGT");
}

test "Geth-style EQ (Equality) comprehensive tests" {
    const allocator = testing.allocator;

    const eq_test_cases = [_]ComparisonTestCase{
        // Basic equality
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000000", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        
        // Large number equality
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        
        // Edge case differences
        .{ .x = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "8000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000005", .y = "0000000000000000000000000000000000000000000000000000000000000005", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
    };

    try run_comparison_test(allocator, &eq_test_cases, 0x14, "EQ");
}

test "Geth-style ISZERO comprehensive tests" {
    const allocator = testing.allocator;

    // ISZERO is a unary operation
    const iszero_cases = [_]struct {
        value: []const u8,
        expected: []const u8,
    }{
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .value = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .value = "8000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
    };

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

    for (iszero_cases, 0..) |test_case, i| {
        const value = try std.fmt.parseInt(u256, test_case.value, 16);
        const expected = try std.fmt.parseInt(u256, test_case.expected, 16);

        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{value});

        _ = try helpers.executeOpcode(0x15, test_vm.vm, test_frame.frame); // ISZERO

        const actual = try test_frame.frame.stack.peek(0);
        if (actual != expected) {
            std.debug.print("ISZERO test case {} failed: ISZERO(0x{s}) expected 0x{x}, got 0x{x}\n", .{ i, test_case.value, expected, actual });
            return error.UnexpectedResult;
        }
    }
}

test "Geth-style AND/OR/XOR bitwise operations comprehensive tests" {
    const allocator = testing.allocator;

    // Test cases for bitwise operations
    const bitwise_cases = [_]struct {
        x: []const u8,
        y: []const u8,
        and_expected: []const u8,
        or_expected: []const u8,
        xor_expected: []const u8,
    }{
        .{
            .x = "0000000000000000000000000000000000000000000000000000000000000000",
            .y = "0000000000000000000000000000000000000000000000000000000000000000",
            .and_expected = "0000000000000000000000000000000000000000000000000000000000000000",
            .or_expected = "0000000000000000000000000000000000000000000000000000000000000000",
            .xor_expected = "0000000000000000000000000000000000000000000000000000000000000000",
        },
        .{
            .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            .y = "0000000000000000000000000000000000000000000000000000000000000000",
            .and_expected = "0000000000000000000000000000000000000000000000000000000000000000",
            .or_expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            .xor_expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        },
        .{
            .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            .y = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            .and_expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            .or_expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            .xor_expected = "0000000000000000000000000000000000000000000000000000000000000000",
        },
        .{
            .x = "5555555555555555555555555555555555555555555555555555555555555555",
            .y = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            .and_expected = "0000000000000000000000000000000000000000000000000000000000000000",
            .or_expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            .xor_expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        },
        .{
            .x = "f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0",
            .y = "0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f",
            .and_expected = "0000000000000000000000000000000000000000000000000000000000000000",
            .or_expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            .xor_expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        },
    };

    // Test AND operation
    const and_test_cases = blk: {
        var cases: [bitwise_cases.len]ComparisonTestCase = undefined;
        for (bitwise_cases, 0..) |case, i| {
            cases[i] = .{ .x = case.x, .y = case.y, .expected = case.and_expected };
        }
        break :blk cases;
    };
    try run_comparison_test(allocator, &and_test_cases, 0x16, "AND");

    // Test OR operation
    const or_test_cases = blk: {
        var cases: [bitwise_cases.len]ComparisonTestCase = undefined;
        for (bitwise_cases, 0..) |case, i| {
            cases[i] = .{ .x = case.x, .y = case.y, .expected = case.or_expected };
        }
        break :blk cases;
    };
    try run_comparison_test(allocator, &or_test_cases, 0x17, "OR");

    // Test XOR operation
    const xor_test_cases = blk: {
        var cases: [bitwise_cases.len]ComparisonTestCase = undefined;
        for (bitwise_cases, 0..) |case, i| {
            cases[i] = .{ .x = case.x, .y = case.y, .expected = case.xor_expected };
        }
        break :blk cases;
    };
    try run_comparison_test(allocator, &xor_test_cases, 0x18, "XOR");
}

test "Geth-style NOT operation comprehensive tests" {
    const allocator = testing.allocator;

    // NOT is a unary operation
    const not_cases = [_]struct {
        value: []const u8,
        expected: []const u8,
    }{
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .value = "5555555555555555555555555555555555555555555555555555555555555555", .expected = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
        .{ .value = "f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0", .expected = "0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f" },
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe" },
    };

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

    for (not_cases, 0..) |test_case, i| {
        const value = try std.fmt.parseInt(u256, test_case.value, 16);
        const expected = try std.fmt.parseInt(u256, test_case.expected, 16);

        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{value});

        _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame); // NOT

        const actual = try test_frame.frame.stack.peek(0);
        if (actual != expected) {
            std.debug.print("NOT test case {} failed: NOT(0x{s}) expected 0x{x}, got 0x{x}\n", .{ i, test_case.value, expected, actual });
            return error.UnexpectedResult;
        }

        test_frame.clearStack();
    }
}

/// Test BYTE operation (extract byte from word)
test "Geth-style BYTE operation comprehensive tests" {
    const allocator = testing.allocator;

    // Test cases directly from geth's TestByteOp
    const byte_test_cases = [_]ComparisonTestCase{
        .{ .x = "ABCDEF0908070605040302010000000000000000000000000000000000000000", .y = "00", .expected = "00000000000000000000000000000000000000000000000000000000000000AB" },
        .{ .x = "ABCDEF0908070605040302010000000000000000000000000000000000000000", .y = "01", .expected = "00000000000000000000000000000000000000000000000000000000000000CD" },
        .{ .x = "00CDEF090807060504030201ffffffffffffffffffffffffffffffffffffffff", .y = "00", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "00CDEF090807060504030201ffffffffffffffffffffffffffffffffffffffff", .y = "01", .expected = "00000000000000000000000000000000000000000000000000000000000000CD" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000102030", .y = "1F", .expected = "0000000000000000000000000000000000000000000000000000000000000030" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000102030", .y = "1E", .expected = "0000000000000000000000000000000000000000000000000000000000000020" },
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "20", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "FFFFFFFFFFFFFFFF", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
    };

    try run_comparison_test(allocator, &byte_test_cases, 0x1A, "BYTE");
}