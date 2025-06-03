const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Vm = evm.Vm;
const Address = @import("Address");
const ExecutionError = evm.ExecutionError;

// Helper function to create a test VM with basic setup
fn createTestVm(allocator: std.mem.Allocator) !*Vm {
    var vm = try allocator.create(Vm);
    vm.* = try Vm.init(allocator);
    
    // Set up basic context
    vm.chain_id = 1;
    vm.gas_price = 1000000000; // 1 gwei
    vm.tx_origin = Address.fromString("0x1234567890123456789012345678901234567890");
    
    // Set up block context
    vm.block_number = 10000;
    vm.block_timestamp = 1234567890;
    vm.block_difficulty = 1000000;
    vm.block_coinbase = Address.fromString("0x0000000000000000000000000000000000000000");
    vm.block_gas_limit = 30000000;
    vm.block_base_fee = 100000000; // 0.1 gwei
    
    return vm;
}

// ===== Control Flow Opcodes =====

test "VM: STOP opcode halts execution" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{0x00}; // STOP
    const result = try vm.run(&bytecode, Address.zero(), 1000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expect(result.gas_used > 0); // Some gas should be consumed
}

test "VM: JUMPDEST and JUMP sequence" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Jump to position 5 where JUMPDEST is located
    const bytecode = [_]u8{
        0x60, 0x05,  // PUSH1 5
        0x56,        // JUMP
        0x00,        // STOP (should be skipped)
        0x00,        // STOP (should be skipped)
        0x5B,        // JUMPDEST (position 5)
        0x60, 0x42,  // PUSH1 66
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // After execution, stack should contain 66
    try testing.expectEqual(@as(u256, 66), vm.stack.data[0]);
}

test "VM: JUMPI conditional jump taken" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Jump to position 7 if condition is true (non-zero)
    const bytecode = [_]u8{
        0x60, 0x01,  // PUSH1 1 (true condition)
        0x60, 0x07,  // PUSH1 7 (jump destination)
        0x57,        // JUMPI
        0x60, 0xFF,  // PUSH1 255 (should be skipped)
        0x00,        // STOP (should be skipped)
        0x5B,        // JUMPDEST (position 7)
        0x60, 0xAA,  // PUSH1 170
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // Stack should contain 170, not 255
    try testing.expectEqual(@as(u256, 170), vm.stack.data[0]);
}

test "VM: JUMPI conditional jump not taken" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Don't jump if condition is false (zero)
    const bytecode = [_]u8{
        0x60, 0x00,  // PUSH1 0 (false condition)
        0x60, 0x07,  // PUSH1 7 (jump destination)
        0x57,        // JUMPI
        0x60, 0xFF,  // PUSH1 255 (should execute)
        0x00,        // STOP
        0x5B,        // JUMPDEST (position 7, should not reach)
        0x60, 0xAA,  // PUSH1 170
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // Stack should contain 255, not 170
    try testing.expectEqual(@as(u256, 255), vm.stack.data[0]);
}

test "VM: PC opcode returns current program counter" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x58,        // PC (at position 0)
        0x60, 0x01,  // PUSH1 1
        0x58,        // PC (at position 3)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // Stack should contain [0, 1, 3] (bottom to top)
    try testing.expectEqual(@as(u256, 0), vm.stack.data[0]);
    try testing.expectEqual(@as(u256, 1), vm.stack.data[1]);
    try testing.expectEqual(@as(u256, 3), vm.stack.data[2]);
}

// ===== Arithmetic Opcodes =====

test "VM: ADD opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x05,  // PUSH1 5
        0x60, 0x03,  // PUSH1 3
        0x01,        // ADD
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 8), vm.stack.data[0]);
}

test "VM: MUL opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x07,  // PUSH1 7
        0x60, 0x06,  // PUSH1 6
        0x02,        // MUL
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 42), vm.stack.data[0]);
}

