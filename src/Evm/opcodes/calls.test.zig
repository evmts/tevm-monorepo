const std = @import("std");
const testing = std.testing;

// Root module imports using the package pattern
const EvmModule = @import("Evm");
const Interpreter = EvmModule.Interpreter;
const Frame = EvmModule.Frame;
const ExecutionError = EvmModule.InterpreterError;
const Stack = EvmModule.Stack;
const Memory = EvmModule.Memory;
const Evm = EvmModule.Evm;
const Contract = EvmModule.Contract;
const createContract = EvmModule.createContract;
const ChainRules = EvmModule.ChainRules;

// Import Address from the Address module
const AddressModule = @import("Address");
const Address = AddressModule.Address;

// Use Zig's built-in u256 type
const u256_native = u256;

fn hexToAddress(allocator: std.mem.Allocator, comptime hex_str: []const u8) !Address {
    _ = allocator;
    if (!std.mem.startsWith(u8, hex_str, "0x") or hex_str.len != 42) {
        return error.InvalidAddressFormat;
    }
    var addr: Address = undefined;
    // Use AddressModule functions to parse addresses consistently
    const bytes = try std.fmt.hexToBytes(&addr.bytes, hex_str[2..]);
    _ = bytes;
    return addr;
}

fn setupInterpreter(allocator: std.mem.Allocator) !*Interpreter {
    // Create an EVM instance with default configurations
    var evm_instance = try Evm.init(allocator, null);
    
    // The JumpTable API has changed from init to newJumpTable
    // Create a jump table using the updated API and then initialize the interpreter
    const jump_table = try EvmModule.JumpTable.newJumpTable(allocator, "latest");
    
    // Create and return the interpreter using the create method instead of init
    // This resolves the type mismatch between *Evm and *evm.Evm
    const interpreter_instance = Interpreter.create(allocator, &evm_instance, jump_table);
    
    return interpreter_instance;
}

fn setupContract(allocator: std.mem.Allocator, code_slice: []const u8) !Contract {
    var contract_instance = createContract(
        try hexToAddress(allocator, "0x0000000000000000000000000000000000000001"),
        try hexToAddress(allocator, "0x0000000000000000000000000000000000000002"),
        0,
        1000000, // Increased gas for tests
    );
    contract_instance.code = code_slice;
    return contract_instance;
}

fn setupFrameForContract(interpreter: *Interpreter, allocator: std.mem.Allocator, contract: *Contract) !*Frame {
    _ = interpreter;
    const frame_instance = try Frame.init(allocator, contract);
    return frame_instance;
}

// Tests for CALL opcode (0xF1)
test "CALL with insufficient stack" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer allocator.destroy(interpreter);

    var contract = try setupContract(allocator, &[_]u8{0xF1}); // CALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x1234); // address
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0); // outOffset
    // Missing outSize

    const result = interpreter.run(&contract, &[_]u8{}, false);
    try testing.expectError(ExecutionError.StackUnderflow, result);
}

test "CALL with all parameters" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer allocator.destroy(interpreter);

    var contract = try setupContract(allocator, &[_]u8{0xF1}); // CALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    try frame.stack.push(u256_native, 1000);
    try frame.stack.push(u256_native, 0x1234);
    try frame.stack.push(u256_native, 0);
    try frame.stack.push(u256_native, 0);
    try frame.stack.push(u256_native, 0);
    try frame.stack.push(u256_native, 0);
    try frame.stack.push(u256_native, 0);

    // This will still fail due to no state manager, but stack should be consumed.
    // Or it might error differently (e.g. OutOfGas if it tries to do account existence checks)
    _ = interpreter.run(&contract, &[_]u8{}, false);

    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for STATICCALL opcode (0xFA)
test "STATICCALL basic functionality" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer allocator.destroy(interpreter);

    var contract = try setupContract(allocator, &[_]u8{0xFA}); // STATICCALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    try frame.stack.push(u256_native, 1000);
    try frame.stack.push(u256_native, 0x1234);
    try frame.stack.push(u256_native, 0);
    try frame.stack.push(u256_native, 0);
    try frame.stack.push(u256_native, 0);
    try frame.stack.push(u256_native, 0);

    _ = interpreter.run(&contract, &[_]u8{}, true); // readOnly = true

    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for DELEGATECALL opcode (0xF4)
test "DELEGATECALL basic functionality" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer allocator.destroy(interpreter);

    var contract = try setupContract(allocator, &[_]u8{0xF4}); // DELEGATECALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    try frame.stack.push(u256_native, 1000);
    try frame.stack.push(u256_native, 0x1234);
    try frame.stack.push(u256_native, 0);
    try frame.stack.push(u256_native, 0);
    try frame.stack.push(u256_native, 0);
    try frame.stack.push(u256_native, 0);

    _ = interpreter.run(&contract, &[_]u8{}, false);

    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for CREATE opcode (0xF0)
test "CREATE basic functionality" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer allocator.destroy(interpreter);

    var contract = try setupContract(allocator, &[_]u8{0xF0}); // CREATE
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // offset
    try frame.stack.push(u256_native, 0); // size

    _ = interpreter.run(&contract, &[_]u8{}, false);

    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for CREATE2 opcode (0xF5)
test "CREATE2 basic functionality" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer allocator.destroy(interpreter);

    var contract = try setupContract(allocator, &[_]u8{0xF5}); // CREATE2
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // offset
    try frame.stack.push(u256_native, 0); // size
    try frame.stack.push(u256_native, 0); // salt

    _ = interpreter.run(&contract, &[_]u8{}, false);

    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for RETURN opcode (0xF3)
test "RETURN opcode" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer allocator.destroy(interpreter);

    var contract = try setupContract(allocator, &[_]u8{0xF3}); // RETURN
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    const return_data = [_]u8{ 0x01, 0x02, 0x03, 0x04 };
    try frame.memory.store(0, &return_data);

    try frame.stack.push(u256_native, 0); // offset
    try frame.stack.push(u256_native, 4); // size

    _ = interpreter.run(&contract, &[_]u8{}, false);

    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for REVERT opcode (0xFD)
test "REVERT opcode" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer allocator.destroy(interpreter);

    var contract = try setupContract(allocator, &[_]u8{0xFD}); // REVERT
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    const revert_data = [_]u8{ 0x08, 0x09, 0x0A, 0x0B };
    try frame.memory.store(0, &revert_data);

    try frame.stack.push(u256_native, 0); // offset
    try frame.stack.push(u256_native, 4); // size

    const result = interpreter.run(&contract, &[_]u8{}, false);
    try testing.expectError(ExecutionError.ExecutionReverted, result); // Assuming ExecutionReverted is a valid error variant

    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for SELFDESTRUCT opcode (0xFF)
test "SELFDESTRUCT opcode" {
    const allocator = testing.allocator;
    const interpreter = try setupInterpreter(allocator);
    defer allocator.destroy(interpreter);

    var contract = try setupContract(allocator, &[_]u8{0xFF}); // SELFDESTRUCT
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    try frame.stack.push(u256_native, 0x1234); // beneficiary address

    _ = interpreter.run(&contract, &[_]u8{}, false);

    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}
