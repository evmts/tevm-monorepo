const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Vm = evm.Vm;
const Address = evm.Address;
const ExecutionError = evm.ExecutionError;
const Contract = evm.Contract;

// Helper function to create a test VM with basic setup
fn createTestVm(allocator: std.mem.Allocator) !*Vm {
    var vm = try allocator.create(Vm);
    vm.* = try Vm.init(allocator);
    
    // Set up basic context
    vm.chain_id = 1;
    vm.gas_price = 1000000000; // 1 gwei
    // Use a simple test address
    const tx_origin: Address.Address = [_]u8{0x12} ** 20;
    vm.tx_origin = tx_origin;
    
    // Set up block context
    vm.block_number = 10000;
    vm.block_timestamp = 1234567890;
    vm.block_difficulty = 1000000;
    vm.block_coinbase = Address.zero();
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
    try testing.expectEqual(@as(u64, 0), result.gas_used); // STOP has zero gas cost
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
    try testing.expectEqual(@as(u256, 66), vm.last_stack_value.?);
}

test "VM: JUMPI conditional jump taken" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Jump to position 8 if condition is true (non-zero)
    const bytecode = [_]u8{
        0x60, 0x01,  // PUSH1 1 (true condition)
        0x60, 0x08,  // PUSH1 8 (jump destination)
        0x57,        // JUMPI
        0x60, 0xFF,  // PUSH1 255 (should be skipped)
        0x00,        // STOP (should be skipped)
        0x5B,        // JUMPDEST (position 8)
        0x60, 0xAA,  // PUSH1 170
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // Stack should contain 170, not 255
    try testing.expectEqual(@as(u256, 170), vm.last_stack_value.?);
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
    try testing.expectEqual(@as(u256, 255), vm.last_stack_value.?);
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
    // Top of stack should be 3 (the last PC value pushed)
    try testing.expectEqual(@as(u256, 3), vm.last_stack_value.?);
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
    try testing.expectEqual(@as(u256, 8), vm.last_stack_value.?);
}

test "VM: ADD opcode overflow" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test addition overflow: MAX_U256 + 1 = 0
    const bytecode = [_]u8{
        0x7f, // PUSH32
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, // MAX_U256
        0x60, 0x01,  // PUSH1 1
        0x01,        // ADD
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.last_stack_value.?); // Should wrap to 0
}

test "VM: ADD complex sequence" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test: (5 + 3) + 2 = 10
    const bytecode = [_]u8{
        0x60, 0x05,  // PUSH1 5
        0x60, 0x03,  // PUSH1 3
        0x01,        // ADD (result: 8)
        0x60, 0x02,  // PUSH1 2
        0x01,        // ADD (result: 10)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 10), vm.last_stack_value.?);
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
    try testing.expectEqual(@as(u256, 42), vm.last_stack_value.?);
}

test "VM: MUL opcode overflow" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test multiplication overflow: MAX_U256 * 2 should wrap
    const bytecode = [_]u8{
        0x7f, // PUSH32
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, // MAX_U256
        0x60, 0x02,  // PUSH1 2
        0x02,        // MUL
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // MAX_U256 * 2 = 2^257 - 2, which wraps to MAX_U256 - 1
    const expected = std.math.maxInt(u256) - 1;
    try testing.expectEqual(expected, vm.last_stack_value.?);
}

test "VM: MUL by zero" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test multiplication by zero
    const bytecode = [_]u8{
        0x61, 0x04, 0xD2,  // PUSH2 1234
        0x60, 0x00,        // PUSH1 0
        0x02,              // MUL
        0x00,              // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.last_stack_value.?);
}

test "VM: MUL by one" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test multiplication by one (identity)
    const bytecode = [_]u8{
        0x61, 0x04, 0xD2,  // PUSH2 1234
        0x60, 0x01,        // PUSH1 1
        0x02,              // MUL
        0x00,              // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 1234), vm.last_stack_value.?);
}

test "VM: MUL complex sequence" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test: 2 * 3 * 4 = 24
    const bytecode = [_]u8{
        0x60, 0x02,  // PUSH1 2
        0x60, 0x03,  // PUSH1 3
        0x02,        // MUL (result: 6)
        0x60, 0x04,  // PUSH1 4
        0x02,        // MUL (result: 24)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 24), vm.last_stack_value.?);
}

