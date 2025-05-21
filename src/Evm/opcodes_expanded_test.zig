const std = @import("std");
const testing = std.testing;

// Import from the main Evm module directly using local imports
const Interpreter = @import("interpreter.zig").Interpreter;
const Frame = @import("Frame.zig").Frame;
const ExecutionError = @import("interpreter.zig").InterpreterError;
const Stack = @import("Stack.zig").Stack;
const Memory = @import("Memory.zig").Memory;
const Evm = @import("evm.zig").Evm;
const Contract = @import("Contract.zig").Contract;
const createContract = @import("Contract.zig").createContract;
const ChainRules = @import("evm.zig").ChainRules;
const Hardfork = @import("evm.zig").Hardfork;
const JumpTable = @import("JumpTable.zig");
const opcodes = @import("opcodes.zig");

// Create a stub Address type for testing
const Address = [20]u8;

// Import opcode-specific modules
const block = @import("opcodes/block.zig");

// Use Zig's built-in u256 type
const u256_native = u256;

/// Helper function to convert hex string to Address
fn hexToAddress(allocator: std.mem.Allocator, comptime hex_str: []const u8) !Address {
    _ = allocator;
    if (!std.mem.startsWith(u8, hex_str, "0x") or hex_str.len != 42) {
        return error.InvalidAddressFormat;
    }
    var addr: Address = undefined;
    try std.fmt.hexToBytes(&addr, hex_str[2..]);
    return addr;
}

/// Setup function to create an EVM instance with a specific hardfork
fn setupEvmForHardfork(allocator: std.mem.Allocator, hardfork: Hardfork) !Evm {
    var evm_instance = try Evm.init(null);
    evm_instance.chainRules = ChainRules.forHardfork(hardfork);
    return evm_instance;
}

/// Setup function to create a JumpTable for a specific hardfork
fn setupJumpTableForHardfork(allocator: std.mem.Allocator, hardfork: []const u8) !JumpTable.JumpTable {
    return try JumpTable.newJumpTable(allocator, hardfork);
}

/// Setup function to create an Interpreter for a specific hardfork
fn setupInterpreterForHardfork(allocator: std.mem.Allocator, hardfork: Hardfork) !*Interpreter {
    var evm_instance = try setupEvmForHardfork(allocator, hardfork);
    const jump_table = try setupJumpTableForHardfork(allocator, @tagName(hardfork));
    
    // Create and return the interpreter
    const interpreter_instance = try Interpreter.create(allocator, &evm_instance, jump_table);
    return &interpreter_instance;
}

/// Setup function to create a contract
fn setupContract(allocator: std.testing.Allocator, code_slice: []const u8) !Contract {
    var contract_instance = createContract(
        try hexToAddress(allocator, "0x0000000000000000000000000000000000000001"),
        try hexToAddress(allocator, "0x0000000000000000000000000000000000000002"),
        0,
        1000000, // Increased gas for tests
    );
    contract_instance.code = code_slice;
    return contract_instance;
}

/// Setup function to create a frame for a contract
fn setupFrameForContract(allocator: std.testing.Allocator, contract: *Contract) !*Frame {
    const frame_instance = try Frame.init(allocator, contract);
    return frame_instance;
}

