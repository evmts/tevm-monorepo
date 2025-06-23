const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const test_helpers = @import("opcodes/test_helpers.zig");
const Address = @import("Address");

// Test allocator will be created per test to avoid conflicts

// Test addresses - use small simple values
const DEPLOYER_ADDRESS = Address.from_u256(0x1111);
const USER_ADDRESS = Address.from_u256(0x2222);
const CONTRACT_ADDRESS = Address.from_u256(0x3333);

// Simple test to verify EVM functionality
test "E2E: Basic EVM operations" {
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
    
    // Set up deployer account with ETH
    try test_vm.vm.state.set_balance(DEPLOYER_ADDRESS, 1000000);
    
    // Test simple bytecode: PUSH1 42 PUSH1 0 MSTORE PUSH1 0 PUSH1 32 RETURN
    const simple_bytecode = [_]u8{
        0x60, 0x2A, // PUSH1 42
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x20, // PUSH1 32 (size)
        0xF3,       // RETURN
    };
    
    const result = test_helpers.runBytecode(
        test_vm.vm,
        &simple_bytecode,
        CONTRACT_ADDRESS,
        100_000, // Gas limit
        null,
    ) catch |err| {
        std.debug.print("Simple bytecode execution failed: {}\n", .{err});
        return err;
    };
    defer if (result.output) |output| allocator.free(output);
    
    // Verify execution success
    try testing.expect(result.status == .Success);
    
    // Check if we have output data
    if (result.output) |output| {
        try testing.expectEqual(@as(usize, 32), output.len);
        
        // Decode returned value (should be 42 in first 32 bytes)
        const returned_value = test_helpers.bytesToU256(output);
        try testing.expectEqual(@as(u256, 42), returned_value);
    } else {
        // If no output, this test isn't validating return data correctly
        std.debug.print("No output returned from bytecode execution\n", .{});
        return error.TestFailed;
    }
}

// Test arithmetic operations
test "E2E: Arithmetic operations" {
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
    
    var test_contract = test_helpers.createTestContract(
        allocator,
        CONTRACT_ADDRESS,
        DEPLOYER_ADDRESS,
        0,
        &[_]u8{},
    ) catch unreachable;
    defer test_contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &test_contract, 100_000);
    defer test_frame.deinit();
    
    // Test ADD operation: 25 + 17 = 42
    try test_frame.pushStack(&[_]u256{25, 17});
    
    const add_result = test_helpers.executeOpcode(0x01, test_vm.vm, test_frame.frame) catch |err| {
        std.debug.print("ADD operation failed: {}\n", .{err});
        return err;
    };
    
    try testing.expect(add_result.output.len == 0); // Continue means empty output
    
    const sum = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 42), sum);
    
    // Test SUB operation: 100 - 58 = 42
    try test_frame.pushStack(&[_]u256{100, 58});
    
    const sub_result = test_helpers.executeOpcode(0x03, test_vm.vm, test_frame.frame) catch unreachable; // SUB
    try testing.expect(sub_result.output.len == 0);
    
    const diff = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 42), diff);
    
    // Test MUL operation: 6 * 7 = 42
    try test_frame.pushStack(&[_]u256{6, 7});
    
    const mul_result = test_helpers.executeOpcode(0x02, test_vm.vm, test_frame.frame) catch unreachable; // MUL
    try testing.expect(mul_result.output.len == 0);
    
    const product = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 42), product);
}

// Test memory operations
test "E2E: Memory operations" {
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
    
    var test_contract = test_helpers.createTestContract(
        allocator,
        CONTRACT_ADDRESS,
        DEPLOYER_ADDRESS,
        0,
        &[_]u8{},
    ) catch unreachable;
    defer test_contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &test_contract, 100_000);
    defer test_frame.deinit();
    
    // Test MSTORE operation
    try test_frame.pushStack(&[_]u256{0xDEADBEEF, 0});
    
    const mstore_result = test_helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame) catch unreachable; // MSTORE
    try testing.expect(mstore_result.output.len == 0);
    
    // Test MLOAD operation
    try test_frame.pushStack(&[_]u256{0});
    
    const mload_result = test_helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame) catch unreachable; // MLOAD
    try testing.expect(mload_result.output.len == 0);
    
    const loaded_value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0xDEADBEEF), loaded_value);
    
    // Test memory expansion
    try test_frame.pushStack(&[_]u256{0xCAFEBABE, 1024});
    
    const expand_result = test_helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame) catch unreachable; // MSTORE at high offset
    try testing.expect(expand_result.output.len == 0);
    
    // Verify the value at high offset
    try test_frame.pushStack(&[_]u256{1024});
    
    _ = test_helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame) catch unreachable; // MLOAD
    const high_value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0xCAFEBABE), high_value);
}