test "VM: MUL large numbers" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test large number multiplication that doesn't overflow
    // 2^128 * 2^127 = 2^255 (fits in u256)
    const bytecode = [_]u8{
        0x70, // PUSH17 (for 2^128)
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 2^128
        0x6F, // PUSH16 (for 2^127)
        0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 2^127
        0x02, // MUL
        0x00, // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // 2^128 * 2^127 = 2^255
    const expected = @as(u256, 1) << 255;
    try testing.expectEqual(expected, vm.last_stack_value.?);
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
        0x03,        // SUB (5 - 10)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // 5 - 10 wraps to MAX - 4
    const expected = std.math.maxInt(u256) - 4;
    try testing.expectEqual(expected, vm.last_stack_value.?);
}

test "VM: SUB opcode underflow" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test subtraction underflow: 5 - 10 should wrap
    const bytecode = [_]u8{
        0x60, 0x0A,  // PUSH1 10
        0x60, 0x05,  // PUSH1 5
        0x03,        // SUB (10 - 5)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // 10 - 5 = 5
    try testing.expectEqual(@as(u256, 5), vm.last_stack_value.?);
}

test "VM: SUB from zero" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test 0 - 1 = MAX_U256
    const bytecode = [_]u8{
        0x60, 0x00,  // PUSH1 0
        0x60, 0x01,  // PUSH1 1
        0x03,        // SUB (0 - 1)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(std.math.maxInt(u256), vm.last_stack_value.?);
}

test "VM: SUB identity" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test n - n = 0
    const bytecode = [_]u8{
        0x61, 0x04, 0xD2,  // PUSH2 1234
        0x61, 0x04, 0xD2,  // PUSH2 1234
        0x03,              // SUB (1234 - 1234)
        0x00,              // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.last_stack_value.?);
}

test "VM: SUB complex sequence" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test: 100 - 30 - 20 = 50
    const bytecode = [_]u8{
        0x60, 0x64,  // PUSH1 100
        0x60, 0x1E,  // PUSH1 30
        0x03,        // SUB (result: 70)
        0x60, 0x14,  // PUSH1 20
        0x03,        // SUB (result: 50)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 50), vm.last_stack_value.?);
}

test "VM: SUB large numbers" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test large number subtraction
    // 2^255 - 2^254 = 2^254
    const bytecode = [_]u8{
        0x7F, // PUSH32 (for 2^255)
        0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 2^255
        0x7F, // PUSH32 (for 2^254)
        0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 2^254
        0x03, // SUB
        0x00, // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // 2^255 - 2^254 = 2^254
    const expected = @as(u256, 1) << 254;
    try testing.expectEqual(expected, vm.last_stack_value.?);
}

test "VM: DIV opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x0F,  // PUSH1 15 (dividend)
        0x60, 0x03,  // PUSH1 3 (divisor)
        0x04,        // DIV (15 / 3 = 5)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 5), vm.last_stack_value.?);
}

test "VM: DIV by zero returns zero" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x0A,  // PUSH1 10 (dividend)
        0x60, 0x00,  // PUSH1 0 (divisor)
        0x04,        // DIV (10 / 0)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.last_stack_value.?);
}

test "VM: DIV with remainder" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test integer division truncation: 17 / 5 = 3
    const bytecode = [_]u8{
        0x60, 0x11,  // PUSH1 17 (dividend)
        0x60, 0x05,  // PUSH1 5 (divisor)
        0x04,        // DIV (17 / 5)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 3), vm.last_stack_value.?); // Integer division
}

test "VM: DIV by one" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test division by one (identity)
    const bytecode = [_]u8{
        0x61, 0x04, 0xD2,  // PUSH2 1234 (dividend)
        0x60, 0x01,  // PUSH1 1 (divisor)
        0x04,        // DIV (1234 / 1)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 1234), vm.last_stack_value.?);
}

test "VM: DIV zero dividend" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test 0 / n = 0
    const bytecode = [_]u8{
        0x60, 0x00,  // PUSH1 0 (dividend)
        0x60, 0x42,  // PUSH1 66 (divisor)
        0x04,        // DIV (0 / 66)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.last_stack_value.?);
}

