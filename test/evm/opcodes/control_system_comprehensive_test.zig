const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");
const Address = @import("Address");

// ============================
// 0xF3: RETURN opcode
// ============================

test "RETURN (0xF3): Return data from execution" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x60, 0x20,    // PUSH1 0x20 (size = 32 bytes)
        0x60, 0x00,    // PUSH1 0x00 (offset = 0)
        0xF3,          // RETURN
    };
    
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
    
    // Write data to memory
    const return_data = "Hello from RETURN!" ++ ([_]u8{0} ** 14);
    _ = try test_frame.frame.memory.set_slice(0, &return_data);
    
    // Execute push operations
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 2;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 4;
    
    // Execute RETURN
    const result = helpers.executeOpcode(0xF3, &test_vm.vm, test_frame.frame);
    
    // RETURN should trigger STOP error with return data
    try testing.expectError(helpers.ExecutionError.Error.STOP, result);
    
    // Check return data buffer was set
    try testing.expectEqualSlices(u8, &return_data, test_frame.frame.return_data_buffer);
}

test "RETURN: Empty return data" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x60, 0x00,    // PUSH1 0x00 (size = 0)
        0x60, 0x00,    // PUSH1 0x00 (offset = 0)
        0xF3,          // RETURN
    };
    
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
    
    // Execute push operations
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 2;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 4;
    
    // Execute RETURN
    const result = helpers.executeOpcode(0xF3, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, result);
    
    // Check empty return data
    try testing.expectEqual(@as(usize, 0), test_frame.frame.return_data_buffer.len);
}

// ============================
// 0xFD: REVERT opcode
// ============================

test "REVERT (0xFD): Revert with data" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x60, 0x10,    // PUSH1 0x10 (size = 16 bytes)
        0x60, 0x00,    // PUSH1 0x00 (offset = 0)
        0xFD,          // REVERT
    };
    
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
    
    // Write revert reason to memory
    const revert_data = "Revert reason!" ++ ([_]u8{0} ** 2);
    _ = try test_frame.frame.memory.set_slice(0, &revert_data);
    
    // Execute push operations
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 2;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 4;
    
    // Execute REVERT
    const result = helpers.executeOpcode(0xFD, &test_vm.vm, test_frame.frame);
    
    // REVERT should trigger REVERT error
    try testing.expectError(helpers.ExecutionError.Error.REVERT, result);
    
    // Check revert data was set
    try testing.expectEqualSlices(u8, &revert_data, test_frame.frame.return_data_buffer);
}

test "REVERT: Empty revert data" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x60, 0x00,    // PUSH1 0x00 (size = 0)
        0x60, 0x00,    // PUSH1 0x00 (offset = 0)
        0xFD,          // REVERT
    };
    
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
    
    // Execute instructions
    for (0..2) |i| {
        test_frame.frame.pc = i * 2;
        _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    }
    test_frame.frame.pc = 4;
    
    // Execute REVERT
    const result = helpers.executeOpcode(0xFD, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.REVERT, result);
    
    // Check empty revert data
    try testing.expectEqual(@as(usize, 0), test_frame.frame.return_data_buffer.len);
}

// ============================
// 0xFE: INVALID opcode
// ============================

test "INVALID (0xFE): Consume all gas and fail" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xFE}; // INVALID
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute INVALID
    const result = helpers.executeOpcode(0xFE, &test_vm.vm, test_frame.frame);
    
    // Should return InvalidOpcode error
    try testing.expectError(helpers.ExecutionError.Error.InvalidOpcode, result);
    
    // Should consume all gas
    try testing.expectEqual(@as(u64, 0), test_frame.frame.gas_remaining);
    try testing.expect(gas_before > 0); // Had gas before
}

// ============================
// 0xFF: SELFDESTRUCT opcode
// ============================

test "SELFDESTRUCT (0xFF): Schedule contract destruction" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x73,          // PUSH20 (beneficiary address)
        0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11,
        0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11,
        0xFF,          // SELFDESTRUCT
    };
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        1000, // Give contract some balance
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Execute PUSH20
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x73, &test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 21;
    
    // Execute SELFDESTRUCT
    const result = helpers.executeOpcode(0xFF, &test_vm.vm, test_frame.frame);
    
    // SELFDESTRUCT returns STOP
    try testing.expectError(helpers.ExecutionError.Error.STOP, result);
}

