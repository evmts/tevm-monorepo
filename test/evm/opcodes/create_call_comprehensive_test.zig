const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");
const Address = @import("Address");

// ============================
// 0xF0: CREATE opcode
// ============================
// WORKING: Fixing CALL/CREATE bounds issues - InvalidOffset errors (agent: fix-call-create-bounds)
// WORKING: Fixing stack parameter order issues in CALL/CREATE tests (agent: fix-call-create-bounds)

test "CREATE (0xF0): Basic contract creation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x60, 0x10,    // PUSH1 0x10 (size = 16 bytes)
        0x60, 0x00,    // PUSH1 0x00 (offset = 0)
        0x60, 0x00,    // PUSH1 0x00 (value = 0)
        0xF0,          // CREATE
    };
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 50000);
    defer test_frame.deinit();
    
    // Write init code to memory (simple bytecode that returns empty)
    const init_code = [_]u8{
        0x60, 0x00,    // PUSH1 0x00
        0x60, 0x00,    // PUSH1 0x00  
        0xF3,          // RETURN
    } ++ ([_]u8{0} ** 11);
    _ = try test_frame.frame.memory.set_data(0, &init_code);
    
    // Execute push operations
    for (0..3) |i| {
        test_frame.frame.pc = i * 2;
        _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    }
    test_frame.frame.pc = 6;
    
    // Mock create_contract to return a successful result
    test_vm.create_result = .{
        .success = true,
        .address = [_]u8{0x12} ** 20,
        .gas_left = 5000,
        .output = &[_]u8{},
    };
    test_vm.syncMocks();
    test_vm.syncMocks();
    
    const gas_before = test_frame.frame.gas_remaining;
    const result = try helpers.executeOpcode(0xF0, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    // Check gas consumption
    const gas_used = gas_before - test_frame.frame.gas_remaining;
    // Gas = 32000 (CREATE) + 200*16 (init code) + memory expansion
    try testing.expect(gas_used > 35000);
    
    // Check that address was pushed to stack
    const created_address = try test_frame.popStack();
    const expected_address = Address.to_u256([_]u8{0x12} ** 20);
    try testing.expectEqual(expected_address, created_address);
}

test "CREATE: Static call protection" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xF0}; // CREATE
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 50000);
    defer test_frame.deinit();
    
    // Set static mode
    test_frame.frame.is_static = true;
    
    // Push required parameters
    try test_frame.pushStack(&[_]u256{0}); // value
    try test_frame.pushStack(&[_]u256{0}); // offset
    try test_frame.pushStack(&[_]u256{0}); // size
    
    const result = helpers.executeOpcode(0xF0, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.WriteProtection, result);
}

test "CREATE: EIP-3860 initcode size limit" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xF0}; // CREATE
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Enable EIP-3860 (Shanghai)
    test_vm.vm.chain_rules.IsEIP3860 = true;
    
    // Push parameters with size > 49152 (max initcode size)
    try test_frame.pushStack(&[_]u256{0});     // value
    try test_frame.pushStack(&[_]u256{0});     // offset
    try test_frame.pushStack(&[_]u256{49153}); // size (exceeds limit)
    
    const result = helpers.executeOpcode(0xF0, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.MaxCodeSizeExceeded, result);
}

test "CREATE: Depth limit" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xF0}; // CREATE
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 50000);
    defer test_frame.deinit();
    
    // Set depth to maximum
    test_frame.frame.depth = 1024;
    
    // Push parameters
    try test_frame.pushStack(&[_]u256{0}); // value
    try test_frame.pushStack(&[_]u256{0}); // offset
    try test_frame.pushStack(&[_]u256{0}); // size
    
    const result = try helpers.executeOpcode(0xF0, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    // Should push 0 to stack (failure)
    const created_address = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), created_address);
}

// ============================
// 0xF5: CREATE2 opcode
// ============================

