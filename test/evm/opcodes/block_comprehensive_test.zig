const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes to test
const evm = @import("evm");
const block = evm.execution.block;

test "Block: BLOCKHASH opcode - valid block numbers" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set current block number to 100
    test_vm.vm.context.block_number = 100;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Block number within last 256 blocks (should return pseudo-hash)
    try test_frame.pushStack(&[_]u256{90}); // Block 90
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    
    const hash_90 = try test_frame.frame.stack.peek_n(0);
    try testing.expect(hash_90 != 0); // Should be non-zero hash

    // Test 2: Block number exactly current block (should return 0)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{100}); // Current block
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    
    try helpers.expectStackValue(test_frame.frame, 0, 0);

    // Test 3: Block number greater than current (should return 0)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{101}); // Future block
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "Block: BLOCKHASH opcode - edge cases" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set current block number to 300
    test_vm.vm.context.block_number = 300;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Block 0 (genesis block - should return 0)
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    
    try helpers.expectStackValue(test_frame.frame, 0, 0);

    // Test 2: Block too old (> 256 blocks ago - should return 0)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{43}); // 300 - 43 = 257 > 256
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    
    try helpers.expectStackValue(test_frame.frame, 0, 0);

    // Test 3: Block exactly 256 blocks ago (boundary case - should return hash)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{44}); // 300 - 44 = 256 (exactly 256 blocks ago)
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    
    const hash_256 = try test_frame.frame.stack.peek_n(0);
    try testing.expect(hash_256 != 0); // Should be non-zero hash

    // Test 4: Block exactly 255 blocks ago (should return hash)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{45}); // 300 - 45 = 255
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    
    const hash_255 = try test_frame.frame.stack.peek_n(0);
    try testing.expect(hash_255 != 0); // Should be non-zero hash

    // Test 5: Block 257 blocks ago (should return 0)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42}); // 300 - 42 = 258 > 256
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "Block: COINBASE opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set coinbase address
    test_vm.vm.context.block_coinbase = helpers.TestAddresses.ALICE;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.BOB,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Execute COINBASE
    _ = try helpers.executeOpcode(0x41, test_vm.vm, test_frame.frame);

    const expected_coinbase = helpers.Address.to_u256(helpers.TestAddresses.ALICE);
    try helpers.expectStackValue(test_frame.frame, 0, expected_coinbase);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: TIMESTAMP opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set block timestamp
    const test_timestamp: u64 = 1640995200; // January 1, 2022
    test_vm.vm.context.block_timestamp = test_timestamp;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Execute TIMESTAMP
    _ = try helpers.executeOpcode(0x42, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, test_timestamp);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: NUMBER opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set block number
    const test_block_number: u64 = 12345678;
    test_vm.vm.context.block_number = test_block_number;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Execute NUMBER
    _ = try helpers.executeOpcode(0x43, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, test_block_number);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: DIFFICULTY/PREVRANDAO opcodes" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set block difficulty/prevrandao
    const test_difficulty: u256 = 0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef;
    test_vm.vm.context.block_difficulty = test_difficulty;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test DIFFICULTY (0x44)
    _ = try helpers.executeOpcode(0x44, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, test_difficulty);

    // Test PREVRANDAO (should be same as DIFFICULTY post-merge)
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 1000; // Reset gas
    _ = try helpers.executeOpcode(0x44, test_vm.vm, test_frame.frame); // Using same opcode as they're equivalent
    try helpers.expectStackValue(test_frame.frame, 0, test_difficulty);
}

test "Block: GASLIMIT opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set gas limit
    const test_gas_limit: u64 = 30000000; // 30M gas
    test_vm.vm.context.block_gas_limit = test_gas_limit;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Execute GASLIMIT
    _ = try helpers.executeOpcode(0x45, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, test_gas_limit);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: CHAINID opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set chain ID
    const test_chain_id: u256 = 1; // Mainnet
    test_vm.vm.context.chain_id = test_chain_id;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Execute CHAINID
    _ = try helpers.executeOpcode(0x46, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, test_chain_id);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: BASEFEE opcode (EIP-1559)" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set base fee
    const test_base_fee: u256 = 20_000_000_000; // 20 gwei
    test_vm.vm.context.block_base_fee = test_base_fee;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Execute BASEFEE
    _ = try helpers.executeOpcode(0x48, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, test_base_fee);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: BLOBHASH opcode (EIP-4844)" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up blob hashes
    const blob_hash_1: u256 = 0x1111111111111111111111111111111111111111111111111111111111111111;
    const blob_hash_2: u256 = 0x2222222222222222222222222222222222222222222222222222222222222222;
    
    // Note: This might need adjustment based on actual VM context structure
    test_vm.vm.context.blob_hashes = &[_]u256{ blob_hash_1, blob_hash_2 };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Valid blob index 0
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, blob_hash_1);

    // Test 2: Valid blob index 1
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{1});
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, blob_hash_2);

    // Test 3: Invalid blob index (out of bounds - should return 0)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{2});
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);

    // Test 4: Very large index (should return 0)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{999999});
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "Block: BLOBBASEFEE opcode (EIP-4844)" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set blob base fee
    const test_blob_base_fee: u256 = 1_000_000_000; // 1 gwei
    test_vm.vm.context.blob_base_fee = test_blob_base_fee;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Execute BLOBBASEFEE
    _ = try helpers.executeOpcode(0x4A, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, test_blob_base_fee);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: Stack underflow errors" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test opcodes that require stack items
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame)); // BLOCKHASH
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame)); // BLOBHASH
}