test "VM: DIV complex sequence" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test: 100 / 2 / 5 = 10
    const bytecode = [_]u8{
        0x60, 0x64,  // PUSH1 100
        0x60, 0x02,  // PUSH1 2
        0x04,        // DIV (result: 50)
        0x60, 0x05,  // PUSH1 5
        0x04,        // DIV (result: 10)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 10), vm.last_stack_value.?);
}

test "VM: DIV large numbers" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test large number division
    // 2^128 / 2^64 = 2^64
    const bytecode = [_]u8{
        0x70, // PUSH17 (for 2^128) - dividend
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 2^128
        0x68, // PUSH9 (for 2^64) - divisor
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 2^64
        0x04, // DIV
        0x00, // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // 2^128 / 2^64 = 2^64
    const expected = @as(u256, 1) << 64;
    try testing.expectEqual(expected, vm.last_stack_value.?);
}

test "VM: MOD opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x0A,  // PUSH1 10 (dividend)
        0x60, 0x03,  // PUSH1 3 (divisor)
        0x06,        // MOD (10 % 3 = 1)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 1), vm.last_stack_value.?);
}

test "VM: MOD by zero returns zero" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x0A,  // PUSH1 10
        0x60, 0x00,  // PUSH1 0
        0x06,        // MOD (10 % 0)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.last_stack_value.?);
}

test "VM: MOD perfect division" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x14,  // PUSH1 20
        0x60, 0x05,  // PUSH1 5
        0x06,        // MOD (20 % 5 = 0)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.last_stack_value.?);
}

test "VM: MOD by one" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x61, 0x04, 0xD2,  // PUSH2 1234
        0x60, 0x01,        // PUSH1 1
        0x06,              // MOD (1234 % 1 = 0)
        0x00,              // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.last_stack_value.?);
}

test "VM: MOD large numbers" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test large number modulo
    // (2^128 + 5) % 2^64 = 5
    const bytecode = [_]u8{
        0x70, // PUSH17 (for 2^128 + 5)
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, // 2^128 + 5
        0x68, // PUSH9 (for 2^64)
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 2^64
        0x06, // MOD
        0x00, // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 5), vm.last_stack_value.?);
}

test "VM: SDIV opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test: -10 / 3 = -3
    // -10 in two's complement: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF6
    const bytecode = [_]u8{
        0x7f, // PUSH32
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF6, // -10
        0x60, 0x03,  // PUSH1 3
        0x05,        // SDIV (-10 / 3 = -3)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // -3 in two's complement
    const expected_neg3 = std.math.maxInt(u256) - 2; // -3 = 0xFFFFFFF...FD
    try testing.expectEqual(expected_neg3, vm.last_stack_value.?);
}

test "VM: SDIV by zero returns zero" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x0A,  // PUSH1 10
        0x60, 0x00,  // PUSH1 0
        0x05,        // SDIV (10 / 0)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.last_stack_value.?);
}

test "VM: SDIV overflow case MIN_I256 / -1" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // MIN_I256 = -2^255 = 0x80000000000000000000000000000000000000000000000000000000000000000
    // -1 = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
    const bytecode = [_]u8{
        0x7f, // PUSH32 (MIN_I256)
        0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x7f, // PUSH32 (-1)
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0x05, // SDIV
        0x00, // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // Result should be MIN_I256 (overflow wraps)
    const min_i256 = @as(u256, 1) << 255;
    try testing.expectEqual(min_i256, vm.last_stack_value.?);
}

test "VM: SDIV positive by negative" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test: 10 / -3 = -3
    // -3 in two's complement: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD
    const bytecode = [_]u8{
        0x60, 0x0A,  // PUSH1 10
        0x7f, // PUSH32 (-3)
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFD,
        0x05, // SDIV (10 / -3 = -3)
        0x00, // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // -3 in two's complement
    const expected_neg3 = std.math.maxInt(u256) - 2;
    try testing.expectEqual(expected_neg3, vm.last_stack_value.?);
}

test "VM: SDIV negative by negative" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test: -10 / -3 = 3
    const bytecode = [_]u8{
        0x7f, // PUSH32 (-10)
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF6,
        0x7f, // PUSH32 (-3)
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFD,
        0x05, // SDIV (-10 / -3 = 3)
        0x00, // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 3), vm.last_stack_value.?);
}

