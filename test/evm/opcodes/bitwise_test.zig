const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes through evm module
const evm = @import("evm");
const bitwise = evm.opcodes.bitwise;

test "Bitwise: AND basic operations" {
    const allocator = testing.allocator;
    
    // Set up test VM and frame
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
    
    // Test 1: Simple AND
    try test_frame.pushStack(&[_]u256{0xFF00, 0xF0F0});
    _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xF000);
    
    // Test 2: AND with zero
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 0xFFFF});
    _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    
    // Test 3: AND with all ones
    test_frame.frame.stack.clear();
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{max_u256, 0x12345678});
    _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x12345678);
    
    // Test gas consumption - create a new frame with jump table
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 1000;
    try test_frame.pushStack(&[_]u256{0xFF00, 0xF0F0});
    
    // Create jump table for gas testing
    const jump_table = helpers.JumpTable.init_from_hardfork(.FRONTIER);
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x16, test_vm.vm, test_frame.frame); // 0x16 = AND
    try helpers.expectGasUsed(test_frame.frame, 1000, 3); // AND costs GasFastestStep = 3
}

test "Bitwise: OR basic operations" {
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
    
    // Test 1: Simple OR
    try test_frame.pushStack(&[_]u256{0xFF00, 0x00FF});
    _ = try helpers.executeOpcode(0x17, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xFFFF);
    
    // Test 2: OR with zero
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 0xABCD});
    _ = try helpers.executeOpcode(0x17, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xABCD);
    
    // Test 3: OR with all ones
    test_frame.frame.stack.clear();
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{max_u256, 0x12345678});
    _ = try helpers.executeOpcode(0x17, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, max_u256);
}

test "Bitwise: XOR basic operations" {
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
    
    // Test 1: Simple XOR
    try test_frame.pushStack(&[_]u256{0xFF00, 0xF0F0});
    _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0FF0);
    
    // Test 2: XOR with itself (should be zero)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0xABCD, 0xABCD});
    _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    
    // Test 3: XOR with zero (identity)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 0x1234});
    _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x1234);
}

test "Bitwise: NOT basic operations" {
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
    
    // Test 1: NOT of zero
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, std.math.maxInt(u256));
    
    // Test 2: NOT of all ones
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{std.math.maxInt(u256)});
    _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    
    // Test 3: NOT of pattern
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0xFFFF0000FFFF0000});
    _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame);
    const expected = std.math.maxInt(u256) ^ 0xFFFF0000FFFF0000;
    try helpers.expectStackValue(test_frame.frame, 0, expected);
}

test "Bitwise: BYTE extraction operations" {
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
    
    // Test 1: Extract first byte (most significant)
    const test_value = 0xABCDEF1234567890;
    try test_frame.pushStack(&[_]u256{test_value, 0}); // Push value first, then index (so index is on top)
    _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Byte 0 is 0x00 in a 256-bit number
    
    // Test 2: Extract last byte (least significant)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{test_value, 31}); // Push value first, then index (so index is on top)
    _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x90);
    
    // Test 3: Out of bounds index
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{test_value, 32}); // Push value first, then index (so index is on top)
    _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Should return 0
    
    // Test 4: Extract from byte 24 
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{test_value, 24}); // Push value first, then index (so index is on top)
    _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xAB); // Byte 24 is where 0xAB is located
}

test "Bitwise: SHL (shift left) operations" {
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
    
    // Test 1: Simple left shift
    try test_frame.pushStack(&[_]u256{0xFF, 8}); // Shift 0xFF left by 8 bits
    _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF00);
    
    // Test 2: Shift by zero
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0x1234, 0});
    _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x1234);
    
    // Test 3: Shift by >= 256 (should return 0)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0xFFFF, 256});
    _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    
    // Test 4: Large shift
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{1, 255}); // Shift 1 to the most significant position
    _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame);
    const expected = @as(u256, 1) << 255;
    try helpers.expectStackValue(test_frame.frame, 0, expected);
}