test "Block: Gas consumption verification" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up block context
    test_vm.vm.context.block_number = 100;
    test_vm.vm.context.block_coinbase = helpers.TestAddresses.ALICE;
    test_vm.vm.context.block_timestamp = 1640995200;
    test_vm.vm.context.block_gas_limit = 30000000;
    test_vm.vm.context.chain_id = 1;
    test_vm.vm.context.block_base_fee = 20_000_000_000;
    test_vm.vm.context.blob_base_fee = 1_000_000_000;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.BOB,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    // Test gas costs for each opcode
    const test_cases = [_]struct { opcode: u8, has_stack_input: bool }{
        .{ .opcode = 0x40, .has_stack_input = true },  // BLOCKHASH
        .{ .opcode = 0x41, .has_stack_input = false }, // COINBASE
        .{ .opcode = 0x42, .has_stack_input = false }, // TIMESTAMP
        .{ .opcode = 0x43, .has_stack_input = false }, // NUMBER
        .{ .opcode = 0x44, .has_stack_input = false }, // DIFFICULTY
        .{ .opcode = 0x45, .has_stack_input = false }, // GASLIMIT
        .{ .opcode = 0x46, .has_stack_input = false }, // CHAINID
        .{ .opcode = 0x48, .has_stack_input = false }, // BASEFEE
        .{ .opcode = 0x49, .has_stack_input = true },  // BLOBHASH
        .{ .opcode = 0x4A, .has_stack_input = false }, // BLOBBASEFEE
    };

    for (test_cases) |test_case| {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        // Set up stack input if needed
        if (test_case.has_stack_input) {
            try test_frame.pushStack(&[_]u256{50}); // Valid input
        }

        _ = try helpers.executeOpcode(test_case.opcode, test_vm.vm, test_frame.frame);

        // Most block opcodes should consume GasQuickStep (2 gas)
        // BLOCKHASH uses GasExtStep (20 gas) due to external access
        // BLOBHASH uses GasFastestStep (3 gas) 
        const expected_gas = switch (test_case.opcode) {
            0x40 => 20, // BLOCKHASH
            0x49 => helpers.opcodes.gas_constants.GasFastestStep, // BLOBHASH uses 3 gas
            else => helpers.opcodes.gas_constants.GasQuickStep, // Others use 2 gas
        };
        try helpers.expectGasUsed(test_frame.frame, 1000, expected_gas);
    }
}

test "Block: Multiple operations in sequence" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up complete block context
    test_vm.vm.context.block_number = 1000;
    test_vm.vm.context.block_coinbase = helpers.TestAddresses.ALICE;
    test_vm.vm.context.block_timestamp = 1640995200;
    test_vm.vm.context.block_gas_limit = 30000000;
    test_vm.vm.context.chain_id = 1;
    test_vm.vm.context.block_base_fee = 20_000_000_000;
    test_vm.vm.context.blob_base_fee = 1_000_000_000;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.BOB,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Execute sequence: NUMBER, TIMESTAMP, COINBASE, CHAINID
    _ = try helpers.executeOpcode(0x43, test_vm.vm, test_frame.frame); // NUMBER
    _ = try helpers.executeOpcode(0x42, test_vm.vm, test_frame.frame); // TIMESTAMP
    _ = try helpers.executeOpcode(0x41, test_vm.vm, test_frame.frame); // COINBASE
    _ = try helpers.executeOpcode(0x46, test_vm.vm, test_frame.frame); // CHAINID

    // Verify stack contains all four values in correct order (most recent on top)
    try helpers.expectStackValue(test_frame.frame, 0, 1); // CHAINID
    try helpers.expectStackValue(test_frame.frame, 1, helpers.Address.to_u256(helpers.TestAddresses.ALICE)); // COINBASE
    try helpers.expectStackValue(test_frame.frame, 2, 1640995200); // TIMESTAMP
    try helpers.expectStackValue(test_frame.frame, 3, 1000); // NUMBER

    // Verify we have exactly 4 items on stack
    try testing.expectEqual(@as(usize, 4), test_frame.frame.stack.size);
}