const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const opcodes = evm.opcodes;
const test_helpers = @import("test_helpers.zig");
const ExecutionError = evm.ExecutionError;
const Address = @import("Address");
const gas_constants = evm.gas_constants;

// Test CREATE operation
test "CREATE: create new contract" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Write init code to memory (simple code that returns empty)
    const init_code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0xF3 }; // PUSH1 0 PUSH1 0 RETURN
    var i: usize = 0;
    while (i < init_code.len) : (i += 1) {
        try test_frame.frame.memory.set_byte(i, init_code[i]);
    }
    
    // Set gas and mock create result
    test_vm.create_result = .{
        .success = true,
        .address = test_helpers.TestAddresses.ALICE,
        .gas_left = 90000,
        .output = null,
    };
    
    // Push size, offset, value
    try test_frame.pushStack(&[_]u256{0});              // value
    try test_frame.pushStack(&[_]u256{0});              // offset
    try test_frame.pushStack(&[_]u256{init_code.len}); // size
    
    // Execute CREATE
    _ = try test_helpers.executeOpcode(opcodes.system.op_create, &test_vm.vm, &test_frame.frame);
    
    // Should push new contract address
    const result = try test_frame.popStack();
    try testing.expectEqual(Address.to_u256(test_helpers.TestAddresses.ALICE), result);
}

test "CREATE: failed creation pushes zero" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Set gas and mock failed create result
    test_vm.create_result = .{
        .success = false,
        .address = Address.ZERO_ADDRESS,
        .gas_left = 0,
        .output = null,
    };
    
    // Push size, offset, value
    try test_frame.pushStack(&[_]u256{0}); // value
    try test_frame.pushStack(&[_]u256{0}); // offset  
    try test_frame.pushStack(&[_]u256{0}); // size
    
    // Execute CREATE
    _ = try test_helpers.executeOpcode(opcodes.system.op_create, &test_vm.vm, &test_frame.frame);
    
    // Should push 0 for failed creation
    try testing.expectEqual(@as(u256, 0), try test_frame.popStack());
}

test "CREATE: write protection in static call" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Set static call
    test_frame.frame.is_static = true;
    
    // Push size, offset, value
    try test_frame.pushStack(&[_]u256{0}); // value
    try test_frame.pushStack(&[_]u256{0}); // offset
    try test_frame.pushStack(&[_]u256{0}); // size
    
    // Execute CREATE - should fail
    const result = test_helpers.executeOpcode(opcodes.system.op_create, &test_vm.vm, &test_frame.frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
}

test "CREATE: depth limit" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Set depth to maximum
    test_frame.frame.depth = 1024;
    
    // Push size, offset, value
    try test_frame.pushStack(&[_]u256{0}); // value
    try test_frame.pushStack(&[_]u256{0}); // offset
    try test_frame.pushStack(&[_]u256{0}); // size
    
    // Execute CREATE
    _ = try test_helpers.executeOpcode(opcodes.system.op_create, &test_vm.vm, &test_frame.frame);
    
    // Should push 0 due to depth limit
    try testing.expectEqual(@as(u256, 0), try test_frame.popStack());
}

// Test CREATE2 operation
test "CREATE2: create with deterministic address" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Write init code to memory
    const init_code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0xF3 };
    var i: usize = 0;
    while (i < init_code.len) : (i += 1) {
        try test_frame.frame.memory.set_byte(i, init_code[i]);
    }
    
    // Set gas and mock create result
    test_vm.create_result = .{
        .success = true,
        .address = test_helpers.TestAddresses.BOB,
        .gas_left = 90000,
        .output = null,
    };
    
    // Push salt, size, offset, value
    try test_frame.pushStack(&[_]u256{0});              // value
    try test_frame.pushStack(&[_]u256{0});              // offset
    try test_frame.pushStack(&[_]u256{init_code.len}); // size
    try test_frame.pushStack(&[_]u256{0x12345678});    // salt
    
    // Execute CREATE2
    _ = try test_helpers.executeOpcode(opcodes.system.op_create2, &test_vm.vm, &test_frame.frame);
    
    // Should push new contract address
    const result = try test_frame.popStack();
    try testing.expectEqual(Address.to_u256(test_helpers.TestAddresses.BOB), result);
}

