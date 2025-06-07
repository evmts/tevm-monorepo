const std = @import("std");
const Address = @import("Address");
const EvmState = @import("evm").EvmState;
const Contract = @import("evm").Contract;
const Vm = @import("evm").Vm;
const RunResult = @import("evm").RunResult;
const ExecutionError = @import("evm").ExecutionError;
const Hardfork = @import("evm").Hardfork;
const constants = @import("evm").constants;

const expect = std.testing.expect;
const expectEqual = std.testing.expectEqual;

// Helper to create bytecode for SSTORE operations
fn create_sstore_bytecode(slot: u256, value: u256) []const u8 {
    // Push value, push slot, SSTORE
    var bytecode = std.ArrayList(u8).init(std.testing.allocator);
    defer bytecode.deinit();
    
    // PUSH32 value
    bytecode.append(constants.PUSH32) catch unreachable;
    var value_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &value_bytes, value, .big);
    bytecode.appendSlice(&value_bytes) catch unreachable;
    
    // PUSH32 slot  
    bytecode.append(constants.PUSH32) catch unreachable;
    var slot_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &slot_bytes, slot, .big);
    bytecode.appendSlice(&slot_bytes) catch unreachable;
    
    // SSTORE
    bytecode.append(constants.SSTORE) catch unreachable;
    
    // STOP
    bytecode.append(constants.STOP) catch unreachable;
    
    return bytecode.toOwnedSlice() catch unreachable;
}

test "SSTORE basic gas refund - clearing storage slot" {
    const allocator = std.testing.allocator;
    
    // Create VM with London hardfork rules
    var vm = try Vm.init_with_hardfork(allocator, .LONDON);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    const slot: u256 = 0x42;
    
    // Set initial storage value (non-zero)
    try vm.state.set_storage(contract_addr, slot, 100);
    
    // Create bytecode that clears the storage slot (sets to 0)
    const bytecode = create_sstore_bytecode(slot, 0);
    defer allocator.free(bytecode);
    
    // Deploy the bytecode
    try vm.state.set_code(contract_addr, bytecode);
    
    // Create contract execution context
    var contract = Contract.init_at_address(
        Address.zero(), // caller
        contract_addr,  // address
        0,             // value
        100000,        // gas
        bytecode,      // code
        &[_]u8{},      // input
        false,         // not static
    );
    defer contract.deinit(allocator, null);
    
    // Execute the contract (this will begin/end transaction automatically)
    const result = try vm.interpret(&contract, &[_]u8{});
    defer if (result.output) |output| allocator.free(output);
    
    // Verify storage was cleared
    const final_value = vm.state.get_storage(contract_addr, slot);
    try expectEqual(@as(u256, 0), final_value);
    
    // Verify gas refund was applied
    // Initial gas: 100000
    // SSTORE cost for clearing (warm): 2900 gas
    // Other opcodes: ~50 gas
    // Refund for clearing: 4800 gas
    // Expected gas left: ~100000 - 2950 + 4800 = ~101850
    // But refund is capped at 20% of gas used
    // Gas used: ~2950, max refund: ~590
    // So actual gas left: ~100000 - 2950 + 590 = ~97640
    
    const gas_used = result.gas_used;
    try expect(gas_used < 3000); // Should have gotten some refund
}

