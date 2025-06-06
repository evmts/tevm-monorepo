const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers");

// Import opcodes through evm module
const evm = @import("evm");
const memory = evm.opcodes.memory;
const storage = evm.opcodes.storage;
const bitwise = evm.opcodes.bitwise;
const arithmetic = evm.opcodes.arithmetic;
const crypto = evm.opcodes.crypto;
const stack = evm.opcodes.stack;
const comparison = evm.opcodes.comparison;

test "Integration: Token balance check pattern" {
    // Simulate checking and updating a token balance
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Simulate ERC20 balance mapping: mapping(address => uint256)
    // Storage slot = keccak256(address . uint256(0))

    // Store Alice's address in memory at offset 0
    const alice_addr = helpers.toU256(helpers.TestAddresses.ALICE);
    try test_frame.pushStack(&[_]u256{ alice_addr, 0 }); // value first, then offset
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);

    // Store mapping slot (0) at offset 32
    try test_frame.pushStack(&[_]u256{ 0, 32 }); // value first, then offset
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);

    // Hash to get storage slot
    try test_frame.pushStack(&[_]u256{ 64, 0 }); // size first, then offset
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);

    // Set initial balance
    const initial_balance: u256 = 1000;
    _ = try helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame); // Duplicate slot
    try test_frame.pushStack(&[_]u256{initial_balance}); // Stack: [slot_hash, slot_hash, initial_balance]
    _ = try helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame); // SWAP1: [slot_hash, initial_balance, slot_hash]
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame); // SSTORE: pops slot_hash, then initial_balance

    // Load balance
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame); // SLOAD using the remaining slot_hash

    // Check if balance >= 100. The original test comment implied this, but the code aimed for 100 < balance.
    // We will stick to making `100 < balance` evaluate to true (1) as the expectStackValue suggests.
    // Original stack after SLOAD: [balance]
    try test_frame.pushStack(&[_]u256{100}); // Stack: [balance, 100]
    // To evaluate 100 < balance (where op_lt is a < b with b=pop, a=pop):
    // We need stack [100, balance] before LT.
    // Current: [balance, 100]. So, SWAP1.
    _ = try helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame); // SWAP1. Stack: [100, balance]
    _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame); // LT pops balance, then 100. Compares 100 < balance.

    // Result should be 1 (true) since 100 < 1000
    try helpers.expectStackValue(test_frame.frame, 0, 1);
}

test "Integration: Packed struct storage" {
    // Simulate Solidity packed struct storage
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Simulate struct { uint128 a; uint128 b; } packed in one slot
    const a: u256 = 12345; // Lower 128 bits
    const b: u256 = 67890; // Upper 128 bits

    // Pack values: b << 128 | a
    try test_frame.pushStack(&[_]u256{ b, 128 });
    _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame);
    try test_frame.pushStack(&[_]u256{a});
    _ = try helpers.executeOpcode(0x17, test_vm.vm, test_frame.frame);

    // Store packed value
    const slot: u256 = 5;
    try test_frame.pushStack(&[_]u256{slot}); // Now stack is [packed_value, slot]
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame); // SSTORE: pops slot, then packed_value

    // Load and unpack 'a' (lower 128 bits)
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);

    // Mask to get lower 128 bits
    const mask_128 = ((@as(u256, 1) << 128) - 1);
    try test_frame.pushStack(&[_]u256{mask_128});
    _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, a);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Load and unpack 'b' (upper 128 bits)
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    try test_frame.pushStack(&[_]u256{128});
    _ = try helpers.executeOpcode(0x1C, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, b);
}

test "Integration: Dynamic array length update" {
    // Simulate updating a dynamic array's length
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Dynamic array base slot
    const array_slot: u256 = 10;

    // Load current length
    try test_frame.pushStack(&[_]u256{array_slot});
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);

    // Increment length
    try test_frame.pushStack(&[_]u256{1});
    _ = try helpers.executeOpcode(0x01, test_vm.vm, test_frame.frame);

    // Store new length
    _ = try helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame); // Duplicate new length
    try test_frame.pushStack(&[_]u256{array_slot}); // Stack: [old_length, new_length, array_slot]
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame); // SSTORE: pops array_slot, then new_length

    // New length should be 1
    try helpers.expectStackValue(test_frame.frame, 0, 1);
}

test "Integration: Reentrancy guard pattern" {
    // Simulate a reentrancy guard check and set
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    const guard_slot: u256 = 99;
    _ = 1; // NOT_ENTERED constant (not used in this test)
    const ENTERED: u256 = 2;

    // Check guard status
    try test_frame.pushStack(&[_]u256{guard_slot});
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);

    // If not set, it's 0, so we need to check against NOT_ENTERED
    _ = try helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame);
    try test_frame.pushStack(&[_]u256{ENTERED});
    _ = try helpers.executeOpcode(0x14, test_vm.vm, test_frame.frame);

    // Should be 0 (not entered)
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Set guard to ENTERED
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame); // Remove old value from stack
    try test_frame.pushStack(&[_]u256{ ENTERED, guard_slot }); // Stack: [ENTERED, guard_slot]
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame); // SSTORE: pops guard_slot, then ENTERED

    // Verify guard is set
    try test_frame.pushStack(&[_]u256{guard_slot});
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, ENTERED);
}