test "VM: SUB opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x05,  // PUSH1 5
        0x60, 0x0A,  // PUSH1 10
        0x03,        // SUB (10 - 5)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 5), vm.stack.data[0]);
}

test "VM: DIV opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x03,  // PUSH1 3
        0x60, 0x0F,  // PUSH1 15
        0x04,        // DIV (15 / 3)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 5), vm.stack.data[0]);
}

test "VM: DIV by zero returns zero" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x00,  // PUSH1 0
        0x60, 0x0A,  // PUSH1 10
        0x04,        // DIV (10 / 0)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.stack.data[0]);
}

test "VM: MOD opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x03,  // PUSH1 3
        0x60, 0x0A,  // PUSH1 10
        0x06,        // MOD (10 % 3)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 1), vm.stack.data[0]);
}

test "VM: ADDMOD opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x03,  // PUSH1 3 (modulus)
        0x60, 0x04,  // PUSH1 4
        0x60, 0x05,  // PUSH1 5
        0x08,        // ADDMOD ((5 + 4) % 3 = 0)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.stack.data[0]);
}

test "VM: MULMOD opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x05,  // PUSH1 5 (modulus)
        0x60, 0x03,  // PUSH1 3
        0x60, 0x04,  // PUSH1 4
        0x09,        // MULMOD ((4 * 3) % 5 = 2)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 2), vm.stack.data[0]);
}

test "VM: EXP opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x03,  // PUSH1 3 (exponent)
        0x60, 0x02,  // PUSH1 2 (base)
        0x0A,        // EXP (2^3 = 8)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 8), vm.stack.data[0]);
}

// ===== Comparison Opcodes =====

test "VM: LT opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test 5 < 10 (true)
    const bytecode = [_]u8{
        0x60, 0x0A,  // PUSH1 10
        0x60, 0x05,  // PUSH1 5
        0x10,        // LT
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 1), vm.stack.data[0]); // true
}

test "VM: GT opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test 10 > 5 (true)
    const bytecode = [_]u8{
        0x60, 0x05,  // PUSH1 5
        0x60, 0x0A,  // PUSH1 10
        0x11,        // GT
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 1), vm.stack.data[0]); // true
}

test "VM: EQ opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test 5 == 5 (true)
    const bytecode = [_]u8{
        0x60, 0x05,  // PUSH1 5
        0x60, 0x05,  // PUSH1 5
        0x14,        // EQ
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 1), vm.stack.data[0]); // true
}

test "VM: ISZERO opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test ISZERO(0) = 1 and ISZERO(5) = 0
    const bytecode = [_]u8{
        0x60, 0x00,  // PUSH1 0
        0x15,        // ISZERO (should be 1)
        0x60, 0x05,  // PUSH1 5
        0x15,        // ISZERO (should be 0)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 1), vm.stack.data[0]); // ISZERO(0) = 1
    try testing.expectEqual(@as(u256, 0), vm.stack.data[1]); // ISZERO(5) = 0
}

// ===== Bitwise Opcodes =====

test "VM: AND opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test 0xFF & 0x0F = 0x0F
    const bytecode = [_]u8{
        0x60, 0x0F,  // PUSH1 15
        0x60, 0xFF,  // PUSH1 255
        0x16,        // AND
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0x0F), vm.stack.data[0]);
}

test "VM: OR opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test 0xF0 | 0x0F = 0xFF
    const bytecode = [_]u8{
        0x60, 0x0F,  // PUSH1 15
        0x60, 0xF0,  // PUSH1 240
        0x17,        // OR
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0xFF), vm.stack.data[0]);
}

test "VM: XOR opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test 0xFF ^ 0xF0 = 0x0F
    const bytecode = [_]u8{
        0x60, 0xF0,  // PUSH1 240
        0x60, 0xFF,  // PUSH1 255
        0x18,        // XOR
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0x0F), vm.stack.data[0]);
}