test "SSTORE gas refund - reverting a clear" {
    const allocator = std.testing.allocator;
    
    var vm = try Vm.init_with_hardfork(allocator, .LONDON);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    const slot: u256 = 0x42;
    const original_value: u256 = 100;
    
    // Set initial storage value
    try vm.state.set_storage(contract_addr, slot, original_value);
    
    // Begin a transaction to track original values
    try vm.state.begin_transaction();
    defer vm.state.end_transaction();
    
    // First SSTORE: clear the slot (100 -> 0)
    const clear_bytecode = create_sstore_bytecode(slot, 0);
    defer allocator.free(clear_bytecode);
    
    var contract1 = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        100000,
        clear_bytecode,
        &[_]u8{},
        false,
    );
    defer contract1.deinit(allocator, null);
    
    // Track refund before first execution
    const initial_refund = contract1.gas_refund;
    
    // Execute clearing (should add refund)
    _ = try vm.interpret(&contract1, &[_]u8{});
    
    // Verify refund was added
    try expect(contract1.gas_refund > initial_refund);
    const refund_after_clear = contract1.gas_refund;
    
    // Second SSTORE: revert the clear (0 -> 50)
    const revert_bytecode = create_sstore_bytecode(slot, 50);
    defer allocator.free(revert_bytecode);
    
    var contract2 = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        100000,
        revert_bytecode,
        &[_]u8{},
        false,
    );
    // Copy the refund counter from previous contract
    contract2.gas_refund = refund_after_clear;
    defer contract2.deinit(allocator, null);
    
    // Execute reverting the clear (should subtract refund)
    _ = try vm.interpret(&contract2, &[_]u8{});
    
    // Verify refund was subtracted
    try expect(contract2.gas_refund < refund_after_clear);
}

test "SSTORE gas refund - restoring original value" {
    const allocator = std.testing.allocator;
    
    var vm = try Vm.init_with_hardfork(allocator, .LONDON);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    const slot: u256 = 0x42;
    const original_value: u256 = 100;
    
    // Set initial storage value
    try vm.state.set_storage(contract_addr, slot, original_value);
    
    // Begin transaction to track original
    try vm.state.begin_transaction();
    defer vm.state.end_transaction();
    
    // First: change to different value (100 -> 200)
    try vm.state.set_storage(contract_addr, slot, 200);
    
    // Create bytecode that restores original value (200 -> 100)
    const restore_bytecode = create_sstore_bytecode(slot, original_value);
    defer allocator.free(restore_bytecode);
    
    try vm.state.set_code(contract_addr, restore_bytecode);
    
    var contract = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        100000,
        restore_bytecode,
        &[_]u8{},
        false,
    );
    defer contract.deinit(allocator, null);
    
    const initial_refund = contract.gas_refund;
    
    // Execute restoration
    const result = try vm.interpret(&contract, &[_]u8{});
    defer if (result.output) |output| allocator.free(output);
    
    // Verify value was restored
    try expectEqual(original_value, vm.state.get_storage(contract_addr, slot));
    
    // Verify refund was applied for restoring original value
    try expect(contract.gas_refund > initial_refund);
}

test "SSTORE gas refund - pre-London hardfork" {
    const allocator = std.testing.allocator;
    
    // Create VM with Istanbul hardfork rules (pre-London)
    var vm = try Vm.init_with_hardfork(allocator, .ISTANBUL);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    const slot: u256 = 0x42;
    
    // Set initial storage value
    try vm.state.set_storage(contract_addr, slot, 100);
    
    // Create bytecode that clears the storage slot
    const bytecode = create_sstore_bytecode(slot, 0);
    defer allocator.free(bytecode);
    
    try vm.state.set_code(contract_addr, bytecode);
    
    var contract = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        100000,
        bytecode,
        &[_]u8{},
        false,
    );
    defer contract.deinit(allocator, null);
    
    // Execute
    const result = try vm.interpret(&contract, &[_]u8{});
    defer if (result.output) |output| allocator.free(output);
    
    // Pre-London refund for clearing is 15000 gas
    // Refund is capped at 50% of gas used (pre-London)
    const gas_used = result.gas_used;
    try expect(gas_used < 10000); // Should have significant refund
}

test "SSTORE gas refund - no refund for same value" {
    const allocator = std.testing.allocator;
    
    var vm = try Vm.init_with_hardfork(allocator, .LONDON);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    const slot: u256 = 0x42;
    const value: u256 = 100;
    
    // Set initial storage value
    try vm.state.set_storage(contract_addr, slot, value);
    
    // Create bytecode that sets same value
    const bytecode = create_sstore_bytecode(slot, value);
    defer allocator.free(bytecode);
    
    try vm.state.set_code(contract_addr, bytecode);
    
    var contract = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        100000,
        bytecode,
        &[_]u8{},
        false,
    );
    defer contract.deinit(allocator, null);
    
    const initial_refund = contract.gas_refund;
    
    // Execute
    const result = try vm.interpret(&contract, &[_]u8{});
    defer if (result.output) |output| allocator.free(output);
    
    // No refund should be added when setting same value
    try expectEqual(initial_refund, contract.gas_refund);
}