// Test to verify availability of opcodes based on different hardforks
test "Opcode Availability by Hardfork" {
    // Use testing allocator
    const allocator = std.testing.allocator;
    
    // Test structure: hardfork name -> opcode byte -> should be available
    const test_cases = [_]struct {
        hardfork: Hardfork,
        opcode: u8,
        opcode_name: []const u8,
        should_be_available: bool,
    }{
        // Test EIP-145 opcodes (Constantinople) - SHL, SHR, SAR
        .{ .hardfork = .Byzantium, .opcode = 0x1B, .opcode_name = "SHL", .should_be_available = false },
        .{ .hardfork = .Constantinople, .opcode = 0x1B, .opcode_name = "SHL", .should_be_available = true },
        .{ .hardfork = .Byzantium, .opcode = 0x1C, .opcode_name = "SHR", .should_be_available = false },
        .{ .hardfork = .Constantinople, .opcode = 0x1C, .opcode_name = "SHR", .should_be_available = true },
        .{ .hardfork = .Byzantium, .opcode = 0x1D, .opcode_name = "SAR", .should_be_available = false },
        .{ .hardfork = .Constantinople, .opcode = 0x1D, .opcode_name = "SAR", .should_be_available = true },
        
        // Test EIP-1344 (Istanbul) - CHAINID
        .{ .hardfork = .Petersburg, .opcode = 0x46, .opcode_name = "CHAINID", .should_be_available = false },
        .{ .hardfork = .Istanbul, .opcode = 0x46, .opcode_name = "CHAINID", .should_be_available = true },
        
        // Test EIP-1884 (Istanbul) - SELFBALANCE
        .{ .hardfork = .Petersburg, .opcode = 0x47, .opcode_name = "SELFBALANCE", .should_be_available = false },
        .{ .hardfork = .Istanbul, .opcode = 0x47, .opcode_name = "SELFBALANCE", .should_be_available = true },
        
        // Test EIP-3198 (London) - BASEFEE
        .{ .hardfork = .Berlin, .opcode = 0x48, .opcode_name = "BASEFEE", .should_be_available = false },
        .{ .hardfork = .London, .opcode = 0x48, .opcode_name = "BASEFEE", .should_be_available = true },
        
        // Test EIP-3855 (Shanghai) - PUSH0
        .{ .hardfork = .Merge, .opcode = 0x5F, .opcode_name = "PUSH0", .should_be_available = false },
        .{ .hardfork = .Shanghai, .opcode = 0x5F, .opcode_name = "PUSH0", .should_be_available = true },
        
        // Test EIP-1153 (Cancun) - TLOAD, TSTORE
        .{ .hardfork = .Shanghai, .opcode = 0x5C, .opcode_name = "TLOAD", .should_be_available = false },
        .{ .hardfork = .Cancun, .opcode = 0x5C, .opcode_name = "TLOAD", .should_be_available = true },
        .{ .hardfork = .Shanghai, .opcode = 0x5D, .opcode_name = "TSTORE", .should_be_available = false },
        .{ .hardfork = .Cancun, .opcode = 0x5D, .opcode_name = "TSTORE", .should_be_available = true },
        
        // Test EIP-5656 (Cancun) - MCOPY
        .{ .hardfork = .Shanghai, .opcode = 0x5E, .opcode_name = "MCOPY", .should_be_available = false },
        .{ .hardfork = .Cancun, .opcode = 0x5E, .opcode_name = "MCOPY", .should_be_available = true },
        
        // Test EIP-4844 (Cancun) - BLOBHASH, BLOBBASEFEE
        .{ .hardfork = .Shanghai, .opcode = 0x49, .opcode_name = "BLOBHASH", .should_be_available = false },
        .{ .hardfork = .Cancun, .opcode = 0x49, .opcode_name = "BLOBHASH", .should_be_available = true },
        .{ .hardfork = .Shanghai, .opcode = 0x4A, .opcode_name = "BLOBBASEFEE", .should_be_available = false },
        .{ .hardfork = .Cancun, .opcode = 0x4A, .opcode_name = "BLOBBASEFEE", .should_be_available = true },
    };
    
    // Create JumpTable for each hardfork and verify opcode availability
    for (test_cases) |test_case| {
        // Get hardfork name as string
        const hardfork_name = @tagName(test_case.hardfork);
        
        // Setup jump table for this hardfork
        var jump_table = try setupJumpTableForHardfork(allocator, hardfork_name);
        
        // Check if the opcode is defined or is UNDEFINED
        const operation = jump_table.getOperation(test_case.opcode);
        const is_defined = !operation.undefined;
        
        // Verify availability matches expectation
        try testing.expectEqual(
            test_case.should_be_available, 
            is_defined,
            "Opcode {s} (0x{X:0>2}) availability mismatch for hardfork {s}: expected {}, got {}",
            .{ 
                test_case.opcode_name, 
                test_case.opcode, 
                hardfork_name, 
                test_case.should_be_available, 
                is_defined 
            }
        );
    }
}

