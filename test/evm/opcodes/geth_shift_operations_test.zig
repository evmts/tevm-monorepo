const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes through evm module
const evm = @import("evm");

/// Test case structure for shift operations (matching geth's pattern)
const ShiftTestCase = struct {
    value: []const u8, // The value to shift (first operand on stack)
    shift: []const u8, // The shift amount (second operand on stack)  
    expected: []const u8,
};

/// Helper function to run shift operation tests
fn run_shift_test(
    allocator: std.mem.Allocator,
    test_cases: []const ShiftTestCase,
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
        const value = try std.fmt.parseInt(u256, test_case.value, 16);
        const shift = try std.fmt.parseInt(u256, test_case.shift, 16);
        const expected = try std.fmt.parseInt(u256, test_case.expected, 16);

        // Clear stack from previous test
        test_frame.clearStack();

        // Push operands: shift amount first, then value (LIFO stack)
        try test_frame.pushStack(&[_]u256{ value, shift });

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
            std.debug.print("Test case {} {s}(0x{s}, 0x{s}): expected 0x{x}, got 0x{x}\n", .{ i, operation_name, test_case.value, test_case.shift, expected, actual });
            return error.UnexpectedResult;
        }
    }
}

test "Geth-style SHL (Shift Left) comprehensive tests" {
    const allocator = testing.allocator;

    // Test cases directly from geth's EIP-145 tests
    const shl_test_cases = [_]ShiftTestCase{
        // Basic shift left tests
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000001", .shift = "01", .expected = "0000000000000000000000000000000000000000000000000000000000000002" },
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000001", .shift = "ff", .expected = "8000000000000000000000000000000000000000000000000000000000000000" },
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000001", .shift = "0100", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000001", .shift = "0101", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        
        // Edge cases with all 1s
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "00", .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "01", .expected = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe" },
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "ff", .expected = "8000000000000000000000000000000000000000000000000000000000000000" },
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "0100", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        
        // Zero shift
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000000", .shift = "01", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        
        // Large value edge case
        .{ .value = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "01", .expected = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe" },
    };

    try run_shift_test(allocator, &shl_test_cases, 0x1B, "SHL");
}

test "Geth-style SHR (Logical Shift Right) comprehensive tests" {
    const allocator = testing.allocator;

    // Test cases for logical right shift
    const shr_test_cases = [_]ShiftTestCase{
        // Basic shift right tests
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000001", .shift = "00", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000001", .shift = "01", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .value = "8000000000000000000000000000000000000000000000000000000000000000", .shift = "01", .expected = "4000000000000000000000000000000000000000000000000000000000000000" },
        .{ .value = "8000000000000000000000000000000000000000000000000000000000000000", .shift = "ff", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .value = "8000000000000000000000000000000000000000000000000000000000000000", .shift = "0100", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .value = "8000000000000000000000000000000000000000000000000000000000000000", .shift = "0101", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        
        // Edge cases with all 1s
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "00", .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "01", .expected = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "ff", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "0100", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        
        // Zero value
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000000", .shift = "01", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
    };

    try run_shift_test(allocator, &shr_test_cases, 0x1C, "SHR");
}