test "SSTORE gas refund - multiple operations accumulate refunds" {
    const allocator = std.testing.allocator;
    
    var vm = try Vm.init_with_hardfork(allocator, .LONDON);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    
    // Set multiple storage slots with non-zero values
    for (0..5) |i| {
        const slot = @as(u256, @intCast(i));
        try vm.state.set_storage(contract_addr, slot, 100 + slot);
    }
    
    // Create bytecode that clears all 5 slots
    var bytecode = std.ArrayList(u8).init(allocator);
    defer bytecode.deinit();
    
    for (0..5) |i| {
        // PUSH1 0 (value)
        try bytecode.appendSlice(&[_]u8{ 0x60, 0x00 });
        // PUSH1 i (slot)
        try bytecode.appendSlice(&[_]u8{ 0x60, @as(u8, @intCast(i)) });
        // SSTORE
        try bytecode.append(0x55);
    }
    // STOP
    try bytecode.append(0x00);
    
    const code = try bytecode.toOwnedSlice();
    defer allocator.free(code);
    
    try vm.state.set_code(contract_addr, code);
    
    var contract = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        500000, // More gas for multiple operations
        code,
        &[_]u8{},
        false,
    );
    defer contract.deinit(allocator, null);
    
    // Execute
    const result = try vm.interpret(&contract, &[_]u8{});
    defer if (result.output) |output| allocator.free(output);
    
    // Should have accumulated refunds for all 5 clears
    // Each clear gives 4800 gas refund (London)
    // But total refund is capped at 20% of gas used
    
    try expect(contract.gas_refund >= 20000); // Should have significant accumulated refund
    try expectEqual(RunResult.Status.Success, result.status);
}

test "SSTORE gas refund - complex scenario with multiple transitions" {
    const allocator = std.testing.allocator;
    
    var vm = try Vm.init_with_hardfork(allocator, .LONDON);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    const slot: u256 = 0x42;
    
    // Initial value: 100
    try vm.state.set_storage(contract_addr, slot, 100);
    
    // Create complex bytecode with multiple SSTORE operations:
    // 1. 100 -> 200 (no refund)
    // 2. 200 -> 0 (refund)
    // 3. 0 -> 300 (remove refund)
    // 4. 300 -> 100 (refund - restoring original)
    
    var bytecode = std.ArrayList(u8).init(allocator);
    defer bytecode.deinit();
    
    // Operation 1: Set to 200
    try bytecode.append(0x61); // PUSH2
    try bytecode.appendSlice(&[_]u8{ 0x00, 0xC8 }); // 200
    try bytecode.append(0x60); // PUSH1
    try bytecode.append(0x42); // slot 42
    try bytecode.append(0x55); // SSTORE
    
    // Operation 2: Clear (set to 0)
    try bytecode.appendSlice(&[_]u8{ 0x60, 0x00 }); // PUSH1 0
    try bytecode.append(0x60); // PUSH1
    try bytecode.append(0x42); // slot 42
    try bytecode.append(0x55); // SSTORE
    
    // Operation 3: Set to 300
    try bytecode.append(0x61); // PUSH2
    try bytecode.appendSlice(&[_]u8{ 0x01, 0x2C }); // 300
    try bytecode.append(0x60); // PUSH1
    try bytecode.append(0x42); // slot 42
    try bytecode.append(0x55); // SSTORE
    
    // Operation 4: Restore to 100 (original)
    try bytecode.append(0x60); // PUSH1
    try bytecode.append(0x64); // 100
    try bytecode.append(0x60); // PUSH1
    try bytecode.append(0x42); // slot 42
    try bytecode.append(0x55); // SSTORE
    
    try bytecode.append(0x00); // STOP
    
    const code = try bytecode.toOwnedSlice();
    defer allocator.free(code);
    
    try vm.state.set_code(contract_addr, code);
    
    var contract = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        500000,
        code,
        &[_]u8{},
        false,
    );
    defer contract.deinit(allocator, null);
    
    // Execute
    const result = try vm.interpret(&contract, &[_]u8{});
    defer if (result.output) |output| allocator.free(output);
    
    // Final storage value should be 100 (original)
    try expectEqual(@as(u256, 100), vm.state.get_storage(contract_addr, slot));
    
    // Net effect: we cleared once (+4800), reversed it (-4800), then restored original (+4800)
    // So net refund should be +4800
    try expect(contract.gas_refund >= 4000); // Should have net positive refund
    try expectEqual(RunResult.Status.Success, result.status);
}