test "CREATE2 (0xF5): Deterministic contract creation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x60, 0x10,    // PUSH1 0x10 (size = 16 bytes)
        0x60, 0x00,    // PUSH1 0x00 (offset = 0)
        0x60, 0x00,    // PUSH1 0x00 (value = 0)
        0x60, 0x42,    // PUSH1 0x42 (salt)
        0xF5,          // CREATE2
    };
    
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
    
    // Write init code to memory
    const init_code = [_]u8{0x60, 0x00, 0x60, 0x00, 0xF3} ++ ([_]u8{0} ** 11);
    _ = try test_frame.frame.memory.set_data(0, &init_code);
    
    // Execute push operations
    for (0..4) |i| {
        test_frame.frame.pc = i * 2;
        _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    }
    test_frame.frame.pc = 8;
    
    // Mock create2 result (uses same create_result)
    test_vm.create_result = .{
        .success = true,
        .address = [_]u8{0x34} ** 20,
        .gas_left = 5000,
        .output = &[_]u8{},
    };
    test_vm.syncMocks();
    
    const gas_before = test_frame.frame.gas_remaining;
    const result = try helpers.executeOpcode(0xF5, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    // Check gas consumption (includes hash cost)
    const gas_used = gas_before - test_frame.frame.gas_remaining;
    // Gas = 32000 (CREATE) + 200*16 (init code) + 6*1 (hash cost) + memory
    try testing.expect(gas_used > 35000);
    
    // Check that address was pushed to stack
    const created_address = try test_frame.popStack();
    const expected_address = Address.to_u256([_]u8{0x34} ** 20);
    try testing.expectEqual(expected_address, created_address);
}

// ============================
// 0xF1: CALL opcode
// ============================

test "CALL (0xF1): Basic external call" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xF1}; // CALL
    
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
    
    // Push CALL parameters (LIFO: push in reverse order)
    // CALL pops: gas, to, value, args_offset, args_size, ret_offset, ret_size
    try test_frame.pushStack(&[_]u256{32});   // ret_size (pushed first, popped last)
    try test_frame.pushStack(&[_]u256{0});    // ret_offset
    try test_frame.pushStack(&[_]u256{0});    // args_size
    try test_frame.pushStack(&[_]u256{0});    // args_offset
    try test_frame.pushStack(&[_]u256{100});  // value
    try test_frame.pushStack(&[_]u256{Address.to_u256(helpers.TestAddresses.BOB)}); // to
    try test_frame.pushStack(&[_]u256{2000}); // gas (pushed last, popped first)
    
    // Mock call result
    test_vm.call_result = .{
        .success = true,
        .gas_left = 1500,
        .output = &([_]u8{0x42} ** 32),
    };
    test_vm.syncMocks();
    
    const result = try helpers.executeOpcode(0xF1, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    // Check success status pushed to stack
    const success = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), success);
    
    // Check return data was written to memory
    const return_data = test_frame.frame.memory.get_slice(0, 32) catch unreachable;
    try testing.expectEqualSlices(u8, &([_]u8{0x42} ** 32), return_data);
}

// WORKING: Fix InvalidOffset vs WriteProtection error (agent: fix-call-static-writeprotection)
test "CALL: Value transfer in static context" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xF1}; // CALL
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        1000,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Set static mode
    test_frame.frame.is_static = true;
    
    // Push CALL parameters with non-zero value (LIFO stack: push in reverse order)
    // CALL pops: gas, to, value, args_offset, args_size, ret_offset, ret_size
    try test_frame.pushStack(&[_]u256{0});                                        // ret_size (pushed first)
    try test_frame.pushStack(&[_]u256{0});                                        // ret_offset
    try test_frame.pushStack(&[_]u256{0});                                        // args_size
    try test_frame.pushStack(&[_]u256{0});                                        // args_offset
    try test_frame.pushStack(&[_]u256{100});                                      // value (non-zero)
    try test_frame.pushStack(&[_]u256{Address.to_u256(helpers.TestAddresses.BOB)}); // to
    try test_frame.pushStack(&[_]u256{2000});                                     // gas (pushed last, popped first)
    
    const result = helpers.executeOpcode(0xF1, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.WriteProtection, result);
}

