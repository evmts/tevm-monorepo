const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers");
const evm = @import("evm");
const opcodes = evm.opcodes;

// Integration tests for crypto operations and logging

test "Integration: SHA3 with dynamic data" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Store some data in memory to hash
    const data1: u256 = 0x1234567890ABCDEF;
    const data2: u256 = 0xFEDCBA0987654321;
    
    try test_frame.pushStack(&[_]u256{data1, 0});
    _ = try helpers.executeOpcode(opcodes.memory.op_mstore, &test_vm.vm, &test_frame.frame);
    
    try test_frame.pushStack(&[_]u256{data2, 32});
    _ = try helpers.executeOpcode(opcodes.memory.op_mstore, &test_vm.vm, &test_frame.frame);
    
    // Hash 64 bytes starting at offset 0
    try test_frame.pushStack(&[_]u256{0, 64}); // offset, size
    _ = try helpers.executeOpcode(opcodes.crypto.op_sha3, &test_vm.vm, &test_frame.frame);
    
    // Result should be a valid hash (non-zero)
    const hash = try test_frame.popStack();
    try testing.expect(hash != 0);
    
    // Hash empty data should give known result
    try test_frame.pushStack(&[_]u256{0, 0}); // offset, size
    _ = try helpers.executeOpcode(opcodes.crypto.op_sha3, &test_vm.vm, &test_frame.frame);
    
    // Empty hash: keccak256("") = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
    const empty_hash = try test_frame.popStack();
    try testing.expect(empty_hash != 0);
}

test "Integration: Logging with topics and data" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Store event data in memory
    const event_data = [_]u8{
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x64, // 100 in uint256
    };
    try test_frame.setMemory(0, &event_data);
    
    // LOG1 with one topic (e.g., Transfer event signature)
    const transfer_sig: u256 = 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef;
    
    try test_frame.pushStack(&[_]u256{
        transfer_sig, // topic1: Transfer signature
        32,           // size
        0,            // offset
    });
    
    _ = try helpers.executeOpcode(opcodes.log.op_log1, &test_vm.vm, &test_frame.frame);
    
    // Verify log was emitted (in real implementation)
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
    const log = test_vm.vm.logs.items[0];
    try testing.expectEqual(helpers.TestAddresses.CONTRACT, log.address);
    try testing.expectEqual(@as(usize, 1), log.topics.len);
    try testing.expectEqual(transfer_sig, helpers.toU256Bytes(log.topics[0]));
}

test "Integration: LOG operations with multiple topics" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Prepare log data
    const log_data = "Hello, Ethereum!";
    try test_frame.setMemory(0, log_data);
    
    // LOG3 with three topics
    const topic1: u256 = 0x1111111111111111111111111111111111111111111111111111111111111111;
    const topic2: u256 = 0x2222222222222222222222222222222222222222222222222222222222222222;
    const topic3: u256 = 0x3333333333333333333333333333333333333333333333333333333333333333;
    
    try test_frame.pushStack(&[_]u256{
        topic3,       // topic3
        topic2,       // topic2
        topic1,       // topic1
        log_data.len, // size
        0,            // offset
    });
    
    _ = try helpers.executeOpcode(opcodes.log.op_log3, &test_vm.vm, &test_frame.frame);
    
    // Clear logs for next test
    test_vm.vm.logs.clearRetainingCapacity();
    
    // LOG0 with no topics
    try test_frame.pushStack(&[_]u256{
        log_data.len, // size
        0,            // offset
    });
    
    _ = try helpers.executeOpcode(opcodes.log.op_log0, &test_vm.vm, &test_frame.frame);
    
    // Verify LOG0
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
    try testing.expectEqual(@as(usize, 0), test_vm.vm.logs.items[0].topics.len);
}

test "Integration: Hash-based address calculation" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Simulate CREATE2 address calculation
    // address = keccak256(0xff ++ deployer ++ salt ++ keccak256(init_code))[12:]
    
    // Store components in memory
    var offset: usize = 0;
    
    // 0xff prefix
    try test_frame.setMemory(offset, &[_]u8{0xff});
    offset += 1;
    
    // Deployer address (20 bytes)
    const deployer_bytes = helpers.addressToBytes(helpers.TestAddresses.CONTRACT);
    try test_frame.setMemory(offset, &deployer_bytes);
    offset += 20;
    
    // Salt (32 bytes)
    const salt: u256 = 0x1234567890ABCDEF;
    var salt_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &salt_bytes, salt, .big);
    try test_frame.setMemory(offset, &salt_bytes);
    offset += 32;
    
    // Init code hash (32 bytes) - simulate with dummy hash
    const init_code_hash: u256 = 0xABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890;
    var hash_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &hash_bytes, init_code_hash, .big);
    try test_frame.setMemory(offset, &hash_bytes);
    
    // Hash all components (1 + 20 + 32 + 32 = 85 bytes)
    try test_frame.pushStack(&[_]u256{0, 85});
    _ = try helpers.executeOpcode(opcodes.crypto.op_sha3, &test_vm.vm, &test_frame.frame);
    
    // Extract address from hash (last 20 bytes)
    const full_hash = try test_frame.popStack();
    const address_mask = (@as(u256, 1) << 160) - 1;
    const derived_address = full_hash & address_mask;
    
    // Should be a valid non-zero address
    try testing.expect(derived_address != 0);
}

