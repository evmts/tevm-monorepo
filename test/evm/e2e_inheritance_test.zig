const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const test_helpers = @import("opcodes/test_helpers.zig");
const Address = @import("Address");

// Test addresses - use small simple values
const DEPLOYER_ADDRESS = Address.from_u256(0x1111);
const USER_ADDRESS = Address.from_u256(0x2222);
const CONTRACT_ADDRESS = Address.from_u256(0x3333);

// Test basic inheritance and virtual function calls
test "E2E: Basic inheritance - virtual function overrides" {
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
    
    // Simulate virtual function override behavior
    // Base implementation returns base value, derived multiplies by factor
    const virtual_override_bytecode = [_]u8{
        // Store base value (100) at slot 0
        0x60, 0x64, // PUSH1 100 (base value)
        0x60, 0x00, // PUSH1 0 (storage slot)
        0x55,       // SSTORE
        
        // Store multiplier (3) at slot 1
        0x60, 0x03, // PUSH1 3 (multiplier)
        0x60, 0x01, // PUSH1 1 (storage slot)
        0x55,       // SSTORE
        
        // Simulate derived class behavior: baseValue * multiplier
        0x60, 0x00, // PUSH1 0 (base value slot)
        0x54,       // SLOAD
        0x60, 0x01, // PUSH1 1 (multiplier slot)
        0x54,       // SLOAD
        0x02,       // MUL (base * multiplier)
        
        // Store result and return
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x20, // PUSH1 32 (size)
        0xF3,       // RETURN
    };
    
    const result = test_helpers.runBytecode(
        test_vm.vm,
        &virtual_override_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    if (result.output) |output| {
        const value = test_helpers.bytesToU256(output);
        try testing.expectEqual(@as(u256, 300), value); // 100 * 3
    }
}

// Test interface implementation and polymorphism
test "E2E: Interface compliance - polymorphic behavior" {
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
    
    // Simulate interface compliance - different implementations of same interface
    const interface_test_bytecode = [_]u8{
        // Test setValue(50) and getValue() for ConcreteA (multiplier = 2)
        0x60, 0x32, // PUSH1 50 (value to set)
        0x60, 0x00, // PUSH1 0 (base value slot)
        0x55,       // SSTORE (setValue)
        
        0x60, 0x02, // PUSH1 2 (multiplier for ConcreteA)
        0x60, 0x01, // PUSH1 1 (multiplier slot)
        0x55,       // SSTORE
        
        // Simulate ConcreteA.getValue(): baseValue * multiplier
        0x60, 0x00, // PUSH1 0 (base value slot)
        0x54,       // SLOAD
        0x60, 0x01, // PUSH1 1 (multiplier slot)
        0x54,       // SLOAD
        0x02,       // MUL (getValue for ConcreteA)
        
        // Store ConcreteA result at memory 0
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x52,       // MSTORE
        
        // Test ConcreteB behavior: baseValue + bonus (bonus = baseValue/10)
        0x60, 0x32, // PUSH1 50 (same base value)
        0x60, 0x0A, // PUSH1 10 (divisor for bonus)
        0x04,       // DIV (50/10 = 5, bonus)
        0x60, 0x32, // PUSH1 50 (base value)
        0x01,       // ADD (baseValue + bonus = 55)
        
        // Store ConcreteB result at memory 32
        0x60, 0x20, // PUSH1 32 (memory offset)
        0x52,       // MSTORE
        
        // Return both results (64 bytes)
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x40, // PUSH1 64 (size)
        0xF3,       // RETURN
    };
    
    const result = test_helpers.runBytecode(
        test_vm.vm,
        &interface_test_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    if (result.output) |output| {
        try testing.expectEqual(@as(usize, 64), output.len);
        
        // ConcreteA result: 50 * 2 = 100
        const concrete_a_result = test_helpers.bytesToU256(output[0..32]);
        try testing.expectEqual(@as(u256, 100), concrete_a_result);
        
        // ConcreteB result: 50 + 5 = 55
        const concrete_b_result = test_helpers.bytesToU256(output[32..64]);
        try testing.expectEqual(@as(u256, 55), concrete_b_result);
    }
}

// Test multiple inheritance (diamond pattern)
test "E2E: Multiple inheritance - diamond pattern resolution" {
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
    
    // Simulate diamond inheritance: Diamond inherits from LeftBase and RightBase
    const diamond_test_bytecode = [_]u8{
        // Store left base value (100) and calculate overridden value (100 * 2)
        0x60, 0x64, // PUSH1 100 (left base value)
        0x60, 0x02, // PUSH1 2 (left multiplier)
        0x02,       // MUL (overridden left: 100 * 2 = 200)
        
        // Store right base value (200) and calculate overridden value (200 * 3)
        0x61, 0x00, 0xC8, // PUSH2 200 (right base value)
        0x60, 0x03, // PUSH1 3 (right multiplier)
        0x02,       // MUL (overridden right: 200 * 3 = 600)
        
        // Add both overridden values for combined result
        0x01,       // ADD (200 + 600 = 800)
        
        // Store result and return
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x20, // PUSH1 32 (size)
        0xF3,       // RETURN
    };
    
    const result = test_helpers.runBytecode(
        test_vm.vm,
        &diamond_test_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    if (result.output) |output| {
        const combined_value = test_helpers.bytesToU256(output);
        try testing.expectEqual(@as(u256, 800), combined_value);
    }
}

// Test super calls and parent function access
test "E2E: Super calls - parent function chaining" {
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
    
    // Simulate super call behavior: child calls parent, then adds its own logic
    const super_call_bytecode = [_]u8{
        // Initialize value to 20
        0x60, 0x14, // PUSH1 20 (initial value)
        0x60, 0x00, // PUSH1 0 (storage slot)
        0x55,       // SSTORE
        
        // Simulate parent.process(): value += 10
        0x60, 0x00, // PUSH1 0 (storage slot)
        0x54,       // SLOAD (load current value)
        0x60, 0x0A, // PUSH1 10 (parent increment)
        0x01,       // ADD (value += 10)
        0x80,       // DUP1 (keep result for later)
        0x60, 0x00, // PUSH1 0 (storage slot)
        0x55,       // SSTORE (update value)
        
        // Store parent result for return calculation
        0x81,       // DUP2 (duplicate parent result)
        
        // Simulate child additional logic: value += 5
        0x60, 0x00, // PUSH1 0 (storage slot)
        0x54,       // SLOAD (load current value)
        0x60, 0x05, // PUSH1 5 (child increment)
        0x01,       // ADD (value += 5)
        0x60, 0x00, // PUSH1 0 (storage slot)
        0x55,       // SSTORE (update value)
        
        // Calculate return value: parentResult + currentValue
        0x60, 0x00, // PUSH1 0 (storage slot)
        0x54,       // SLOAD (load final value)
        0x01,       // ADD (parentResult + finalValue)
        
        // Store result and return
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x20, // PUSH1 32 (size)
        0xF3,       // RETURN
    };
    
    const result = test_helpers.runBytecode(
        test_vm.vm,
        &super_call_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    if (result.output) |output| {
        const return_value = test_helpers.bytesToU256(output);
        // Parent result: 30 (20+10), Final value: 35 (30+5), Return: 30+35 = 65
        try testing.expectEqual(@as(u256, 65), return_value);
    }
}

// Test function visibility and access control
test "E2E: Function visibility - access control patterns" {
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
    
    // Test internal function access through public wrapper
    const visibility_test_bytecode = [_]u8{
        // Simulate internal function that returns 100
        0x60, 0x64, // PUSH1 100 (internal function result)
        
        // Store private variable (1) at slot 0
        0x60, 0x01, // PUSH1 1 (private var)
        0x60, 0x00, // PUSH1 0 (storage slot)
        0x55,       // SSTORE
        
        // Store internal variable (2) at slot 1
        0x60, 0x02, // PUSH1 2 (internal var)
        0x60, 0x01, // PUSH1 1 (storage slot)
        0x55,       // SSTORE
        
        // Store public variable (3) at slot 2
        0x60, 0x03, // PUSH1 3 (public var)
        0x60, 0x02, // PUSH1 2 (storage slot)
        0x55,       // SSTORE
        
        // Simulate callInternal() -> internalFunction()
        // Result is internal function result (100) + sum of variables
        0x60, 0x00, // PUSH1 0 (private var slot)
        0x54,       // SLOAD
        0x60, 0x01, // PUSH1 1 (internal var slot)
        0x54,       // SLOAD
        0x01,       // ADD (private + internal)
        0x60, 0x02, // PUSH1 2 (public var slot)
        0x54,       // SLOAD
        0x01,       // ADD (+ public)
        0x01,       // ADD (+ internal function result)
        
        // Store result and return
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x20, // PUSH1 32 (size)
        0xF3,       // RETURN
    };
    
    const result = test_helpers.runBytecode(
        test_vm.vm,
        &visibility_test_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    if (result.output) |output| {
        const total = test_helpers.bytesToU256(output);
        // 100 (internal function) + 1 (private) + 2 (internal) + 3 (public) = 106
        try testing.expectEqual(@as(u256, 106), total);
    }
}

// Test function overloading simulation
test "E2E: Function overloading - multiple function signatures" {
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
    
    // Simulate function overloading by using different code paths
    const overloading_test_bytecode = [_]u8{
        // Test setValue(uint256) - simple version
        0x60, 0x2A, // PUSH1 42 (value)
        0x60, 0x00, // PUSH1 0 (storage slot for publicVar)
        0x55,       // SSTORE (setValue(42))
        
        // Test setValue(uint256, bool) with doubling
        0x60, 0x19, // PUSH1 25 (value)
        0x60, 0x01, // PUSH1 1 (true for double flag)
        
        // Branch based on boolean flag
        0x60, 0x15, // PUSH1 21 (jump target for doubling)
        0x57,       // JUMPI (conditional jump if true)
        
        // False path (never executed in this test)
        0x60, 0x01, // PUSH1 1 (slot)
        0x55,       // SSTORE
        0x60, 0x1A, // PUSH1 26 (skip to end)
        0x56,       // JUMP
        
        // True path - double the value
        0x5B,       // JUMPDEST (destination 21)
        0x60, 0x02, // PUSH1 2 (multiplier)
        0x02,       // MUL (25 * 2 = 50)
        0x60, 0x01, // PUSH1 1 (storage slot)
        0x55,       // SSTORE
        
        // End point
        0x5B,       // JUMPDEST (destination 26)
        
        // Return sum of both stored values
        0x60, 0x00, // PUSH1 0 (first slot)
        0x54,       // SLOAD (42)
        0x60, 0x01, // PUSH1 1 (second slot)
        0x54,       // SLOAD (50)
        0x01,       // ADD (42 + 50 = 92)
        
        // Store result and return
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x20, // PUSH1 32 (size)
        0xF3,       // RETURN
    };
    
    const result = test_helpers.runBytecode(
        test_vm.vm,
        &overloading_test_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    if (result.output) |output| {
        const sum = test_helpers.bytesToU256(output);
        try testing.expectEqual(@as(u256, 92), sum); // 42 + 50
    }
}

// Test modifier inheritance and override behavior
test "E2E: Modifier inheritance - access control and state checking" {
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
    
    // Simulate modifier behavior: onlyOwner + counter limit check
    const modifier_test_bytecode = [_]u8{
        // Initialize state: owner = address(1), counter = 50, paused = false
        0x60, 0x01, // PUSH1 1 (owner address)
        0x60, 0x00, // PUSH1 0 (owner slot)
        0x55,       // SSTORE
        
        0x60, 0x32, // PUSH1 50 (counter value)
        0x60, 0x01, // PUSH1 1 (counter slot)
        0x55,       // SSTORE
        
        0x60, 0x00, // PUSH1 0 (not paused)
        0x60, 0x02, // PUSH1 2 (paused slot)
        0x55,       // SSTORE
        
        // Simulate msg.sender = owner (1) - access check passes
        0x60, 0x01, // PUSH1 1 (msg.sender)
        0x60, 0x00, // PUSH1 0 (owner slot)
        0x54,       // SLOAD
        0x14,       // EQ (check if sender == owner)
        
        0x60, 0x1E, // PUSH1 30 (jump to proceed if owner)
        0x57,       // JUMPI
        
        // Access denied path (return 0)
        0x60, 0x00, // PUSH1 0
        0x60, 0x00, 0x52, 0x60, 0x00, 0x60, 0x20, 0xF3, // Store and return 0
        
        // Access granted path
        0x5B,       // JUMPDEST (destination 30)
        
        // Check counter limit (must be < 100)
        0x60, 0x01, // PUSH1 1 (counter slot)
        0x54,       // SLOAD (current counter: 50)
        0x60, 0x64, // PUSH1 100 (limit)
        0x10,       // LT (counter < 100)
        
        0x60, 0x2A, // PUSH1 42 (jump to proceed if under limit)
        0x57,       // JUMPI
        
        // Limit exceeded path (return 999)
        0x61, 0x03, 0xE7, // PUSH2 999
        0x60, 0x00, 0x52, 0x60, 0x00, 0x60, 0x20, 0xF3, // Store and return 999
        
        // All checks passed - increment counter
        0x5B,       // JUMPDEST (destination 42)
        0x60, 0x01, // PUSH1 1 (counter slot)
        0x54,       // SLOAD
        0x60, 0x01, // PUSH1 1 (increment)
        0x01,       // ADD
        0x60, 0x01, // PUSH1 1 (counter slot)
        0x55,       // SSTORE (counter = 51)
        
        // Return new counter value
        0x60, 0x01, // PUSH1 1 (counter slot)
        0x54,       // SLOAD
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x52,       // MSTORE
        0x60, 0x00, // PUSH1 0 (offset)
        0x60, 0x20, // PUSH1 32 (size)
        0xF3,       // RETURN
    };
    
    const result = test_helpers.runBytecode(
        test_vm.vm,
        &modifier_test_bytecode,
        CONTRACT_ADDRESS,
        100_000,
        null,
    ) catch unreachable;
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    if (result.output) |output| {
        const counter = test_helpers.bytesToU256(output);
        try testing.expectEqual(@as(u256, 51), counter); // Incremented from 50 to 51
    }
}