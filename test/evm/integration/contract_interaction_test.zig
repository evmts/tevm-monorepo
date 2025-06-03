const std = @import("std");
const testing = std.testing;
const test_helpers = @import("test_helpers");
const evm = @import("evm");
const opcodes = evm.opcodes;
const ExecutionError = evm.ExecutionError;
const Address = @import("Address");

// Test contract creation workflow
test "Integration: contract creation and initialization" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Create simple init code that stores a value and returns runtime code
    // PUSH1 0x42 PUSH1 0x00 SSTORE   (store 0x42 at slot 0)
    // PUSH1 0x0a PUSH1 0x00 RETURN   (return 10 bytes of runtime code)
    const init_code = [_]u8{
        0x60, 0x42, 0x60, 0x00, 0x55, // Store 0x42 at slot 0
        0x60, 0x0a, 0x60, 0x00, 0xF3, // Return 10 bytes
    };
    
    // Write init code to memory
    var i: usize = 0;
    while (i < init_code.len) : (i += 1) {
        try frame.memory.write_byte(i, init_code[i]);
    }
    
    // Set up CREATE result
    frame.frame.gas_remaining = 100000;
    const new_contract_address = test_helpers.TEST_ADDRESS_1;
    vm.vm.create_result = .{
        .success = true,
        .address = new_contract_address,
        .gas_left = 90000,
        .output = null,
    };
    
    // Execute CREATE
    try frame.pushValue(init_code.len); // size
    try frame.pushValue(0);              // offset
    try frame.pushValue(1000);           // value to send
    
    try test_helpers.executeOpcode(0xF0, &frame);
    
    // Check result
    const created_address = try frame.popValue();
    try testing.expectEqual(test_helpers.to_u256(new_contract_address), created_address);
    
    // Verify address is warm (EIP-2929)
    try testing.expect(!vm.isAddressCold(new_contract_address));
    
    // Gas should be consumed
    try testing.expect(frame.frame.gas_remaining < 100000);
}

// Test CALL interaction between contracts
test "Integration: inter-contract calls" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set up accounts
    vm.setBalance(test_helpers.TEST_CONTRACT_ADDRESS, 10000);
    vm.setBalance(test_helpers.TEST_ADDRESS_1, 1000);
    
    // Prepare call data
    const call_data = [_]u8{ 0x11, 0x22, 0x33, 0x44 };
    var i: usize = 0;
    while (i < call_data.len) : (i += 1) {
        try frame.memory.write_byte(i, call_data[i]);
    }
    
    // Set up mock call result
    frame.frame.gas_remaining = 100000;
    const return_data = [_]u8{ 0xAA, 0xBB, 0xCC, 0xDD };
    vm.vm.call_result = .{
        .success = true,
        .gas_left = 80000,
        .output = &return_data,
    };
    
    // Execute CALL
    try frame.pushValue(32);  // ret_size
    try frame.pushValue(100); // ret_offset
    try frame.pushValue(4);   // args_size
    try frame.pushValue(0);   // args_offset
    try frame.pushValue(500); // value to send
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // to
    try frame.pushValue(50000); // gas
    
    try test_helpers.executeOpcode(0xF1, &frame);
    
    // Check success
    try testing.expectEqual(@as(u256, 1), try frame.popValue());
    
    // Verify return data was written to memory
    i = 0;
    while (i < return_data.len) : (i += 1) {
        try testing.expectEqual(return_data[i], frame.memory.read_byte(100 + i));
    }
    
    // Check gas accounting
    try testing.expect(frame.frame.gas_remaining < 100000);
}