test "Bitwise: SHR (logical shift right) operations" {
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
    
    // Test 1: Simple right shift
    try test_frame.pushStack(&[_]u256{0xFF00, 8}); // Shift 0xFF00 right by 8 bits
    _ = try helpers.executeOpcode(0x1C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF);
    
    // Test 2: Shift by zero
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0x1234, 0});
    _ = try helpers.executeOpcode(0x1C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x1234);
    
    // Test 3: Shift by >= 256 (should return 0)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0xFFFF, 256});
    _ = try helpers.executeOpcode(0x1C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "Bitwise: SAR (arithmetic shift right) operations" {
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
    
    // Test 1: SAR with positive number (same as logical shift)
    try test_frame.pushStack(&[_]u256{0xFF00, 8});
    _ = try helpers.executeOpcode(0x1D, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF);
    
    // Test 2: SAR with negative number (sign bit = 1)
    test_frame.frame.stack.clear();
    const negative = @as(u256, 1) << 255 | 0xFF00; // Set sign bit
    try test_frame.pushStack(&[_]u256{negative, 8});
    _ = try helpers.executeOpcode(0x1D, test_vm.vm, test_frame.frame);
    // Should fill with 1s from left
    const expected = ((@as(u256, 0xFF) << 248) | (negative >> 8));
    try helpers.expectStackValue(test_frame.frame, 0, expected);
    
    // Test 3: SAR by >= 256 with negative number (should return all 1s)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{negative, 256});
    _ = try helpers.executeOpcode(0x1D, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, std.math.maxInt(u256));
    
    // Test 4: SAR by >= 256 with positive number (should return 0)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0x7FFF, 256}); // Positive number
    _ = try helpers.executeOpcode(0x1D, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "Bitwise: Stack underflow errors" {
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
    
    // Test AND with empty stack
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame)
    );
    
    // Test NOT with empty stack
    test_frame.frame.stack.clear();
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame)
    );
    
    // Test BYTE with only one item
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42});
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame)
    );
}

test "Bitwise: Gas consumption" {
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
    
    // All bitwise operations cost 3 gas (GasFastestStep)
    const operations = comptime [_]struct {
        name: []const u8,
        op: fn(usize, *helpers.OperationModule.Interpreter, *helpers.OperationModule.State) helpers.ExecutionError.Error!helpers.OperationModule.ExecutionResult,
        stack_items: u8,
    }{
        .{ .name = "AND", .op = bitwise.op_and, .stack_items = 2 },
        .{ .name = "OR", .op = bitwise.op_or, .stack_items = 2 },
        .{ .name = "XOR", .op = bitwise.op_xor, .stack_items = 2 },
        .{ .name = "NOT", .op = bitwise.op_not, .stack_items = 1 },
        .{ .name = "BYTE", .op = bitwise.op_byte, .stack_items = 2 },
        .{ .name = "SHL", .op = bitwise.op_shl, .stack_items = 2 },
        .{ .name = "SHR", .op = bitwise.op_shr, .stack_items = 2 },
        .{ .name = "SAR", .op = bitwise.op_sar, .stack_items = 2 },
    };
    
    // Create jump table for gas testing - use Cancun to include SHL/SHR/SAR
    const jump_table = helpers.JumpTable.init_from_hardfork(.CANCUN);
    
    // Map operations to their opcodes
    const opcode_map = [_]u8{
        0x16, // AND
        0x17, // OR
        0x18, // XOR
        0x19, // NOT
        0x1A, // BYTE
        0x1B, // SHL
        0x1C, // SHR
        0x1D, // SAR
    };
    
    inline for (operations, 0..) |op_info, idx| {
        test_frame.frame.stack.clear();
        test_frame.frame.gas_remaining = 1000;
        
        // Push required stack items
        var i: u8 = 0;
        while (i < op_info.stack_items) : (i += 1) {
            try test_frame.pushStack(&[_]u256{0x42});
        }
        
        _ = try helpers.executeOpcodeWithGas(&jump_table, opcode_map[idx], test_vm.vm, test_frame.frame);
        try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasFastestStep);
    }
}