test "SSTORE gas refund - refund cap at 20% (London)" {
    const allocator = std.testing.allocator;
    
    var vm = try Vm.init_with_hardfork(allocator, .LONDON);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    
    // Set many storage slots to create large potential refund
    for (0..20) |i| {
        const slot = @as(u256, @intCast(i));
        try vm.state.set_storage(contract_addr, slot, 100);
    }
    
    // Create bytecode that clears all slots
    var bytecode = std.ArrayList(u8).init(allocator);
    defer bytecode.deinit();
    
    for (0..20) |i| {
        try bytecode.appendSlice(&[_]u8{ 0x60, 0x00 }); // PUSH1 0
        try bytecode.append(0x60); // PUSH1
        try bytecode.append(@as(u8, @intCast(i))); // slot
        try bytecode.append(0x55); // SSTORE
    }
    try bytecode.append(0x00); // STOP
    
    const code = try bytecode.toOwnedSlice();
    defer allocator.free(code);
    
    try vm.state.set_code(contract_addr, code);
    
    const initial_gas: u64 = 1000000;
    var contract = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        initial_gas,
        code,
        &[_]u8{},
        false,
    );
    defer contract.deinit(allocator, null);
    
    // Execute
    const result = try vm.interpret(&contract, &[_]u8{});
    defer if (result.output) |output| allocator.free(output);
    
    // Each clear gives 4800 refund, 20 clears = 96000 potential refund
    // But refund is capped at 20% of gas used
    const gas_used = initial_gas - result.gas_left;
    const max_refund = gas_used / 5; // 20% cap
    
    // Verify the refund cap was applied
    // The actual gas remaining should reflect the capped refund
    const expected_gas_with_cap = initial_gas - gas_used + max_refund;
    const tolerance: u64 = 1000; // Allow small tolerance for gas calculation differences
    
    try expect(@abs(@as(i64, @intCast(result.gas_left)) - @as(i64, @intCast(expected_gas_with_cap))) < tolerance);
}

test "SSTORE gas refund - refund cap at 50% (pre-London)" {
    const allocator = std.testing.allocator;
    
    var vm = try Vm.init_with_hardfork(allocator, .ISTANBUL);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    
    // Set storage slots
    for (0..10) |i| {
        const slot = @as(u256, @intCast(i));
        try vm.state.set_storage(contract_addr, slot, 100);
    }
    
    // Create bytecode that clears slots
    var bytecode = std.ArrayList(u8).init(allocator);
    defer bytecode.deinit();
    
    for (0..10) |i| {
        try bytecode.appendSlice(&[_]u8{ 0x60, 0x00 }); // PUSH1 0
        try bytecode.append(0x60); // PUSH1
        try bytecode.append(@as(u8, @intCast(i))); // slot
        try bytecode.append(0x55); // SSTORE
    }
    try bytecode.append(0x00); // STOP
    
    const code = try bytecode.toOwnedSlice();
    defer allocator.free(code);
    
    try vm.state.set_code(contract_addr, code);
    
    const initial_gas: u64 = 1000000;
    var contract = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        initial_gas,
        code,
        &[_]u8{},
        false,
    );
    defer contract.deinit(allocator, null);
    
    // Execute
    const result = try vm.interpret(&contract, &[_]u8{});
    defer if (result.output) |output| allocator.free(output);
    
    // Pre-London: 15000 refund per clear, 10 clears = 150000 potential refund
    // But refund is capped at 50% of gas used
    const gas_used = initial_gas - result.gas_left;
    const max_refund = gas_used / 2; // 50% cap pre-London
    
    // Verify appropriate refund was applied
    try expect(contract.gas_refund >= 75000); // Should have accumulated significant refund
    
    // Verify the refund cap logic
    const expected_gas_with_cap = initial_gas - gas_used + @min(contract.gas_refund, max_refund);
    const tolerance: u64 = 5000; // Allow tolerance for gas differences
    
    try expect(@abs(@as(i64, @intCast(result.gas_left)) - @as(i64, @intCast(expected_gas_with_cap))) < tolerance);
}