// Test CALL operation
test "CALL: successful call" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Write call data to memory
    const call_data = [_]u8{ 0x11, 0x22, 0x33, 0x44 };
    var i: usize = 0;
    while (i < call_data.len) : (i += 1) {
        try test_frame.frame.memory.set_byte(i, call_data[i]);
    }
    
    // Pre-expand memory to accommodate return data at offset 100
    _ = try test_frame.frame.memory.ensure_capacity(110); // Need at least 100 + 10 bytes
    
    // Set gas and mock call result
    test_vm.call_result = .{
        .success = true,
        .gas_left = 90000,
        .output = &[_]u8{ 0xAA, 0xBB },
    };
    
    // Push ret_size, ret_offset, args_size, args_offset, value, to, gas
    try test_frame.pushStack(&[_]u256{50000}); // gas
    try test_frame.pushStack(&[_]u256{Address.to_u256(test_helpers.TestAddresses.ALICE)}); // to
    try test_frame.pushStack(&[_]u256{0});   // value
    try test_frame.pushStack(&[_]u256{0});   // args_offset
    try test_frame.pushStack(&[_]u256{4});   // args_size
    try test_frame.pushStack(&[_]u256{100}); // ret_offset
    try test_frame.pushStack(&[_]u256{10});  // ret_size
    
    // Execute CALL
    _ = try test_helpers.executeOpcode(opcodes.system.op_call, &test_vm.vm, &test_frame.frame);
    
    // Should push 1 for success
    try testing.expectEqual(@as(u256, 1), try test_frame.popStack());
    
    // Return data should be written to memory
    try testing.expectEqual(@as(u8, 0xAA), test_frame.frame.memory.get_byte(100));
    try testing.expectEqual(@as(u8, 0xBB), test_frame.frame.memory.get_byte(101));
    
    // Remaining return area should be zeroed
    i = 2;
    while (i < 10) : (i += 1) {
        try testing.expectEqual(@as(u8, 0), test_frame.frame.memory.get_byte(100 + i));
    }
}

test "CALL: failed call" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Set gas and mock failed call result
    test_vm.call_result = .{
        .success = false,
        .gas_left = 0,
        .output = null,
    };
    
    // Push parameters
    try test_frame.pushStack(&[_]u256{50000}); // gas
    try test_frame.pushStack(&[_]u256{Address.to_u256(test_helpers.TestAddresses.ALICE)}); // to
    try test_frame.pushStack(&[_]u256{0}); // value
    try test_frame.pushStack(&[_]u256{0}); // args_offset
    try test_frame.pushStack(&[_]u256{0}); // args_size
    try test_frame.pushStack(&[_]u256{0}); // ret_offset
    try test_frame.pushStack(&[_]u256{0}); // ret_size
    
    // Execute CALL
    _ = try test_helpers.executeOpcode(opcodes.system.op_call, &test_vm.vm, &test_frame.frame);
    
    // Should push 0 for failure
    try testing.expectEqual(@as(u256, 0), try test_frame.popStack());
}

test "CALL: cold address access costs more gas" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Set gas and mock call result
    test_vm.call_result = .{
        .success = true,
        .gas_left = 5000,
        .output = null,
    };
    
    // Push parameters
    try test_frame.pushStack(&[_]u256{1000}); // gas
    try test_frame.pushStack(&[_]u256{Address.to_u256(test_helpers.TestAddresses.ALICE)}); // to
    try test_frame.pushStack(&[_]u256{0}); // value
    try test_frame.pushStack(&[_]u256{0}); // args_offset
    try test_frame.pushStack(&[_]u256{0}); // args_size
    try test_frame.pushStack(&[_]u256{0}); // ret_offset
    try test_frame.pushStack(&[_]u256{0}); // ret_size
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute CALL
    _ = try test_helpers.executeOpcode(opcodes.system.op_call, &test_vm.vm, &test_frame.frame);
    
    // Should consume 2600 gas for cold access
    // Gas used = (gas_before - gas_remaining) - (gas_given - gas_returned)
    // Gas used = (gas_before - gas_remaining) - (1000 - 5000) 
    // But gas_returned (5000) > gas_given (1000), which means we got gas back
    const gas_consumed = gas_before - test_frame.frame.gas_remaining;
    const gas_refunded = 5000 - 1000; // 4000 gas refunded
    const net_gas_used = gas_consumed -| gas_refunded; // Saturating subtraction
    try testing.expect(net_gas_used >= 2600);
}

