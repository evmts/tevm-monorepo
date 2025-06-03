const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers");
const evm = @import("evm");
const opcodes = evm.opcodes;

// Comprehensive integration tests combining multiple opcode categories

test "Integration: Complete ERC20 transfer simulation" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set up accounts
    const alice_balance: u256 = 1000;
    const bob_balance: u256 = 500;
    
    // Storage slots for balances (slot 0 for Alice, slot 1 for Bob)
    try test_vm.setStorage(helpers.TestAddresses.CONTRACT, 0, alice_balance);
    try test_vm.setStorage(helpers.TestAddresses.CONTRACT, 1, bob_balance);
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE, // Alice is calling
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Transfer amount
    const transfer_amount: u256 = 100;
    
    // 1. Load Alice's balance
    try test_frame.pushStack(&[_]u256{0}); // Alice's slot
    _ = try helpers.executeOpcode(opcodes.storage.op_sload, &test_vm.vm, &test_frame.frame);
    const alice_initial = try test_frame.popStack();
    try testing.expectEqual(alice_balance, alice_initial);
    
    // 2. Check if Alice has enough balance
    try test_frame.pushStack(&[_]u256{alice_initial, transfer_amount});
    _ = try helpers.executeOpcode(opcodes.comparison.op_lt, &test_vm.vm, &test_frame.frame);
    const insufficient = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), insufficient); // Should be false (sufficient balance)
    
    // 3. Calculate new balances
    try test_frame.pushStack(&[_]u256{alice_initial, transfer_amount});
    _ = try helpers.executeOpcode(opcodes.arithmetic.op_sub, &test_vm.vm, &test_frame.frame);
    const alice_new = try test_frame.popStack();
    
    try test_frame.pushStack(&[_]u256{1}); // Bob's slot
    _ = try helpers.executeOpcode(opcodes.storage.op_sload, &test_vm.vm, &test_frame.frame);
    const bob_initial = try test_frame.popStack();
    
    try test_frame.pushStack(&[_]u256{bob_initial, transfer_amount});
    _ = try helpers.executeOpcode(opcodes.arithmetic.op_add, &test_vm.vm, &test_frame.frame);
    const bob_new = try test_frame.popStack();
    
    // 4. Update storage
    try test_frame.pushStack(&[_]u256{alice_new, 0}); // value, slot
    _ = try helpers.executeOpcode(opcodes.storage.op_sstore, &test_vm.vm, &test_frame.frame);
    
    try test_frame.pushStack(&[_]u256{bob_new, 1}); // value, slot
    _ = try helpers.executeOpcode(opcodes.storage.op_sstore, &test_vm.vm, &test_frame.frame);
    
    // 5. Emit Transfer event
    const transfer_sig: u256 = 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef;
    
    // Store transfer amount in memory for event data
    var amount_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &amount_bytes, transfer_amount, .big);
    try test_frame.setMemory(0, &amount_bytes);
    
    try test_frame.pushStack(&[_]u256{
        helpers.toU256(helpers.TestAddresses.BOB),   // to (indexed)
        helpers.toU256(helpers.TestAddresses.ALICE), // from (indexed)
        transfer_sig,                                 // event signature
        32,                                          // data size
        0,                                           // data offset
    });
    _ = try helpers.executeOpcode(opcodes.log.op_log3, &test_vm.vm, &test_frame.frame);
    
    // 6. Verify final balances
    const alice_final = try test_vm.getStorage(helpers.TestAddresses.CONTRACT, 0);
    const bob_final = try test_vm.getStorage(helpers.TestAddresses.CONTRACT, 1);
    
    try testing.expectEqual(@as(u256, 900), alice_final);
    try testing.expectEqual(@as(u256, 600), bob_final);
}

