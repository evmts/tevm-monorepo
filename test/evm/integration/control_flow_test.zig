const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers");

// Import opcodes through evm module
const evm = @import("evm");
const control = evm.opcodes.control;
const comparison = evm.opcodes.comparison;
const stack = evm.opcodes.stack;
const arithmetic = evm.opcodes.arithmetic;
const memory = evm.opcodes.memory;
const Contract = evm.Contract;

// WORKING ON THIS: Fixing conditional jump patterns test

test "Integration: Conditional jump patterns" {
    // Test JUMPI with various conditions
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    // Create bytecode with jump destinations
    var code = [_]u8{0} ** 100;
    code[10] = 0x5b; // JUMPDEST at position 10
    code[20] = 0x5b; // JUMPDEST at position 20
    code[30] = 0x5b; // JUMPDEST at position 30

    // Calculate proper code hash after setting up the code
    var code_hash: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(&code, &code_hash, .{});

    var contract = Contract.init(
        helpers.TestAddresses.ALICE,
        helpers.TestAddresses.CONTRACT,
        0,
        1_000_000,
        &code,
        code_hash,
        &[_]u8{},
        false,
    );

    // Pre-analyze jump destinations
    contract.analyze_jumpdests();

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test 1: Jump when condition is true
    test_frame.frame.pc = 0;
    // JUMPI expects stack: [condition, destination] with destination on top
    try test_frame.pushStack(&[_]u256{ 1, 10 }); // condition=1, destination=10
    _ = try helpers.executeOpcode(0x57, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 10), test_frame.frame.pc);

    // Test 2: Don't jump when condition is false
    test_frame.frame.pc = 0;
    // JUMPI expects stack: [condition, destination] with destination on top
    try test_frame.pushStack(&[_]u256{ 0, 20 }); // condition=0, destination=20
    _ = try helpers.executeOpcode(0x57, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.pc); // PC unchanged

    // Test 3: Complex condition evaluation
    test_frame.frame.pc = 0;

    // Calculate condition: 5 > 3
    try test_frame.pushStack(&[_]u256{ 5, 3 });
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame); // GT Result: 1, Stack: [1]

    // Push destination (30) on top of condition
    try test_frame.pushStack(&[_]u256{30}); // Stack: [1, 30] with 30 on top
    // Now stack is [condition=1, destination=30] which is correct for JUMPI

    _ = try helpers.executeOpcode(0x57, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 30), test_frame.frame.pc);
}

test "Integration: Loop implementation with JUMP" {
    // Implement a simple counter loop
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    // Create bytecode for loop
    var code = [_]u8{0} ** 100;
    code[0] = 0x5b; // JUMPDEST (loop start)
    code[50] = 0x5b; // JUMPDEST (loop end)

    // Calculate proper code hash after setting up the code
    var code_hash: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(&code, &code_hash, .{});

    var contract = Contract.init(
        helpers.TestAddresses.ALICE,
        helpers.TestAddresses.CONTRACT,
        0,
        1_000_000,
        &code,
        code_hash,
        &[_]u8{},
        false,
    );

    contract.analyze_jumpdests();

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Initialize counter to 5
    try test_frame.pushStack(&[_]u256{5});

    // Simulate loop iterations
    var iterations: u32 = 0;
    while (iterations < 5) : (iterations += 1) {
        // Decrement counter
        try test_frame.pushStack(&[_]u256{1});
        _ = try helpers.executeOpcode(0x03, &test_vm.vm, test_frame.frame);

        // Duplicate for comparison
        _ = try helpers.executeOpcode(0x80, &test_vm.vm, test_frame.frame);

        // Check if counter > 0
        try test_frame.pushStack(&[_]u256{0});
        _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame);

        // If counter > 0, we would jump back to loop start
        const condition = try test_frame.popStack();
        if (condition == 0) break;
    }

    // Counter should be 0
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "Integration: Return data handling" {
    // Test RETURN with memory data
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

    // Store data in memory
    const return_value: u256 = 0x42424242;
    try test_frame.pushStack(&[_]u256{ 0, return_value }); // offset, value
    _ = try helpers.executeOpcode(0x52, &test_vm.vm, test_frame.frame);

    // Return 32 bytes from offset 0
    try test_frame.pushStack(&[_]u256{ 0, 32 }); // offset, size

    // RETURN will throw an error (ExecutionError.STOP) which is expected
    const result = helpers.executeOpcode(0xF3, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, result);

    // The return data would be available in frame.return_data_buffer
    try testing.expectEqual(@as(usize, 32), test_frame.frame.return_data_buffer.len);
}

