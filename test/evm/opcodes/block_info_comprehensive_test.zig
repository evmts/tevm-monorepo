const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// 0x45-0x4A Block Information (continued)
// ============================

test "GASLIMIT (0x45): Get block gas limit" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const test_cases = [_]u64{
        0,                    // Zero (unusual but valid)
        8_000_000,            // Classic 8M gas limit
        12_500_000,           // ~12.5M (common mainnet value)
        30_000_000,           // 30M gas limit
        std.math.maxInt(u64), // Maximum possible
    };
    
    for (test_cases) |gas_limit| {
<<<<<<< HEAD
        test_vm.vm.block_gas_limit = gas_limit;
=======
        test_vm.vm.context.block_gas_limit = gas_limit;
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
=======
        defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();
        
        // Execute GASLIMIT
<<<<<<< HEAD
        _ = try helpers.executeOpcode(0x45, &test_vm.vm, test_frame.frame);
=======
        _ = try helpers.executeOpcode(0x45, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        try helpers.expectStackValue(test_frame.frame, 0, gas_limit);
    }
}

test "CHAINID (0x46): Get chain ID" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const test_cases = [_]u256{
        1,                    // Ethereum mainnet
        5,                    // Goerli testnet
        10,                   // Optimism mainnet
        137,                  // Polygon mainnet
        42161,                // Arbitrum One
        43114,                // Avalanche C-Chain
        56,                   // BSC mainnet
        std.math.maxInt(u256), // Maximum chain ID
    };
    
    for (test_cases) |chain_id| {
<<<<<<< HEAD
        test_vm.vm.chain_id = chain_id;
=======
        test_vm.vm.context.chain_id = chain_id;
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
=======
        defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();
        
        // Execute CHAINID
<<<<<<< HEAD
        _ = try helpers.executeOpcode(0x46, &test_vm.vm, test_frame.frame);
=======
        _ = try helpers.executeOpcode(0x46, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        try helpers.expectStackValue(test_frame.frame, 0, chain_id);
    }
}

test "SELFBALANCE (0x47): Get contract's own balance" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const test_cases = [_]u256{
        0,                              // No balance
        1,                              // 1 wei
        1_000_000_000_000_000_000,      // 1 ETH
        42_000_000_000_000_000_000,     // 42 ETH
        std.math.maxInt(u256),          // Max balance
    };
    
    for (test_cases) |balance| {
        var contract = try helpers.createTestContract(
            allocator,
            helpers.TestAddresses.CONTRACT,
            helpers.TestAddresses.ALICE,
            0,
            &[_]u8{},
        );
<<<<<<< HEAD
        defer contract.deinit(null);
        
        // Set the contract's balance
        try test_vm.vm.set_balance(contract.address, balance);
=======
        defer contract.deinit(allocator, null);
        
        // Set the contract's balance directly in the state
        try test_vm.vm.state.set_balance(contract.address, balance);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();
        
        // Execute SELFBALANCE
<<<<<<< HEAD
        _ = try helpers.executeOpcode(0x47, &test_vm.vm, test_frame.frame);
=======
        _ = try helpers.executeOpcode(0x47, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        try helpers.expectStackValue(test_frame.frame, 0, balance);
    }
}

test "BASEFEE (0x48): Get block base fee" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const test_cases = [_]u256{
        0,                      // Zero base fee (unlikely but valid)
        1_000_000_000,          // 1 Gwei
        20_000_000_000,         // 20 Gwei (typical)
        100_000_000_000,        // 100 Gwei (high congestion)
        500_000_000_000,        // 500 Gwei (extreme congestion)
        std.math.maxInt(u256),  // Maximum possible
    };
    
    for (test_cases) |base_fee| {
<<<<<<< HEAD
        test_vm.vm.block_base_fee = base_fee;
=======
        test_vm.vm.context.block_base_fee = base_fee;
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
=======
        defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();
        
        // Execute BASEFEE
<<<<<<< HEAD
        _ = try helpers.executeOpcode(0x48, &test_vm.vm, test_frame.frame);
=======
        _ = try helpers.executeOpcode(0x48, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        try helpers.expectStackValue(test_frame.frame, 0, base_fee);
    }
}

test "BLOBHASH (0x49): Get blob versioned hash" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    // Set up blob hashes
    const blob_hashes = [_]u256{
        0x0101010101010101010101010101010101010101010101010101010101010101,
        0x0202020202020202020202020202020202020202020202020202020202020202,
        0x0303030303030303030303030303030303030303030303030303030303030303,
    };
<<<<<<< HEAD
    test_vm.vm.blob_hashes = &blob_hashes;
