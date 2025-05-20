const std = @import("std");
const testing = std.testing;

// Import the Evm module using the global import path
const EvmModule = @import("Evm");
// Import all needed components from the Evm module
const Interpreter = EvmModule.Interpreter;
const Frame = EvmModule.Frame;
const ExecutionError = EvmModule.InterpreterError;
const Stack = EvmModule.Stack;
const Memory = EvmModule.Memory;
const Evm = EvmModule.Evm;
const Contract = EvmModule.Contract;
const createContract = EvmModule.createContract;
const JumpTable = EvmModule.JumpTable;
const ChainRules = EvmModule.ChainRules;

// Import the Address module using the standard module path
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

fn setupTestEnvironment(allocator: std.mem.Allocator, code: []const u8) !struct {
    evm: Evm,
    interpreter: *Interpreter,
    contract: Contract,
    frame: *Frame,
} {
    // Create an EVM instance with default configurations
    var evm_instance = try Evm.init(allocator, null);
    
    // Create a contract with the specified code
    var contract_instance = createContract(
        try hexToAddress(allocator, "0x0000000000000000000000000000000000000001"),
        try hexToAddress(allocator, "0x0000000000000000000000000000000000000002"),
        0,
        1000000, // Increased gas for tests
    );
    contract_instance.code = code;
    
    // Create a jump table using the newJumpTable API 
    const jump_table = try JumpTable.newJumpTable(allocator, "latest");
    
    // Create the interpreter 
    const interpreter_instance = Interpreter.create(allocator, &evm_instance, jump_table);
    
    // Create a frame for the contract
    const frame_instance = try Frame.init(allocator, &contract_instance);
    
    return .{
        .evm = evm_instance,
        .interpreter = interpreter_instance,
        .contract = contract_instance,
        .frame = frame_instance,
    };
}

// Tests for CALL opcode (0xF1)
test "CALL with insufficient stack" {
    const allocator = testing.allocator;
    var env = try setupTestEnvironment(allocator, &[_]u8{0xF1}); // CALL opcode
    defer allocator.destroy(env.interpreter);
    defer env.frame.deinit();

    try env.frame.stack.push(u256_native, 1000); // gas
    try env.frame.stack.push(u256_native, 0x1234); // address
    try env.frame.stack.push(u256_native, 0); // value
    try env.frame.stack.push(u256_native, 0); // inOffset
    try env.frame.stack.push(u256_native, 0); // inSize
    try env.frame.stack.push(u256_native, 0); // outOffset
    // Missing outSize

    const result = env.interpreter.run(&env.contract, &[_]u8{}, false);
    try testing.expectError(ExecutionError.StackUnderflow, result);
}

test "CALL with all parameters" {
    const allocator = testing.allocator;
    var env = try setupTestEnvironment(allocator, &[_]u8{0xF1}); // CALL opcode
    defer allocator.destroy(env.interpreter);
    defer env.frame.deinit();

    try env.frame.stack.push(u256_native, 1000); // gas
    try env.frame.stack.push(u256_native, 0x1234); // address
    try env.frame.stack.push(u256_native, 0); // value
    try env.frame.stack.push(u256_native, 0); // inOffset
    try env.frame.stack.push(u256_native, 0); // inSize
    try env.frame.stack.push(u256_native, 0); // outOffset
    try env.frame.stack.push(u256_native, 0); // outSize

    // This will still fail due to no state manager, but stack should be consumed.
    // Or it might error differently (e.g. OutOfGas if it tries to do account existence checks)
    _ = env.interpreter.run(&env.contract, &[_]u8{}, false);

    try testing.expectEqual(@as(usize, 0), env.frame.stack.size);
}

// Test for STATICCALL opcode (0xFA)
test "STATICCALL basic functionality" {
    const allocator = testing.allocator;
    var env = try setupTestEnvironment(allocator, &[_]u8{0xFA}); // STATICCALL opcode
    defer allocator.destroy(env.interpreter);
    defer env.frame.deinit();

    try env.frame.stack.push(u256_native, 1000); // gas
    try env.frame.stack.push(u256_native, 0x1234); // address
    try env.frame.stack.push(u256_native, 0); // inOffset
    try env.frame.stack.push(u256_native, 0); // inSize
    try env.frame.stack.push(u256_native, 0); // outOffset
    try env.frame.stack.push(u256_native, 0); // outSize

    _ = env.interpreter.run(&env.contract, &[_]u8{}, true); // readOnly = true

    try testing.expectEqual(@as(usize, 0), env.frame.stack.size);
}