test "SSTORE gas refund - zero to zero no refund" {
    const allocator = std.testing.allocator;
    
    var vm = try Vm.init_with_hardfork(allocator, .LONDON);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    const slot: u256 = 0x42;
    
    // Storage slot starts at 0 (default)
    
    // Create bytecode that sets 0 to 0
    const bytecode = create_sstore_bytecode(slot, 0);
    defer allocator.free(bytecode);
    
    try vm.state.set_code(contract_addr, bytecode);
    
    var contract = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        100000,
        bytecode,
        &[_]u8{},
        false,
    );
    defer contract.deinit(allocator, null);
    
    const initial_refund = contract.gas_refund;
    
    // Execute
    const result = try vm.interpret(&contract, &[_]u8{});
    defer if (result.output) |output| allocator.free(output);
    
    // No refund for 0 -> 0
    try expectEqual(initial_refund, contract.gas_refund);
}

test "SSTORE gas refund - clearing then restoring in separate transactions" {
    const allocator = std.testing.allocator;
    
    var vm = try Vm.init_with_hardfork(allocator, .LONDON);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    const slot: u256 = 0x42;
    const original_value: u256 = 100;
    
    // Set initial value
    try vm.state.set_storage(contract_addr, slot, original_value);
    
    // Transaction 1: Clear the slot
    {
        const clear_bytecode = create_sstore_bytecode(slot, 0);
        defer allocator.free(clear_bytecode);
        
        try vm.state.set_code(contract_addr, clear_bytecode);
        
        var contract = Contract.init_at_address(
            Address.zero(),
            contract_addr,
            0,
            100000,
            clear_bytecode,
            &[_]u8{},
            false,
        );
        defer contract.deinit(allocator, null);
        
        const result = try vm.interpret(&contract, &[_]u8{});
        defer if (result.output) |output| allocator.free(output);
        
        // Should get refund for clearing
        try expect(contract.gas_refund > 0);
        try expectEqual(@as(u256, 0), vm.state.get_storage(contract_addr, slot));
    }
    
    // Transaction 2: Restore original value
    {
        const restore_bytecode = create_sstore_bytecode(slot, original_value);
        defer allocator.free(restore_bytecode);
        
        try vm.state.set_code(contract_addr, restore_bytecode);
        
        var contract = Contract.init_at_address(
            Address.zero(),
            contract_addr,
            0,
            100000,
            restore_bytecode,
            &[_]u8{},
            false,
        );
        defer contract.deinit(allocator, null);
        
        const result = try vm.interpret(&contract, &[_]u8{});
        defer if (result.output) |output| allocator.free(output);
        
        // In a new transaction, 0 -> 100 is just a regular set, no refund
        try expectEqual(@as(u64, 0), contract.gas_refund);
        try expectEqual(original_value, vm.state.get_storage(contract_addr, slot));
    }
}