test "Integration: Smart contract deployment flow" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var deployer_contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        10000, // Deployer has funds
        &[_]u8{},
    );
    defer deployer_contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &deployer_contract, 200000);
    defer test_frame.deinit();
    
    // Build constructor arguments
    const initial_supply: u256 = 1_000_000;
    const decimals: u256 = 18;
    
    // Constructor bytecode that:
    // 1. Stores initial supply at slot 0
    // 2. Stores decimals at slot 1
    // 3. Returns runtime code
    const constructor_code = [_]u8{
        // Store initial supply
        0x69, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0F, 0x42, 0x40, 0x00, 0x00, // PUSH10 1000000
        0x60, 0x00, // PUSH1 0
        0x55,       // SSTORE
        
        // Store decimals
        0x60, 0x12, // PUSH1 18
        0x60, 0x01, // PUSH1 1
        0x55,       // SSTORE
        
        // Return runtime code (just a STOP for simplicity)
        0x60, 0x01, // PUSH1 1 (size)
        0x60, 0x20, // PUSH1 32 (offset of runtime code)
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x39,       // CODECOPY
        0x60, 0x01, // PUSH1 1 (size)
        0x60, 0x00, // PUSH1 0 (memory offset)
        0xf3,       // RETURN
        
        // Runtime code
        0x00,       // STOP
    };
    
    // Copy constructor code to memory
    var i: usize = 0;
    while (i < constructor_code.len) : (i += 1) {
        try test_frame.setMemory(i, &[_]u8{constructor_code[i]});
    }
    
    // Mock successful deployment
    test_vm.vm.create_result = .{
        .success = true,
        .address = helpers.TestAddresses.BOB,
        .gas_left = 150000,
        .output = &[_]u8{0x00}, // Runtime code
    };
    
    // Deploy contract
    try test_frame.pushStack(&[_]u256{
        constructor_code.len, // size
        0,                    // offset
        0,                    // value
    });
    
    _ = try helpers.executeOpcode(opcodes.system.op_create, &test_vm.vm, &test_frame.frame);
    
    const deployed_address = try test_frame.popStack();
    try testing.expectEqual(helpers.toU256(helpers.TestAddresses.BOB), deployed_address);
    
    // Verify deployment by calling the contract
    test_frame.frame.stack.clear();
    test_vm.vm.call_result = .{
        .success = true,
        .gas_left = 90000,
        .output = null,
    };
    
    try test_frame.pushStack(&[_]u256{
        0, 0, 0, 0, 0,
        deployed_address,
        50000,
    });
    
    _ = try helpers.executeOpcode(opcodes.system.op_call, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1); // Success
}

test "Integration: Complex control flow with nested conditions" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Contract that implements:
    // if (value >= 100) {
    //     if (value <= 200) {
    //         result = value * 2;
    //     } else {
    //         result = value + 50;
    //     }
    // } else {
    //     result = value;
    // }
    var code = [_]u8{
        // Load value (150 for this test)
        0x60, 0x96, // PUSH1 150
        0x80,       // DUP1
        
        // Check >= 100
        0x60, 0x64, // PUSH1 100
        0x10,       // LT
        0x15,       // ISZERO (now have value >= 100)
        0x60, 0x0E, // PUSH1 14 (jump to first branch)
        0x57,       // JUMPI
        
        // Else branch: result = value
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x00,       // STOP
        
        // First branch (offset 14)
        0x5b,       // JUMPDEST
        0x80,       // DUP1
        0x60, 0xC8, // PUSH1 200
        0x11,       // GT
        0x60, 0x1E, // PUSH1 30 (jump to > 200 branch)
        0x57,       // JUMPI
        
        // 100 <= value <= 200: result = value * 2
        0x60, 0x02, // PUSH1 2
        0x02,       // MUL
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x00,       // STOP
        
        // > 200 branch (offset 30)
        0x5b,       // JUMPDEST
        0x60, 0x32, // PUSH1 50
        0x01,       // ADD
        0x60, 0x00, // PUSH1 0
        0x52,       // MSTORE
        0x00,       // STOP
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
    
    // Execute the contract logic step by step
    // We'll test with value = 150, which should result in 300 (150 * 2)
    
    // Push 150
    _ = try helpers.executeOpcodeAt(opcodes.stack.op_push1, 0, &test_vm.vm, &test_frame.frame);
    test_frame.frame.pc = 2;
    
    // DUP1
    _ = try helpers.executeOpcode(opcodes.stack.op_dup1, &test_vm.vm, &test_frame.frame);
    test_frame.frame.pc = 3;
    
    // Push 100
    _ = try helpers.executeOpcodeAt(opcodes.stack.op_push1, 3, &test_vm.vm, &test_frame.frame);
    test_frame.frame.pc = 5;
    
    // LT
    _ = try helpers.executeOpcode(opcodes.comparison.op_lt, &test_vm.vm, &test_frame.frame);
    test_frame.frame.pc = 6;
    
    // ISZERO
    _ = try helpers.executeOpcode(opcodes.comparison.op_iszero, &test_vm.vm, &test_frame.frame);
    test_frame.frame.pc = 7;
    
    // Push jump destination
    _ = try helpers.executeOpcodeAt(opcodes.stack.op_push1, 7, &test_vm.vm, &test_frame.frame);
    test_frame.frame.pc = 9;
    
    // JUMPI (should jump to 14)
    _ = try helpers.executeOpcode(opcodes.control.op_jumpi, &test_vm.vm, &test_frame.frame);
    try testing.expectEqual(@as(usize, 14), test_frame.frame.pc);
    
    // Continue execution from JUMPDEST at 14
    test_frame.frame.pc = 15; // Skip JUMPDEST
    
    // DUP1
    _ = try helpers.executeOpcode(opcodes.stack.op_dup1, &test_vm.vm, &test_frame.frame);
    test_frame.frame.pc = 16;
    
    // Push 200
    _ = try helpers.executeOpcodeAt(opcodes.stack.op_push1, 16, &test_vm.vm, &test_frame.frame);
    test_frame.frame.pc = 18;
    
    // GT
    _ = try helpers.executeOpcode(opcodes.comparison.op_gt, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0); // 150 > 200 is false
    test_frame.frame.pc = 19;
    
    // Push jump destination
    _ = try helpers.executeOpcodeAt(opcodes.stack.op_push1, 19, &test_vm.vm, &test_frame.frame);
    test_frame.frame.pc = 21;
    
    // JUMPI (should not jump)
    _ = try helpers.executeOpcode(opcodes.control.op_jumpi, &test_vm.vm, &test_frame.frame);
    try testing.expectEqual(@as(usize, 21), test_frame.frame.pc); // No jump
    
    // Continue with multiplication
    test_frame.frame.pc = 22;
    
    // Push 2
    _ = try helpers.executeOpcodeAt(opcodes.stack.op_push1, 22, &test_vm.vm, &test_frame.frame);
    test_frame.frame.pc = 24;
    
    // MUL
    _ = try helpers.executeOpcode(opcodes.arithmetic.op_mul, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 300); // 150 * 2
    
    // Store result
    test_frame.frame.pc = 25;
    try test_frame.pushStack(&[_]u256{0}); // offset
    _ = try helpers.executeOpcode(opcodes.memory.op_mstore, &test_vm.vm, &test_frame.frame);
    
    // Verify result in memory
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(opcodes.memory.op_mload, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 300);
}

