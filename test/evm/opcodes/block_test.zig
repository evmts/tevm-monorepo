const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes to test
const evm = @import("evm");
const block = evm.opcodes.block;

test "Block: BLOCKHASH operations" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    
    // Set up test VM and frame
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set up block context
    test_vm.vm.block_number = 1000;
    
=======

    // Set up test VM and frame
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up block context
    test_vm.vm.context.block_number = 1000;

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: Get blockhash (currently returns 0 as not implemented)
    try test_frame.pushStack(&[_]u256{999}); // Block number
    _ = try helpers.executeOpcode(0x40, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Returns 0 as not implemented
    
    // Test 2: Block number too old (> 256 blocks ago)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{700}); // More than 256 blocks ago
    _ = try helpers.executeOpcode(0x40, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    
    // Test 3: Future block number
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{1001}); // Future block
    _ = try helpers.executeOpcode(0x40, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    
=======
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Get blockhash for recent block (should return a hash)
    try test_frame.pushStack(&[_]u256{999}); // Block number (1 block ago)
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    const hash_value = try test_frame.popStack();
    // Should return a non-zero hash for recent blocks
    try testing.expect(hash_value != 0);

    // Test 2: Block number too old (> 256 blocks ago)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{700}); // More than 256 blocks ago
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);

    // Test 3: Future block number
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{1001}); // Future block
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    // Test gas consumption (3 BLOCKHASH operations * 20 gas each)
    try helpers.expectGasUsed(test_frame.frame, 1000, 3 * helpers.opcodes.gas_constants.GasExtStep);
}

test "Block: COINBASE operations" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set coinbase address
    test_vm.vm.block_coinbase = helpers.TestAddresses.CHARLIE;
    
=======

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set coinbase address
    test_vm.vm.context.block_coinbase = helpers.TestAddresses.CHARLIE;

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: Push coinbase address to stack
    _ = try helpers.executeOpcode(0x41, &test_vm.vm, test_frame.frame);
    const coinbase_as_u256 = helpers.bytesToU256(&test_vm.vm.block_coinbase);
    try helpers.expectStackValue(test_frame.frame, 0, coinbase_as_u256);
    
=======
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test: Push coinbase address to stack
    _ = try helpers.executeOpcode(0x41, test_vm.vm, test_frame.frame);
    const coinbase_as_u256 = helpers.bytesToU256(&test_vm.vm.context.block_coinbase);
    try helpers.expectStackValue(test_frame.frame, 0, coinbase_as_u256);

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    // Test gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: TIMESTAMP operations" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set block timestamp
    test_vm.vm.block_timestamp = 1234567890;
    
=======

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set block timestamp
    test_vm.vm.context.block_timestamp = 1234567890;

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: Push timestamp to stack
    _ = try helpers.executeOpcode(0x42, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1234567890);
    
=======
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test: Push timestamp to stack
    _ = try helpers.executeOpcode(0x42, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1234567890);

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    // Test gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: NUMBER operations" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set block number
    test_vm.vm.block_number = 987654321;
    
=======

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set block number
    test_vm.vm.context.block_number = 987654321;

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: Push block number to stack
    _ = try helpers.executeOpcode(0x43, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 987654321);
    
=======
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test: Push block number to stack
    _ = try helpers.executeOpcode(0x43, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 987654321);

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    // Test gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: DIFFICULTY/PREVRANDAO operations" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set difficulty/prevrandao
    test_vm.vm.block_difficulty = 0x123456789ABCDEF0;
    
=======

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set difficulty/prevrandao
    test_vm.vm.context.block_difficulty = 0x123456789ABCDEF0;

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: Push difficulty to stack
    _ = try helpers.executeOpcode(0x44, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x123456789ABCDEF0);
    
=======
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test: Push difficulty to stack
    _ = try helpers.executeOpcode(0x44, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x123456789ABCDEF0);

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    // Test gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: GASLIMIT operations" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set gas limit
    test_vm.vm.block_gas_limit = 30_000_000;
    
=======

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set gas limit
    test_vm.vm.context.block_gas_limit = 30_000_000;

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: Push gas limit to stack
    _ = try helpers.executeOpcode(0x45, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 30_000_000);
    
=======
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test: Push gas limit to stack
    _ = try helpers.executeOpcode(0x45, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 30_000_000);

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    // Test gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: BASEFEE operations (London)" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set base fee
    test_vm.vm.block_base_fee = 1_000_000_000; // 1 gwei
    