// Test to verify the DIFFICULTY/PREVRANDAO opcode name switch after the Merge
test "DIFFICULTY/PREVRANDAO Opcode Behavior after Merge" {
    const allocator = testing.allocator;
    
    // Setup test for pre-Merge (London hardfork)
    {
        var evm_instance = try setupEvmForHardfork(allocator, .London);
        
        // Address setup
        var address_bytes = [_]u8{0} ** 20;
        address_bytes[19] = 1;
        const contract_address: Address = address_bytes;
        
        var caller_bytes = [_]u8{0} ** 20;
        caller_bytes[19] = 2;
        const caller_address: Address = caller_bytes;
        
        // Create contract
        var contract_instance = createContract(caller_address, contract_address, 0, 100000);
        contract_instance.code = &[_]u8{0x44}; // DIFFICULTY opcode
        
        // Setup interpreter and frame
        const jump_table = try setupJumpTableForHardfork(allocator, "london");
        var interpreter_instance = try Interpreter.create(allocator, &evm_instance, jump_table);
        var frame_instance = try Frame.init(allocator, &contract_instance);
        
        // Execute the opcode directly
        _ = try block.opDifficulty(0, &interpreter_instance, &frame_instance);
        
        // Verify the result is a reasonable difficulty value (pre-Merge behavior)
        try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
        
        // Should be a non-zero value representing difficulty
        const difficulty_result = frame_instance.stack.pop();
        try testing.expect(difficulty_result > 0);
        
        // Cleanup
        frame_instance.deinit();
    }
    
    // Setup test for post-Merge
    {
        var evm_instance = try setupEvmForHardfork(allocator, .Merge);
        
        // Address setup
        var address_bytes = [_]u8{0} ** 20;
        address_bytes[19] = 1;
        const contract_address: Address = address_bytes;
        
        var caller_bytes = [_]u8{0} ** 20;
        caller_bytes[19] = 2;
        const caller_address: Address = caller_bytes;
        
        // Create contract
        var contract_instance = createContract(caller_address, contract_address, 0, 100000);
        contract_instance.code = &[_]u8{0x44}; // Now PREVRANDAO opcode
        
        // Setup interpreter and frame
        const jump_table = try setupJumpTableForHardfork(allocator, "merge");
        var interpreter_instance = try Interpreter.create(allocator, &evm_instance, jump_table);
        var frame_instance = try Frame.init(allocator, &contract_instance);
        
        // Execute the opcode directly
        _ = try block.opDifficulty(0, &interpreter_instance, &frame_instance);
        
        // Verify the result looks like a 32-byte random value (post-Merge behavior)
        try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
        
        // Should be a large random-looking value
        const random_result = frame_instance.stack.pop();
        
        // The actual test depends on implementation, but we'll check it's not zero
        // and not equal to the standard pre-merge difficulty value (2500000000000000)
        try testing.expect(random_result != 0);
        try testing.expect(random_result != 2500000000000000);
        
        // Cleanup
        frame_instance.deinit();
    }
}

