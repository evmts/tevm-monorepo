const std = @import("std");
const testing = std.testing;
const opcodes = @import("../../../src/evm/opcodes/package.zig");
const test_helpers = @import("test_helpers.zig");
const ExecutionError = opcodes.ExecutionError;
const Address = @import("Address");

// Test CREATE operation
test "CREATE: create new contract" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write init code to memory (simple code that returns empty)
    const init_code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0xF3 }; // PUSH1 0 PUSH1 0 RETURN
    var i: usize = 0;
    while (i < init_code.len) : (i += 1) {
        try frame.memory.write_byte(i, init_code[i]);
    }
    
    // Set gas and mock create result
    frame.frame.gas_remaining = 100000;
    vm.vm.create_result = .{
        .success = true,
        .address = test_helpers.TEST_ADDRESS_1,
        .gas_left = 90000,
        .output = null,
    };
    
    // Push size, offset, value
    try frame.pushValue(init_code.len); // size
    try frame.pushValue(0);              // offset
    try frame.pushValue(0);              // value
    
    // Execute CREATE
    try test_helpers.executeOpcode(opcodes.system.op_create, &frame);
    
    // Should push new contract address
    const result = try frame.popValue();
    try testing.expectEqual(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1), result);
    
    // Address should be marked as warm
    try testing.expect(!vm.isAddressCold(test_helpers.TEST_ADDRESS_1));
}

test "CREATE: failed creation pushes zero" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set gas and mock failed create result
    frame.frame.gas_remaining = 100000;
    vm.vm.create_result = .{
        .success = false,
        .address = Address.zero(),
        .gas_left = 0,
        .output = null,
    };
    
    // Push size, offset, value
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset  
    try frame.pushValue(0); // value
    
    // Execute CREATE
    try test_helpers.executeOpcode(opcodes.system.op_create, &frame);
    
    // Should push 0 for failed creation
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
}

test "CREATE: write protection in static call" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set static call
    frame.frame.is_static = true;
    
    // Push size, offset, value
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset
    try frame.pushValue(0); // value
    
    // Execute CREATE - should fail
    const result = test_helpers.executeOpcode(opcodes.system.op_create, &frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
}

test "CREATE: depth limit" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set depth to maximum
    frame.frame.depth = 1024;
    
    // Push size, offset, value
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset
    try frame.pushValue(0); // value
    
    // Execute CREATE
    try test_helpers.executeOpcode(opcodes.system.op_create, &frame);
    
    // Should push 0 due to depth limit
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
}

// Test CREATE2 operation
test "CREATE2: create with deterministic address" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write init code to memory
    const init_code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0xF3 };
    var i: usize = 0;
    while (i < init_code.len) : (i += 1) {
        try frame.memory.write_byte(i, init_code[i]);
    }
    
    // Set gas and mock create result
    frame.frame.gas_remaining = 100000;
    vm.vm.create_result = .{
        .success = true,
        .address = test_helpers.TEST_ADDRESS_2,
        .gas_left = 90000,
        .output = null,
    };
    
    // Push salt, size, offset, value
    try frame.pushValue(0x12345678);    // salt
    try frame.pushValue(init_code.len); // size
    try frame.pushValue(0);              // offset
    try frame.pushValue(0);              // value
    
    // Execute CREATE2
    try test_helpers.executeOpcode(opcodes.system.op_create2, &frame);
    
    // Should push new contract address
    const result = try frame.popValue();
    try testing.expectEqual(test_helpers.to_u256(test_helpers.TEST_ADDRESS_2), result);
}

// Test CALL operation
test "CALL: successful call" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write call data to memory
    const call_data = [_]u8{ 0x11, 0x22, 0x33, 0x44 };
    var i: usize = 0;
    while (i < call_data.len) : (i += 1) {
        try frame.memory.write_byte(i, call_data[i]);
    }
    
    // Set gas and mock call result
    frame.frame.gas_remaining = 100000;
    vm.vm.call_result = .{
        .success = true,
        .gas_left = 90000,
        .output = &[_]u8{ 0xAA, 0xBB },
    };
    
    // Push ret_size, ret_offset, args_size, args_offset, value, to, gas
    try frame.pushValue(10);  // ret_size
    try frame.pushValue(100); // ret_offset
    try frame.pushValue(4);   // args_size
    try frame.pushValue(0);   // args_offset
    try frame.pushValue(0);   // value
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // to
    try frame.pushValue(50000); // gas
    
    // Execute CALL
    try test_helpers.executeOpcode(opcodes.system.op_call, &frame);
    
    // Should push 1 for success
    try testing.expectEqual(@as(u256, 1), try frame.popValue());
    
    // Return data should be written to memory
    try testing.expectEqual(@as(u8, 0xAA), frame.memory.read_byte(100));
    try testing.expectEqual(@as(u8, 0xBB), frame.memory.read_byte(101));
    
    // Remaining return area should be zeroed
    i = 2;
    while (i < 10) : (i += 1) {
        try testing.expectEqual(@as(u8, 0), frame.memory.read_byte(100 + i));
    }
}