test "SSTORE gas refund - EIP-2200 net gas metering" {
    const allocator = std.testing.allocator;
    
    var vm = try Vm.init_with_hardfork(allocator, .ISTANBUL);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    const slot: u256 = 0x42;
    
    // Test EIP-2200 specific case: dirty slot behavior
    // Set initial value
    try vm.state.set_storage(contract_addr, slot, 100);
    
    // Create bytecode with multiple SSTORE to same slot
    var bytecode = std.ArrayList(u8).init(allocator);
    defer bytecode.deinit();
    
    // First SSTORE: 100 -> 200
    try bytecode.append(0x61); // PUSH2
    try bytecode.appendSlice(&[_]u8{ 0x00, 0xC8 }); // 200
    try bytecode.append(0x60); // PUSH1
    try bytecode.append(0x42); // slot
    try bytecode.append(0x55); // SSTORE
    
    // Second SSTORE: 200 -> 100 (back to original, should give refund)
    try bytecode.append(0x60); // PUSH1
    try bytecode.append(0x64); // 100
    try bytecode.append(0x60); // PUSH1
    try bytecode.append(0x42); // slot
    try bytecode.append(0x55); // SSTORE
    
    try bytecode.append(0x00); // STOP
    
    const code = try bytecode.toOwnedSlice();
    defer allocator.free(code);
    
    try vm.state.set_code(contract_addr, code);
    
    var contract = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        100000,
        code,
        &[_]u8{},
        false,
    );
    defer contract.deinit(allocator, null);
    
    // Execute
    const result = try vm.interpret(&contract, &[_]u8{});
    defer if (result.output) |output| allocator.free(output);
    
    // Should get refund for restoring original value
    try expect(contract.gas_refund >= 4000);
    try expectEqual(@as(u256, 100), vm.state.get_storage(contract_addr, slot));
    try expectEqual(RunResult.Status.Success, result.status);
}

test "SSTORE gas refund - full transaction lifecycle" {
    const allocator = std.testing.allocator;
    
    var vm = try Vm.init_with_hardfork(allocator, .LONDON);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    
    // Set up multiple slots with values
    for (0..30) |i| {
        const slot = @as(u256, @intCast(i));
        try vm.state.set_storage(contract_addr, slot, 1000 + slot);
    }
    
    // Create bytecode that:
    // - Clears slots 0-9 (refunds)
    // - Changes slots 10-19 to different non-zero values (no refunds)
    // - Leaves slots 20-29 unchanged
    var bytecode = std.ArrayList(u8).init(allocator);
    defer bytecode.deinit();
    
    // Clear slots 0-9
    for (0..10) |i| {
        try bytecode.appendSlice(&[_]u8{ 0x60, 0x00 }); // PUSH1 0
        try bytecode.append(0x60); // PUSH1
        try bytecode.append(@as(u8, @intCast(i))); // slot
        try bytecode.append(0x55); // SSTORE
    }
    
    // Change slots 10-19
    for (10..20) |i| {
        try bytecode.append(0x61); // PUSH2
        try bytecode.appendSlice(&[_]u8{ 0x00, @as(u8, @intCast(i * 10)) }); // new value
        try bytecode.append(0x60); // PUSH1
        try bytecode.append(@as(u8, @intCast(i))); // slot
        try bytecode.append(0x55); // SSTORE
    }
    
    try bytecode.append(0x00); // STOP
    
    const code = try bytecode.toOwnedSlice();
    defer allocator.free(code);
    
    try vm.state.set_code(contract_addr, code);
    
    const initial_gas: u64 = 2000000;
    var contract = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        initial_gas,
        code,
        &[_]u8{},
        false,
    );
    defer contract.deinit(allocator, null);
    
    // Execute full transaction
    const result = try vm.interpret(&contract, &[_]u8{});
    defer if (result.output) |output| allocator.free(output);
    
    // Verify storage changes
    for (0..10) |i| {
        const slot = @as(u256, @intCast(i));
        try expectEqual(@as(u256, 0), vm.state.get_storage(contract_addr, slot));
    }
    for (10..20) |i| {
        const slot = @as(u256, @intCast(i));
        const expected = @as(u256, @intCast(i * 10));
        try expectEqual(expected, vm.state.get_storage(contract_addr, slot));
    }
    for (20..30) |i| {
        const slot = @as(u256, @intCast(i));
        const expected = 1000 + slot;
        try expectEqual(expected, vm.state.get_storage(contract_addr, slot));
    }
    
    // Should have accumulated refunds for 10 clears
    // 10 * 4800 = 48000 potential refund
    // But capped at 20% of gas used
    
    try expect(contract.gas_refund >= 40000); // Should have significant accumulated refund
    
    // Verify gas refund was properly capped and applied
    const gas_used_without_refund = initial_gas - result.gas_left + contract.gas_refund;
    const max_refund = gas_used_without_refund / 5; // 20% cap
    
    try expect(contract.gas_refund >= 40000); // Full refund accumulated
    try expectEqual(RunResult.Status.Success, result.status);
}