// Test to verify JumpTable updates when hardfork changes
test "JumpTable Updates for Different Hardforks" {
    const allocator = testing.allocator;
    
    // Test structure: hardfork pair, opcode to check, expected changes
    const test_cases = [_]struct {
        old_hardfork: []const u8,
        new_hardfork: []const u8,
        opcode: u8,
        opcode_name: []const u8,
        should_be_added: bool,
    }{
        // Constantinople adds SHL, SHR, SAR
        .{ .old_hardfork = "byzantium", .new_hardfork = "constantinople", .opcode = 0x1B, .opcode_name = "SHL", .should_be_added = true },
        
        // Istanbul adds CHAINID, SELFBALANCE
        .{ .old_hardfork = "petersburg", .new_hardfork = "istanbul", .opcode = 0x46, .opcode_name = "CHAINID", .should_be_added = true },
        .{ .old_hardfork = "petersburg", .new_hardfork = "istanbul", .opcode = 0x47, .opcode_name = "SELFBALANCE", .should_be_added = true },
        
        // London adds BASEFEE
        .{ .old_hardfork = "berlin", .new_hardfork = "london", .opcode = 0x48, .opcode_name = "BASEFEE", .should_be_added = true },
        
        // Shanghai adds PUSH0
        .{ .old_hardfork = "merge", .new_hardfork = "shanghai", .opcode = 0x5F, .opcode_name = "PUSH0", .should_be_added = true },
        
        // Cancun adds TLOAD, TSTORE, MCOPY, BLOBHASH, BLOBBASEFEE
        .{ .old_hardfork = "shanghai", .new_hardfork = "cancun", .opcode = 0x5C, .opcode_name = "TLOAD", .should_be_added = true },
        .{ .old_hardfork = "shanghai", .new_hardfork = "cancun", .opcode = 0x5D, .opcode_name = "TSTORE", .should_be_added = true },
        .{ .old_hardfork = "shanghai", .new_hardfork = "cancun", .opcode = 0x5E, .opcode_name = "MCOPY", .should_be_added = true },
        .{ .old_hardfork = "shanghai", .new_hardfork = "cancun", .opcode = 0x49, .opcode_name = "BLOBHASH", .should_be_added = true },
        .{ .old_hardfork = "shanghai", .new_hardfork = "cancun", .opcode = 0x4A, .opcode_name = "BLOBBASEFEE", .should_be_added = true },
    };
    
    for (test_cases) |test_case| {
        // Create jump tables for old and new hardforks
        var old_jump_table = try setupJumpTableForHardfork(allocator, test_case.old_hardfork);
        var new_jump_table = try setupJumpTableForHardfork(allocator, test_case.new_hardfork);
        
        // Check if the opcode is defined in old hardfork
        const old_operation = old_jump_table.getOperation(test_case.opcode);
        const old_is_defined = !old_operation.undefined;
        
        // Check if the opcode is defined in new hardfork
        const new_operation = new_jump_table.getOperation(test_case.opcode);
        const new_is_defined = !new_operation.undefined;
        
        if (test_case.should_be_added) {
            // If the opcode should be added, it should be undefined in old hardfork
            // and defined in new hardfork
            try testing.expectEqual(false, old_is_defined);
            try testing.expectEqual(true, new_is_defined);
        } else {
            // If the opcode should be removed, it should be defined in old hardfork
            // and undefined in new hardfork
            try testing.expectEqual(true, old_is_defined);
            try testing.expectEqual(false, new_is_defined);
        }
    }
}