test "Geth-style SAR (Arithmetic Shift Right) comprehensive tests" {
    const allocator = testing.allocator;

    // Test cases for arithmetic right shift (sign-extending)
    const sar_test_cases = [_]ShiftTestCase{
        // Positive numbers (no sign extension)
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000001", .shift = "00", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000001", .shift = "01", .expected = "0000000000000000000000000000000000000000000000000000000000000000" },
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000002", .shift = "01", .expected = "0000000000000000000000000000000000000000000000000000000000000001" },
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000004", .shift = "01", .expected = "0000000000000000000000000000000000000000000000000000000000000002" },
        .{ .value = "0000000000000000000000000000000000000000000000000000000000000008", .shift = "01", .expected = "0000000000000000000000000000000000000000000000000000000000000004" },
        
        // Negative numbers (sign extension with 1s)
        .{ .value = "8000000000000000000000000000000000000000000000000000000000000000", .shift = "01", .expected = "c000000000000000000000000000000000000000000000000000000000000000" },
        .{ .value = "8000000000000000000000000000000000000000000000000000000000000000", .shift = "ff", .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        .{ .value = "8000000000000000000000000000000000000000000000000000000000000000", .shift = "0100", .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        .{ .value = "8000000000000000000000000000000000000000000000000000000000000000", .shift = "0101", .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        
        // All 1s (negative)
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "00", .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "01", .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "ff", .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        .{ .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "0100", .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        
        // Boundary cases
        .{ .value = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "01", .expected = "3fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" },
        .{ .value = "4000000000000000000000000000000000000000000000000000000000000000", .shift = "01", .expected = "2000000000000000000000000000000000000000000000000000000000000000" },
    };

    try run_shift_test(allocator, &sar_test_cases, 0x1D, "SAR");
}

/// Test shift operations with extreme values and edge cases
test "Geth-style shift operations extreme edge cases" {
    const allocator = testing.allocator;

    // Test very large shift amounts (should result in zero or all 1s for SAR)
    const extreme_cases = [_]struct {
        opcode: u8,
        name: []const u8,
        value: []const u8,
        shift: []const u8,
        expected: []const u8,
        description: []const u8,
    }{
        // SHL with large shifts
        .{ .opcode = 0x1B, .name = "SHL", .value = "0000000000000000000000000000000000000000000000000000000000000001", .shift = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000000", .description = "SHL with maximum shift" },
        .{ .opcode = 0x1B, .name = "SHL", .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000000", .description = "SHL all 1s with maximum shift" },
        
        // SHR with large shifts
        .{ .opcode = 0x1C, .name = "SHR", .value = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000000", .description = "SHR with maximum shift" },
        .{ .opcode = 0x1C, .name = "SHR", .value = "8000000000000000000000000000000000000000000000000000000000000000", .shift = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000000", .description = "SHR negative number with maximum shift" },
        
        // SAR with large shifts (should preserve sign)
        .{ .opcode = 0x1D, .name = "SAR", .value = "8000000000000000000000000000000000000000000000000000000000000000", .shift = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .description = "SAR negative number with maximum shift" },
        .{ .opcode = 0x1D, .name = "SAR", .value = "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .shift = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", .expected = "0000000000000000000000000000000000000000000000000000000000000000", .description = "SAR positive number with maximum shift" },
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

    for (extreme_cases, 0..) |test_case, i| {
        const value = try std.fmt.parseInt(u256, test_case.value, 16);
        const shift = try std.fmt.parseInt(u256, test_case.shift, 16);
        const expected = try std.fmt.parseInt(u256, test_case.expected, 16);

        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{ value, shift });

        _ = try helpers.executeOpcode(test_case.opcode, test_vm.vm, test_frame.frame);

        const actual = try test_frame.frame.stack.peek(0);
        if (actual != expected) {
            std.debug.print("Extreme case {} failed: {s}\n", .{ i, test_case.description });
            std.debug.print("Expected: 0x{x}, Got: 0x{x}\n", .{ expected, actual });
            return error.UnexpectedResult;
        }

        test_frame.clearStack();
        std.debug.print("Extreme case {} passed: {s}\n", .{ i, test_case.description });
    }
}

/// Test power-of-2 patterns that are common in real usage
test "Geth-style shift operations power-of-2 patterns" {
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

    // Test powers of 2 with various shift amounts
    const base_values = [_]u256{ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 };
    const shift_amounts = [_]u8{ 1, 2, 3, 4, 5, 8, 16 };

    for (base_values) |base| {
        for (shift_amounts) |shift| {
            if (shift < 250) { // Avoid overflow in our calculations
                // Test SHL
                test_frame.clearStack();
                try test_frame.pushStack(&[_]u256{ base, shift });
                _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame); // SHL
                
                const shl_result = try test_frame.frame.stack.pop();
                const expected_shl = base << shift;
                
                if (shl_result != expected_shl) {
                    std.debug.print("SHL power-of-2 test failed: {} << {} = {}, expected {}\n", .{ base, shift, shl_result, expected_shl });
                    return error.PowerOf2SHLFailed;
                }

                // Test SHR with a larger base to avoid underflow
                if (base >= (1 << shift)) {
                    test_frame.clearStack();
                    const large_base = base << 8; // Make it larger
                    try test_frame.pushStack(&[_]u256{ large_base, shift });
                    _ = try helpers.executeOpcode(0x1C, test_vm.vm, test_frame.frame); // SHR
                    
                    const shr_result = try test_frame.frame.stack.pop();
                    const expected_shr = large_base >> shift;
                    
                    if (shr_result != expected_shr) {
                        std.debug.print("SHR power-of-2 test failed: {} >> {} = {}, expected {}\n", .{ large_base, shift, shr_result, expected_shr });
                        return error.PowerOf2SHRFailed;
                    }
                }
            }
        }
    }
}