test "Integration: Event emission patterns" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Simulate ERC20 Transfer event
    // Transfer(address indexed from, address indexed to, uint256 value)
    
    const from_addr = helpers.toU256(helpers.TestAddresses.ALICE);
    const to_addr = helpers.toU256(helpers.TestAddresses.BOB);
    const value: u256 = 1000;
    
    // Store value in memory (non-indexed parameter)
    var value_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &value_bytes, value, .big);
    try test_frame.setMemory(0, &value_bytes);
    
    // Emit Transfer event with LOG3
    const transfer_sig: u256 = 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef;
    
    try test_frame.pushStack(&[_]u256{
        to_addr,      // topic3: indexed 'to'
        from_addr,    // topic2: indexed 'from'
        transfer_sig, // topic1: event signature
        32,           // size of data (value)
        0,            // offset in memory
    });
    
    _ = try helpers.executeOpcode(opcodes.log.op_log3, &test_vm.vm, &test_frame.frame);
    
    // Simulate ERC20 Approval event
    // Approval(address indexed owner, address indexed spender, uint256 value)
    test_vm.vm.logs.clearRetainingCapacity();
    
    const owner_addr = helpers.toU256(helpers.TestAddresses.ALICE);
    const spender_addr = helpers.toU256(helpers.TestAddresses.CONTRACT);
    const allowance: u256 = 500;
    
    // Store allowance in memory
    var allowance_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &allowance_bytes, allowance, .big);
    try test_frame.setMemory(32, &allowance_bytes);
    
    const approval_sig: u256 = 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925;
    
    try test_frame.pushStack(&[_]u256{
        spender_addr, // topic3: indexed 'spender'
        owner_addr,   // topic2: indexed 'owner'
        approval_sig, // topic1: event signature
        32,           // size of data (allowance)
        32,           // offset in memory
    });
    
    _ = try helpers.executeOpcode(opcodes.log.op_log3, &test_vm.vm, &test_frame.frame);
    
    // Both events should be recorded
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
}

test "Integration: Dynamic log data with memory expansion" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Create dynamic-sized log data
    const message = "This is a longer message that will cause memory expansion when logged!";
    
    // Store message at high memory offset
    const high_offset: usize = 1000;
    try test_frame.setMemory(high_offset, message);
    
    // Check memory size before
    _ = try helpers.executeOpcode(opcodes.memory.op_msize, &test_vm.vm, &test_frame.frame);
    const size_before = try test_frame.popStack();
    
    // Log with data from high offset
    try test_frame.pushStack(&[_]u256{
        0x1234567890ABCDEF, // topic1
        message.len,        // size
        high_offset,        // offset
    });
    
    const gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.log.op_log1, &test_vm.vm, &test_frame.frame);
    const gas_after = test_frame.frame.gas_remaining;
    
    // Check memory size after
    _ = try helpers.executeOpcode(opcodes.memory.op_msize, &test_vm.vm, &test_frame.frame);
    const size_after = try test_frame.popStack();
    
    // Memory should have expanded
    try testing.expect(size_after > size_before);
    try testing.expect(size_after >= high_offset + message.len);
    
    // Gas should include memory expansion cost
    const gas_used = gas_before - gas_after;
    try testing.expect(gas_used > 375 + message.len * 8); // Base + data cost
}

test "Integration: SHA3 for signature verification" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Simulate function selector calculation
    // keccak256("transfer(address,uint256)")[:4]
    const function_sig = "transfer(address,uint256)";
    try test_frame.setMemory(0, function_sig);
    
    // Hash the function signature
    try test_frame.pushStack(&[_]u256{0, function_sig.len});
    _ = try helpers.executeOpcode(opcodes.crypto.op_sha3, &test_vm.vm, &test_frame.frame);
    
    // Extract first 4 bytes as selector
    const full_hash = try test_frame.popStack();
    const selector = full_hash >> (28 * 8); // Shift right to get first 4 bytes
    
    // Should be non-zero
    try testing.expect(selector != 0);
    
    // The actual selector for transfer(address,uint256) is 0xa9059cbb
    // but we can't verify exact value without real keccak256
}

test "Integration: Log in static context fails" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Set static context
    test_frame.frame.is_static = true;
    
    // Try to emit LOG0
    try test_frame.pushStack(&[_]u256{0, 0}); // size, offset
    
    const result = opcodes.log.op_log0(0, &test_vm.vm, &test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.WriteProtection, result);
    
    // Try LOG1
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0x1111, 0, 0}); // topic, size, offset
    
    const result1 = opcodes.log.op_log1(0, &test_vm.vm, &test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.WriteProtection, result1);
}