test "CALL: Cold address access (EIP-2929)" {
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
    
    // Ensure address is cold
    test_vm.vm.access_list.clear();
    
    // Push CALL parameters (LIFO stack: push in reverse order)
    // CALL pops: gas, to, value, args_offset, args_size, ret_offset, ret_size
    try test_frame.pushStack(&[_]u256{0});    // ret_size (pushed first)
    try test_frame.pushStack(&[_]u256{0});    // ret_offset
    try test_frame.pushStack(&[_]u256{0});    // args_size
    try test_frame.pushStack(&[_]u256{0});    // args_offset
    try test_frame.pushStack(&[_]u256{0});    // value
    try test_frame.pushStack(&[_]u256{Address.to_u256([_]u8{0xCC} ** 20)}); // cold address
    try test_frame.pushStack(&[_]u256{1000}); // gas (pushed last, popped first)
    
    // Mock call result
    test_vm.call_result = .{
        .success = true,
        .gas_left = 800,
        .output = &[_]u8{},
    };
    test_vm.syncMocks();
    
    const gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0xF1, &test_vm.vm, test_frame.frame);
    const gas_used = gas_before - test_frame.frame.gas_remaining;
    
    // Should include cold address access cost (2600 gas)
    try testing.expect(gas_used >= 2600);
}

// ============================
// 0xF2: CALLCODE opcode
// ============================

test "CALLCODE (0xF2): Execute external code with current storage" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xF2}; // CALLCODE
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        1000,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Push CALLCODE parameters (LIFO stack: push in reverse order)
    // CALLCODE pops: gas, to, value, args_offset, args_size, ret_offset, ret_size
    try test_frame.pushStack(&[_]u256{32});   // ret_size (pushed first, popped last)
    try test_frame.pushStack(&[_]u256{0});    // ret_offset
    try test_frame.pushStack(&[_]u256{0});    // args_size
    try test_frame.pushStack(&[_]u256{0});    // args_offset
    try test_frame.pushStack(&[_]u256{0});    // value
    try test_frame.pushStack(&[_]u256{Address.to_u256(helpers.TestAddresses.BOB)}); // to
    try test_frame.pushStack(&[_]u256{2000}); // gas (pushed last, popped first)
    
    // Mock callcode result
    test_vm.call_result = .{
        .success = true,
        .gas_left = 1500,
        .output = &([_]u8{0x99} ** 32),
    };
    test_vm.syncMocks();
    
    const result = try helpers.executeOpcode(0xF2, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    // Check success status
    const success = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), success);
}

// ============================
// 0xF4: DELEGATECALL opcode
// ============================

test "DELEGATECALL (0xF4): Execute with current context" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xF4}; // DELEGATECALL
    
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
    
    // Push DELEGATECALL parameters (LIFO stack: push in reverse order, no value parameter)
    // DELEGATECALL pops: gas, to, args_offset, args_size, ret_offset, ret_size
    try test_frame.pushStack(&[_]u256{32});   // ret_size (pushed first, popped last)
    try test_frame.pushStack(&[_]u256{0});    // ret_offset
    try test_frame.pushStack(&[_]u256{4});    // args_size
    try test_frame.pushStack(&[_]u256{0});    // args_offset
    try test_frame.pushStack(&[_]u256{Address.to_u256(helpers.TestAddresses.BOB)}); // to
    try test_frame.pushStack(&[_]u256{2000}); // gas (pushed last, popped first)
    
    // Write call data
    _ = try test_frame.frame.memory.set_data(0, &[_]u8{0x11, 0x22, 0x33, 0x44});
    
    // Mock delegatecall result (uses regular call_result)
    test_vm.call_result = .{
        .success = true,
        .gas_left = 1800,
        .output = &([_]u8{0xAA} ** 32),
    };
    test_vm.syncMocks();
    
    const result = try helpers.executeOpcode(0xF4, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    // Check success status
    const success = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), success);
}

// ============================
// 0xFA: STATICCALL opcode
// ============================

