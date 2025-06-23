const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const test_helpers = @import("opcodes/test_helpers.zig");
const Address = @import("Address");

// Test addresses - use small simple values
const DEPLOYER_ADDRESS = Address.from_u256(0x1111);
const USER_ADDRESS = Address.from_u256(0x2222);
const CONTRACT_ADDRESS = Address.from_u256(0x3333);

// Test revert conditions and error messages
test "E2E: Revert conditions - require and revert opcodes" {
    var gpa = std.heap.GeneralPurposeAllocator(.{ .safety = true }){};
    defer {
        const leaked = gpa.deinit();
        if (leaked == .leak) {
            std.log.err("Memory leak detected in test", .{});
        }
    }
    const allocator = gpa.allocator();
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Test REVERT opcode directly
    const revert_bytecode = [_]u8{
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x00, // PUSH1 0 (size)
        0xFD,       // REVERT
    };
    
    const revert_result = test_helpers.runBytecode(
        test_vm.vm,
        &revert_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (revert_result.output) |output| allocator.free(output);
    
    try testing.expect(revert_result.status == .Revert);
    
    // Test conditional revert - should succeed if condition is false
    const conditional_bytecode = [_]u8{
        0x60, 0x00, // PUSH1 0 (false condition)
        0x60, 0x10, // PUSH1 16 (jump target if condition is true)
        0x57,       // JUMPI (conditional jump)
        // Success path
        0x60, 0x2A, // PUSH1 42
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0
        0x60, 0x20, // PUSH1 32
        0xF3,       // RETURN
        // Revert path (offset 16)
        0x5B,       // JUMPDEST
        0x60, 0x00, // PUSH1 0
        0x60, 0x00, // PUSH1 0
        0xFD,       // REVERT
    };
    
    const conditional_result = test_helpers.runBytecode(
        test_vm.vm,
        &conditional_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (conditional_result.output) |output| allocator.free(output);
    
    try testing.expect(conditional_result.status == .Success);
    if (conditional_result.output) |output| {
        const value = test_helpers.bytesToU256(output);
        try testing.expectEqual(@as(u256, 42), value);
    }
}

// Test arithmetic overflow and underflow scenarios
test "E2E: Arithmetic overflow - EVM wraparound behavior" {
    var gpa = std.heap.GeneralPurposeAllocator(.{ .safety = true }){};
    defer {
        const leaked = gpa.deinit();
        if (leaked == .leak) {
            std.log.err("Memory leak detected in test", .{});
        }
    }
    const allocator = gpa.allocator();
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Test MAX_UINT256 + 1 = 0 (wraparound)
    const overflow_test_bytecode = [_]u8{
        // Push MAX_UINT256 (all 0xFF bytes)
        0x7F, // PUSH32 (followed by 32 bytes)
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0x60, 0x01, // PUSH1 1
        0x01,       // ADD (should wrap to 0)
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x20, // PUSH1 32 (size)
        0xF3,       // RETURN
    };
    
    const overflow_result = test_helpers.runBytecode(
        test_vm.vm,
        &overflow_test_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (overflow_result.output) |output| allocator.free(output);
    
    try testing.expect(overflow_result.status == .Success);
    if (overflow_result.output) |output| {
        try testing.expectEqual(@as(usize, 32), output.len);
        // Should return 0 (MAX_UINT256 + 1 wraps to 0)
        const result_value = test_helpers.bytesToU256(output);
        try testing.expectEqual(@as(u256, 0), result_value);
    }
    
    // Test underflow: 0 - 1 = MAX_UINT256
    const underflow_test_bytecode = [_]u8{
        0x60, 0x00, // PUSH1 0
        0x60, 0x01, // PUSH1 1
        0x03,       // SUB (0 - 1, should wrap to MAX_UINT256)
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x20, // PUSH1 32 (size)
        0xF3,       // RETURN
    };
    
    const underflow_result = test_helpers.runBytecode(
        test_vm.vm,
        &underflow_test_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (underflow_result.output) |output| allocator.free(output);
    
    try testing.expect(underflow_result.status == .Success);
    if (underflow_result.output) |output| {
        const result_value = test_helpers.bytesToU256(output);
        try testing.expectEqual(std.math.maxInt(u256), result_value);
    }
}

// Test gas consumption and out-of-gas scenarios
test "E2E: Gas limits - controlled consumption and out-of-gas" {
    var gpa = std.heap.GeneralPurposeAllocator(.{ .safety = true }){};
    defer {
        const leaked = gpa.deinit();
        if (leaked == .leak) {
            std.log.err("Memory leak detected in test", .{});
        }
    }
    const allocator = gpa.allocator();
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Simple gas consumption test - just do some operations
    const gas_test_bytecode = [_]u8{
        // Do a series of operations to consume gas
        0x60, 0x01, // PUSH1 1
        0x60, 0x02, // PUSH1 2
        0x01,       // ADD
        0x60, 0x03, // PUSH1 3
        0x02,       // MUL
        0x60, 0x04, // PUSH1 4
        0x01,       // ADD
        0x60, 0x02, // PUSH1 2
        0x04,       // DIV
        
        // Store result in memory and return
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x20, // PUSH1 32 (size)
        0xF3,       // RETURN
    };
    
    // Test with sufficient gas
    const sufficient_result = test_helpers.runBytecode(
        test_vm.vm,
        &gas_test_bytecode,
        CONTRACT_ADDRESS,
        10_000,
        null,
    ) catch unreachable;
    defer if (sufficient_result.output) |output| allocator.free(output);
    
    try testing.expect(sufficient_result.status == .Success);
    try testing.expect(sufficient_result.gas_used > 0);
    
    if (sufficient_result.output) |output| {
        const result_value = test_helpers.bytesToU256(output);
        // Result should be: ((1 + 2) * 3 + 4) / 2 = (9 + 4) / 2 = 13 / 2 = 6
        try testing.expectEqual(@as(u256, 6), result_value);
    }
    
    // Test with insufficient gas
    const insufficient_result = test_helpers.runBytecode(
        test_vm.vm,
        &gas_test_bytecode,
        CONTRACT_ADDRESS,
        10, // Very low gas limit
        null,
    ) catch unreachable;
    defer if (insufficient_result.output) |output| allocator.free(output);
    
    std.debug.print("Insufficient gas test status: {}, gas used: {}\n", .{ insufficient_result.status, insufficient_result.gas_used });
    try testing.expect(insufficient_result.status == .OutOfGas);
}

// Test stack operations and underflow conditions
test "E2E: Stack underflow - empty stack operations" {
    var gpa = std.heap.GeneralPurposeAllocator(.{ .safety = true }){};
    defer {
        const leaked = gpa.deinit();
        if (leaked == .leak) {
            std.log.err("Memory leak detected in test", .{});
        }
    }
    const allocator = gpa.allocator();
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Test stack underflow - POP from empty stack
    const underflow_bytecode = [_]u8{
        0x50, // POP (from empty stack - should fail)
    };
    
    const underflow_result = test_helpers.runBytecode(
        test_vm.vm,
        &underflow_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (underflow_result.output) |output| allocator.free(output);
    
    try testing.expect(underflow_result.status == .Invalid);
    
    // Test arithmetic with insufficient stack items
    const insufficient_stack_bytecode = [_]u8{
        0x60, 0x05, // PUSH1 5 (only one item on stack)
        0x01,       // ADD (needs two items - should fail)
    };
    
    const insufficient_result = test_helpers.runBytecode(
        test_vm.vm,
        &insufficient_stack_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (insufficient_result.output) |output| allocator.free(output);
    
    try testing.expect(insufficient_result.status == .Invalid);
}

// Test division by zero and modulo by zero
test "E2E: Division by zero - EVM behavior" {
    var gpa = std.heap.GeneralPurposeAllocator(.{ .safety = true }){};
    defer {
        const leaked = gpa.deinit();
        if (leaked == .leak) {
            std.log.err("Memory leak detected in test", .{});
        }
    }
    const allocator = gpa.allocator();
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Test division by zero (EVM returns 0)
    const div_zero_bytecode = [_]u8{
        0x60, 0x05, // PUSH1 5
        0x60, 0x00, // PUSH1 0
        0x04,       // DIV (5 / 0)
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x20, // PUSH1 32 (size)
        0xF3,       // RETURN
    };
    
    const div_zero_result = test_helpers.runBytecode(
        test_vm.vm,
        &div_zero_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (div_zero_result.output) |output| allocator.free(output);
    
    try testing.expect(div_zero_result.status == .Success);
    if (div_zero_result.output) |output| {
        const result_value = test_helpers.bytesToU256(output);
        try testing.expectEqual(@as(u256, 0), result_value); // Division by zero returns 0
    }
    
    // Test modulo by zero (EVM returns 0)
    const mod_zero_bytecode = [_]u8{
        0x60, 0x05, // PUSH1 5
        0x60, 0x00, // PUSH1 0
        0x06,       // MOD (5 % 0)
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x20, // PUSH1 32 (size)
        0xF3,       // RETURN
    };
    
    const mod_zero_result = test_helpers.runBytecode(
        test_vm.vm,
        &mod_zero_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (mod_zero_result.output) |output| allocator.free(output);
    
    try testing.expect(mod_zero_result.status == .Success);
    if (mod_zero_result.output) |output| {
        const result_value = test_helpers.bytesToU256(output);
        try testing.expectEqual(@as(u256, 0), result_value); // Modulo by zero returns 0
    }
}

// Test memory expansion and large memory access
test "E2E: Memory expansion - large offset testing" {
    var gpa = std.heap.GeneralPurposeAllocator(.{ .safety = true }){};
    defer {
        const leaked = gpa.deinit();
        if (leaked == .leak) {
            std.log.err("Memory leak detected in test", .{});
        }
    }
    const allocator = gpa.allocator();
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Test memory expansion with reasonable large offset
    const memory_expansion_bytecode = [_]u8{
        // Store data at memory offset 1024
        0x60, 0x42,       // PUSH1 0x42 (value)
        0x61, 0x04, 0x00, // PUSH2 0x0400 (offset = 1024)
        0x52,             // MSTORE
        
        // Load data back from the same offset
        0x61, 0x04, 0x00, // PUSH2 0x0400 (offset = 1024)
        0x51,             // MLOAD
        
        // Return the loaded value
        0x60, 0x00, // PUSH1 0 (memory offset for return)
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x20, // PUSH1 32 (size)
        0xF3,       // RETURN
    };
    
    const expansion_result = test_helpers.runBytecode(
        test_vm.vm,
        &memory_expansion_bytecode,
        CONTRACT_ADDRESS,
        200_000, // More gas for memory expansion
        null,
    ) catch unreachable;
    defer if (expansion_result.output) |output| allocator.free(output);
    
    try testing.expect(expansion_result.status == .Success);
    if (expansion_result.output) |output| {
        const result_value = test_helpers.bytesToU256(output);
        try testing.expectEqual(@as(u256, 0x42), result_value);
    }
    
    // Verify memory expansion consumed extra gas
    std.debug.print("Memory expansion gas used: {}\n", .{expansion_result.gas_used});
    try testing.expect(expansion_result.gas_used > 100); // Should use some gas for expansion
}

// Test invalid jump destinations
test "E2E: Invalid jumps - bad jump destinations" {
    var gpa = std.heap.GeneralPurposeAllocator(.{ .safety = true }){};
    defer {
        const leaked = gpa.deinit();
        if (leaked == .leak) {
            std.log.err("Memory leak detected in test", .{});
        }
    }
    const allocator = gpa.allocator();
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Test jump to invalid destination (not JUMPDEST)
    const invalid_jump_bytecode = [_]u8{
        0x60, 0x05, // PUSH1 5 (invalid jump target)
        0x56,       // JUMP (should fail - destination 5 is not JUMPDEST)
        0x60, 0x42, // PUSH1 42 (never reached)
        0x00,       // STOP
    };
    
    const invalid_jump_result = test_helpers.runBytecode(
        test_vm.vm,
        &invalid_jump_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (invalid_jump_result.output) |output| allocator.free(output);
    
    try testing.expect(invalid_jump_result.status == .Invalid);
    
    // Test valid jump to JUMPDEST
    const valid_jump_bytecode = [_]u8{
        0x60, 0x04, // PUSH1 4 (valid jump target - JUMPDEST at position 4)
        0x56,       // JUMP
        0x00,       // STOP (skipped)
        0x5B,       // JUMPDEST (destination 4)
        0x60, 0x42, // PUSH1 42
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0
        0x60, 0x20, // PUSH1 32
        0xF3,       // RETURN
    };
    
    const valid_jump_result = test_helpers.runBytecode(
        test_vm.vm,
        &valid_jump_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (valid_jump_result.output) |output| allocator.free(output);
    
    try testing.expect(valid_jump_result.status == .Success);
    if (valid_jump_result.output) |output| {
        const result_value = test_helpers.bytesToU256(output);
        try testing.expectEqual(@as(u256, 0x42), result_value); // 0x42 = 66 in decimal
    }
}