test "SELFDESTRUCT: Static call protection" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xFF}; // SELFDESTRUCT
    
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
    
    // Set static mode
    test_frame.frame.is_static = true;
    
    // Push beneficiary address
    try test_frame.pushStack(Address.to_u256(helpers.TestAddresses.BOB));
    
    // Execute SELFDESTRUCT
    const result = helpers.executeOpcode(0xFF, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.WriteProtection, result);
}

test "SELFDESTRUCT: Cold beneficiary address (EIP-2929)" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xFF}; // SELFDESTRUCT
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Ensure beneficiary is cold
    test_vm.vm.access_list.clear();
    
    // Push cold beneficiary address
    const cold_address = [_]u8{0xDD} ** 20;
    try test_frame.pushStack(Address.to_u256(cold_address));
    
    const gas_before = test_frame.frame.gas_remaining;
    const result = helpers.executeOpcode(0xFF, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, result);
    
    // Check that cold address access cost was consumed
    const gas_used = gas_before - test_frame.frame.gas_remaining;
    // Base SELFDESTRUCT (5000) + cold access (2600) = 7600
    try testing.expect(gas_used >= 7600);
}

// ============================
// Gas consumption tests
// ============================

test "Control opcodes: Gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Test RETURN gas consumption (memory expansion)
    const return_code = [_]u8{0xF3}; // RETURN
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &return_code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Return large data requiring memory expansion
    try test_frame.pushStack(0);     // offset
    try test_frame.pushStack(0x1000); // size (4096 bytes)
    
    const gas_before = test_frame.frame.gas_remaining;
    const result = helpers.executeOpcode(0xF3, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, result);
    
    const gas_used = gas_before - test_frame.frame.gas_remaining;
    // Should include memory expansion cost
    try testing.expect(gas_used > 400); // Significant gas for memory
}

// ============================
// Edge cases
// ============================

test "RETURN/REVERT: Large memory offset" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const opcodes = [_]u8{0xF3, 0xFD}; // RETURN, REVERT
    
    for (opcodes) |opcode| {
        var contract = try helpers.createTestContract(
            allocator,
            helpers.TestAddresses.CONTRACT,
            helpers.TestAddresses.ALICE,
            0,
            &[_]u8{opcode},
        );
        defer contract.deinit(null);
        
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
        defer test_frame.deinit();
        
        // Push large offset
        try test_frame.pushStack(0x1000); // offset = 4096
        try test_frame.pushStack(32);     // size = 32
        
        const gas_before = test_frame.frame.gas_remaining;
        const result = helpers.executeOpcode(opcode, &test_vm.vm, test_frame.frame);
        
        if (opcode == 0xF3) {
            try testing.expectError(helpers.ExecutionError.Error.STOP, result);
        } else {
            try testing.expectError(helpers.ExecutionError.Error.REVERT, result);
        }
        
        // Check memory expansion gas was consumed
        const gas_used = gas_before - test_frame.frame.gas_remaining;
        try testing.expect(gas_used > 400);
    }
}

test "RETURN/REVERT: Stack underflow" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const opcodes = [_]u8{0xF3, 0xFD}; // RETURN, REVERT
    
    for (opcodes) |opcode| {
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
        
        // Only one item on stack (need 2)
        try test_frame.pushStack(0);
        const result2 = helpers.executeOpcode(opcode, &test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result2);
    }
}

test "Control flow interaction: Call with REVERT" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xF1}; // CALL
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Push CALL parameters
    try test_frame.pushStack(2000); // gas
    try test_frame.pushStack(Address.to_u256(helpers.TestAddresses.BOB)); // to
    try test_frame.pushStack(0);    // value
    try test_frame.pushStack(0);    // args_offset
    try test_frame.pushStack(0);    // args_size
    try test_frame.pushStack(0);    // ret_offset
    try test_frame.pushStack(32);   // ret_size
    
    // Mock call result with revert
    const revert_reason = "Called contract reverted!";
    test_vm.vm.call_contract_result = .{
        .success = false,
        .gas_left = 500,
        .output = revert_reason,
    };
    
    _ = try helpers.executeOpcode(0xF1, &test_vm.vm, test_frame.frame);
    
    // Check failure status pushed to stack
    const success = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), success);
    
    // Check return data contains revert reason
    try testing.expectEqualSlices(u8, revert_reason, test_frame.frame.return_data_buffer);
}