test "CALL: value transfer in static call fails" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Set static call
    test_frame.frame.is_static = true;
    
    // Push parameters with non-zero value
    try test_frame.pushStack(&[_]u256{1000}); // gas
    try test_frame.pushStack(&[_]u256{Address.to_u256(test_helpers.TestAddresses.ALICE)}); // to
    try test_frame.pushStack(&[_]u256{100}); // value (non-zero!)
    try test_frame.pushStack(&[_]u256{0}); // args_offset
    try test_frame.pushStack(&[_]u256{0}); // args_size
    try test_frame.pushStack(&[_]u256{0}); // ret_offset
    try test_frame.pushStack(&[_]u256{0}); // ret_size
    
    // Execute CALL - should fail
    const result = test_helpers.executeOpcode(opcodes.system.op_call, &test_vm.vm, &test_frame.frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
}

// Test DELEGATECALL operation
test "DELEGATECALL: execute code in current context" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Pre-expand memory to accommodate return data at offset 50
    _ = try test_frame.frame.memory.ensure_capacity(52); // Need at least 50 + 2 bytes
    
    // Set gas and mock call result
    test_vm.call_result = .{
        .success = true,
        .gas_left = 90000,
        .output = &[_]u8{ 0xCC, 0xDD },
    };
    
    // Push ret_size, ret_offset, args_size, args_offset, to, gas
    try test_frame.pushStack(&[_]u256{50000}); // gas
    try test_frame.pushStack(&[_]u256{Address.to_u256(test_helpers.TestAddresses.ALICE)}); // to
    try test_frame.pushStack(&[_]u256{0});  // args_offset
    try test_frame.pushStack(&[_]u256{0});  // args_size
    try test_frame.pushStack(&[_]u256{50}); // ret_offset
    try test_frame.pushStack(&[_]u256{2});  // ret_size
    
    // Execute DELEGATECALL
    _ = try test_helpers.executeOpcode(opcodes.system.op_delegatecall, &test_vm.vm, &test_frame.frame);
    
    // Should push 1 for success
    try testing.expectEqual(@as(u256, 1), try test_frame.popStack());
    
    // Return data should be written to memory
    try testing.expectEqual(@as(u8, 0xCC), test_frame.frame.memory.get_byte(50));
    try testing.expectEqual(@as(u8, 0xDD), test_frame.frame.memory.get_byte(51));
}

// Test STATICCALL operation
test "STATICCALL: read-only call" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Pre-expand memory to accommodate return data at offset 200
    _ = try test_frame.frame.memory.ensure_capacity(202); // Need at least 200 + 2 bytes
    
    // Set gas and mock call result
    test_vm.call_result = .{
        .success = true,
        .gas_left = 90000,
        .output = &[_]u8{ 0xEE, 0xFF },
    };
    
    // Push ret_size, ret_offset, args_size, args_offset, to, gas
    try test_frame.pushStack(&[_]u256{50000}); // gas
    try test_frame.pushStack(&[_]u256{Address.to_u256(test_helpers.TestAddresses.ALICE)}); // to
    try test_frame.pushStack(&[_]u256{0});   // args_offset
    try test_frame.pushStack(&[_]u256{0});   // args_size
    try test_frame.pushStack(&[_]u256{200}); // ret_offset
    try test_frame.pushStack(&[_]u256{2});   // ret_size
    
    // Execute STATICCALL
    _ = try test_helpers.executeOpcode(opcodes.system.op_staticcall, &test_vm.vm, &test_frame.frame);
    
    // Should push 1 for success
    try testing.expectEqual(@as(u256, 1), try test_frame.popStack());
    
    // Return data should be written to memory
    try testing.expectEqual(@as(u8, 0xEE), test_frame.frame.memory.get_byte(200));
    try testing.expectEqual(@as(u8, 0xFF), test_frame.frame.memory.get_byte(201));
}