=======
    test_vm.vm.context.blob_hashes = &blob_hashes;
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
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test 1: Get first blob hash
    try test_frame.pushStack(&[_]u256{0});
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x49, &test_vm.vm, test_frame.frame);
=======
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, blob_hashes[0]);
    _ = try test_frame.popStack();
    
    // Test 2: Get second blob hash
    try test_frame.pushStack(&[_]u256{1});
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x49, &test_vm.vm, test_frame.frame);
=======
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, blob_hashes[1]);
    _ = try test_frame.popStack();
    
    // Test 3: Get third blob hash
    try test_frame.pushStack(&[_]u256{2});
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x49, &test_vm.vm, test_frame.frame);
=======
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, blob_hashes[2]);
    _ = try test_frame.popStack();
    
    // Test 4: Index out of bounds (should return 0)
    try test_frame.pushStack(&[_]u256{3});
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x49, &test_vm.vm, test_frame.frame);
=======
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();
    
    // Test 5: Large index (should return 0)
    try test_frame.pushStack(&[_]u256{1000});
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x49, &test_vm.vm, test_frame.frame);
=======
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "BLOBBASEFEE (0x4A): Get blob base fee" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    const test_cases = [_]u256{
        0,                      // Zero blob base fee
        1,                      // Minimum blob base fee
        1_000_000_000,          // 1 Gwei
        10_000_000_000,         // 10 Gwei
        100_000_000_000,        // 100 Gwei
        std.math.maxInt(u256),  // Maximum possible
    };
    
    for (test_cases) |blob_base_fee| {
<<<<<<< HEAD
        test_vm.vm.blob_base_fee = blob_base_fee;
=======
        test_vm.vm.context.blob_base_fee = blob_base_fee;
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
=======
        defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();
        
        // Execute BLOBBASEFEE
<<<<<<< HEAD
        _ = try helpers.executeOpcode(0x4A, &test_vm.vm, test_frame.frame);
=======
        _ = try helpers.executeOpcode(0x4A, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        try helpers.expectStackValue(test_frame.frame, 0, blob_base_fee);
    }
}

// ============================
// Gas consumption tests
// ============================

test "Block info opcodes: Gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
    
    // Set up blob hashes for BLOBHASH test
    const blob_hashes = [_]u256{0x01};
    test_vm.vm.blob_hashes = &blob_hashes;
=======
    defer test_vm.deinit(allocator);
    
    // Set up blob hashes for BLOBHASH test
    const blob_hashes = [_]u256{0x01};
    test_vm.vm.context.blob_hashes = &blob_hashes;
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
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    const opcodes = [_]struct {
        opcode: u8,
        name: []const u8,
        expected_gas: u64,
        needs_stack: bool,
    }{
        .{ .opcode = 0x45, .name = "GASLIMIT", .expected_gas = 2, .needs_stack = false },
        .{ .opcode = 0x46, .name = "CHAINID", .expected_gas = 2, .needs_stack = false },
        .{ .opcode = 0x47, .name = "SELFBALANCE", .expected_gas = 5, .needs_stack = false },
        .{ .opcode = 0x48, .name = "BASEFEE", .expected_gas = 2, .needs_stack = false },
        .{ .opcode = 0x49, .name = "BLOBHASH", .expected_gas = 3, .needs_stack = true },
        .{ .opcode = 0x4A, .name = "BLOBBASEFEE", .expected_gas = 2, .needs_stack = false },
    };
    
    for (opcodes) |op| {
        test_frame.frame.stack.clear();
        if (op.needs_stack) {
            try test_frame.pushStack(&[_]u256{0}); // Index for BLOBHASH
        }
        
        const gas_before = 1000;
        test_frame.frame.gas_remaining = gas_before;
        
<<<<<<< HEAD
        _ = try helpers.executeOpcode(op.opcode, &test_vm.vm, test_frame.frame);
=======
        _ = try helpers.executeOpcode(op.opcode, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        const gas_used = gas_before - test_frame.frame.gas_remaining;
        try testing.expectEqual(op.expected_gas, gas_used);
    }
}

// ============================
// Invalid opcodes 0x4B-0x4E
// ============================

test "Invalid opcodes 0x4B-0x4E: Should revert" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
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
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    const invalid_opcodes = [_]u8{ 0x4B, 0x4C, 0x4D, 0x4E };
    
    for (invalid_opcodes) |opcode| {
        const gas_before = test_frame.frame.gas_remaining;
<<<<<<< HEAD
        const result = helpers.executeOpcode(opcode, &test_vm.vm, test_frame.frame);
=======
        const result = helpers.executeOpcode(opcode, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        // Should fail with InvalidOpcode error
        try testing.expectError(helpers.ExecutionError.Error.InvalidOpcode, result);
        
        // Should consume all gas
        try testing.expectEqual(@as(u64, 0), test_frame.frame.gas_remaining);
        
        // Reset for next test
        test_frame.frame.gas_remaining = gas_before;
    }
}