test "Integration: Gas metering across operations" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    const initial_gas = test_frame.frame.gas_remaining;
    var total_gas_used: u64 = 0;
    
    // 1. Arithmetic operations
    try test_frame.pushStack(&[_]u256{10, 20});
    _ = try helpers.executeOpcode(opcodes.arithmetic.op_add, &test_vm.vm, &test_frame.frame);
    total_gas_used += initial_gas - test_frame.frame.gas_remaining;
    
    // 2. Memory operation
    try test_frame.pushStack(&[_]u256{0}); // offset
    const gas_before_mstore = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.memory.op_mstore, &test_vm.vm, &test_frame.frame);
    const mstore_gas = gas_before_mstore - test_frame.frame.gas_remaining;
    total_gas_used += mstore_gas;
    try testing.expect(mstore_gas > 3); // Should include memory expansion
    
    // 3. Storage operation (cold)
    const slot: u256 = 999;
    try test_frame.pushStack(&[_]u256{slot});
    const gas_before_sload = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.storage.op_sload, &test_vm.vm, &test_frame.frame);
    const sload_gas = gas_before_sload - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2100), sload_gas); // Cold access
    total_gas_used += sload_gas;
    
    // 4. SHA3 with data
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 32}); // offset, size
    const gas_before_sha3 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.crypto.op_sha3, &test_vm.vm, &test_frame.frame);
    const sha3_gas = gas_before_sha3 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 30 + 6), sha3_gas); // Base + 1 word
    total_gas_used += sha3_gas;
    
    // 5. Environment operation (cold address)
    test_frame.frame.stack.clear();
    const cold_address = helpers.toU256(helpers.TestAddresses.CHARLIE);
    try test_frame.pushStack(&[_]u256{cold_address});
    const gas_before_balance = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.environment.op_balance, &test_vm.vm, &test_frame.frame);
    const balance_gas = gas_before_balance - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2600), balance_gas); // Cold address
    total_gas_used += balance_gas;
    
    // Verify total gas consumption
    try testing.expectEqual(total_gas_used, initial_gas - test_frame.frame.gas_remaining);
}

test "Integration: Error propagation and recovery" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        1000,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test 1: Stack underflow recovery
    const div_result = opcodes.arithmetic.op_div(0, &test_vm.vm, &test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, div_result);
    
    // Stack should still be usable
    try test_frame.pushStack(&[_]u256{10, 5});
    _ = try helpers.executeOpcode(opcodes.arithmetic.op_div, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 2);
    
    // Test 2: Out of gas recovery
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 50; // Very low gas
    
    // Try expensive operation
    try test_frame.pushStack(&[_]u256{999}); // Cold storage slot
    const sload_result = opcodes.storage.op_sload(0, &test_vm.vm, &test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfGas, sload_result);
    
    // Test 3: Invalid jump recovery
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 10000; // Reset gas
    
    try test_frame.pushStack(&[_]u256{999}); // Invalid jump destination
    const jump_result = opcodes.control.op_jump(0, &test_vm.vm, &test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, jump_result);
    
    // Test 4: Write protection in static context
    test_frame.frame.stack.clear();
    test_frame.frame.is_static = true;
    
    try test_frame.pushStack(&[_]u256{42, 0}); // value, slot
    const sstore_result = opcodes.storage.op_sstore(0, &test_vm.vm, &test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.WriteProtection, sstore_result);
    
    // Reset static flag and verify normal operation works
    test_frame.frame.is_static = false;
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42, 0});
    _ = try helpers.executeOpcode(opcodes.storage.op_sstore, &test_vm.vm, &test_frame.frame);
    
    // Verify storage was updated
    const stored_value = try test_vm.getStorage(helpers.TestAddresses.CONTRACT, 0);
    try testing.expectEqual(@as(u256, 42), stored_value);
}