// Test depth limit for calls
test "CALL: depth limit" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Set depth to maximum
    test_frame.frame.depth = 1024;
    
    // Push parameters
    try test_frame.pushStack(&[_]u256{1000}); // gas
    try test_frame.pushStack(&[_]u256{Address.to_u256(test_helpers.TestAddresses.ALICE)}); // to
    try test_frame.pushStack(&[_]u256{0}); // value
    try test_frame.pushStack(&[_]u256{0}); // args_offset
    try test_frame.pushStack(&[_]u256{0}); // args_size
    try test_frame.pushStack(&[_]u256{0}); // ret_offset
    try test_frame.pushStack(&[_]u256{0}); // ret_size
    
    // Execute CALL
    _ = try test_helpers.executeOpcode(opcodes.system.op_call, &test_vm.vm, &test_frame.frame);
    
    // Should push 0 due to depth limit
    try testing.expectEqual(@as(u256, 0), try test_frame.popStack());
}

// Test gas calculation
test "CREATE: gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Write init code to memory
    const init_code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0xF3 };
    var i: usize = 0;
    while (i < init_code.len) : (i += 1) {
        try test_frame.frame.memory.set_byte(i, init_code[i]);
    }
    
    // Set gas
    test_vm.create_result = .{
        .success = true,
        .address = test_helpers.TestAddresses.ALICE,
        .gas_left = 90000,
        .output = null,
    };
    
    // Push parameters
    try test_frame.pushStack(&[_]u256{0});              // value
    try test_frame.pushStack(&[_]u256{0});              // offset
    try test_frame.pushStack(&[_]u256{init_code.len}); // size
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute CREATE
    _ = try test_helpers.executeOpcode(opcodes.system.op_create, &test_vm.vm, &test_frame.frame);
    
    // Should consume gas for init code (200 per byte)
    const expected_init_gas = @as(u64, init_code.len) * 200;
    const gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expect(gas_used >= expected_init_gas);
}

test "CREATE2: additional gas for hashing" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Write init code to memory
    const init_code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0xF3 };
    var i: usize = 0;
    while (i < init_code.len) : (i += 1) {
        try test_frame.frame.memory.set_byte(i, init_code[i]);
    }
    
    // Set gas
    test_vm.create_result = .{
        .success = true,
        .address = test_helpers.TestAddresses.BOB,
        .gas_left = 90000,
        .output = null,
    };
    
    // Push parameters
    try test_frame.pushStack(&[_]u256{0});              // value
    try test_frame.pushStack(&[_]u256{0});              // offset
    try test_frame.pushStack(&[_]u256{init_code.len}); // size
    try test_frame.pushStack(&[_]u256{0x12345678});    // salt
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute CREATE2
    _ = try test_helpers.executeOpcode(opcodes.system.op_create2, &test_vm.vm, &test_frame.frame);
    
    // Should consume gas for init code + hashing
    const expected_init_gas = @as(u64, init_code.len) * 200;
    const expected_hash_gas = @as(u64, (init_code.len + 31) / 32) * 6;
    const gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expect(gas_used >= expected_init_gas + expected_hash_gas);
}