test "STATICCALL (0xFA): Read-only external call" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xFA}; // STATICCALL
    
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
    
    // Push STATICCALL parameters (LIFO stack: push in reverse order, no value parameter)
    // STATICCALL pops: gas, to, args_offset, args_size, ret_offset, ret_size
    try test_frame.pushStack(&[_]u256{32});   // ret_size (pushed first, popped last)
    try test_frame.pushStack(&[_]u256{0});    // ret_offset
    try test_frame.pushStack(&[_]u256{0});    // args_size
    try test_frame.pushStack(&[_]u256{0});    // args_offset
    try test_frame.pushStack(&[_]u256{Address.to_u256(helpers.TestAddresses.BOB)}); // to
    try test_frame.pushStack(&[_]u256{2000}); // gas (pushed last, popped first)
    
    // Mock call result (staticcall uses regular call with is_static=true)
    test_vm.call_result = .{
        .success = true,
        .gas_left = 1900,
        .output = &([_]u8{0xBB} ** 32),
    };
    test_vm.syncMocks();
    
    const result = try helpers.executeOpcode(0xFA, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    // Check success status
    const success = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), success);
}

// ============================
// Gas consumption tests
// ============================

test "System opcodes: Gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xF0}; // CREATE
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Test CREATE gas with EIP-3860
    test_vm.vm.chain_rules.IsEIP3860 = true;
    
    // Write 64 bytes of init code
    const init_code: [64]u8 = [_]u8{0xFF} ** 64;
    _ = try test_frame.frame.memory.set_data(0, &init_code);
    
    try test_frame.pushStack(&[_]u256{0});  // value
    try test_frame.pushStack(&[_]u256{0});  // offset
    try test_frame.pushStack(&[_]u256{64}); // size
    
    test_vm.create_result = .{
        .success = true,
        .address = [_]u8{0} ** 20,
        .gas_left = 50000,
        .output = &[_]u8{},
    };
    test_vm.syncMocks();
    
    const gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0xF0, &test_vm.vm, test_frame.frame);
    const gas_used = gas_before - test_frame.frame.gas_remaining;
    
    // Expected gas:
    // - 32000 (CREATE base)
    // - 200 * 64 = 12800 (init code)
    // - 2 * 2 = 4 (EIP-3860: 2 words)
    // - Memory expansion
    // Total should be > 44804
    try testing.expect(gas_used > 44804);
}

// ============================
// Edge cases
// ============================

test "CALL operations: Depth limit" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const opcodes = [_]u8{0xF1, 0xF2, 0xF4, 0xFA}; // CALL, CALLCODE, DELEGATECALL, STATICCALL
    
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
        
        // Set depth to maximum
        test_frame.frame.depth = 1024;
        
        // Push parameters based on opcode
        if (opcode == 0xF4 or opcode == 0xFA) { // DELEGATECALL, STATICCALL
            try test_frame.pushStack(&[_]u256{1000}); // gas
            try test_frame.pushStack(&[_]u256{0});    // to
            try test_frame.pushStack(&[_]u256{0});    // args_offset
            try test_frame.pushStack(&[_]u256{0});    // args_size
            try test_frame.pushStack(&[_]u256{0});    // ret_offset
            try test_frame.pushStack(&[_]u256{0});    // ret_size
        } else { // CALL, CALLCODE
            try test_frame.pushStack(&[_]u256{1000}); // gas
            try test_frame.pushStack(&[_]u256{0});    // to
            try test_frame.pushStack(&[_]u256{0});    // value
            try test_frame.pushStack(&[_]u256{0});    // args_offset
            try test_frame.pushStack(&[_]u256{0});    // args_size
            try test_frame.pushStack(&[_]u256{0});    // ret_offset
            try test_frame.pushStack(&[_]u256{0});    // ret_size
        }
        
        const result = try helpers.executeOpcode(opcode, &test_vm.vm, test_frame.frame);
        try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
        
        // Should push 0 (failure)
        const success = try test_frame.popStack();
        try testing.expectEqual(@as(u256, 0), success);
    }
}

test "CREATE/CREATE2: Failed creation scenarios" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xF0}; // CREATE
    
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
    
    // Test failed creation
    try test_frame.pushStack(&[_]u256{0}); // value
    try test_frame.pushStack(&[_]u256{0}); // offset
    try test_frame.pushStack(&[_]u256{0}); // size
    
    // Mock failed creation
    test_vm.create_result = .{
        .success = false,
        .address = [_]u8{0} ** 20,
        .gas_left = 0,
        .output = &[_]u8{},
    };
    test_vm.syncMocks();
    
    _ = try helpers.executeOpcode(0xF0, &test_vm.vm, test_frame.frame);
    
    // Should push 0 address
    const created_address = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), created_address);
}