=======

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set base fee
    test_vm.vm.context.block_base_fee = 1_000_000_000; // 1 gwei

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: Push base fee to stack
    _ = try helpers.executeOpcode(0x48, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1_000_000_000);
    
=======
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test: Push base fee to stack
    _ = try helpers.executeOpcode(0x48, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1_000_000_000);

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    // Test gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: BLOBHASH operations (Cancun)" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set up blob hashes
    test_vm.vm.blob_hashes = &[_]u256{
=======

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up blob hashes
    test_vm.vm.context.blob_hashes = &[_]u256{
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        0x1111111111111111111111111111111111111111111111111111111111111111,
        0x2222222222222222222222222222222222222222222222222222222222222222,
        0x3333333333333333333333333333333333333333333333333333333333333333,
    };
<<<<<<< HEAD
    
=======

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test 1: Get first blob hash
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x49, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x1111111111111111111111111111111111111111111111111111111111111111);
    
    // Test 2: Get second blob hash
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{1});
    _ = try helpers.executeOpcode(0x49, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x2222222222222222222222222222222222222222222222222222222222222222);
    
    // Test 3: Out of bounds index
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{3});
    _ = try helpers.executeOpcode(0x49, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Returns 0 for out of bounds
    
    // Test 4: Very large index
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{std.math.maxInt(u256)});
    _ = try helpers.executeOpcode(0x49, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Returns 0 for out of bounds
    
=======
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Get first blob hash
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x1111111111111111111111111111111111111111111111111111111111111111);

    // Test 2: Get second blob hash
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{1});
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x2222222222222222222222222222222222222222222222222222222222222222);

    // Test 3: Out of bounds index
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{3});
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Returns 0 for out of bounds

    // Test 4: Very large index
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{std.math.maxInt(u256)});
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Returns 0 for out of bounds

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    // Test gas consumption (4 BLOBHASH operations * 3 gas each)
    try helpers.expectGasUsed(test_frame.frame, 1000, 4 * helpers.opcodes.gas_constants.GasFastestStep);
}

test "Block: BLOBBASEFEE operations (Cancun)" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set blob base fee
    test_vm.vm.blob_base_fee = 100_000_000; // 0.1 gwei
    
=======

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set blob base fee
    test_vm.vm.context.blob_base_fee = 100_000_000; // 0.1 gwei

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test: Push blob base fee to stack
    _ = try helpers.executeOpcode(0x4A, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 100_000_000);
    
=======
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test: Push blob base fee to stack
    _ = try helpers.executeOpcode(0x4A, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 100_000_000);

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    // Test gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: Stack underflow errors" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
=======

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test BLOCKHASH with empty stack
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcode(0x40, &test_vm.vm, test_frame.frame)
    );
    
    // Test BLOBHASH with empty stack (Cancun)
    test_frame.frame.stack.clear();
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcode(0x49, &test_vm.vm, test_frame.frame)
    );
=======
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test BLOCKHASH with empty stack
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame));

    // Test BLOBHASH with empty stack (Cancun)
    test_frame.frame.stack.clear();
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame));
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
}

test "Block: Edge cases" {
    const allocator = testing.allocator;
<<<<<<< HEAD
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
=======

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test with maximum values
    test_vm.vm.block_number = std.math.maxInt(u64);
    test_vm.vm.block_timestamp = std.math.maxInt(u64);
    test_vm.vm.block_gas_limit = std.math.maxInt(u64);
    test_vm.vm.block_difficulty = std.math.maxInt(u256);
    test_vm.vm.block_base_fee = std.math.maxInt(u256);
    test_vm.vm.blob_base_fee = std.math.maxInt(u256);
    
    // Test all opcodes still work with max values
    _ = try helpers.executeOpcode(0x43, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, std.math.maxInt(u64));
    
    test_frame.frame.stack.clear();
    _ = try helpers.executeOpcode(0x42, &test_vm.vm, test_frame.frame);
=======
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test with maximum values
    test_vm.vm.context.block_number = std.math.maxInt(u64);
    test_vm.vm.context.block_timestamp = std.math.maxInt(u64);
    test_vm.vm.context.block_gas_limit = std.math.maxInt(u64);
    test_vm.vm.context.block_difficulty = std.math.maxInt(u256);
    test_vm.vm.context.block_base_fee = std.math.maxInt(u256);
    test_vm.vm.context.blob_base_fee = std.math.maxInt(u256);

    // Test all opcodes still work with max values
    _ = try helpers.executeOpcode(0x43, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, std.math.maxInt(u64));

    test_frame.frame.stack.clear();
    _ = try helpers.executeOpcode(0x42, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, std.math.maxInt(u64));
}