// Test stack errors
test "CREATE: stack underflow" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Push only two values (need three)
    try test_frame.pushStack(&[_]u256{0}); // offset
    try test_frame.pushStack(&[_]u256{0}); // size
    
    // Execute CREATE - should fail
    const result = test_helpers.executeOpcode(opcodes.system.op_create, &test_vm.vm, &test_frame.frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "CALL: stack underflow" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Push only six values (need seven)
    try test_frame.pushStack(&[_]u256{0}); // to
    try test_frame.pushStack(&[_]u256{0}); // value
    try test_frame.pushStack(&[_]u256{0}); // args_offset
    try test_frame.pushStack(&[_]u256{0}); // args_size
    try test_frame.pushStack(&[_]u256{0}); // ret_offset
    try test_frame.pushStack(&[_]u256{0}); // ret_size
    
    // Execute CALL - should fail
    const result = test_helpers.executeOpcode(opcodes.system.op_call, &test_vm.vm, &test_frame.frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

// Test memory expansion
test "CREATE: memory expansion for init code" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Set gas
    test_vm.create_result = .{
        .success = true,
        .address = test_helpers.TestAddresses.ALICE,
        .gas_left = 90000,
        .output = null,
    };
    
    // Push parameters that require memory expansion
    try test_frame.pushStack(&[_]u256{0});   // value
    try test_frame.pushStack(&[_]u256{200}); // offset (requires expansion to 300 bytes)
    try test_frame.pushStack(&[_]u256{100}); // size
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute CREATE
    _ = try test_helpers.executeOpcode(opcodes.system.op_create, &test_vm.vm, &test_frame.frame);
    
    // Should consume gas for memory expansion
    const gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expect(gas_used > 100 * 200); // More than just init code cost
}

// Test EIP-3860: Limit and meter initcode
test "CREATE: EIP-3860 initcode size limit" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000000);
    defer test_frame.deinit();
    
    // Push parameters with size exceeding MaxInitcodeSize (49152)
    try test_frame.pushStack(&[_]u256{0});      // value
    try test_frame.pushStack(&[_]u256{0});      // offset
    try test_frame.pushStack(&[_]u256{49153}); // size (one byte over limit)
    
    // Execute CREATE - should fail with MaxCodeSizeExceeded
    const result = test_helpers.executeOpcode(opcodes.system.op_create, &test_vm.vm, &test_frame.frame);
    try testing.expectError(ExecutionError.Error.MaxCodeSizeExceeded, result);
}

test "CREATE: EIP-3860 initcode word gas" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Write 64 bytes of init code (2 words)
    var i: usize = 0;
    while (i < 64) : (i += 1) {
        try test_frame.frame.memory.set_byte(i, 0x00);
    }
    
    test_vm.create_result = .{
        .success = true,
        .address = test_helpers.TestAddresses.ALICE,
        .gas_left = 90000,
        .output = null,
    };
    
    // Push parameters
    try test_frame.pushStack(&[_]u256{0});  // value
    try test_frame.pushStack(&[_]u256{0});  // offset
    try test_frame.pushStack(&[_]u256{64}); // size (2 words)
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute CREATE
    _ = try test_helpers.executeOpcode(opcodes.system.op_create, &test_vm.vm, &test_frame.frame);
    
    // Should consume gas for init code + word gas
    const expected_init_gas = 64 * gas_constants.CreateDataGas;
    const expected_word_gas = 2 * gas_constants.InitcodeWordGas; // 2 words * 2 gas
    const gas_used = gas_before - test_frame.frame.gas_remaining;
    
    // Gas used should include the word gas cost
    try testing.expect(gas_used >= expected_init_gas + expected_word_gas);
}

test "CREATE2: EIP-3860 initcode size limit" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000000);
    defer test_frame.deinit();
    
    // Push parameters with size exceeding MaxInitcodeSize (49152)
    try test_frame.pushStack(&[_]u256{0});      // value
    try test_frame.pushStack(&[_]u256{0});      // offset
    try test_frame.pushStack(&[_]u256{49153}); // size (one byte over limit)
    try test_frame.pushStack(&[_]u256{0x123}); // salt
    
    // Execute CREATE2 - should fail with MaxCodeSizeExceeded
    const result = test_helpers.executeOpcode(opcodes.system.op_create2, &test_vm.vm, &test_frame.frame);
    try testing.expectError(ExecutionError.Error.MaxCodeSizeExceeded, result);
}
