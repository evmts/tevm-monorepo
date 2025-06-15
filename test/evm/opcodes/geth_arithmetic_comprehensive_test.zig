const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes through evm module
const evm = @import("evm");
const arithmetic = evm.opcodes.arithmetic;

/// Test case structure matching geth's TwoOperandTestcase
const TwoOperandTestCase = struct {
    x: []const u8,
    y: []const u8,
    expected: []const u8,
};

/// Common edge case parameters used across multiple operations
/// These match geth's commonParams exactly
const common_edge_cases = [_][]const u8{
    "0000000000000000000000000000000000000000000000000000000000000000", // 0
    "0000000000000000000000000000000000000000000000000000000000000001", // +1
    "0000000000000000000000000000000000000000000000000000000000000005", // +5
    "7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe", // + max -1
    "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", // + max
    "8000000000000000000000000000000000000000000000000000000000000000", // - max
    "8000000000000000000000000000000000000000000000000000000000000001", // - max+1
    "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb", // - 5
    "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", // - 1
};

/// Helper function to run two-operand tests (matches geth's testTwoOperandOp pattern)
fn run_two_operand_test(
    allocator: std.mem.Allocator,
    test_cases: []const TwoOperandTestCase,
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
        const x_bytes = try std.fmt.parseInt(u256, test_case.x, 16);
        const y_bytes = try std.fmt.parseInt(u256, test_case.y, 16);
        const expected = try std.fmt.parseInt(u256, test_case.expected, 16);

        // Clear stack from previous test
        test_frame.clearStack();

        // Push operands (note: stack is LIFO, so push in reverse order)
        try test_frame.pushStack(&[_]u256{ y_bytes, x_bytes });

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
            std.debug.print("Test case {} {s}(0x{x}, 0x{x}): expected 0x{x}, got 0x{x}\n", .{ i, operation_name, x_bytes, y_bytes, expected, actual });
            return error.UnexpectedResult;
        }
    }
}

test "Geth-style ADD comprehensive edge cases" {
    const allocator = testing.allocator;

    // Test cases directly from geth's testcases_add.json
    const add_test_cases = [_]TwoOperandTestCase{
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000000", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000000", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000002" },
        .{ .x = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "8000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe" },
    };

    try run_two_operand_test(allocator, &add_test_cases, 0x01, "ADD");
}

test "Geth-style SUB comprehensive edge cases" {
    const allocator = testing.allocator;

    // Test cases based on geth's patterns for subtraction
    const sub_test_cases = [_]TwoOperandTestCase{
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000000", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000000", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        .{ .x = "8000000000000000000000000000000000000000000000000000000000000000", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
    };

    try run_two_operand_test(allocator, &sub_test_cases, 0x03, "SUB");
}

test "Geth-style MUL comprehensive edge cases" {
    const allocator = testing.allocator;

    const mul_test_cases = [_]TwoOperandTestCase{
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000000", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000000", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000002", .y = "0000000000000000000000000000000000000000000000000000000000000003", .expected = "0000000000000000000000000000000000000000000000000000000000000006" },
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "0000000000000000000000000000000000000000000000000000000000000002", .expected = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe" },
    };

    try run_two_operand_test(allocator, &mul_test_cases, 0x02, "MUL");
}

test "Geth-style DIV comprehensive edge cases" {
    const allocator = testing.allocator;

    const div_test_cases = [_]TwoOperandTestCase{
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000000", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000006", .y = "0000000000000000000000000000000000000000000000000000000000000002", .expected = "0000000000000000000000000000000000000000000000000000000000000003" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000007", .y = "0000000000000000000000000000000000000000000000000000000000000003", .expected = "0000000000000000000000000000000000000000000000000000000000000002" },
        // Division by zero should return zero
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
    };

    try run_two_operand_test(allocator, &div_test_cases, 0x04, "DIV");
}

test "Geth-style MOD comprehensive edge cases" {
    const allocator = testing.allocator;

    const mod_test_cases = [_]TwoOperandTestCase{
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000000", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000001", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000007", .y = "0000000000000000000000000000000000000000000000000000000000000003", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .x = "000000000000000000000000000000000000000000000000000000000000000a", .y = "0000000000000000000000000000000000000000000000000000000000000003", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        // Modulo by zero should return zero
        .{ .x = "0000000000000000000000000000000000000000000000000000000000000001", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .x = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .y = "0000000000000000000000000000000000000000000000000000000000000000", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
    };

    try run_two_operand_test(allocator, &mod_test_cases, 0x06, "MOD");
}

/// Generate comprehensive test cases using all edge case combinations
/// This matches geth's approach of testing all commonParams combinations
test "Geth-style comprehensive edge case matrix for ADD" {
    const allocator = testing.allocator;

    // Generate test cases for each combination of edge cases
    var test_cases = std.ArrayList(TwoOperandTestCase).init(allocator);
    defer test_cases.deinit();

    // For demonstration, test a subset of combinations (full matrix would be 9x9=81 cases)
    const critical_combinations = [_][2]usize{
        .{ 0, 0 }, // 0 + 0
        .{ 0, 1 }, // 0 + 1
        .{ 1, 1 }, // 1 + 1
        .{ 3, 1 }, // max-1 + 1 (overflow to max)
        .{ 4, 1 }, // max + 1 (overflow to -max)
        .{ 8, 1 }, // -1 + 1 (should equal 0)
    };

    for (critical_combinations) |combo| {
        const x_str = common_edge_cases[combo[0]];
        const y_str = common_edge_cases[combo[1]];
        
        // Calculate expected result (basic addition with wraparound)
        const x_val = try std.fmt.parseInt(u256, x_str, 16);
        const y_val = try std.fmt.parseInt(u256, y_str, 16);
        const expected_val = x_val +% y_val; // Wraparound addition
        
        var expected_str: [64]u8 = undefined;
        _ = try std.fmt.bufPrint(&expected_str, "{x:0>64}", .{expected_val});

        try test_cases.append(.{
            .x = x_str,
            .y = y_str,
            .expected = &expected_str,
        });
    }

    try run_two_operand_test(allocator, test_cases.items, 0x01, "ADD");
}