test "Integration: Bitfield manipulation" {
    // Simulate complex bitfield operations
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Create a bitfield with flags at different positions
    var bitfield: u256 = 0;

    // Set bit 0 (0x1)
    try test_frame.pushStack(&[_]u256{ bitfield, 1 });
    _ = try helpers.executeOpcode(0x17, test_vm.vm, test_frame.frame);
    bitfield = try test_frame.popStack();

    // Set bit 7 (0x80)
    try test_frame.pushStack(&[_]u256{ bitfield, 0x80 });
    _ = try helpers.executeOpcode(0x17, test_vm.vm, test_frame.frame);
    bitfield = try test_frame.popStack();

    // Set bit 255 (highest bit)
    try test_frame.pushStack(&[_]u256{ bitfield, @as(u256, 1) << 255 });
    _ = try helpers.executeOpcode(0x17, test_vm.vm, test_frame.frame);
    bitfield = try test_frame.popStack();

    // Check if bit 7 is set
    try test_frame.pushStack(&[_]u256{ bitfield, 0x80 });
    _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame);
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x11, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, 1); // Bit 7 is set
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Clear bit 0
    try test_frame.pushStack(&[_]u256{ bitfield, 1 });
    _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame);
    bitfield = try test_frame.popStack();

    // Check if bit 0 is clear
    try test_frame.pushStack(&[_]u256{ bitfield, 1 });
    _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, 0); // Bit 0 is clear
}

test "Integration: Safe math operations" {
    // Simulate SafeMath-style overflow checks
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Safe addition: check if a + b overflows
    const a: u256 = std.math.maxInt(u256) - 100;
    const b: u256 = 50;

    // Calculate a + b
    try test_frame.pushStack(&[_]u256{ a, b });
    _ = try helpers.executeOpcode(0x01, test_vm.vm, test_frame.frame);
    const sum = try test_frame.popStack();

    // Check if sum < a (overflow occurred)
    try test_frame.pushStack(&[_]u256{ sum, a });
    _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame);

    // Should be 0 (no overflow since 50 < 100)
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test actual overflow
    const c: u256 = 200; // This will overflow
    try test_frame.pushStack(&[_]u256{ a, c });
    _ = try helpers.executeOpcode(0x01, test_vm.vm, test_frame.frame);
    const overflow_sum = try test_frame.popStack();

    // Check if overflow_sum < a (overflow occurred)
    try test_frame.pushStack(&[_]u256{ overflow_sum, a });
    _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame);

    // Should be 1 (overflow occurred)
    try helpers.expectStackValue(test_frame.frame, 0, 1);
}

test "Integration: Signature verification simulation" {
    // Simulate part of signature verification process
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Simulate message hash computation
    const message = "Hello, Ethereum!";

    // Store message in memory
    try test_frame.setMemory(0, message);

    // Hash the message
    try test_frame.pushStack(&[_]u256{ message.len, 0 }); // size first, then offset
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const message_hash = try test_frame.popStack();

    // Store Ethereum signed message prefix
    const prefix = "\x19Ethereum Signed Message:\n16";
    try test_frame.setMemory(100, prefix);

    // Store message length as ASCII
    try test_frame.pushStack(&[_]u256{ 100 + prefix.len, 0x3136 }); // offset first, then value
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);

    // Final hash would include prefix + length + message hash
    // This demonstrates the pattern even if not complete

    try testing.expect(message_hash != 0); // We got a hash
}

test "Integration: Multi-sig wallet threshold check" {
    // Simulate multi-sig wallet confirmation counting
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Storage layout:
    // slot 0: required confirmations
    // slot 1: confirmation count for current transaction

    // Set required confirmations to 3
    try test_frame.pushStack(&[_]u256{ 3, 0 });
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);

    // Initialize confirmation count to 0
    try test_frame.pushStack(&[_]u256{ 0, 1 });
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);

    // First confirmation - load, increment, store
    try test_frame.pushStack(&[_]u256{1}); // Load current count
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    try test_frame.pushStack(&[_]u256{1});
    _ = try helpers.executeOpcode(0x01, test_vm.vm, test_frame.frame); // Add 1
    try test_frame.pushStack(&[_]u256{1}); // Slot 1
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);

    // Second confirmation - load, increment, store
    try test_frame.pushStack(&[_]u256{1}); // Load current count
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    try test_frame.pushStack(&[_]u256{1});
    _ = try helpers.executeOpcode(0x01, test_vm.vm, test_frame.frame); // Add 1
    try test_frame.pushStack(&[_]u256{1}); // Slot 1
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);

    // Check if we have enough confirmations
    try test_frame.pushStack(&[_]u256{1}); // Load confirmation count
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);

    try test_frame.pushStack(&[_]u256{0}); // Load required confirmations
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);

    // Compare: confirmations >= required
    // Stack is [confirmations, required], LT computes confirmations < required
    _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame); // LT: confirmations < required
    _ = try helpers.executeOpcode(0x15, test_vm.vm, test_frame.frame); // NOT(confirmations < required) = confirmations >= required

    // Should be 0 (false) since 2 >= 3 is false
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Add third confirmation
    try test_frame.pushStack(&[_]u256{1}); // Load current count from slot 1
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    try test_frame.pushStack(&[_]u256{1});
    _ = try helpers.executeOpcode(0x01, test_vm.vm, test_frame.frame); // Add 1
    try test_frame.pushStack(&[_]u256{1}); // Store back to slot 1
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);

    // Check again
    try test_frame.pushStack(&[_]u256{1}); // Load confirmation count
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);

    try test_frame.pushStack(&[_]u256{0}); // Load required confirmations
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);

    // Compare: confirmations >= required
    // Stack is [confirmations, required], LT computes confirmations < required
    _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame); // LT: confirmations < required
    _ = try helpers.executeOpcode(0x15, test_vm.vm, test_frame.frame); // NOT(confirmations < required) = confirmations >= required

    // Should be 1 (true) since 3 >= 3 is true, so NOT(3 < 3) = NOT(false) = true
    try helpers.expectStackValue(test_frame.frame, 0, 1);
}