// Test DELEGATECALL preserving context
test "Integration: delegatecall context preservation" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial context
    frame.frame.contract.address = test_helpers.TEST_CONTRACT_ADDRESS;
    frame.frame.contract.caller = test_helpers.TEST_CALLER_ADDRESS;
    frame.frame.value = 1000;
    
    // Prepare call data
    const call_data = [_]u8{ 0x01, 0x02 };
    var i: usize = 0;
    while (i < call_data.len) : (i += 1) {
        try frame.memory.write_byte(i, call_data[i]);
    }
    
    // Set up mock call result
    frame.frame.gas_remaining = 50000;
    vm.vm.call_result = .{
        .success = true,
        .gas_left = 40000,
        .output = &[_]u8{ 0xFF },
    };
    
    // Execute DELEGATECALL
    try frame.pushValue(1);   // ret_size
    try frame.pushValue(50);  // ret_offset
    try frame.pushValue(2);   // args_size
    try frame.pushValue(0);   // args_offset
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // to
    try frame.pushValue(30000); // gas
    
    try test_helpers.executeOpcode(0xF4, &frame);
    
    // Check success
    try testing.expectEqual(@as(u256, 1), try frame.popValue());
    
    // Context should be preserved (caller, value, storage context)
    try testing.expectEqual(test_helpers.TEST_CONTRACT_ADDRESS, frame.frame.contract.address);
    try testing.expectEqual(test_helpers.TEST_CALLER_ADDRESS, frame.frame.contract.caller);
    try testing.expectEqual(@as(u256, 1000), frame.frame.value);
}

// Test STATICCALL read-only enforcement
test "Integration: staticcall restrictions" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set up for STATICCALL
    frame.frame.gas_remaining = 50000;
    vm.vm.call_result = .{
        .success = true,
        .gas_left = 40000,
        .output = null,
    };
    
    // Execute STATICCALL
    try frame.pushValue(0);  // ret_size
    try frame.pushValue(0);  // ret_offset
    try frame.pushValue(0);  // args_size
    try frame.pushValue(0);  // args_offset
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // to
    try frame.pushValue(30000); // gas
    
    try test_helpers.executeOpcode(0xFA, &frame);
    
    // Check success
    try testing.expectEqual(@as(u256, 1), try frame.popValue());
    
    // Now test that state modifications fail in static context
    frame.frame.is_static = true;
    
    // Try SSTORE - should fail
    try frame.pushValue(100); // value
    try frame.pushValue(0);   // slot
    const sstore_result = test_helpers.executeOpcode(0x55, &frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, sstore_result);
    
    // Try LOG0 - should fail
    frame.stack.clear();
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset
    const log_result = test_helpers.executeOpcode(0xA0, &frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, log_result);
    
    // Try CREATE - should fail
    frame.stack.clear();
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset
    try frame.pushValue(0); // value
    const create_result = test_helpers.executeOpcode(0xF0, &frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, create_result);
}

// Test CREATE2 deterministic address
test "Integration: CREATE2 deterministic deployment" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Simple init code
    const init_code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0xF3 }; // PUSH1 0 PUSH1 0 RETURN
    
    // Write init code to memory
    var i: usize = 0;
    while (i < init_code.len) : (i += 1) {
        try frame.memory.write_byte(i, init_code[i]);
    }
    
    // Set up CREATE2 result
    frame.frame.gas_remaining = 100000;
    const deterministic_address = test_helpers.TEST_ADDRESS_2;
    vm.vm.create_result = .{
        .success = true,
        .address = deterministic_address,
        .gas_left = 90000,
        .output = null,
    };
    
    // Execute CREATE2 with salt
    const salt: u256 = 0x1234567890ABCDEF;
    try frame.pushValue(salt);          // salt
    try frame.pushValue(init_code.len); // size
    try frame.pushValue(0);              // offset
    try frame.pushValue(0);              // value
    
    try test_helpers.executeOpcode(0xF5, &frame);
    
    // Check result
    const created_address = try frame.popValue();
    try testing.expectEqual(test_helpers.to_u256(deterministic_address), created_address);
    
    // Address should be warm
    try testing.expect(!vm.isAddressCold(deterministic_address));
    
    // Gas consumption should include hashing cost
    const gas_used = 100000 - frame.frame.gas_remaining;
    const expected_min_gas = init_code.len * 200 + // init code cost
                            ((init_code.len + 31) / 32) * 6; // hashing cost
    try testing.expect(gas_used >= expected_min_gas);
}