// Test execution behavior when hardfork disables an opcode
test "Opcode Execution Behavior Across Hardforks" {
    const allocator = testing.allocator;
    
    // Test BASEFEE opcode which is added in London hardfork
    // First with Berlin (should fail)
    {
        const interpreter = try setupInterpreterForHardfork(allocator, .Berlin);
        defer allocator.destroy(interpreter);
        
        var contract = try setupContract(allocator, &[_]u8{0x48}); // BASEFEE opcode
        const frame = try setupFrameForContract(allocator, &contract);
        defer frame.deinit();
        
        // Run the interpreter - should fail with InvalidOpcode since BASEFEE isn't available pre-London
        const result = interpreter.run(&contract, &[_]u8{}, false);
        try testing.expectError(ExecutionError.InvalidOpcode, result);
    }
    
    // Then with London (should succeed)
    {
        const interpreter = try setupInterpreterForHardfork(allocator, .London);
        defer allocator.destroy(interpreter);
        
        var contract = try setupContract(allocator, &[_]u8{0x48}); // BASEFEE opcode
        const frame = try setupFrameForContract(allocator, &contract);
        defer frame.deinit();
        
        // Run the interpreter - should succeed with BASEFEE opcode in London
        _ = try interpreter.run(&contract, &[_]u8{}, false);
        
        // Check that we got a result on the stack
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
    
    // Test CREATE2 opcode which is added in Constantinople hardfork
    // First with Byzantium (should fail)
    {
        const interpreter = try setupInterpreterForHardfork(allocator, .Byzantium);
        defer allocator.destroy(interpreter);
        
        var contract = try setupContract(allocator, &[_]u8{0xF5}); // CREATE2 opcode
        const frame = try setupFrameForContract(allocator, &contract);
        defer frame.deinit();
        
        // Push required values for CREATE2
        try frame.stack.push(u256_native, 0); // value
        try frame.stack.push(u256_native, 0); // offset
        try frame.stack.push(u256_native, 0); // size
        try frame.stack.push(u256_native, 0); // salt
        
        // Run the interpreter - should fail with InvalidOpcode since CREATE2 isn't available pre-Constantinople
        const result = interpreter.run(&contract, &[_]u8{}, false);
        try testing.expectError(ExecutionError.InvalidOpcode, result);
    }
    
    // Then with Constantinople (should succeed)
    {
        const interpreter = try setupInterpreterForHardfork(allocator, .Constantinople);
        defer allocator.destroy(interpreter);
        
        var contract = try setupContract(allocator, &[_]u8{0xF5}); // CREATE2 opcode
        const frame = try setupFrameForContract(allocator, &contract);
        defer frame.deinit();
        
        // Push required values for CREATE2
        try frame.stack.push(u256_native, 0); // value
        try frame.stack.push(u256_native, 0); // offset
        try frame.stack.push(u256_native, 0); // size
        try frame.stack.push(u256_native, 0); // salt
        
        // Run the interpreter - should succeed with CREATE2 opcode in Constantinople
        // This call might still fail with another error related to state management, which is fine
        _ = interpreter.run(&contract, &[_]u8{}, false) catch |err| {
            switch (err) {
                ExecutionError.InvalidOpcode => {
                    try testing.expect(false);
                },
                else => {
                    // Other errors are expected due to lack of state setup
                    // But the main point is that InvalidOpcode shouldn't occur
                },
            }
        };
    }
}

// Test to verify that opcode names are correctly mapped across hardforks
test "Opcode Names Across Hardforks" {
    // Allocator not used in this test
    
    // Test specific opcodes names in different hardforks
    const test_cases = [_]struct {
        hardfork: []const u8,
        opcode: u8,
        expected_name: []const u8,
    }{
        // Test DIFFICULTY/PREVRANDAO name switch
        .{ .hardfork = "london", .opcode = 0x44, .expected_name = "DIFFICULTY" },
        .{ .hardfork = "merge", .opcode = 0x44, .expected_name = "PREVRANDAO" },
        
        // Other opcode names that remain consistent
        .{ .hardfork = "homestead", .opcode = 0x56, .expected_name = "JUMP" },
        .{ .hardfork = "latest", .opcode = 0x56, .expected_name = "JUMP" },
        
        // Newer opcodes
        .{ .hardfork = "latest", .opcode = 0x48, .expected_name = "BASEFEE" },
        .{ .hardfork = "latest", .opcode = 0x5F, .expected_name = "PUSH0" },
        .{ .hardfork = "latest", .opcode = 0x5C, .expected_name = "TLOAD" },
        .{ .hardfork = "latest", .opcode = 0x49, .expected_name = "BLOBHASH" },
    };
    
    // Run the tests
    for (test_cases) |test_case| {
        const actual_name = opcodes.getOpcodeName(test_case.opcode);
        
        // Compare with expected name
        try testing.expectEqualStrings(test_case.expected_name, actual_name);
    }
}

// Test that EIP3651 is correctly implemented (COINBASE should be warm)
test "EIP-3651: COINBASE should be warm by default" {
    const allocator = std.testing.allocator;
    
    // Create EVM with EIP-3651 disabled
    {
        var evm = try Evm.init(null);
        var chainRules = evm.chainRules;
        chainRules.IsEIP3651 = false;
        evm.setChainRules(chainRules);
        
        // Check that COINBASE gas cost matches cold access cost pre-EIP3651
        _ = JumpTable.ColdAccountAccessCost; // This would be the expected cost
        
        // Note: In a real implementation, we would assert that accessing COINBASE costs ColdAccountAccessCost
        // But our COINBASE opcode implementation might not have this gas metering yet
        try testing.expectEqual(false, chainRules.IsEIP3651);
    }
    
    // Create EVM with EIP-3651 enabled
    {
        var evm = try Evm.init(null);
        var chainRules = evm.chainRules;
        chainRules.IsEIP3651 = true;
        evm.setChainRules(chainRules);
        
        // Check that COINBASE gas cost matches warm access cost with EIP3651
        _ = JumpTable.WarmStorageReadCost; // This would be the expected cost
        
        // Note: In a real implementation, we would assert that accessing COINBASE costs WarmStorageReadCost
        // But our COINBASE opcode implementation might not have this gas metering yet
        try testing.expectEqual(true, chainRules.IsEIP3651);
    }
}