// Test for DELEGATECALL opcode (0xF4)
test "DELEGATECALL basic functionality" {
    const allocator = testing.allocator;
    var env = try setupTestEnvironment(allocator, &[_]u8{0xF4}); // DELEGATECALL opcode
    defer allocator.destroy(env.interpreter);
    defer env.frame.deinit();

    try env.frame.stack.push(u256_native, 1000); // gas
    try env.frame.stack.push(u256_native, 0x1234); // address
    try env.frame.stack.push(u256_native, 0); // inOffset
    try env.frame.stack.push(u256_native, 0); // inSize
    try env.frame.stack.push(u256_native, 0); // outOffset
    try env.frame.stack.push(u256_native, 0); // outSize

    _ = env.interpreter.run(&env.contract, &[_]u8{}, false);

    try testing.expectEqual(@as(usize, 0), env.frame.stack.size);
}

// Test for CREATE opcode (0xF0)
test "CREATE basic functionality" {
    const allocator = testing.allocator;
    var env = try setupTestEnvironment(allocator, &[_]u8{0xF0}); // CREATE opcode
    defer allocator.destroy(env.interpreter);
    defer env.frame.deinit();

    try env.frame.stack.push(u256_native, 0); // value
    try env.frame.stack.push(u256_native, 0); // offset
    try env.frame.stack.push(u256_native, 0); // size

    _ = env.interpreter.run(&env.contract, &[_]u8{}, false);

    try testing.expectEqual(@as(usize, 0), env.frame.stack.size);
}

// Test for CREATE2 opcode (0xF5)
test "CREATE2 basic functionality" {
    const allocator = testing.allocator;
    var env = try setupTestEnvironment(allocator, &[_]u8{0xF5}); // CREATE2 opcode
    defer allocator.destroy(env.interpreter);
    defer env.frame.deinit();

    try env.frame.stack.push(u256_native, 0); // value
    try env.frame.stack.push(u256_native, 0); // offset
    try env.frame.stack.push(u256_native, 0); // size
    try env.frame.stack.push(u256_native, 0); // salt

    _ = env.interpreter.run(&env.contract, &[_]u8{}, false);

    try testing.expectEqual(@as(usize, 0), env.frame.stack.size);
}

// Test for RETURN opcode (0xF3)
test "RETURN opcode" {
    const allocator = testing.allocator;
    var env = try setupTestEnvironment(allocator, &[_]u8{0xF3}); // RETURN opcode
    defer allocator.destroy(env.interpreter);
    defer env.frame.deinit();

    const return_data = [_]u8{ 0x01, 0x02, 0x03, 0x04 };
    try env.frame.memory.store(0, &return_data);

    try env.frame.stack.push(u256_native, 0); // offset
    try env.frame.stack.push(u256_native, 4); // size

    _ = env.interpreter.run(&env.contract, &[_]u8{}, false);

    try testing.expectEqual(@as(usize, 0), env.frame.stack.size);
}

// Test for REVERT opcode (0xFD)
test "REVERT opcode" {
    const allocator = testing.allocator;
    var env = try setupTestEnvironment(allocator, &[_]u8{0xFD}); // REVERT opcode
    defer allocator.destroy(env.interpreter);
    defer env.frame.deinit();

    const revert_data = [_]u8{ 0x08, 0x09, 0x0A, 0x0B };
    try env.frame.memory.store(0, &revert_data);

    try env.frame.stack.push(u256_native, 0); // offset
    try env.frame.stack.push(u256_native, 4); // size

    const result = env.interpreter.run(&env.contract, &[_]u8{}, false);
    try testing.expectError(ExecutionError.ExecutionReverted, result);

    try testing.expectEqual(@as(usize, 0), env.frame.stack.size);
}

// Test for SELFDESTRUCT opcode (0xFF)
test "SELFDESTRUCT opcode" {
    const allocator = testing.allocator;
    var env = try setupTestEnvironment(allocator, &[_]u8{0xFF}); // SELFDESTRUCT opcode
    defer allocator.destroy(env.interpreter);
    defer env.frame.deinit();

    try env.frame.stack.push(u256_native, 0x1234); // beneficiary address

    _ = env.interpreter.run(&env.contract, &[_]u8{}, false);

    try testing.expectEqual(@as(usize, 0), env.frame.stack.size);
}