// Test SELFDESTRUCT workflow
test "Integration: selfdestruct with balance transfer" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set up contract with balance
    const contract_balance: u256 = 5000;
    vm.setBalance(test_helpers.TEST_CONTRACT_ADDRESS, contract_balance);
    
    // Set beneficiary
    const beneficiary = test_helpers.TEST_ADDRESS_1;
    
    // Execute SELFDESTRUCT
    try frame.pushValue(test_helpers.to_u256(beneficiary));
    
    const result = test_helpers.executeOpcode(0xFF, &frame);
    try testing.expectError(ExecutionError.Error.STOP, result);
    
    // Verify contract is marked for deletion
    try testing.expect(vm.isMarkedForDeletion(test_helpers.TEST_CONTRACT_ADDRESS));
    
    // Verify beneficiary is recorded
    try testing.expectEqual(beneficiary, vm.getSelfdestructBeneficiary(test_helpers.TEST_CONTRACT_ADDRESS));
}

// Test call depth limit
test "Integration: call depth limit enforcement" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set depth to maximum
    frame.frame.depth = 1024;
    
    // Try CREATE - should fail silently (push 0)
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset
    try frame.pushValue(0); // value
    
    try test_helpers.executeOpcode(0xF0, &frame);
    
    // Should push 0 for failure
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
    
    // Try CALL - should fail silently (push 0)
    try frame.pushValue(0); // ret_size
    try frame.pushValue(0); // ret_offset
    try frame.pushValue(0); // args_size
    try frame.pushValue(0); // args_offset
    try frame.pushValue(0); // value
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // to
    try frame.pushValue(1000); // gas
    
    try test_helpers.executeOpcode(0xF1, &frame);
    
    // Should push 0 for failure
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
}

// Test return data handling across calls
test "Integration: return data buffer management" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Initial state - no return data
    try test_helpers.executeOpcode(0x3D, &frame);
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
    
    // Make a call that returns data
    frame.frame.gas_remaining = 50000;
    const return_data = [_]u8{ 0x11, 0x22, 0x33, 0x44, 0x55 };
    vm.vm.call_result = .{
        .success = true,
        .gas_left = 40000,
        .output = &return_data,
    };
    
    try frame.pushValue(0);  // ret_size (don't copy to memory)
    try frame.pushValue(0);  // ret_offset
    try frame.pushValue(0);  // args_size
    try frame.pushValue(0);  // args_offset
    try frame.pushValue(0);  // value
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // to
    try frame.pushValue(30000); // gas
    
    try test_helpers.executeOpcode(0xF1, &frame);
    _ = try frame.popValue(); // Discard success flag
    
    // Check return data size
    try test_helpers.executeOpcode(0x3D, &frame);
    try testing.expectEqual(@as(u256, return_data.len), try frame.popValue());
    
    // Copy return data to memory
    try frame.pushValue(return_data.len); // size
    try frame.pushValue(0);                // data offset
    try frame.pushValue(200);              // memory offset
    
    try test_helpers.executeOpcode(0x3E, &frame);
    
    // Verify data was copied
    var i: usize = 0;
    while (i < return_data.len) : (i += 1) {
        try testing.expectEqual(return_data[i], frame.memory.read_byte(200 + i));
    }
    
    // Try to copy beyond return data size - should fail
    try frame.pushValue(10);               // size (too large)
    try frame.pushValue(0);                // data offset
    try frame.pushValue(300);              // memory offset
    
    const copy_result = test_helpers.executeOpcode(0x3E, &frame);
    try testing.expectError(ExecutionError.Error.ReturnDataOutOfBounds, copy_result);
}