test "CALL: failed call" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set gas and mock failed call result
    frame.frame.gas_remaining = 100000;
    vm.vm.call_result = .{
        .success = false,
        .gas_left = 0,
        .output = null,
    };
    
    // Push parameters
    try frame.pushValue(0); // ret_size
    try frame.pushValue(0); // ret_offset
    try frame.pushValue(0); // args_size
    try frame.pushValue(0); // args_offset
    try frame.pushValue(0); // value
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // to
    try frame.pushValue(50000); // gas
    
    // Execute CALL
    try test_helpers.executeOpcode(opcodes.system.op_call, &frame);
    
    // Should push 0 for failure
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
}

test "CALL: cold address access costs more gas" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set gas and mock call result
    frame.frame.gas_remaining = 10000;
    vm.vm.call_result = .{
        .success = true,
        .gas_left = 5000,
        .output = null,
    };
    
    // Push parameters
    try frame.pushValue(0); // ret_size
    try frame.pushValue(0); // ret_offset
    try frame.pushValue(0); // args_size
    try frame.pushValue(0); // args_offset
    try frame.pushValue(0); // value
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // to
    try frame.pushValue(1000); // gas
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute CALL
    try test_helpers.executeOpcode(opcodes.system.op_call, &frame);
    
    // Should consume 2600 gas for cold access
    const gas_used = gas_before - frame.frame.gas_remaining - (1000 - 5000); // Subtract the gas given to call
    try testing.expect(gas_used >= 2600);
}

test "CALL: value transfer in static call fails" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set static call
    frame.frame.is_static = true;
    
    // Push parameters with non-zero value
    try frame.pushValue(0); // ret_size
    try frame.pushValue(0); // ret_offset
    try frame.pushValue(0); // args_size
    try frame.pushValue(0); // args_offset
    try frame.pushValue(100); // value (non-zero!)
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // to
    try frame.pushValue(1000); // gas
    
    // Execute CALL - should fail
    const result = test_helpers.executeOpcode(opcodes.system.op_call, &frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
}

// Test DELEGATECALL operation
test "DELEGATECALL: execute code in current context" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set gas and mock call result
    frame.frame.gas_remaining = 100000;
    vm.vm.call_result = .{
        .success = true,
        .gas_left = 90000,
        .output = &[_]u8{ 0xCC, 0xDD },
    };
    
    // Push ret_size, ret_offset, args_size, args_offset, to, gas
    try frame.pushValue(2);  // ret_size
    try frame.pushValue(50); // ret_offset
    try frame.pushValue(0);  // args_size
    try frame.pushValue(0);  // args_offset
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // to
    try frame.pushValue(50000); // gas
    
    // Execute DELEGATECALL
    try test_helpers.executeOpcode(opcodes.system.op_delegatecall, &frame);
    
    // Should push 1 for success
    try testing.expectEqual(@as(u256, 1), try frame.popValue());
    
    // Return data should be written to memory
    try testing.expectEqual(@as(u8, 0xCC), frame.memory.read_byte(50));
    try testing.expectEqual(@as(u8, 0xDD), frame.memory.read_byte(51));
}

// Test STATICCALL operation
test "STATICCALL: read-only call" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set gas and mock call result
    frame.frame.gas_remaining = 100000;
    vm.vm.call_result = .{
        .success = true,
        .gas_left = 90000,
        .output = &[_]u8{ 0xEE, 0xFF },
    };
    
    // Push ret_size, ret_offset, args_size, args_offset, to, gas
    try frame.pushValue(2);   // ret_size
    try frame.pushValue(200); // ret_offset
    try frame.pushValue(0);   // args_size
    try frame.pushValue(0);   // args_offset
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // to
    try frame.pushValue(50000); // gas
    
    // Execute STATICCALL
    try test_helpers.executeOpcode(opcodes.system.op_staticcall, &frame);
    
    // Should push 1 for success
    try testing.expectEqual(@as(u256, 1), try frame.popValue());
    
    // Return data should be written to memory
    try testing.expectEqual(@as(u8, 0xEE), frame.memory.read_byte(200));
    try testing.expectEqual(@as(u8, 0xFF), frame.memory.read_byte(201));
}