test "Integration: Revert with reason" {
    // Test REVERT with error message
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

    // Store error message in memory
    const error_msg = "Insufficient balance";
    try test_frame.setMemory(0, error_msg);

    // Revert with error message
    try test_frame.pushStack(&[_]u256{ 0, error_msg.len }); // offset, size

    // REVERT will throw an error (ExecutionError.REVERT) which is expected
    const result = helpers.executeOpcode(0xFD, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.REVERT, result);

    // The revert data would be available in frame.return_data_buffer
    try testing.expectEqual(@as(usize, error_msg.len), test_frame.frame.return_data_buffer.len);
    try testing.expectEqualSlices(u8, error_msg, test_frame.frame.return_data_buffer);
}

test "Integration: PC tracking through operations" {
    // Test PC opcode and tracking
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

    // Set PC to a specific value
    test_frame.frame.pc = 42;

    // Get current PC
    _ = try helpers.executeOpcode(0x58, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 42);

    // Change PC and get again
    test_frame.frame.pc = 100;
    _ = try helpers.executeOpcode(0x58, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 100);
}

test "Integration: Invalid opcode handling" {
    // Test INVALID opcode
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

    // Execute INVALID opcode
    std.debug.print("\nInvalid opcode test: Gas before execution: {}\n", .{test_frame.frame.gas_remaining});
    const result = helpers.executeOpcode(0xFE, &test_vm.vm, test_frame.frame);
    std.debug.print("Invalid opcode test: Gas after execution: {}\n", .{test_frame.frame.gas_remaining});
    try testing.expectError(helpers.ExecutionError.Error.InvalidOpcode, result);

    // All gas should be consumed
    try testing.expectEqual(@as(u64, 0), test_frame.frame.gas_remaining);
}

test "Integration: Nested conditions with jumps" {
    // Test complex control flow: if (a > b && c < d) { ... }
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    // Create bytecode with multiple jump destinations
    var code = [_]u8{0} ** 100;
    code[20] = 0x5b; // JUMPDEST (first condition false)
    code[40] = 0x5b; // JUMPDEST (both conditions true)
    code[60] = 0x5b; // JUMPDEST (end)

    // Calculate proper code hash after setting up the code
    var code_hash: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(&code, &code_hash, .{});

    var contract = Contract.init(
        helpers.TestAddresses.ALICE,
        helpers.TestAddresses.CONTRACT,
        0,
        1_000_000,
        &code,
        code_hash,
        &[_]u8{},
        false,
    );

    contract.analyze_jumpdests();

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test values: a=10, b=5, c=3, d=8
    const a: u256 = 10;
    const b: u256 = 5;
    const c: u256 = 3;
    const d: u256 = 8;

    // First condition: a > b (should be true)
    try test_frame.pushStack(&[_]u256{ a, b });
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame);

    // If first condition is false, jump to end
    _ = try helpers.executeOpcode(0x80, &test_vm.vm, test_frame.frame);
    _ = try helpers.executeOpcode(0x15, &test_vm.vm, test_frame.frame);
    try test_frame.pushStack(&[_]u256{60}); // Jump to end if false
    _ = try helpers.executeOpcode(0x90, &test_vm.vm, test_frame.frame);

    // This would be a JUMPI in real execution
    const should_skip_first = try test_frame.popStack();
    _ = try test_frame.popStack(); // Pop destination
    try testing.expectEqual(@as(u256, 0), should_skip_first); // Should not skip

    // Second condition: c < d (should be true)
    try test_frame.pushStack(&[_]u256{ c, d });
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);

    // AND the conditions
    _ = try helpers.executeOpcode(0x02, &test_vm.vm, test_frame.frame); // Using MUL as AND for 0/1 values

    try helpers.expectStackValue(test_frame.frame, 0, 1); // Both conditions true
}

test "Integration: Self-destruct with beneficiary" {
    // Test SELFDESTRUCT operation
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    // Set up contract with balance
    const contract_balance: u256 = 1000;
    try test_vm.setAccount(helpers.TestAddresses.CONTRACT, contract_balance, &[_]u8{});

    // Set up beneficiary
    const beneficiary_initial: u256 = 500;
    try test_vm.setAccount(helpers.TestAddresses.BOB, beneficiary_initial, &[_]u8{});

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

    // Get initial beneficiary balance
    const initial_balance = try test_vm.vm.get_balance(helpers.TestAddresses.BOB);
    try testing.expectEqual(beneficiary_initial, initial_balance);

    // Execute selfdestruct with BOB as beneficiary
    try test_frame.pushStack(&[_]u256{helpers.toU256(helpers.TestAddresses.BOB)});

    // Note: Actual selfdestruct implementation would transfer balance and mark for deletion
    // For this test, we're just verifying the opcode executes
    const result = helpers.executeOpcode(0xFF, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, result);
}