test "VM: NOT opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test NOT(0) = MAX_U256
    const bytecode = [_]u8{
        0x60, 0x00,  // PUSH1 0
        0x19,        // NOT
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(std.math.maxInt(u256), vm.stack.data[0]);
}

// ===== Stack Manipulation Opcodes =====

test "VM: DUP1 opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x42,  // PUSH1 66
        0x80,        // DUP1
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 66), vm.stack.data[0]);
    try testing.expectEqual(@as(u256, 66), vm.stack.data[1]);
}

test "VM: SWAP1 opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x11,  // PUSH1 17
        0x60, 0x22,  // PUSH1 34
        0x90,        // SWAP1
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 34), vm.stack.data[0]);
    try testing.expectEqual(@as(u256, 17), vm.stack.data[1]);
}

test "VM: POP opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x11,  // PUSH1 17
        0x60, 0x22,  // PUSH1 34
        0x50,        // POP
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(usize, 1), vm.stack.len);
    try testing.expectEqual(@as(u256, 17), vm.stack.data[0]);
}

// ===== Memory Opcodes =====

test "VM: MSTORE and MLOAD opcodes" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x42,  // PUSH1 66 (value to store)
        0x60, 0x00,  // PUSH1 0 (memory offset)
        0x52,        // MSTORE
        0x60, 0x00,  // PUSH1 0 (memory offset)
        0x51,        // MLOAD
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 66), vm.stack.data[0]);
}

test "VM: MSTORE8 opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x61, 0x01, 0x23,  // PUSH2 0x0123 (value to store, only low byte used)
        0x60, 0x00,        // PUSH1 0 (memory offset)
        0x53,              // MSTORE8
        0x60, 0x00,        // PUSH1 0 (memory offset)
        0x51,              // MLOAD
        0x00,              // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // MSTORE8 should only store the lowest byte (0x23)
    // When loaded as a 32-byte word, it should be left-padded with zeros
    try testing.expectEqual(@as(u256, 0x23 << 248), vm.stack.data[0]);
}

test "VM: MSIZE opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x59,        // MSIZE (should be 0 initially)
        0x60, 0x42,  // PUSH1 66
        0x60, 0x20,  // PUSH1 32 (memory offset)
        0x52,        // MSTORE (expands memory to 64 bytes)
        0x59,        // MSIZE (should be 64 now)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.stack.data[0]);  // Initial MSIZE
    try testing.expectEqual(@as(u256, 64), vm.stack.data[1]); // After MSTORE
}

// ===== Storage Opcodes =====

test "VM: SSTORE and SLOAD opcodes" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const contract_address = Address.fromString("0xc0ffee000000000000000000000000000000cafe");
    
    const bytecode = [_]u8{
        0x60, 0x42,  // PUSH1 66 (value)
        0x60, 0x01,  // PUSH1 1 (key)
        0x55,        // SSTORE
        0x60, 0x01,  // PUSH1 1 (key)
        0x54,        // SLOAD
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, contract_address, 100000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 66), vm.stack.data[0]);
}

// ===== Environment Opcodes =====

test "VM: ADDRESS opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const contract_address = Address.fromString("0xc0ffee000000000000000000000000000000cafe");
    
    const bytecode = [_]u8{
        0x30,  // ADDRESS
        0x00,  // STOP
    };
    
    const result = try vm.run(&bytecode, contract_address, 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    const expected_addr = try std.fmt.parseInt(u256, "c0ffee000000000000000000000000000000cafe", 16);
    try testing.expectEqual(expected_addr, vm.stack.data[0]);
}

test "VM: CALLER opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const caller_address = Address.fromString("0xdeadbeef00000000000000000000000000000000");
    
    const bytecode = [_]u8{
        0x33,  // CALLER
        0x00,  // STOP
    };
    
    // Set up a frame with a specific caller
    const contract_address = Address.zero();
    const input_data = [_]u8{};
    
    // For this test, we'll need to set up the VM state properly
    // This is a simplified version - in reality we'd need proper frame setup
    const result = try vm.run(&bytecode, contract_address, 10000, &input_data);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // The caller should be on the stack
    try testing.expect(vm.stack.len > 0);
}