// Test depth limit for calls
test "CALL: depth limit" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set depth to maximum
    frame.frame.depth = 1024;
    
    // Push parameters
    try frame.pushValue(0); // ret_size
    try frame.pushValue(0); // ret_offset
    try frame.pushValue(0); // args_size
    try frame.pushValue(0); // args_offset
    try frame.pushValue(0); // value
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // to
    try frame.pushValue(1000); // gas
    
    // Execute CALL
    try test_helpers.executeOpcode(opcodes.system.op_call, &frame);
    
    // Should push 0 due to depth limit
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
}

// Test gas calculation
test "CREATE: gas consumption" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write init code to memory
    const init_code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0xF3 };
    var i: usize = 0;
    while (i < init_code.len) : (i += 1) {
        try frame.memory.write_byte(i, init_code[i]);
    }
    
    // Set gas
    frame.frame.gas_remaining = 100000;
    vm.vm.create_result = .{
        .success = true,
        .address = test_helpers.TEST_ADDRESS_1,
        .gas_left = 90000,
        .output = null,
    };
    
    // Push parameters
    try frame.pushValue(init_code.len); // size
    try frame.pushValue(0);              // offset
    try frame.pushValue(0);              // value
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute CREATE
    try test_helpers.executeOpcode(opcodes.system.op_create, &frame);
    
    // Should consume gas for init code (200 per byte)
    const expected_init_gas = @as(u64, init_code.len) * 200;
    const gas_used = gas_before - frame.frame.gas_remaining;
    try testing.expect(gas_used >= expected_init_gas);
}

test "CREATE2: additional gas for hashing" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write init code to memory
    const init_code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0xF3 };
    var i: usize = 0;
    while (i < init_code.len) : (i += 1) {
        try frame.memory.write_byte(i, init_code[i]);
    }
    
    // Set gas
    frame.frame.gas_remaining = 100000;
    vm.vm.create_result = .{
        .success = true,
        .address = test_helpers.TEST_ADDRESS_2,
        .gas_left = 90000,
        .output = null,
    };
    
    // Push parameters
    try frame.pushValue(0x12345678);    // salt
    try frame.pushValue(init_code.len); // size
    try frame.pushValue(0);              // offset
    try frame.pushValue(0);              // value
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute CREATE2
    try test_helpers.executeOpcode(opcodes.system.op_create2, &frame);
    
    // Should consume gas for init code + hashing
    const expected_init_gas = @as(u64, init_code.len) * 200;
    const expected_hash_gas = @as(u64, (init_code.len + 31) / 32) * 6;
    const gas_used = gas_before - frame.frame.gas_remaining;
    try testing.expect(gas_used >= expected_init_gas + expected_hash_gas);
}

// Test stack errors
test "CREATE: stack underflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push only two values (need three)
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset
    
    // Execute CREATE - should fail
    const result = test_helpers.executeOpcode(opcodes.system.op_create, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "CALL: stack underflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push only six values (need seven)
    try frame.pushValue(0); // ret_size
    try frame.pushValue(0); // ret_offset
    try frame.pushValue(0); // args_size
    try frame.pushValue(0); // args_offset
    try frame.pushValue(0); // value
    try frame.pushValue(0); // to
    
    // Execute CALL - should fail
    const result = test_helpers.executeOpcode(opcodes.system.op_call, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

// Test memory expansion
test "CREATE: memory expansion for init code" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set gas
    frame.frame.gas_remaining = 100000;
    vm.vm.create_result = .{
        .success = true,
        .address = test_helpers.TEST_ADDRESS_1,
        .gas_left = 90000,
        .output = null,
    };
    
    // Push parameters that require memory expansion
    try frame.pushValue(100); // size
    try frame.pushValue(200); // offset (requires expansion to 300 bytes)
    try frame.pushValue(0);   // value
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute CREATE
    try test_helpers.executeOpcode(opcodes.system.op_create, &frame);
    
    // Should consume gas for memory expansion
    const gas_used = gas_before - frame.frame.gas_remaining;
    try testing.expect(gas_used > 100 * 200); // More than just init code cost
}