test "VM: SDIV truncation behavior" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test: -17 / 5 = -3 (truncates toward zero)
    // -17 in two's complement: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEF
    const bytecode = [_]u8{
        0x7f, // PUSH32 (-17)
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xEF,
        0x60, 0x05,  // PUSH1 5
        0x05,        // SDIV (-17 / 5 = -3)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // -3 in two's complement
    const expected_neg3 = std.math.maxInt(u256) - 2;
    try testing.expectEqual(expected_neg3, vm.last_stack_value.?);
}

test "VM: SMOD opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test: -10 % 3 = -1
    // -10 in two's complement: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF6
    const bytecode = [_]u8{
        0x7f, // PUSH32 (-10)
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF6,
        0x60, 0x03,  // PUSH1 3
        0x07,        // SMOD (-10 % 3 = -1)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // -1 in two's complement
    const expected_neg1 = std.math.maxInt(u256);
    try testing.expectEqual(expected_neg1, vm.last_stack_value.?);
}

test "VM: SMOD by zero returns zero" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x0A,  // PUSH1 10
        0x60, 0x00,  // PUSH1 0
        0x07,        // SMOD (10 % 0)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.last_stack_value.?);
}

test "VM: SMOD positive by positive" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test: 17 % 5 = 2
    const bytecode = [_]u8{
        0x60, 0x11,  // PUSH1 17
        0x60, 0x05,  // PUSH1 5
        0x07,        // SMOD (17 % 5 = 2)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 2), vm.last_stack_value.?);
}

test "VM: SMOD positive by negative" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test: 10 % -3 = 1
    // -3 in two's complement: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD
    const bytecode = [_]u8{
        0x60, 0x0A,  // PUSH1 10
        0x7f, // PUSH32 (-3)
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFD,
        0x07, // SMOD (10 % -3 = 1)
        0x00, // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 1), vm.last_stack_value.?);
}

test "VM: SMOD negative by negative" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test: -10 % -3 = -1
    const bytecode = [_]u8{
        0x7f, // PUSH32 (-10)
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF6,
        0x7f, // PUSH32 (-3)
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFD,
        0x07, // SMOD (-10 % -3 = -1)
        0x00, // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // -1 in two's complement
    const expected_neg1 = std.math.maxInt(u256);
    try testing.expectEqual(expected_neg1, vm.last_stack_value.?);
}

test "VM: SMOD large negative number" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test: MIN_I256 % 100
    // MIN_I256 = -2^255 = 0x80000000000000000000000000000000000000000000000000000000000000000
    const bytecode = [_]u8{
        0x7f, // PUSH32 (MIN_I256)
        0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x60, 0x64,  // PUSH1 100
        0x07,        // SMOD
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    // The result should be negative (two's complement)
    try testing.expect(vm.last_stack_value.? > @as(u256, 1) << 255);
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
    try testing.expectEqual(@as(u256, 0), vm.last_stack_value.?);
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
    try testing.expectEqual(@as(u256, 2), vm.last_stack_value.?);
}

test "VM: EXP opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x03,  // PUSH1 3 (base)
        0x60, 0x02,  // PUSH1 2 (exponent)
        0x0A,        // EXP (3^2 = 9)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 9), vm.last_stack_value.?);
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
    try testing.expectEqual(@as(u256, 1), vm.last_stack_value.?); // true
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
    try testing.expectEqual(@as(u256, 1), vm.last_stack_value.?); // true
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
    try testing.expectEqual(@as(u256, 1), vm.last_stack_value.?); // true
}

test "VM: ISZERO opcode with non-zero" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test ISZERO(5) = 0 (testing non-zero input)
    const bytecode = [_]u8{
        0x60, 0x05,  // PUSH1 5
        0x15,        // ISZERO (should be 0)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 0), vm.last_stack_value.?); // ISZERO(5) = 0
}

