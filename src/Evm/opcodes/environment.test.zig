const std = @import("std");

// Import the Evm module using relative path
const EvmModule = @import("../evm.zig");
// Get environment functions from the Evm module
const environment = @import("environment.zig");
const Interpreter = EvmModule.Interpreter;
const Frame = EvmModule.Frame;
const Memory = EvmModule.Memory;
const Stack = EvmModule.Stack;
const Contract = EvmModule.Contract;
const Evm = EvmModule.Evm;
const JumpTable = EvmModule.JumpTable;
const u256_native = u256;

// Import the Address module using relative path
const AddressModule = @import("../../Address/address.zig");
const Address = AddressModule.Address;

// Test setup: Create a frame and contract for testing opcodes
fn setupTestEnvironment(allocator: std.mem.Allocator) !struct {
    frame: *Frame,
    evm: Evm,
    interpreter: *Interpreter,
} {
    const evm_instance = try Evm.init(allocator, null);

    const memory_instance = Memory.init(allocator);
    _ = memory_instance; // autofix

    const stack_instance = Stack.init(allocator);
    _ = stack_instance; // autofix

    var contract_val = EvmModule.createContract(std.mem.zeroes(Address), std.mem.zeroes(Address), 0, 1000000);
    contract_val.code = &[_]u8{ 0x60, 0x01, 0x60, 0x02, 0x01 };
    contract_val.input = &[_]u8{ 0xAA, 0xBB, 0xCC, 0xDD };

    const frame_instance = try Frame.init(allocator, &contract_val);

    const jump_table_instance = try JumpTable.init(allocator);
    try environment.registerEnvironmentOpcodes(allocator, &jump_table_instance);

    const interpreter_instance = try Interpreter.create(allocator, &evm_instance, jump_table_instance);

    return .{
        .frame = frame_instance,
        .evm = evm_instance,
        .interpreter = interpreter_instance,
    };
}

// Test the ADDRESS opcode
test "environment - ADDRESS opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);

    _ = try environment.opAddress(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    var expected_value: u256_native = 0;
    for (test_env.frame.contract.address.bytes) |byte| {
        expected_value = (expected_value << 8) | byte;
    }

    try std.testing.expectEqual(expected_value, test_env.frame.stack.items[0]);
}

// Test the CALLER opcode
test "environment - CALLER opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);

    _ = try environment.opCaller(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    var expected_value: u256_native = 0;
    for (test_env.frame.contract.caller.bytes) |byte| {
        expected_value = (expected_value << 8) | byte;
    }

    try std.testing.expectEqual(expected_value, test_env.frame.stack.items[0]);
}

// Test the CALLVALUE opcode
test "environment - CALLVALUE opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);

    _ = try environment.opCallValue(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    try std.testing.expectEqual(test_env.frame.contract.value, test_env.frame.stack.items[0]);
}

// Test the CALLDATASIZE opcode
test "environment - CALLDATASIZE opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);

    _ = try environment.opCalldatasize(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    try std.testing.expectEqual(@as(u256_native, 4), test_env.frame.stack.items[0]);
}

// Test the CALLDATALOAD opcode
test "environment - CALLDATALOAD opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);

    try test_env.frame.stack.push(0);

    _ = try environment.opCalldataload(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    const expected_value: u256_native = 0xAABBCCDD00000000000000000000000000000000000000000000000000000000;

    try std.testing.expectEqual(expected_value, test_env.frame.stack.items[0]);
}

// Test the CODESIZE opcode
test "environment - CODESIZE opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);

    _ = try environment.opCodesize(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    try std.testing.expectEqual(@as(u256_native, 5), test_env.frame.stack.items[0]);
}

// Test the CALLDATACOPY opcode
test "environment - CALLDATACOPY opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);

    try test_env.frame.stack.push(0x20);
    try test_env.frame.stack.push(0);
    try test_env.frame.stack.push(0);

    _ = try environment.opCalldatacopy(0, test_env.interpreter, test_env.frame);

    try std.testing.expect(test_env.frame.memory.len() >= 32);

    try std.testing.expectEqual(@as(u8, 0xAA), test_env.frame.memory.data()[0]);
    try std.testing.expectEqual(@as(u8, 0xBB), test_env.frame.memory.data()[1]);
    try std.testing.expectEqual(@as(u8, 0xCC), test_env.frame.memory.data()[2]);
    try std.testing.expectEqual(@as(u8, 0xDD), test_env.frame.memory.data()[3]);

    for (4..32) |i| {
        try std.testing.expectEqual(@as(u8, 0), test_env.frame.memory.data()[i]);
    }
}

// Test the CODECOPY opcode
test "environment - CODECOPY opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);

    try test_env.frame.stack.push(0x20);
    try test_env.frame.stack.push(0);
    try test_env.frame.stack.push(0);

    _ = try environment.opCodecopy(0, test_env.interpreter, test_env.frame);

    try std.testing.expect(test_env.frame.memory.len() >= 32);

    try std.testing.expectEqual(@as(u8, 0x60), test_env.frame.memory.data()[0]);
    try std.testing.expectEqual(@as(u8, 0x01), test_env.frame.memory.data()[1]);
    try std.testing.expectEqual(@as(u8, 0x60), test_env.frame.memory.data()[2]);
    try std.testing.expectEqual(@as(u8, 0x02), test_env.frame.memory.data()[3]);
    try std.testing.expectEqual(@as(u8, 0x01), test_env.frame.memory.data()[4]);

    for (5..32) |i| {
        try std.testing.expectEqual(@as(u8, 0), test_env.frame.memory.data()[i]);
    }
}

// Test the RETURNDATASIZE and RETURNDATACOPY opcodes
test "environment - RETURNDATASIZE and RETURNDATACOPY opcodes" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);

    const return_data = [_]u8{ 0x12, 0x34, 0x56, 0x78 };
    try test_env.frame.setReturnData(&return_data);

    _ = try environment.opReturndatasize(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    try std.testing.expectEqual(@as(u256_native, 4), test_env.frame.stack.items[0]);

    _ = try test_env.frame.stack.pop();

    try test_env.frame.stack.push(4);
    try test_env.frame.stack.push(0);
    try test_env.frame.stack.push(0);

    _ = try environment.opReturndatacopy(0, test_env.interpreter, test_env.frame);

    try std.testing.expect(test_env.frame.memory.len() >= 4);

    try std.testing.expectEqual(@as(u8, 0x12), test_env.frame.memory.data()[0]);
    try std.testing.expectEqual(@as(u8, 0x34), test_env.frame.memory.data()[1]);
    try std.testing.expectEqual(@as(u8, 0x56), test_env.frame.memory.data()[2]);
    try std.testing.expectEqual(@as(u8, 0x78), test_env.frame.memory.data()[3]);
}

// Test the GASPRICE opcode
test "environment - GASPRICE opcode" {
    const allocator = std.testing.allocator;

    const test_env = try setupTestEnvironment(allocator);

    _ = try environment.opGasprice(0, test_env.interpreter, test_env.frame);

    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);

    try std.testing.expectEqual(@as(u256_native, 1000000000), test_env.frame.stack.items[0]);
}