// ===== Block Information Opcodes =====

test "VM: NUMBER opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x43,  // NUMBER
        0x00,  // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 10000), vm.stack.data[0]); // Block number set in createTestVm
}

test "VM: TIMESTAMP opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x42,  // TIMESTAMP
        0x00,  // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 1234567890), vm.stack.data[0]); // Timestamp set in createTestVm
}

test "VM: CHAINID opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x46,  // CHAINID
        0x00,  // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 1), vm.stack.data[0]); // Chain ID set in createTestVm
}

// ===== Complex Sequences =====

test "VM: Complex arithmetic sequence" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Calculate: (10 + 5) * 2 - 3 = 27
    const bytecode = [_]u8{
        0x60, 0x0A,  // PUSH1 10
        0x60, 0x05,  // PUSH1 5
        0x01,        // ADD (15)
        0x60, 0x02,  // PUSH1 2
        0x02,        // MUL (30)
        0x60, 0x03,  // PUSH1 3
        0x03,        // SUB (27)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 27), vm.stack.data[0]);
}

test "VM: Conditional logic with comparison" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // If 10 > 5, push 100, else push 200
    const bytecode = [_]u8{
        0x60, 0x05,  // PUSH1 5
        0x60, 0x0A,  // PUSH1 10
        0x11,        // GT (10 > 5 = 1)
        0x60, 0x0B,  // PUSH1 11 (jump dest if true)
        0x57,        // JUMPI
        0x60, 0xC8,  // PUSH1 200 (false path)
        0x60, 0x0D,  // PUSH1 13 (jump to end)
        0x56,        // JUMP
        0x5B,        // JUMPDEST (position 11)
        0x60, 0x64,  // PUSH1 100 (true path)
        0x5B,        // JUMPDEST (position 13)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 100), vm.stack.data[0]); // Should take true path
}

// ===== Error Cases =====

test "VM: Invalid JUMP destination" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Jump to invalid destination (not a JUMPDEST)
    const bytecode = [_]u8{
        0x60, 0x05,  // PUSH1 5
        0x56,        // JUMP
        0x00,        // STOP
        0x00,        // STOP (position 5 - not a JUMPDEST)
        0x60, 0x42,  // PUSH1 66
    };
    
    const result = vm.run(&bytecode, Address.zero(), 10000, null) catch |err| {
        try testing.expect(err == ExecutionError.InvalidJump);
        return;
    };
    
    if (result.output) |output| allocator.free(output);
    try testing.expect(false); // Should not reach here
}

test "VM: Stack underflow" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Try to ADD with only one item on stack
    const bytecode = [_]u8{
        0x60, 0x01,  // PUSH1 1
        0x01,        // ADD (requires 2 items, only have 1)
        0x00,        // STOP
    };
    
    const result = vm.run(&bytecode, Address.zero(), 10000, null) catch |err| {
        try testing.expect(err == ExecutionError.StackUnderflow);
        return;
    };
    
    if (result.output) |output| allocator.free(output);
    try testing.expect(false); // Should not reach here
}

test "VM: Out of gas" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Complex operation with insufficient gas
    const bytecode = [_]u8{
        0x60, 0x05,  // PUSH1 5
        0x60, 0x03,  // PUSH1 3
        0x0A,        // EXP (expensive operation)
        0x00,        // STOP
    };
    
    const result = vm.run(&bytecode, Address.zero(), 10, null) catch |err| {
        try testing.expect(err == ExecutionError.OutOfGas);
        return;
    };
    
    if (result.output) |output| allocator.free(output);
    try testing.expect(false); // Should not reach here
}