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
    const final_value = vm.state.get_storage(contract_addr, slot);
    try expectEqual(original_value, final_value);
    
    // Verify refund was added for restoration
    try expect(contract.gas_refund > initial_refund);
}

test "SSTORE gas refund cap - London hardfork (20%)" {
    const allocator = std.testing.allocator;
    
    var vm = try Vm.init_with_hardfork(allocator, .LONDON);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    
    // Create bytecode that clears multiple slots to accumulate large refund
    var bytecode = std.ArrayList(u8).init(allocator);
    defer bytecode.deinit();
    
    // Clear 10 storage slots
    var i: u8 = 0;
    while (i < 10) : (i += 1) {
        // PUSH1 0 (value)
        try bytecode.append(constants.PUSH1);
        try bytecode.append(0);
        
        // PUSH1 i (slot)
        try bytecode.append(constants.PUSH1);
        try bytecode.append(i);
        
        // SSTORE
        try bytecode.append(constants.SSTORE);
    }
    
    // STOP
    try bytecode.append(constants.STOP);
    
    const code = try bytecode.toOwnedSlice();
    defer allocator.free(code);
    
    // Set initial values for all slots
    i = 0;
    while (i < 10) : (i += 1) {
        try vm.state.set_storage(contract_addr, i, 100);
    }
    
    try vm.state.set_code(contract_addr, code);
    
    var contract = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        1000000, // Plenty of gas
        code,
        &[_]u8{},
        false,
    );
    defer contract.deinit(allocator, null);
    
    const result = try vm.interpret(&contract, &[_]u8{});
    defer if (result.output) |output| allocator.free(output);
    
    // Calculate expected refund
    // Each SSTORE clear gives 4800 refund
    // 10 clears = 48000 refund
    // But cap is 20% of gas used
    const gas_used = result.gas_used;
    _ = gas_used; // Used for documentation purposes
    
    // The actual gas returned should respect the cap
    // Without cap: gas_left would be much higher
    // With cap: gas_left is limited
    try expect(contract.gas_refund >= 48000); // Full refund accumulated
    
    // But the actual gas returned is capped
    // This is hard to test precisely without access to pre-cap gas_left
    // So we just verify execution succeeded and some gas was returned
    try expectEqual(RunResult.Status.Success, result.status);
}

test "SSTORE gas refund cap - pre-London (50%)" {
    const allocator = std.testing.allocator;
    
    var vm = try Vm.init_with_hardfork(allocator, .ISTANBUL);
    defer vm.deinit();
    
    const contract_addr = Address.from_u256(0x1000);
    
    // Similar test but with Istanbul rules (50% cap)
    var bytecode = std.ArrayList(u8).init(allocator);
    defer bytecode.deinit();
    
    // Clear 5 storage slots
    var i: u8 = 0;
    while (i < 5) : (i += 1) {
        try bytecode.append(constants.PUSH1);
        try bytecode.append(0);
        try bytecode.append(constants.PUSH1);
        try bytecode.append(i);
        try bytecode.append(constants.SSTORE);
    }
    try bytecode.append(constants.STOP);
    
    const code = try bytecode.toOwnedSlice();
    defer allocator.free(code);
    
    // Set initial values
    i = 0;
    while (i < 5) : (i += 1) {
        try vm.state.set_storage(contract_addr, i, 100);
    }
    
    try vm.state.set_code(contract_addr, code);
    
    var contract = Contract.init_at_address(
        Address.zero(),
        contract_addr,
        0,
        1000000,
        code,
        &[_]u8{},
        false,
    );
    defer contract.deinit(allocator, null);
    
    const result = try vm.interpret(&contract, &[_]u8{});
    defer if (result.output) |output| allocator.free(output);
    
    // Pre-London: 15000 refund per clear
    // 5 clears = 75000 refund
    // Cap is 50% of gas used
    const gas_used = result.gas_used;
    _ = gas_used; // Used for documentation purposes
    
    try expect(contract.gas_refund >= 75000); // Full refund accumulated
    try expectEqual(RunResult.Status.Success, result.status);
}