// Test storage operations
test "E2E: Storage operations" {
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
    
    var test_contract = test_helpers.createTestContract(
        allocator,
        CONTRACT_ADDRESS,
        DEPLOYER_ADDRESS,
        0,
        &[_]u8{},
    ) catch unreachable;
    defer test_contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &test_contract, 100_000);
    defer test_frame.deinit();
    
    // Test SSTORE operation
    try test_frame.pushStack(&[_]u256{0x12345678, 5});
    
    const sstore_result = test_helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame) catch unreachable; // SSTORE
    try testing.expect(sstore_result.output.len == 0);
    
    // Test SLOAD operation
    try test_frame.pushStack(&[_]u256{5});
    
    const sload_result = test_helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame) catch unreachable; // SLOAD
    try testing.expect(sload_result.output.len == 0);
    
    const stored_value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0x12345678), stored_value);
}

// Test stack operations
test "E2E: Stack operations" {
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
    
    var test_contract = test_helpers.createTestContract(
        allocator,
        CONTRACT_ADDRESS,
        DEPLOYER_ADDRESS,
        0,
        &[_]u8{},
    ) catch unreachable;
    defer test_contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &test_contract, 100_000);
    defer test_frame.deinit();
    
    // Push some values
    try test_frame.pushStack(&[_]u256{100, 200, 300});
    
    // Test DUP1 (duplicate top element)
    const dup_result = test_helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame) catch unreachable; // DUP1
    try testing.expect(dup_result.output.len == 0);
    
    try testing.expectEqual(@as(usize, 4), test_frame.stackSize());
    
    // Top two elements should be the same
    const top1 = try test_frame.popStack();
    const top2 = try test_frame.popStack();
    try testing.expectEqual(top1, top2);
    try testing.expectEqual(@as(u256, 300), top1);
    
    // Test SWAP1 (swap top two elements)
    try test_frame.pushStack(&[_]u256{400});
    // Stack is now: 100, 200, 400
    
    const swap_result = test_helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame) catch unreachable; // SWAP1
    try testing.expect(swap_result.output.len == 0);
    
    // Stack should now be: 100, 400, 200
    const after_swap1 = try test_frame.popStack();
    const after_swap2 = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 200), after_swap1);
    try testing.expectEqual(@as(u256, 400), after_swap2);
}

// Test gas consumption
test "E2E: Gas consumption patterns" {
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
    
    var test_contract = test_helpers.createTestContract(
        allocator,
        CONTRACT_ADDRESS,
        DEPLOYER_ADDRESS,
        0,
        &[_]u8{},
    ) catch unreachable;
    defer test_contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &test_contract, 100_000);
    defer test_frame.deinit();
    
    const initial_gas = test_frame.gasRemaining();
    
    // Execute a simple operation
    try test_frame.pushStack(&[_]u256{42});
    _ = test_helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame) catch unreachable; // POP
    
    const gas_after_pop = test_frame.gasRemaining();
    const pop_cost = initial_gas - gas_after_pop;
    
    // POP should cost 2 gas
    try testing.expectEqual(@as(u64, 2), pop_cost);
    
    // Test expensive operation (SSTORE)
    try test_frame.pushStack(&[_]u256{100, 0});
    _ = test_helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame) catch unreachable; // SSTORE
    
    const gas_after_sstore = test_frame.gasRemaining();
    const sstore_cost = gas_after_pop - gas_after_sstore;
    
    // SSTORE should cost much more than POP
    try testing.expect(sstore_cost > 1000); // SSTORE costs at least 20,000 gas for new slot
}