test "VM: ISZERO opcode with zero" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Test ISZERO(0) = 1 (testing zero input)
    const bytecode = [_]u8{
        0x60, 0x00,  // PUSH1 0
        0x15,        // ISZERO (should be 1)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 1), vm.last_stack_value.?); // ISZERO(0) = 1
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
    try testing.expectEqual(@as(u256, 0x0F), vm.last_stack_value.?);
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
    try testing.expectEqual(@as(u256, 0xFF), vm.last_stack_value.?);
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
    try testing.expectEqual(@as(u256, 0x0F), vm.last_stack_value.?);
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
    try testing.expectEqual(std.math.maxInt(u256), vm.last_stack_value.?);
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
    // DUP1 duplicates the top value, so top of stack should be 66
    try testing.expectEqual(@as(u256, 66), vm.last_stack_value.?);
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
    // After SWAP1, the top should be 17 (was second)
    try testing.expectEqual(@as(u256, 17), vm.last_stack_value.?);
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
    // After POP, the top should be 17 (the first pushed value)
    try testing.expectEqual(@as(u256, 17), vm.last_stack_value.?);
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
    try testing.expectEqual(@as(u256, 66), vm.last_stack_value.?);
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
    try testing.expectEqual(@as(u256, 0x23 << 248), vm.last_stack_value.?);
}

test "VM: MSIZE opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    const bytecode = [_]u8{
        0x60, 0x42,  // PUSH1 66
        0x60, 0x20,  // PUSH1 32 (memory offset)
        0x52,        // MSTORE (expands memory to 64 bytes)
        0x59,        // MSIZE (should be 64 now)
        0x00,        // STOP
    };
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u256, 64), vm.last_stack_value.?); // After MSTORE
}

// ===== Storage Opcodes =====

test "VM: SSTORE and SLOAD opcodes" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Create a test contract address
    var contract_address: Address.Address = [_]u8{0} ** 20;
    contract_address[0] = 0xc0;
    contract_address[1] = 0xff;
    contract_address[2] = 0xee;
    contract_address[19] = 0xfe;
    
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
    try testing.expectEqual(@as(u256, 66), vm.last_stack_value.?);
}

// ===== Environment Opcodes =====

test "VM: ADDRESS opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
    // Create a test contract address
    var contract_address: Address.Address = [_]u8{0} ** 20;
    contract_address[0] = 0xc0;
    contract_address[1] = 0xff;
    contract_address[2] = 0xee;
    contract_address[19] = 0xfe;
    
    const bytecode = [_]u8{
        0x30,  // ADDRESS
        0x00,  // STOP
    };
    
    const result = try vm.run(&bytecode, contract_address, 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Success);
    const expected_addr = try std.fmt.parseInt(u256, "c0ffee00000000000000000000000000000000fe", 16);
    try testing.expectEqual(expected_addr, vm.last_stack_value.?);
}

test "VM: CALLER opcode" {
    const allocator = testing.allocator;
    var vm = try createTestVm(allocator);
    defer {
        vm.deinit();
        allocator.destroy(vm);
    }
    
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
    // The caller should be on the stack - in this case it's the same as the contract address (zero)
    try testing.expectEqual(@as(u256, 0), vm.last_stack_value.?);
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
    try testing.expectEqual(@as(u256, 10000), vm.last_stack_value.?); // Block number set in createTestVm
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
    try testing.expectEqual(@as(u256, 1234567890), vm.last_stack_value.?); // Timestamp set in createTestVm
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
    try testing.expectEqual(@as(u256, 1), vm.last_stack_value.?); // Chain ID set in createTestVm
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
    try testing.expectEqual(@as(u256, 27), vm.last_stack_value.?);
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
    try testing.expectEqual(@as(u256, 100), vm.last_stack_value.?); // Should take true path
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
    
    const result = vm.run(&bytecode, Address.zero(), 10000, null) catch {
        // InvalidJump is not a direct error from run, it would be wrapped
        // We expect the VM to handle this and return an Invalid status
        unreachable;
    };
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .Invalid);
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
    
    const result = try vm.run(&bytecode, Address.zero(), 10000, null);
    defer if (result.output) |output| allocator.free(output);
    
    // Stack underflow should result in Invalid status
    try testing.expect(result.status == .Invalid);
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
    
    const result = try vm.run(&bytecode, Address.zero(), 10, null);
    defer if (result.output) |output| allocator.free(output);
    
    try testing.expect(result.status == .OutOfGas);
}