// ============================
// Edge cases and special scenarios
// ============================

test "SELFBALANCE: Balance changes during execution" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
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
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
<<<<<<< HEAD
    // Initial balance: 1000 wei
    try test_vm.vm.set_balance(contract.address, 1000);
    
    // Check initial balance
    _ = try helpers.executeOpcode(0x47, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1000);
    _ = try test_frame.popStack();
    
    // Simulate balance change (e.g., from a transfer)
    try test_vm.vm.set_balance(contract.address, 2500);
    
    // Check updated balance
    _ = try helpers.executeOpcode(0x47, &test_vm.vm, test_frame.frame);
=======
    // Initial balance: 1000 wei - set directly in the state
    try test_vm.vm.state.set_balance(contract.address, 1000);
    
    // Check initial balance
    _ = try helpers.executeOpcode(0x47, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1000);
    _ = try test_frame.popStack();
    
    // Simulate balance change (e.g., from a transfer) - set directly in the state
    try test_vm.vm.state.set_balance(contract.address, 2500);
    
    // Check updated balance
    _ = try helpers.executeOpcode(0x47, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, 2500);
}

test "BLOBHASH: Empty blob list" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
    
    // No blob hashes set (empty slice)
    test_vm.vm.blob_hashes = &[_]u256{};
=======
    defer test_vm.deinit(allocator);
    
    // No blob hashes set (empty slice)
    test_vm.vm.context.blob_hashes = &[_]u256{};
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
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Any index should return 0 when no blobs
    try test_frame.pushStack(&[_]u256{0});
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x49, &test_vm.vm, test_frame.frame);
=======
    _ = try helpers.executeOpcode(0x49, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "CHAINID: EIP-1344 behavior" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
    
    // Test that CHAINID returns consistent value
    test_vm.vm.chain_id = 1337; // Common test chain ID
=======
    defer test_vm.deinit(allocator);
    
    // Test that CHAINID returns consistent value
    test_vm.vm.context.chain_id = 1337; // Common test chain ID
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
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Execute CHAINID multiple times - should always return same value
    for (0..3) |_| {
<<<<<<< HEAD
        _ = try helpers.executeOpcode(0x46, &test_vm.vm, test_frame.frame);
=======
        _ = try helpers.executeOpcode(0x46, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        try helpers.expectStackValue(test_frame.frame, 0, 1337);
        _ = try test_frame.popStack();
    }
}

test "Stack operations: All opcodes push exactly one value" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
    
    // Set up blob hash for BLOBHASH
    const blob_hashes = [_]u256{0x01};
    test_vm.vm.blob_hashes = &blob_hashes;
=======
    defer test_vm.deinit(allocator);
    
    // Set up blob hash for BLOBHASH
    const blob_hashes = [_]u256{0x01};
    test_vm.vm.context.blob_hashes = &blob_hashes;
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
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    const opcodes = [_]struct {
        opcode: u8,
        needs_input: bool,
    }{
        .{ .opcode = 0x45, .needs_input = false }, // GASLIMIT
        .{ .opcode = 0x46, .needs_input = false }, // CHAINID
        .{ .opcode = 0x47, .needs_input = false }, // SELFBALANCE
        .{ .opcode = 0x48, .needs_input = false }, // BASEFEE
        .{ .opcode = 0x49, .needs_input = true },  // BLOBHASH
        .{ .opcode = 0x4A, .needs_input = false }, // BLOBBASEFEE
    };
    
    for (opcodes) |op| {
        // Clear stack for clean test
        test_frame.frame.stack.clear();
        
        if (op.needs_input) {
            try test_frame.pushStack(&[_]u256{0}); // Input for BLOBHASH
        }
        
        const initial_stack_len = test_frame.frame.stack.size;
        
<<<<<<< HEAD
        _ = try helpers.executeOpcode(op.opcode, &test_vm.vm, test_frame.frame);
=======
        _ = try helpers.executeOpcode(op.opcode, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        
        // Check that exactly one value was pushed (or net zero for BLOBHASH which pops 1 and pushes 1)
        const expected_len = if (op.needs_input) 
            initial_stack_len  // BLOBHASH: pop 1, push 1 = net 0
        else 
            initial_stack_len + 1;     // Others: just push 1 = net +1
        try testing.expectEqual(expected_len, test_frame.frame.stack.size);
    }
}